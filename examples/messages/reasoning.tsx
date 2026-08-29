"use client"

import * as React from "react"
import {
  AiBrowserIcon,
  FileEditIcon,
  Layers01Icon,
  PencilEdit02Icon,
  TerminalIcon,
  TextSearchIcon,
} from "@hugeicons/core-free-icons"

import {
  Reasoning,
  ReasoningBranch,
  ReasoningBranchContent,
  ReasoningBranchTrigger,
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
 * The work as the tree it actually was: steps with glyphs and the fact worth
 * pinning to each one, and the steps that were made of steps folding on their
 * own — a file inside the edits inside the run, each level one rule further
 * in. This is the shape a work log has once thinking is more than prose.
 */
export function ReasoningWorkflowDemo() {
  return (
    <div className="w-full max-w-sm">
      <Reasoning duration={25} defaultOpen>
        <ReasoningTrigger>Worked for 25s</ReasoningTrigger>
        <ReasoningContent>
          <ReasoningStep icon={AiBrowserIcon} detail="8s">
            Used the browser
          </ReasoningStep>
          <ReasoningStep icon={Layers01Icon}>
            Context automatically compacted
          </ReasoningStep>

          <ReasoningBranch defaultOpen>
            <ReasoningBranchTrigger icon={PencilEdit02Icon} detail="3 files">
              Edited files
            </ReasoningBranchTrigger>
            <ReasoningBranchContent>
              <ReasoningBranch>
                <ReasoningBranchTrigger icon={FileEditIcon} detail="+41 −7">
                  attachments.tsx
                </ReasoningBranchTrigger>
                <ReasoningBranchContent>
                  <ReasoningStep>
                    Stretched the overlay control across the tile, and kept the
                    remove button above it.
                  </ReasoningStep>
                  <ReasoningStep>
                    The stem truncates; the extension survives.
                  </ReasoningStep>
                </ReasoningBranchContent>
              </ReasoningBranch>
              <ReasoningStep icon={FileEditIcon} detail="+12">
                timestamps.tsx
              </ReasoningStep>
              <ReasoningStep icon={FileEditIcon} detail="+3 −3">
                chat.tsx
              </ReasoningStep>
            </ReasoningBranchContent>
          </ReasoningBranch>

          <ReasoningStep icon={TerminalIcon} status="done" detail="2s">
            pnpm typecheck
          </ReasoningStep>
        </ReasoningContent>
      </Reasoning>
    </div>
  )
}

/**
 * The same tree, still growing: the branch being worked is open with its
 * spinner turning, the finished ones sit above it, and the clock on the
 * trigger keeps counting.
 */
export function ReasoningWorkflowLiveDemo() {
  return (
    <div className="w-full max-w-sm">
      <Reasoning thinking>
        <ReasoningTrigger />
        <ReasoningContent>
          <ReasoningStep icon={AiBrowserIcon} status="done" detail="8s">
            Read the element pages
          </ReasoningStep>
          <ReasoningBranch status="running">
            <ReasoningBranchTrigger
              icon={TextSearchIcon}
              status="running"
              detail="12 matches"
            >
              Searching the registry
            </ReasoningBranchTrigger>
            <ReasoningBranchContent>
              <ReasoningStep status="done">
                The bubble variants all pass through cva.
              </ReasoningStep>
              <ReasoningStep status="running">
                Reading the examples that import them…
              </ReasoningStep>
              <ReasoningStep status="pending">
                Compare against the tokens file.
              </ReasoningStep>
            </ReasoningBranchContent>
          </ReasoningBranch>
        </ReasoningContent>
      </Reasoning>
    </div>
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
