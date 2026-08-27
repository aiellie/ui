"use client"

import * as React from "react"

import {
  StreamingText,
  type StreamingSegment,
} from "@/components/aiellie-ui/streaming-text"
import { TypingIndicator } from "@/components/aiellie-ui/typing-indicator"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

/** Prose with two things set in the mono face, since that is the awkward case. */
const answer: StreamingSegment[] = [
  "Three people debated the rollout date and settled on shipping behind",
  { text: "rollout.tuesday", mono: true },
  "next week. Marta wanted it held until the migration lands, so it ships dark and goes on for staff first — run",
  { text: "pnpm flags:list", mono: true },
  "to see where it stands.",
]

export function StreamingTextDemo() {
  const [run, setRun] = React.useState(0)

  const again = React.useCallback(() => {
    setTimeout(() => setRun((previous) => previous + 1), 2600)
  }, [])

  return (
    <BubbleGroup className="w-full max-w-sm">
      <Bubble align="end">
        <BubbleContent>What did they decide?</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          <StreamingText
            key={run}
            mode="typewriter"
            segments={answer}
            speed={9}
            onComplete={again}
          />
        </BubbleContent>
      </Bubble>
    </BubbleGroup>
  )
}

/**
 * What a real stream looks like: the count climbs as tokens land, the newest
 * words arrive tinted and cool to the body colour behind them.
 */
export function StreamingTextTokensDemo() {
  const total = React.useMemo(
    () =>
      answer.reduce(
        (sum, segment) =>
          sum +
          (typeof segment === "string" ? segment : segment.text).split(/\s+/)
            .length,
        0
      ),
    []
  )
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => {
      setCount((previous) => (previous >= total ? 0 : previous + 1))
    }, 130)
    return () => clearInterval(id)
  }, [total])

  return (
    <BubbleGroup className="w-full max-w-sm">
      <Bubble variant="muted">
        <BubbleContent>
          <StreamingText
            segments={answer}
            count={count}
            streaming={count < total}
            className="min-h-28"
          />
        </BubbleContent>
      </Bubble>
    </BubbleGroup>
  )
}

/**
 * The pair as they are actually used: the indicator holds the place while
 * nothing has arrived, and hands over to the stream at the first token.
 */
export function StreamingTextWithTypingDemo() {
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => setTick((previous) => previous + 1), 140)
    return () => clearInterval(id)
  }, [])

  // A beat of nothing before the first token, which is the part the indicator
  // exists for, then round again.
  const cycle = tick % 60
  const arrived = Math.max(0, cycle - 8)

  return (
    <BubbleGroup className="w-full max-w-sm">
      <Bubble align="end">
        <BubbleContent>What did they decide?</BubbleContent>
      </Bubble>
      {arrived === 0 ? (
        <TypingIndicator label="Ellie is typing" />
      ) : (
        <Bubble variant="muted">
          <BubbleContent>
            <StreamingText
              segments={answer}
              count={arrived}
              streaming={cycle < 56}
            />
          </BubbleContent>
        </Bubble>
      )}
    </BubbleGroup>
  )
}
