"use client"

import * as React from "react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { cn } from "@/lib/utils"

export interface TypingBubbleProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /**
   * What shape the waiting takes — a bubble holding the answer's place, the
   * dots on their own, a line of text saying so, or the caret an answer is
   * about to stream into.
   */
  variant?: "bubble" | "ghost" | "label" | "caret"
  align?: "start" | "end"
  /** Announced always, and shown in the `label` variant. */
  label?: string
}

/** Three, always: fewer reads as a stutter and more as a loading bar. */
const dots = [0, 1, 2]

function Dots({ className }: { className?: string }) {
  return (
    <span
      data-slot="typing-bubble-dots"
      aria-hidden="true"
      className={cn("flex items-center gap-1", className)}
    >
      {dots.map((index) => (
        <span
          key={index}
          className={cn(
            "size-1.5 rounded-full bg-current opacity-40",
            // Staggered so the row reads as a wave rather than a blink, and
            // still legible as three dots when the animation is turned off:
            // the opacity holds, only the movement goes.
            "animate-bounce motion-reduce:animate-none"
          )}
          style={{
            animationDuration: "1.1s",
            animationDelay: `${index * 140}ms`,
          }}
        />
      ))}
    </span>
  )
}

/**
 * The stand-in for a message not written yet.
 *
 * The default is a bubble because a bubble holds the place the answer will
 * take: the thread does not jump when the words arrive, it fills in. The other
 * variants are for the times that is the wrong promise — an assistant whose
 * prose is not bubbled, a status line, an answer about to stream into the page
 * a character at a time.
 *
 * The dots are decoration and the label is the message: a screen reader is told
 * someone is typing rather than read three full stops.
 */
export function TypingBubble({
  variant = "bubble",
  align = "start",
  label = "Typing",
  className,
  ...props
}: TypingBubbleProps) {
  const announcement = (
    <span data-slot="typing-bubble-label" className="sr-only">
      {label}
    </span>
  )

  if (variant === "bubble") {
    return (
      <Bubble
        data-slot="typing-bubble"
        data-variant-type="bubble"
        variant="muted"
        align={align}
        className={className}
        {...props}
      >
        <BubbleContent
          role="status"
          aria-live="polite"
          className="flex items-center py-2.5"
        >
          {announcement}
          <Dots />
        </BubbleContent>
      </Bubble>
    )
  }

  return (
    <div
      data-slot="typing-bubble"
      data-variant-type={variant}
      data-align={align}
      role="status"
      aria-live="polite"
      className={cn(
        "flex w-fit items-center gap-2 text-sm text-muted-foreground",
        align === "end" && "self-end",
        className
      )}
      {...props}
    >
      {announcement}
      {variant === "caret" ? (
        // The cursor an answer is about to appear at. A block rather than a
        // line, so it holds a character's worth of space and the first word
        // lands where the caret already was.
        <span
          aria-hidden="true"
          data-slot="typing-bubble-caret"
          className="inline-block h-4 w-2 animate-pulse rounded-[2px] bg-current align-text-bottom motion-reduce:animate-none"
          style={{ animationDuration: "1.1s" }}
        />
      ) : (
        <>
          {variant === "label" ? (
            <span
              aria-hidden="true"
              className="animate-pulse text-xs motion-reduce:animate-none"
              style={{ animationDuration: "1.8s" }}
            >
              {label}
            </span>
          ) : null}
          <Dots />
        </>
      )}
    </div>
  )
}
