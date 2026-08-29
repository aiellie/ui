"use client"

import * as React from "react"
import { Warp } from "@paper-design/shaders-react"

import { cn } from "@/lib/utils"

/**
 * The assistant, embodied: a sphere of moving colour that idles, listens,
 * thinks, speaks and sleeps.
 *
 * The surface is a warp shader and the body language is CSS — a slow breathe
 * at rest, a spin while thinking, a pulse while speaking — with the one
 * live input, the microphone level, arriving as a plain number so the orb
 * can be driven by `use-audio-level`, by a playback meter, or by nothing.
 *
 * The look is a *name*. A seed string resolves deterministically to colours
 * and shader values — the built-in presets by their names, anything else by
 * hash — so a product themes its orb with one word and gets the same orb on
 * every machine, forever. States never change the look, only push it faster
 * or calmer: every palette reads as the same orb in five moods.
 */

export type OrbState = "idle" | "listening" | "thinking" | "speaking" | "asleep"

export interface OrbColors {
  color1: string
  color2: string
  color3: string
}

type OrbShape = "checks" | "stripes" | "edge"

interface OrbValues {
  proportion: number
  softness: number
  distortion: number
  swirl: number
  swirlIterations: number
  shapeScale: number
  speed: number
  scale: number
  rotation: number
  offsetX: number
  offsetY: number
}

export interface OrbConfig {
  colors: OrbColors
  shape: OrbShape
  values: OrbValues
  grain: number
}

/** The named looks. `aiellie` is the house indigo and the default. */
export const orbPresets: Record<string, OrbColors> = {
  aiellie: { color1: "#a5b4fc", color2: "#e0e7ff", color3: "#4f46e5" },
  openai: { color1: "#10a37f", color2: "#d1f5e9", color3: "#0b7a5f" },
  google: { color1: "#4285f4", color2: "#fce8e6", color3: "#ea4335" },
  anthropic: { color1: "#d97757", color2: "#f5efe6", color3: "#8c4a2f" },
  x: { color1: "#71767b", color2: "#e7e9ea", color3: "#0f1419" },
  deepseek: { color1: "#4d6bfe", color2: "#e3e9ff", color3: "#1c2f9e" },
}

const SHAPES: OrbShape[] = ["checks", "stripes", "edge"]

const DEFAULT_VALUES: OrbValues = {
  proportion: 0.35,
  softness: 1,
  distortion: 0.32,
  swirl: 1,
  swirlIterations: 0,
  shapeScale: 0,
  speed: 12.2,
  scale: 0.31,
  rotation: 176,
  offsetX: 0.65,
  offsetY: 0.09,
}

/**
 * What a seeded roll may land on, per value. Narrower than what the shader
 * accepts on purpose: the extremes (scale 4, speed 30) wash the orb out, and
 * a look nobody chose should still read as an orb.
 */
const SEED_RANGES: Record<keyof OrbValues, [number, number]> = {
  proportion: [0.2, 0.8],
  softness: [0.3, 1],
  distortion: [0.05, 0.6],
  swirl: [0.2, 1],
  swirlIterations: [0, 6],
  shapeScale: [0, 0.6],
  speed: [4, 18],
  scale: [0.15, 1.2],
  rotation: [0, 360],
  offsetX: [-0.8, 0.8],
  offsetY: [-0.8, 0.8],
}

/** FNV-1a — small, fast, and stable across runs, so a name always maps to
 * the same look. */
