"use client"

import type { ComponentProps } from "react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { cn } from "@/lib/utils"

export interface SuggestionsProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  suggestions: readonly string[]
  selectedSuggestion?: string | null
  /** Bump to replay the stagger: a new key remounts the row. */
  cycle?: number
  onSuggestion: (suggestion: string) => void
  variant?: "pills" | "list"
}

/**
 * The prompts on offer, drawn as bubbles: a dashed outline while a suggestion
 * is still an offer, tinted once it has been picked. Dashes are what mark it as
 * something to act on — a solid outline reads as a filled field — and the
 * tinted state drops them because it is no longer a prompt.
 *
 * Selection lives with the caller, since picking a suggestion is usually the
 * same event as sending it.
 */
export function Suggestions({
  suggestions,
  selectedSuggestion = null,
  cycle = 0,
  onSuggestion,
  variant = "pills",
  className,
  ...props
}: SuggestionsProps) {
  const list = variant === "list"

  return (
    <div
      data-slot="suggestions"
      data-variant={variant}
      key={cycle}
      className={cn(
        // Either way the suggestions hang off the end edge, where the reader's
        // own messages sit: they are the reader's next turn, offered ready
        // made, so they line up with the side that turn would come from.
        list
          ? "flex w-full max-w-sm flex-col items-end gap-2"
          : // Pills stay on one line and scroll rather than wrapping, since a
            // wrapped row reads as a block of choices instead of a strip of
            // them. `-my-1` gives the hover lift and the entry slide somewhere
            // to move: `overflow-x` clips vertically too, so the room has to be
            // padding rather than overflow. The alignment is the safe kind, so
            // a row wider than the strip scrolls from its start rather than
            // hiding the first pill past the edge.
            "-my-1 flex max-w-md items-center justify-end-safe gap-2 overflow-x-auto py-1",
        className
      )}
      {...props}
    >
      {suggestions.map((suggestion, index) => {
        const selected = selectedSuggestion === suggestion

        return (
          <Bubble
            key={suggestion}
            variant={selected ? "tinted" : "outline"}
            align={list ? "end" : "start"}
            data-slot="suggestion"
            data-selected={selected || undefined}
            className={cn(
              "animate-in duration-300 fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none",
              "transition-transform hover:-translate-y-px active:scale-[0.96] motion-reduce:transition-none",
              "max-w-full",
              list || "shrink-0"
            )}
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <BubbleContent
              className={cn(
                "cursor-pointer text-[13px] select-none",
                // A list is a column of choices rather than a run of pills,
                // but each one is still a bubble: it keeps the width of its own
                // prompt and hangs off the start edge rather than stretching
                // into a block.
                list ? "rounded-2xl text-end" : "rounded-full",
                !selected && "border-dashed"
              )}
              // The button props ride on the rendered element rather than on
              // BubbleContent, which types its own props against a div.
              render={
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSuggestion(suggestion)}
                />
              }
            >
              {suggestion}
            </BubbleContent>
          </Bubble>
        )
      })}
    </div>
  )
}
