"use client"

import * as React from "react"
import {
  AiBrain01Icon,
  CircleIcon,
  EyeClosedIcon,
  Megaphone01Icon,
  Mic01Icon,
  ShuffleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  Orb,
  orbPresets,
  type OrbState,
} from "@/components/aiellie-ui/audio/orb"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useAudioLevel } from "@/hooks/use-audio-level"
import { cn } from "@/lib/utils"

const STATES: { state: OrbState; icon: IconSvgElement; label: string }[] = [
  { state: "idle", icon: CircleIcon, label: "Idle" },
  { state: "listening", icon: Mic01Icon, label: "Listening" },
  { state: "thinking", icon: AiBrain01Icon, label: "Thinking" },
  { state: "speaking", icon: Megaphone01Icon, label: "Speaking" },
  { state: "asleep", icon: EyeClosedIcon, label: "Asleep" },
]

/* Two-word names roll pronounceable seeds — short enough to say out loud,
   and they round-trip because the look derives from the name itself. */
const ADJECTIVES = [
  "amber",
  "cobalt",
  "dusk",
  "ember",
  "jade",
  "lunar",
  "neon",
  "opal",
  "tidal",
  "velvet",
]
const NOUNS = [
  "arc",
  "bloom",
  "drift",
  "echo",
  "flux",
  "glow",
  "orbit",
  "pulse",
  "tide",
  "wisp",
]

const randomSeed = () => {
  const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)]
  return `${pick(ADJECTIVES)}-${pick(NOUNS)}`
}

/**
 * The orb, driven: five states to put it in — listening opens the real
 * microphone, and the orb swells with the room — and a name to theme it by.
 * Preset names land on their preset; the shuffle rolls a word, and any word
 * always looks the same.
 */
export function OrbDemo() {
  const [state, setState] = React.useState<OrbState>("idle")
  const [seed, setSeed] = React.useState("aiellie")
  const { level, listening, start, stop } = useAudioLevel()

  /* Listening is the one state backed by hardware: entering it opens the
     mic, leaving it closes it again — the orb must never keep a tab's mic
     light on for decoration. */
  const changeState = (next: OrbState) => {
    setState(next)
    if (next === "listening") {
      if (!listening) void start()
    } else if (listening) {
      stop()
    }
  }

  return (
    <TooltipProvider>
      <div className="flex w-full max-w-sm flex-col items-center gap-5">
        <Orb state={state} seed={seed} size={180} level={level} />

        <div
          role="toolbar"
          aria-label="Orb state"
          className="flex items-center gap-1"
        >
          {STATES.map((entry) => (
            <TooltipIconButton
              key={entry.state}
              tooltip={entry.label}
              aria-pressed={state === entry.state}
              onClick={() => changeState(entry.state)}
              className={cn(
                state === entry.state &&
                  "bg-primary text-primary-foreground hover:bg-primary/85 hover:text-primary-foreground"
              )}
            >
              <HugeiconsIcon icon={entry.icon} />
            </TooltipIconButton>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {Object.keys(orbPresets).map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={seed === name}
              onClick={() => setSeed(name)}
              className={cn(
                "rounded-full border border-dashed border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none",
                seed === name &&
                  "border-solid border-transparent bg-primary/10 text-primary"
              )}
            >
              {name}
            </button>
          ))}
          <TooltipIconButton
            tooltip="Roll a seed"
            className="size-6"
            onClick={() => setSeed(randomSeed())}
          >
            <HugeiconsIcon icon={ShuffleIcon} className="size-3.5" />
          </TooltipIconButton>
        </div>

        {/* The word currently naming the look — any word works. */}
        <p className="text-[11px] text-muted-foreground tabular-nums">
          seed: {seed}
        </p>
      </div>
    </TooltipProvider>
  )
}

/**
 * Four names, four orbs, forever: the point of seeding is that a look can
 * be spoken. These are ordinary words hashed into palettes nobody drew.
 */
export function OrbSeedsDemo() {
  const seeds = ["dusk-orbit", "jade-pulse", "ember-tide", "lunar-wisp"]

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {seeds.map((seed) => (
        <figure key={seed} className="flex flex-col items-center gap-2">
          <Orb seed={seed} size={88} />
          <figcaption className="text-[11px] text-muted-foreground">
            {seed}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
