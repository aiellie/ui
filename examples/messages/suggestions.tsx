"use client"

import * as React from "react"

import { Suggestions } from "@/components/aiellie-ui/suggestions"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

const prompts = ["Summarise this", "Draft a reply", "What changed?"]

export function SuggestionsDemo() {
  const [selected, setSelected] = React.useState<string | null>(null)

  return (
    <Suggestions
      suggestions={prompts}
      selectedSuggestion={selected}
      onSuggestion={setSelected}
    />
  )
}

export function SuggestionsListDemo() {
  const [selected, setSelected] = React.useState<string | null>(
    "Draft a reply for me to send"
  )

  return (
    <Suggestions
      variant="list"
      suggestions={[
        "Summarise this thread",
        "Draft a reply for me to send",
        "What changed since Tuesday?",
      ]}
      selectedSuggestion={selected}
      onSuggestion={setSelected}
    />
  )
}

/**
 * The reason a suggestion is a button and not a chip: picking one is meant to
 * do something. Sending swaps the prompts for a fresh set, and the bumped
 * `cycle` replays the stagger so the new ones arrive rather than appear.
 */
export function SuggestionsControlledDemo() {
  const [sent, setSent] = React.useState<string | null>(null)
  const [cycle, setCycle] = React.useState(0)

  return (
    <div className="flex w-full max-w-sm flex-col items-end gap-3">
      {sent ? (
        <BubbleGroup className="w-full">
          <Bubble align="end">
            <BubbleContent>{sent}</BubbleContent>
          </Bubble>
        </BubbleGroup>
      ) : null}
      <Suggestions
        cycle={cycle}
        suggestions={sent ? ["Start over"] : prompts}
        selectedSuggestion={null}
        onSuggestion={(suggestion) => {
          setSent(suggestion === "Start over" ? null : suggestion)
          setCycle((previous) => previous + 1)
        }}
      />
    </div>
  )
}
