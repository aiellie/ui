"use client"

import * as React from "react"

import { QuotedMessage } from "@/components/aiellie-ui/quoted-message"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

const original =
  "Three people debated the rollout date and settled on shipping behind a flag next Tuesday, with staff first."

export function QuotedMessageDemo() {
  return (
    <BubbleGroup className="w-full max-w-sm gap-3">
      <Bubble variant="muted">
        <BubbleContent>{original}</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent className="flex flex-col gap-1.5">
          <QuotedMessage author="Ellie">{original}</QuotedMessage>
          <span>Staff first is the part I wanted to check.</span>
        </BubbleContent>
      </Bubble>
    </BubbleGroup>
  )
}

/**
 * The quote as a way back to what it quotes: rendered as a button, it is what
 * a reader expects it to be — press it and the thread goes there.
 */
export function QuotedMessageJumpDemo() {
  const [went, setWent] = React.useState(false)

  React.useEffect(() => {
    if (!went) return undefined
    const id = setTimeout(() => setWent(false), 2000)
    return () => clearTimeout(id)
  }, [went])

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <BubbleGroup>
        <Bubble align="end">
          <BubbleContent className="flex flex-col gap-1.5">
            <QuotedMessage
              author="Ellie"
              lines={1}
              render={<button type="button" onClick={() => setWent(true)} />}
            >
              {original}
            </QuotedMessage>
            <span>Staff first is the part I wanted to check.</span>
          </BubbleContent>
        </Bubble>
      </BubbleGroup>
      <p className="min-h-4 pe-1 text-end text-xs text-muted-foreground">
        {went ? "Jumped to the original" : "Press the quote."}
      </p>
    </div>
  )
}

/**
 * The other place a quote lives: above whatever is being written, with a way to
 * call it off before it is sent.
 */
export function QuotedMessagePendingDemo() {
  const [quoting, setQuoting] = React.useState(true)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <BubbleGroup>
        <Bubble variant="muted">
          <BubbleContent>{original}</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <div className="flex flex-col gap-2 rounded-xl border border-border/60 p-2">
        {quoting ? (
          <QuotedMessage
            author="Ellie"
            lines={1}
            onDismiss={() => setQuoting(false)}
          >
            {original}
          </QuotedMessage>
        ) : null}
        <p className="px-1 text-sm text-muted-foreground">
          {quoting ? "Replying to Ellie…" : "Not replying to anything."}
        </p>
      </div>
      {!quoting ? (
        <button
          type="button"
          onClick={() => setQuoting(true)}
          className="w-fit cursor-pointer text-xs text-muted-foreground underline underline-offset-3 hover:text-foreground"
        >
          Quote it again
        </button>
      ) : null}
    </div>
  )
}
