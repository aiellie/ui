"use client"

import * as React from "react"

import {
  Reasoning,
  ReasoningContent,
  ReasoningStep,
  ReasoningTrigger,
} from "@/components/aiellie-ui/reasoning"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

const steps = [
  "The question is about the rollout date, so the flag state is what matters.",
  "rollout.tuesday is on for staff and off for everyone else.",
  "The migration is the blocker on turning it on more widely.",
  "So: shipped, but only staff can see it until Thursday.",
]

/** Thinking as it happens: open while it runs, folded away once it is done. */
export function ReasoningDemo() {
  const [shown, setShown] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => {
      setShown((previous) => (previous > steps.length + 3 ? 0 : previous + 1))
    }, 1200)
    return () => clearInterval(id)
  }, [])

  const thinking = shown <= steps.length

  return (
    <BubbleGroup className="w-full max-w-sm">
      <Bubble align="end">
        <BubbleContent>Did the rollout ship?</BubbleContent>
      </Bubble>
      <div className="flex flex-col gap-1">
        <Reasoning thinking={thinking}>
          <ReasoningTrigger />
          <ReasoningContent>
            {steps.slice(0, shown).map((step) => (
              <ReasoningStep key={step}>{step}</ReasoningStep>
            ))}
          </ReasoningContent>
        </Reasoning>
        {!thinking ? (
          <Bubble variant="muted">
            <BubbleContent>
              It shipped behind a flag on Tuesday — staff only until the
              migration lands on Thursday.
            </BubbleContent>
          </Bubble>
        ) : null}
      </div>
    </BubbleGroup>
  )
}

/**
 * A transcript being read back rather than watched: the duration is known, so
 * it is given rather than counted, and the panel starts folded.
 */
export function ReasoningSettledDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Reasoning duration={4}>
        <ReasoningTrigger />
        <ReasoningContent>
          {steps.map((step) => (
            <ReasoningStep key={step}>{step}</ReasoningStep>
          ))}
        </ReasoningContent>
      </Reasoning>
      <Reasoning duration={41} defaultOpen>
        <ReasoningTrigger />
        <ReasoningContent>
          {steps.slice(0, 2).map((step) => (
            <ReasoningStep key={step}>{step}</ReasoningStep>
          ))}
        </ReasoningContent>
      </Reasoning>
    </div>
  )
}
