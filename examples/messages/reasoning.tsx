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
 * One frame every beat, wrapping at the end: the whole demo is derived from
 * the number, so the script is thresholds rather than a pile of timers, and
 * unmounting cleans up one interval.
 */
function useFrame(frames: number, ms = 1100) {
  const [frame, setFrame] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % frames), ms)
    return () => clearInterval(id)
  }, [frames, ms])

  return frame
}

/**
 * A run, lived: the browser read, a search branch that opens while it works
 * — sub-steps going pending → running → done inside it — and folds itself
 * on its result; the edits landing file by file; the check at the end; and
 * then the whole log folding to one line, because that is what a finished
 * run owes the answer under it. Loops, so however the card is caught it is
 * doing something.
 */
export function ReasoningWorkflowDemo() {
  const frame = useFrame(14)
  const settled = frame >= 10

  return (
    <div className="w-full max-w-sm">
      {/* Not keyed per pass on purpose: a reader who folds the log keeps it
          folded across loops — their disagreement outranks the script, which
          is the component's own rule. */}
      <Reasoning thinking={!settled} duration={settled ? 11 : undefined}>
        <ReasoningTrigger />
        <ReasoningContent>
          <ReasoningStep
            icon={AiBrowserIcon}
            status={frame >= 1 ? "done" : "running"}
            detail={frame >= 1 ? "3 pages" : undefined}
          >
            Read the element pages
          </ReasoningStep>

          {frame >= 1 ? (
            <ReasoningBranch
              open={frame < 4}
              status={frame >= 4 ? "done" : "running"}
            >
              <ReasoningBranchTrigger
                icon={TextSearchIcon}
                status={frame >= 4 ? "done" : "running"}
                detail={frame >= 4 ? "12 matches" : undefined}
              >
                Searching the registry
              </ReasoningBranchTrigger>
              <ReasoningBranchContent>
                <ReasoningStep status={frame >= 2 ? "done" : "running"}>
                  The bubble variants all pass through cva.
                </ReasoningStep>
                {frame >= 2 ? (
                  <ReasoningStep status={frame >= 3 ? "done" : "running"}>
                    The examples import them bare.
                  </ReasoningStep>
                ) : null}
                {frame >= 3 ? (
                  <ReasoningStep status="running">
                    Compare against the tokens file.
                  </ReasoningStep>
                ) : null}
              </ReasoningBranchContent>
            </ReasoningBranch>
          ) : null}

          {frame >= 5 ? (
            <ReasoningBranch open>
              <ReasoningBranchTrigger
                icon={PencilEdit02Icon}
                detail={`${Math.min(frame - 4, 3)} ${frame === 5 ? "file" : "files"}`}
              >
                Edited files
              </ReasoningBranchTrigger>
              <ReasoningBranchContent>
                <ReasoningStep icon={FileEditIcon} detail="+41 −7">
                  attachments.tsx
                </ReasoningStep>
                {frame >= 6 ? (
                  <ReasoningStep icon={FileEditIcon} detail="+12">
                    timestamps.tsx
                  </ReasoningStep>
                ) : null}
                {frame >= 7 ? (
                  <ReasoningStep icon={FileEditIcon} detail="+3 −3">
                    chat.tsx
                  </ReasoningStep>
                ) : null}
              </ReasoningBranchContent>
            </ReasoningBranch>
          ) : null}

          {frame >= 8 ? (
            <ReasoningStep
              icon={TerminalIcon}
              status={frame >= 9 ? "done" : "running"}
              detail={frame >= 9 ? "2s" : undefined}
            >
              pnpm typecheck
            </ReasoningStep>
          ) : null}
        </ReasoningContent>
      </Reasoning>
    </div>
  )
}

/**
 * The tree standing still, at full depth: a file inside the edits inside the
 * run, each level one rule further in and folding on its own. This is the
 * shape a work log has once thinking is more than prose.
 */
export function ReasoningNestedDemo() {
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
