"use client"

import * as React from "react"

/**
 * The microphone as one number: how loud the room is right now, 0 to 1.
 *
 * Everything visual about voice — an orb swelling, a waveform standing up,
 * a mute button confirming it worked — wants exactly this and nothing more,
 * so the hook narrows the whole WebAudio ceremony down to a level and two
 * verbs. `start` asks for the microphone (a specific one, when a device id
 * is given) and `stop` genuinely lets go of it: track, analyser and audio
 * context are all closed, because a page that keeps a tab's mic light on
 * after its "stop" has taught the reader never to press "start" again.
 *
 * The level is root-mean-square over the analyser's time domain, smoothed
 * toward its previous reading — raw RMS flickers at frame rate, and a value
 * that exists to drive motion should already move like motion.
 */
export function useAudioLevel() {
  const [level, setLevel] = React.useState(0)
  const [listening, setListening] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const stream = React.useRef<MediaStream | null>(null)
  const context = React.useRef<AudioContext | null>(null)
  const frame = React.useRef<number>(0)

  const stop = React.useCallback(() => {
    cancelAnimationFrame(frame.current)
    stream.current?.getTracks().forEach((track) => track.stop())
    stream.current = null
    void context.current?.close().catch(() => {})
    context.current = null
    setListening(false)
    setLevel(0)
  }, [])

  const start = React.useCallback(
    async (deviceId?: string) => {
      stop()
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          audio: deviceId ? { deviceId: { exact: deviceId } } : true,
        })
        stream.current = media
        const audio = new AudioContext()
        context.current = audio
        const analyser = audio.createAnalyser()
        analyser.fftSize = 512
        audio.createMediaStreamSource(media).connect(analyser)

        const samples = new Uint8Array(analyser.fftSize)
        let smoothed = 0
        const read = () => {
          analyser.getByteTimeDomainData(samples)
          let sum = 0
          for (let i = 0; i < samples.length; i++) {
            const centred = (samples[i] - 128) / 128
            sum += centred * centred
          }
          /* The 4 is gain: conversational speech RMS sits well under 0.25,
             and a level that never leaves the bottom tenth of its range is
             a level nothing visual can be driven by. */
          const raw = Math.min(1, Math.sqrt(sum / samples.length) * 4)
          smoothed = smoothed * 0.8 + raw * 0.2
          setLevel(smoothed)
          frame.current = requestAnimationFrame(read)
        }
        frame.current = requestAnimationFrame(read)
        setError(null)
        setListening(true)
      } catch (cause) {
        setError(
          cause instanceof DOMException && cause.name === "NotAllowedError"
            ? "The browser has not been given the microphone."
            : "The microphone could not be opened."
        )
        setListening(false)
      }
    },
    [stop]
  )

  /* Whatever the component was doing with the mic ends when the component
     does. */
  React.useEffect(() => stop, [stop])

  return { level, listening, error, start, stop }
}
