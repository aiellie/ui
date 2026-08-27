"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface Segment {
  text: string
  /** Set in the mono face, as a chip — an identifier, a path, a flag. */
  mono?: boolean
}

/** A bare string is prose; an object is prose with a claim about how it is set. */
export type StreamingSegment = Segment | string

export interface StreamingTextProps extends Omit<
  React.ComponentProps<"p">,
  "children"
> {
  segments: readonly StreamingSegment[]
  /**
   * How many words have arrived. Omit and the text is whole; drive it from a
   * stream and the words appear as it counts up.
   */
  count?: number
  /** Reveal on a clock of its own instead, for text already in hand. */
  mode?: "stream" | "typewriter"
  /** Typewriter only: words a second. */
  speed?: number
  /** Whether more is still coming: shows the caret and marks the region busy. */
  streaming?: boolean
  showCaret?: boolean
  /** How many of the newest words keep the arriving tint. */
  freshWords?: number
  onComplete?: () => void
}

type Word = { word: string; mono: boolean }

function toWords(segments: readonly StreamingSegment[]): Word[] {
  return segments.flatMap((segment) => {
    const { text, mono = false } =
      typeof segment === "string" ? { text: segment, mono: false } : segment
    return text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, mono }))
  })
}

type SurfaceProps = Omit<React.ComponentProps<"p">, "children"> & {
  words: Word[]
  shown: number
  busy: boolean
  showCaret: boolean
  freshWords: number
}

/**
 * Each word fades in as it mounts, which is the whole trick: React mounts only
 * the words that are new, so nothing has to be tracked to know what to animate.
 * Words already on screen keep their finished animation and are never touched
 * again.
 *
 * The newest few also arrive tinted and cool to the body colour over the next
 * beat, which is what makes a stream read as arriving rather than as text that
 * keeps getting longer.
 */
function Surface({
  words,
  shown,
  busy,
  showCaret,
  freshWords,
  className,
  ...props
}: SurfaceProps) {
  const visible = words.slice(0, shown)

  return (
    <p
      data-slot="streaming-text"
      data-streaming={busy || undefined}
      // Announcing every word would read the answer out one word at a time, so
      // the region stays quiet while it fills and is announced once it settles.
      aria-busy={busy || undefined}
      aria-live={busy ? "off" : "polite"}
      className={cn("text-sm leading-relaxed text-pretty", className)}
      {...props}
    >
      {visible.map(({ word, mono }, index) => {
        const fresh = busy && visible.length - 1 - index < freshWords

        return (
          <span
            key={index}
            className="animate-in duration-500 fill-mode-both fade-in motion-reduce:animate-none"
          >
            <span
              className={cn(
                "transition-colors duration-700 motion-reduce:transition-none",
                fresh && "text-primary",
                mono &&
                  "rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[0.85em]"
              )}
            >
              {word}
            </span>{" "}
          </span>
        )
      })}
      {showCaret && busy && visible.length > 0 ? (
        <span
          aria-hidden="true"
          data-slot="streaming-text-caret"
          // Inline with the last word rather than on a line of its own, so the
          // next word lands exactly where the caret was sitting.
          className="ms-0.5 -mb-0.5 inline-block h-3.5 w-0.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none"
        />
      ) : null}
    </p>
  )
}

/**
 * Mounted under a key of the text itself, so new words are a new typewriter
 * rather than a counter that has to be reset — the reveal starts from nothing
 * without a line of resetting logic.
 */
function Typewriter({
  words,
  speed,
  onComplete,
  ...props
}: Omit<SurfaceProps, "shown" | "busy"> & {
  speed: number
  onComplete?: () => void
}) {
  const [shown, setShown] = React.useState(0)
  const complete = shown >= words.length

  React.useEffect(() => {
    if (complete) return undefined

    // The interval is the clock the reveal runs on. The state is set from a
    // timer rather than from the effect body, so the render stays a render.
    const id = setInterval(
      () => setShown((previous) => Math.min(words.length, previous + 1)),
      1000 / Math.max(speed, 1)
    )

    return () => clearInterval(id)
  }, [complete, words.length, speed])

  const finishedRef = React.useRef(false)
  React.useEffect(() => {
    if (complete && words.length > 0 && !finishedRef.current) {
      finishedRef.current = true
      onComplete?.()
    }
  }, [complete, words.length, onComplete])

  return <Surface words={words} shown={shown} busy={!complete} {...props} />
}

/**
 * Text that arrives a word at a time — from a model streaming tokens, or typed
 * out from something already in hand.
 *
 * Words rather than characters: a character reveal cuts an identifier in half
 * and reflows the line on every frame, and nothing reads faster for it.
 */
export function StreamingText({
  segments,
  count,
  mode = "stream",
  speed = 10,
  streaming = false,
  showCaret = true,
  freshWords = 2,
  onComplete,
  ...props
}: StreamingTextProps) {
  const words = React.useMemo(() => toWords(segments), [segments])

  if (mode === "typewriter") {
    return (
      <Typewriter
        key={words.map((entry) => entry.word).join(" ")}
        words={words}
        speed={speed}
        showCaret={showCaret}
        freshWords={freshWords}
        onComplete={onComplete}
        {...props}
      />
    )
  }

  return (
    <Surface
      words={words}
      shown={count ?? words.length}
      busy={streaming}
      showCaret={showCaret}
      freshWords={freshWords}
      {...props}
    />
  )
}
