"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface Reaction {
  emoji: string
  count: number
  /** Whether the reader is one of the count. */
  reacted?: boolean
  /** Who reacted, for the hover — the count alone never says who. */
  people?: readonly string[]
}

export interface ReactionsProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "onToggle"
> {
  reactions: readonly Reaction[]
  onToggle?: (emoji: string) => void
  /** Renders a trailing control for adding one that is not on the row yet. */
  onAdd?: () => void
  align?: "start" | "end"
}

/** How the hover reads: the names, and the reader's own share of the count. */
function titleFor({ emoji, count, reacted, people }: Reaction) {
  if (people?.length) {
    const names = [...people]
    if (reacted) names.unshift("You")
    return `${names.join(", ")} reacted with ${emoji}`
  }
  return reacted
    ? `You and ${count - 1} others reacted with ${emoji}`
    : `${count} reacted with ${emoji}`
}

/**
 * What a message has collected, as a row under it. This is the counted kind: a
 * reaction is a thing several people can give, so it carries a tally and the
 * reader's own is a state of that tally rather than a separate mark.
 *
 * Toggling is the whole interaction — pressing one you already gave takes it
 * back — so each is a real toggle button and says so.
 */
export function Reactions({
  reactions,
  onToggle,
  onAdd,
  align = "start",
  className,
  ...props
}: ReactionsProps) {
  if (!reactions.length && !onAdd) return null

  return (
    <div
      data-slot="reactions"
      data-align={align}
      className={cn(
        "flex flex-wrap items-center gap-1",
        align === "end" && "justify-end",
        className
      )}
      {...props}
    >
      {reactions.map((reaction) => {
        const { emoji, count, reacted } = reaction

        return (
          <button
            key={emoji}
            type="button"
            data-slot="reaction"
            data-reacted={reacted || undefined}
            aria-pressed={Boolean(reacted)}
            title={titleFor(reaction)}
            onClick={() => onToggle?.(emoji)}
            className={cn(
              "flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs leading-none transition-[background-color,border-color,scale] duration-150 outline-none select-none",
              "border-border/60 bg-background hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring/50 active:scale-[0.96] dark:hover:bg-input/30",
              // The ones the reader gave are tinted rather than merely darker,
              // so their own reactions are findable in a long row at a glance.
              reacted &&
                "border-transparent bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] dark:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)]",
              "motion-reduce:transition-none"
            )}
          >
            <span aria-hidden="true">{emoji}</span>
            <span className="text-muted-foreground tabular-nums">{count}</span>
            <span className="sr-only">
              {reacted ? `${emoji}, ${count}, yours` : `${emoji}, ${count}`}
            </span>
          </button>
        )
      })}

      {onAdd ? (
        <button
          type="button"
          data-slot="reactions-add"
          aria-label="Add a reaction"
          onClick={onAdd}
          className={cn(
            "flex size-6 cursor-pointer items-center justify-center rounded-full border border-dashed border-border text-muted-foreground transition-colors duration-150 outline-none hover:bg-muted hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/50 motion-reduce:transition-none dark:hover:bg-input/30"
          )}
        >
          {/* Drawn rather than imported: a plus is not worth an icon set. */}
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
            className="size-3"
          >
            <path d="M8 3.5v9M3.5 8h9" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}

/**
 * The tally with one emoji taken off or put on, which is the update every
 * caller writes the moment they wire a picker to a row.
 */
export function toggleReaction(
  reactions: readonly Reaction[],
  emoji: string
): Reaction[] {
  const existing = reactions.find((reaction) => reaction.emoji === emoji)

  if (!existing) return [...reactions, { emoji, count: 1, reacted: true }]

  const count = existing.count + (existing.reacted ? -1 : 1)

  // A reaction nobody is left giving is not a reaction with a count of zero.
  if (count <= 0) {
    return reactions.filter((reaction) => reaction.emoji !== emoji)
  }

  return reactions.map((reaction) =>
    reaction.emoji === emoji
      ? { ...reaction, count, reacted: !reaction.reacted }
      : reaction
  )
}
