"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Speech, becoming text in front of you.
 *
 * A transcriber's defining state is *provisional*: words arrive as guesses,
 * shimmer while the recogniser can still change its mind, and settle into
 * ink when it commits. Interim text is therefore a first-class look here —
 * the tw-shimmer sheen over muted text — rather than a style a demo fakes,
 * and swapping a guessed segment for its final form is one prop flipping.
 *
 * The log follows itself the way a thread does: new lines keep the newest
 * in view until the reader scrolls up to re-read, at which point following
 * is theirs to resume. `role="log"` says what this is, and the politeness
 * means finished lines are read out without cutting anyone off.
 */

export function Transcript({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const region = ref.current
    if (!region) return undefined

    const toBottom = () => {
      const box = ref.current
      if (!box) return
      const distance = box.scrollHeight - box.scrollTop - box.clientHeight
      // Near enough counts, exactly as the chat card reasons.
      if (distance < 80) box.scrollTop = box.scrollHeight
    }

    toBottom()
    const observer = new MutationObserver(toBottom)
    observer.observe(region, {
      childList: true,
      subtree: true,
      characterData: true,
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-slot="transcript"
      role="log"
      aria-live="polite"
      className={cn(
        "flex max-h-64 w-full flex-col gap-2 overflow-y-auto overscroll-contain",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TranscriptSegmentProps extends React.ComponentProps<"p"> {
  /** Who said it. Omitted, the line stands alone — a dictation, not a call. */
  speaker?: string
  /** Still a guess: shimmering, muted, and hidden from the polite log until
   * it settles, so a screen reader never hears a sentence that then
   * un-happens. */
  interim?: boolean
}

export function TranscriptSegment({
  speaker,
  interim = false,
  className,
  children,
  ...props
}: TranscriptSegmentProps) {
  return (
    <p
      data-slot="transcript-segment"
      data-interim={interim || undefined}
      aria-hidden={interim || undefined}
      className={cn("text-sm leading-relaxed", className)}
      {...props}
    >
      {speaker ? (
        <span className="me-2 text-xs font-medium text-muted-foreground">
          {speaker}
        </span>
      ) : null}
      <span
        className={cn(
          interim &&
            /* The sheen is the state: text that may yet change should look
               like it is still being decided. Motion-reduce drops the sweep
               and the low-opacity ink alone says provisional. */
            "shimmer text-foreground/40 motion-reduce:animate-none"
        )}
      >
        {children}
      </span>
    </p>
  )
}
