"use client"

import * as React from "react"
import { Mic01Icon, MicOff01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Waveform, WaveformLive } from "@/components/aiellie-ui/audio/waveform"
import { Button } from "@/components/ui/button"
import { useAudioLevel } from "@/hooks/use-audio-level"

/**
 * A clip's shape that never changes between loads: peaks drawn from sines
 * rather than rolled, so the demo is the same picture every visit.
 */
const PEAKS = Array.from({ length: 56 }, (_, i) => {
  const swell = Math.abs(Math.sin(i / 5.5)) * 0.7
  const chatter = Math.abs(Math.sin(i * 2.3)) * 0.3
  return Math.max(0.08, Math.min(1, swell + chatter))
})

/** The whole strip is the slider — drag anywhere, or focus it and use the
 * arrow keys. */
export function WaveformDemo() {
  const [progress, setProgress] = React.useState(0.35)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Waveform peaks={PEAKS} progress={progress} onSeek={setProgress} />
      <p className="text-[11px] text-muted-foreground tabular-nums">
        {Math.round(progress * 100)}% played
      </p>
    </div>
  )
}

/**
 * The level as weather: with the microphone open the strip carries the room;
 * before permission it breathes on a slow synthetic swell, so the element is
 * alive to look at without anything being asked of anyone.
 */
export function WaveformLiveDemo() {
  const { level, listening, error, start, stop } = useAudioLevel()
  const [synthetic, setSynthetic] = React.useState(0)

  React.useEffect(() => {
    if (listening) return undefined
    let tick = 0
    const id = setInterval(() => {
      tick += 1
      setSynthetic(
        Math.abs(Math.sin(tick / 9)) * 0.35 +
          Math.abs(Math.sin(tick / 2.1)) * 0.15
      )
    }, 60)
    return () => clearInterval(id)
  }, [listening])

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <WaveformLive
        level={listening ? level : synthetic}
        label={listening ? "Microphone level" : "Sample level"}
      />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={listening ? "secondary" : "outline"}
          onClick={() => (listening ? stop() : void start())}
        >
          <HugeiconsIcon
            icon={listening ? MicOff01Icon : Mic01Icon}
            data-icon="inline-start"
          />
          {listening ? "Stop the microphone" : "Use the microphone"}
        </Button>
        {error ? (
          <p className="text-[11px] text-destructive">{error}</p>
        ) : !listening ? (
          <p className="text-[11px] text-muted-foreground">
            Showing a sample swell.
          </p>
        ) : null}
      </div>
    </div>
  )
}
