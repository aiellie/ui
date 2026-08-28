"use client"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"

export function MessageDemo() {
  return (
    <MessageGroup className="w-full max-w-md">
      <Message align="end">
        <MessageAvatar className="size-8 text-xs font-medium">EL</MessageAvatar>
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>How did the migration land?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar className="size-8 text-xs font-medium">AI</MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              Cleanly — every route moved over and the old adapter is gone.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

export function MessageMetaDemo() {
  return (
    <MessageGroup className="w-full max-w-md">
      <Message align="end">
        <MessageAvatar className="size-8 text-xs font-medium">EL</MessageAvatar>
        <MessageContent>
          <MessageHeader>You</MessageHeader>
          <Bubble align="end">
            <BubbleContent>Ship it behind the flag.</BubbleContent>
          </Bubble>
          <MessageFooter>Sent 9:41</MessageFooter>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar className="size-8 text-xs font-medium">AI</MessageAvatar>
        <MessageContent>
          <MessageHeader>Assistant</MessageHeader>
          <Bubble variant="muted">
            <BubbleContent>Flag is live for 10% of traffic.</BubbleContent>
          </Bubble>
          <MessageFooter>9:41 · 1.2s</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

export function MessageGhostDemo() {
  return (
    <MessageGroup className="w-full max-w-md">
      <Message align="end">
        <MessageAvatar className="size-8 text-xs font-medium">EL</MessageAvatar>
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>Why did the build get slower?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent>
          <Bubble variant="ghost">
            <BubbleContent>
              The type-check step stopped being cached, so it re-runs from
              scratch on every commit. Restoring the cache key brings it back
              under a minute.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
