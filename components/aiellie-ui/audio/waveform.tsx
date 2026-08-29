"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Sound, drawn as the bars everyone already reads.
 *
 * Two forms because audio has two tenses. `Waveform` is the past: a clip's
 * peaks laid out whole, with played time tinted and — when a seek handler is
 * given — the entire strip draggable through one real range input, the same
 * trick `image-compare` uses, so the keyboard and a screen reader get a
 * slider for free. `WaveformLive` is the present: a rolling window of the
 * level as it happens, fed one number at a time from `use-audio-level`.
 */

export interface WaveformProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "onSeek"
> {
  /** The clip's shape, 0–1 per bar. However many you have is how many draw. */
  peaks: readonly number[]
  /** How much has played, 0–1. Bars up to here take the primary tint. */
  progress?: number
  /** Makes the strip a real slider over the clip. */
  onSeek?: (fraction: number) => void
  /** What the slider is called to assistive tech. */
  label?: string
}

export function Waveform({
  peaks,
  progress = 0,
  onSeek,
  label = "Seek",
  className,
  ...props
}: WaveformProps) {
  const played = Math.round(progress * peaks.length)

  return (
    <div
      data-slot="waveform"
      className={cn("relative h-10 w-full", className)}
      {...props}
    >
      <div aria-hidden className="flex h-full w-full items-center gap-px">
        {peaks.map((peak, index) => (
          <span
            key={index}
            data-played={index < played || undefined}
            className={cn(
              "min-h-1 flex-1 rounded-full transition-colors duration-150 motion-reduce:transition-none",
              index < played ? "bg-primary" : "bg-foreground/20"
            )}
            style={{ height: `${Math.round(peak * 100)}%` }}
          />
        ))}
      </div>
      {onSeek ? (
        <input
          type="range"
          min={0}
          max={1000}
          step={1}
          value={Math.round(progress * 1000)}
          aria-label={label}
          onChange={(event) => onSeek(Number(event.target.value) / 1000)}
          /* Invisible but everywhere: the track is the whole strip, so a
             press lands where it lands and playback comes to it. */
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 outline-none"
        />
      ) : null}
    </div>
  )
}

const LIVE_BARS = 32

export interface WaveformLiveProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** The room right now, 0–1 — `use-audio-level`'s number. */
  level: number
  /** How much history stands in the window. */
  bars?: number
  /** Announced state, since the bars themselves are decoration. */
  label?: string
}

/**
 * The level as it happens: each new reading pushes in from the end and the
 * window slides, so speech reads as weather moving across the strip rather
 * than one bar twitching.
 */
export function WaveformLive({
  level,
  bars = LIVE_BARS,
  label = "Microphone level",
  className,
  ...props
}: WaveformLiveProps) {
  const [history, setHistory] = React.useState<number[]>(() =>
    Array.from({ length: bars }, () => 0)
  )

  /* The window slides on its own clock rather than on the prop: a level that
     stops changing should still drift leftward out of frame, the way silence
     does. The prop is read through a ref so the frame loop never restarts. */
  const levelRef = React.useRef(level)
  React.useEffect(() => {
    levelRef.current = level
  }, [level])

  React.useEffect(() => {
    let frame = 0
    const tick = () => {
      setHistory((current) => [...current.slice(-(bars - 1)), levelRef.current])
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [bars])

  return (
    <div
      data-slot="waveform-live"
      role="img"
      aria-label={label}
      className={cn("flex h-10 w-full items-center gap-px", className)}
      {...props}
    >
      {history.map((reading, index) => (
        <span
          key={index}
          className="min-h-1 flex-1 rounded-full bg-primary/80 transition-[height] duration-75 motion-reduce:transition-none"
          style={{ height: `${Math.round(Math.min(1, reading) * 100)}%` }}
        />
      ))}
    </div>
  )
}
