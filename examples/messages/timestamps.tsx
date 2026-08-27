"use client"

import * as React from "react"

import { Timestamp, TimestampRow } from "@/components/aiellie-ui/timestamps"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

/** One moment per mount, so the demos read consistently while they are open. */
function useMountedAt() {
  return React.useState(() => Date.now())[0]
}

export function TimestampsDemo() {
  const now = useMountedAt()

  return (
    <BubbleGroup className="w-full max-w-sm gap-3">
      <Timestamp variant="separator" date={now - DAY} format="day" />
      <Bubble variant="muted">
        <BubbleContent>
          The rollout is behind a flag until Tuesday.
        </BubbleContent>
      </Bubble>
      <Timestamp date={now - DAY} format="time" className="ps-1" />
      <Timestamp variant="separator" date={now} format="day" />
      <Bubble align="end">
        <BubbleContent>Any change to that?</BubbleContent>
      </Bubble>
      <Timestamp
        date={now - 4 * MINUTE}
        format="relative"
        live
        className="justify-end pe-1"
      />
    </BubbleGroup>
  )
}

/**
 * The stamp beside the message rather than under it, and only once the message
 * is hovered — the time is worth having to hand and not worth reading every
 * line of the thread through.
 */
export function TimestampsAsideDemo() {
  const now = useMountedAt()

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <TimestampRow>
        <Bubble variant="muted">
          <BubbleContent>Shipping behind a flag on Tuesday.</BubbleContent>
        </Bubble>
        <Timestamp
          date={now - 3 * HOUR}
          format="time"
          placement="side"
          showOnHover
        />
      </TimestampRow>
      <TimestampRow align="end">
        <Bubble align="end">
          <BubbleContent>Any change to that?</BubbleContent>
        </Bubble>
        <Timestamp
          date={now - 4 * MINUTE}
          format="relative"
          placement="side"
          showOnHover
          live
        />
      </TimestampRow>
    </div>
  )
}

export function TimestampsVariantsDemo() {
  const now = useMountedAt()

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Timestamp date={now - 2 * HOUR} />
      <Timestamp variant="separator" date={now - 2 * DAY} format="day" />
      <Timestamp variant="border" date={now - 9 * DAY} format="datetime" />
    </div>
  )
}

/**
 * `live` re-stamps on an interval, so a stamp that says "just now" stops saying
 * it. The ages here are fixed; only the phrasing moves.
 */
export function TimestampsRelativeDemo() {
  const now = useMountedAt()

  const ages = [
    { label: "Seconds", date: now - 10_000 },
    { label: "Minutes", date: now - 12 * MINUTE },
    { label: "Hours", date: now - 5 * HOUR },
    { label: "Days", date: now - 3 * DAY },
    { label: "Weeks", date: now - 24 * DAY },
  ]

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {ages.map((age) => (
        <div key={age.label} className="flex items-baseline justify-between">
          <span className="text-sm">{age.label}</span>
          <Timestamp
            date={age.date}
            format="relative"
            live
            className="w-auto"
          />
        </div>
      ))}
    </div>
  )
}
