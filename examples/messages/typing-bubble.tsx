"use client"

import * as React from "react"

import { TypingBubble } from "@/components/aiellie-ui/typing-bubble"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
} from "@/components/ui/message"

const answer =
  "Three people debated the rollout date and settled on shipping behind a flag next Tuesday."

function Avatar() {
  return (
    <MessageAvatar className="size-8 text-xs font-medium text-muted-foreground">
      E
    </MessageAvatar>
  )
}

export function TypingBubbleDemo() {
  return (
    <BubbleGroup className="w-full max-w-sm">
      <Bubble align="end">
        <BubbleContent>Can you summarise the thread for me?</BubbleContent>
      </Bubble>
      <TypingBubble />
    </BubbleGroup>
  )
}

/**
 * Not four colours of the same bubble: four ways of saying an answer is coming.
 * A bubble holds the place the words will take, the dots on their own suit an
 * assistant whose prose is not bubbled, the line says who is typing, and the
 * caret is where a streamed answer will start appearing.
 */
export function TypingBubbleVariantsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <TypingBubble />
      <TypingBubble variant="ghost" />
      <TypingBubble variant="label" label="Ellie is typing" />
      <TypingBubble variant="caret" label="Ellie is answering" />
    </div>
  )
}

/**
 * The thread as it actually runs: the avatar is already in place, and the
 * bubble under it fills in rather than the row jumping when the words arrive.
 */
export function TypingBubbleFlowDemo() {
  const [typing, setTyping] = React.useState(true)

  React.useEffect(() => {
    const id = setTimeout(
      () => setTyping((previous) => !previous),
      typing ? 2600 : 3400
    )
    return () => clearTimeout(id)
  }, [typing])

  return (
    <MessageGroup className="w-full max-w-sm gap-3">
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>What did they decide?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <Avatar />
        <MessageContent>
          {typing ? (
            <TypingBubble label="Ellie is typing" />
          ) : (
            <Bubble variant="muted">
              <BubbleContent>{answer}</BubbleContent>
            </Bubble>
          )}
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
