"use client"

import * as React from "react"

import {
  AudioPlayer,
  AudioPlayerButton,
  AudioPlayerTime,
  AudioPlayerWaveform,
} from "@/components/aiellie-ui/audio/audio-player"

/**
 * The demo ships no audio file: the clip is synthesised on mount — a small
 * pentatonic figure with a soft envelope — and handed to the player as a
 * blob URL. The same trick the image cards play with the sample service,
 * for sound: the element is real, only the material is minted locally.
 */

const RATE = 22050
const NOTES = [262, 330, 392, 523, 392, 330, 262, 196]
const NOTE_SECONDS = 0.5
const DURATION = NOTES.length * NOTE_SECONDS

function renderClip(): Blob {
  const total = Math.floor(RATE * DURATION)
  const samples = new Float32Array(total)

  NOTES.forEach((frequency, index) => {
    const start = Math.floor(index * NOTE_SECONDS * RATE)
    const length = Math.floor(NOTE_SECONDS * RATE)
    for (let i = 0; i < length; i++) {
      const t = i / RATE
      /* Attack fast, decay long: a plucked envelope keeps eight sine notes
         from reading as a hearing test. The fifth above at low gain thickens
         the tone without another oscillator's worth of code. */
      const envelope = Math.min(1, i / (RATE * 0.01)) * Math.exp(-3 * t)
      samples[start + i] =
        (Math.sin(2 * Math.PI * frequency * t) * 0.6 +
          Math.sin(2 * Math.PI * frequency * 1.5 * t) * 0.15) *
        envelope *
        0.5
    }
  })

  /* A minimal WAV wrapper: 44 bytes of header, then 16-bit PCM. */
  const buffer = new ArrayBuffer(44 + total * 2)
  const view = new DataView(buffer)
  const write = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++)
      view.setUint8(offset + i, text.charCodeAt(i))
  }
  write(0, "RIFF")
  view.setUint32(4, 36 + total * 2, true)
  write(8, "WAVE")
  write(12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, RATE, true)
  view.setUint32(28, RATE * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  write(36, "data")
  view.setUint32(40, total * 2, true)
  for (let i = 0; i < total; i++) {
    view.setInt16(
      44 + i * 2,
      Math.max(-1, Math.min(1, samples[i])) * 0x7fff,
      true
    )
  }
  return new Blob([buffer], { type: "audio/wav" })
}

/** The clip's real shape: peak absolute sample per bar, normalised. */
function peaksOf(samples: Float32Array, bars: number): number[] {
  const window = Math.floor(samples.length / bars)
  const peaks: number[] = []
  let loudest = 0
  for (let bar = 0; bar < bars; bar++) {
    let peak = 0
    for (let i = bar * window; i < (bar + 1) * window; i++) {
      peak = Math.max(peak, Math.abs(samples[i]))
    }
    peaks.push(peak)
    loudest = Math.max(loudest, peak)
  }
  return peaks.map((peak) => Math.max(0.08, peak / (loudest || 1)))
}

export function AudioPlayerDemo() {
  const [clip, setClip] = React.useState<{ src: string; peaks: number[] }>()

  React.useEffect(() => {
    let url: string | undefined
    /* A beat later, not inline: synthesis is a spin of arithmetic the mount
       render should not wait behind, and the effect body itself then sets no
       state. */
    const id = setTimeout(() => {
      const blob = renderClip()
      url = URL.createObjectURL(blob)
      /* Re-render the samples once for the picture — cheaper than decoding
         the blob back, and exactly the same numbers. */
      const total = Math.floor(RATE * DURATION)
      const samples = new Float32Array(total)
      NOTES.forEach((frequency, index) => {
        const start = Math.floor(index * NOTE_SECONDS * RATE)
        const length = Math.floor(NOTE_SECONDS * RATE)
        for (let i = 0; i < length; i++) {
          const t = i / RATE
          const envelope = Math.min(1, i / (RATE * 0.01)) * Math.exp(-3 * t)
          samples[start + i] = Math.sin(2 * Math.PI * frequency * t) * envelope
        }
      })
      setClip({ src: url, peaks: peaksOf(samples, 48) })
    }, 0)
    return () => {
      clearTimeout(id)
      if (url) URL.revokeObjectURL(url)
    }
  }, [])

  if (!clip) {
    return (
      <p className="shimmer text-xs text-foreground/40 motion-reduce:animate-none">
        Rendering a clip…
      </p>
    )
  }

  return (
    <AudioPlayer src={clip.src} duration={DURATION}>
      <AudioPlayerButton />
      <AudioPlayerWaveform peaks={clip.peaks} />
      <AudioPlayerTime />
    </AudioPlayer>
  )
}