function hashSeed(text: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/** mulberry32 — a tiny deterministic PRNG behind the hash. */
function createRng(seed: number): () => number {
  let state = seed || 1
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hslToHex(h: number, s: number, l: number): string {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    const value = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(255 * value)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${channel(0)}${channel(8)}${channel(4)}`
}

/** Rolls a palette shaped like the presets: a light accent, a near-white
 * wash, and a saturated deep tone from a neighbouring hue. */
function colorsFromRng(rng: () => number): OrbColors {
  const hue = Math.floor(rng() * 360)
  const spread = 20 + Math.floor(rng() * 60)
  return {
    color1: hslToHex(hue, 90, 76),
    color2: hslToHex((hue + spread) % 360, 100, 93),
    color3: hslToHex((hue + 360 - spread) % 360, 72, 45),
  }
}

/**
 * A name is the whole recipe: preset names resolve to their preset on the
 * default tuning, and anything else is hashed into a look that never changes
 * for that name.
 */
export function orbConfigFromSeed(text: string): OrbConfig {
  const name = text.trim().toLowerCase()

  if (name in orbPresets) {
    return {
      colors: orbPresets[name],
      shape: "edge",
      values: DEFAULT_VALUES,
      grain: 0,
    }
  }

  const rng = createRng(hashSeed(name))
  const values = {} as OrbValues
  for (const key of Object.keys(DEFAULT_VALUES) as (keyof OrbValues)[]) {
    const [low, high] = SEED_RANGES[key]
    values[key] = low + rng() * (high - low)
  }
  return {
    values,
    shape: SHAPES[Math.floor(rng() * SHAPES.length)],
    colors: colorsFromRng(rng),
    // Rolled last so the earlier rolls stay stable; capped where the grain
    // accents rather than muddies.
    grain: Math.round(rng() * 50) / 100,
  }
}

/**
 * Per-state multipliers on the tuned shader values. The seed still owns the
 * look; a state only pushes it faster, calmer or more turbulent.
 */
const STATE_SHADER: Record<
  OrbState,
  Partial<Record<keyof OrbValues, number>>
> = {
  idle: { speed: 0.5 },
  listening: { speed: 0.9, distortion: 1.2 },
  thinking: { speed: 2.4, swirl: 1.25, distortion: 1.4 },
  speaking: { speed: 1.7, swirl: 1.1, distortion: 1.25 },
  asleep: { speed: 0.1, swirl: 0.6, distortion: 0.45 },
}

const STATE_LABELS: Record<OrbState, string> = {
  idle: "Idle",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
  asleep: "Asleep",
}

/**
 * The body language, per state — keyframes from the stylesheet the item
 * ships, so the breathing survives an install. Thinking rides the stock spin
 * with a slow clock; everything else has a keyframe of its own.
 */
const STATE_MOTION: Record<OrbState, string> = {
  idle: "animate-[orb-breathe_6s_ease-in-out_infinite]",
  listening: "",
  thinking: "animate-[spin_7s_linear_infinite] scale-95",
  speaking: "animate-[orb-pulse_1.1s_ease-in-out_infinite]",
  asleep: "animate-[orb-drowse_5s_ease-in-out_infinite] opacity-50",
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

/** A tiling monochrome noise texture, blended over the shader for a film
 * grain finish. SVG turbulence keeps it a few hundred bytes. */
const GRAIN_TEXTURE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`

export interface OrbProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  state?: OrbState
  /** Edge of the square shader, and so the diameter of the orb. */
  size?: number
  /**
   * Names the look: a preset name lands on that preset, any other word
   * hashes to a look that never changes for that word.
   */
  seed?: string
  /** Overrides the seed's palette while keeping its tuning. */
  colors?: OrbColors
  /**
   * How loud the person is, 0–1 — `use-audio-level`'s number. Only read
   * while listening or speaking, where it swells the orb and roughens the
   * surface; the states carry themselves without it.
   */
  level?: number
}

export function Orb({
  state = "idle",
  size = 160,
  seed = "aiellie",
  colors,
  level = 0,
  className,
  ...props
}: OrbProps) {
  const config = React.useMemo(() => orbConfigFromSeed(seed), [seed])
  const palette = colors ?? config.colors

  const values = { ...config.values }
  for (const [key, factor] of Object.entries(STATE_SHADER[state]) as [
    keyof OrbValues,
    number,
  ][]) {
    values[key] = clamp(values[key] * factor, SEED_RANGES[key][0], 30)
  }
  /* Only distortion tracks the voice: it is a spatial term, so pushing it
     per audio frame roughens the surface without stepping the shader clock. */
  if (state === "listening" || state === "speaking") {
    values.distortion = clamp(values.distortion + level * 0.3, 0, 1)
  }

  const reactive =
    state === "listening" || state === "speaking" ? 1 + level * 0.18 : 1

  return (
    <div
      data-slot="orb"
      data-state={state}
      /* A picture of a state, and named as one: the orb is the one part of a
         voice call a glance actually lands on, so what it would say out loud
         is what it says to a screen reader. */
      role="img"
      aria-label={`Assistant orb — ${STATE_LABELS[state].toLowerCase()}`}
      className={cn("relative", className)}
      {...props}
    >
      <div
        className={cn(
          "overflow-hidden rounded-full transition-[scale,opacity] duration-300 motion-reduce:animate-none motion-reduce:transition-none",
          STATE_MOTION[state]
        )}
        style={{
          width: size,
          height: size,
          /* The voice-driven swell rides on the wrapper, outside the keyframe
             animation, so the two transforms never fight over one property. */
          scale: String(reactive),
        }}
      >
        <Warp
          width={size}
          height={size}
          colors={[palette.color1, palette.color2, palette.color3]}
          shape={config.shape}
          {...values}
        />
        {config.grain > 0 ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{
              backgroundImage: `url("${GRAIN_TEXTURE}")`,
              backgroundSize: "140px 140px",
              opacity: config.grain,
            }}
          />
        ) : null}
      </div>
      {/* The state, said once when it changes — the colours only move. */}
      <span role="status" className="sr-only">
        {STATE_LABELS[state]}
      </span>
    </div>
  )
}
