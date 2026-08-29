"use client"

import * as React from "react"
import { PauseIcon, PlayIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { paper } from "@/components/aiellie-ui/actions"
import { Waveform } from "@/components/aiellie-ui/audio/waveform"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { cn } from "@/lib/utils"

/**
 * A clip in a chat, playable where it stands.
 *
 * A voice note or a generated reply is a message, so the player is shaped
 * like one: a row that fits a bubble, a play that becomes a pause, the
 * clip's own shape to scrub through, and the time read out in digits that
 * do not jitter. The `<audio>` element underneath is the real machinery —
 * the parts only dress the state it already keeps.
 *
 * Parts, not props: the row is composed of `AudioPlayerButton`,
 * `AudioPlayerWaveform` and `AudioPlayerTime` inside the root, so a player
 * with no waveform, or with something else entirely in the middle, is a
 * different arrangement of the same pieces rather than a new component.
 */

type AudioPlayerContextValue = {
  playing: boolean
  time: number
  duration: number
  toggle: () => void
  seek: (fraction: number) => void
}

const AudioPlayerContext = React.createContext<AudioPlayerContextValue | null>(
  null
)

function useAudioPlayerContext(part: string) {
  const context = React.useContext(AudioPlayerContext)
  if (!context) throw new Error(`${part} must be used within an AudioPlayer.`)
  return context
}

export interface AudioPlayerProps extends React.ComponentProps<"div"> {
  src: string
  /** Read before metadata arrives — a blob URL reports its length late, and
   * a player that says 0:00 until then reads as broken. */
  duration?: number
}

export function AudioPlayer({
  src,
  duration: durationProp,
  className,
  children,
  ...props
}: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = React.useState(false)
  const [time, setTime] = React.useState(0)
  const [metaDuration, setMetaDuration] = React.useState(0)

  const duration = metaDuration || durationProp || 0

  const toggle = React.useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void audio.play().catch(() => {})
    else audio.pause()
  }, [])

  const seek = React.useCallback(
    (fraction: number) => {
      const audio = audioRef.current
      if (!audio || !duration) return
      audio.currentTime = fraction * duration
      setTime(audio.currentTime)
    },
    [duration]
  )

  const context = React.useMemo(
    () => ({ playing, time, duration, toggle, seek }),
    [playing, time, duration, toggle, seek]
  )

  return (
    <AudioPlayerContext.Provider value={context}>
      <div
        data-slot="audio-player"
        data-playing={playing || undefined}
        className={cn(
          paper,
          "flex w-full max-w-sm items-center gap-3 rounded-2xl p-2 pe-3",
          className
        )}
        {...props}
      >
        {/* The machinery, kept and hidden: the element owns playback state,
            and every part above reads it through the events it already
            fires rather than a clock of our own. */}
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => {
            const value = event.currentTarget.duration
            if (Number.isFinite(value)) setMetaDuration(value)
          }}
        />
        {children}
      </div>
    </AudioPlayerContext.Provider>
  )
}

/** The one control. Play becomes pause in place, and says which it is. */
export function AudioPlayerButton({
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof TooltipIconButton>,
  "tooltip" | "children"
>) {
  const { playing, toggle } = useAudioPlayerContext("AudioPlayerButton")

  return (
    <TooltipIconButton
      data-slot="audio-player-button"
      tooltip={playing ? "Pause" : "Play"}
      onClick={toggle}
      className={cn(
        "size-9 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/85 hover:text-primary-foreground",
        className
      )}
      {...props}
    >
      <HugeiconsIcon icon={playing ? PauseIcon : PlayIcon} />
    </TooltipIconButton>
  )
}

/** The clip's shape, scrubbable: progress comes from playback and a drag
 * goes straight back into it. */
export function AudioPlayerWaveform({
  peaks,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Waveform>, "progress" | "onSeek">) {
  const { time, duration, seek } = useAudioPlayerContext("AudioPlayerWaveform")

  return (
    <Waveform
      data-slot="audio-player-waveform"
      peaks={peaks}
      progress={duration ? time / duration : 0}
      onSeek={seek}
      label="Seek through the clip"
      className={cn("h-8 min-w-0 flex-1", className)}
      {...props}
    />
  )
}

const formatTime = (seconds: number) => {
  const whole = Math.max(0, Math.floor(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`
}

/**
 * Elapsed over length. Tabular figures, so the digits ticking over do not
 * push the row around — the same rule every timestamp here follows.
 */
export function AudioPlayerTime({
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children">) {
  const { time, duration } = useAudioPlayerContext("AudioPlayerTime")

  return (
    <span
      data-slot="audio-player-time"
      className={cn(
        "shrink-0 text-[11px] text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    >
      {formatTime(time)}
      <span className="text-muted-foreground/50">
        {" "}
        / {formatTime(duration)}
      </span>
    </span>
  )
}
