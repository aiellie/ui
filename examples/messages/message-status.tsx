"use client"

import * as React from "react"

import {
  MessageStatus,
  type MessageStatusValue,
} from "@/components/aiellie-ui/message-status"
import { Timestamp } from "@/components/aiellie-ui/timestamps"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

const order: MessageStatusValue[] = ["sending", "sent", "delivered", "read"]

/** A message actually travelling, which is the only way the states read right. */
export function MessageStatusDemo() {
  // One moment per mount, so the stamp beside the status holds still while the
  // status travels — and so the render stays pure.
  const [sentAt] = React.useState(() => Date.now())
  const [step, setStep] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(
      () => setStep((previous) => (previous + 1) % (order.length + 1)),
      1600
    )
    return () => clearInterval(id)
  }, [])

  const status = order[Math.min(step, order.length - 1)]

  return (
    <BubbleGroup className="w-full max-w-sm">
      <Bubble variant="muted">
        <BubbleContent>Are we still shipping on Tuesday?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Behind the flag, yes.</BubbleContent>
      </Bubble>
      <div className="flex items-center gap-2 self-end pe-1">
        <Timestamp date={sentAt} format="time" />
        <MessageStatus status={status} />
      </div>
    </BubbleGroup>
  )
}

export function MessageStatusStatesDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {(["sending", "sent", "delivered", "read", "failed"] as const).map(
        (status) => (
          <div key={status} className="flex items-center justify-between">
            <span className="text-sm capitalize">{status}</span>
            <MessageStatus status={status} showLabel />
          </div>
        )
      )}
    </div>
  )
}

/**
 * The one state that asks something of the reader gets a way to answer: a
 * failed message offers the retry rather than reporting the failure and leaving
 * them to find it.
 */
export function MessageStatusFailedDemo() {
  const [status, setStatus] = React.useState<MessageStatusValue>("failed")

  React.useEffect(() => {
    if (status !== "sending") return undefined
    const id = setTimeout(() => setStatus("failed"), 1800)
    return () => clearTimeout(id)
  }, [status])

  return (
    <BubbleGroup className="w-full max-w-sm">
      <Bubble
        align="end"
        variant={status === "failed" ? "destructive" : "default"}
      >
        <BubbleContent>Behind the flag, yes.</BubbleContent>
      </Bubble>
      <div className="self-end pe-1">
        <MessageStatus
          status={status}
          showLabel
          onRetry={() => setStatus("sending")}
        />
      </div>
    </BubbleGroup>
  )
}
