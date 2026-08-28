"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  ChatAvatar,
  ChatAvatarImage,
  ChatAvatarName,
} from "@/components/aiellie-ui/chat-avatar"
import { ChatCardThread } from "@/components/aiellie-ui/chat-card"
import {
  EmptyStateDescription,
  EmptyStateTitle,
} from "@/components/aiellie-ui/composer/empty-state"
import {
  MessageInput,
  MessageInputField,
  MessageInputSubmit,
} from "@/components/aiellie-ui/composer/message-input"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import type { Agent } from "@/lib/agents"
import { cn } from "@/lib/utils"

import { Pane, PaneTitle } from "./pane"

interface Turn {
  id: number
  text: string
}

/**
 * The width the conversation is read at. The panel can be dragged as wide as
 * the window, but a line of text cannot be read at that width, so the thread
 * and the field under it both stop at the same measure and centre in whatever
 * is left.
 */
const measure = "mx-auto w-full max-w-3xl"

/**
 * The middle of the workspace: whose thread this is at the top, what has been
 * said under it, and the field at the foot.
 *
 * The shape does not move when the first message lands — the portrait stays
 * where it was and the composer stays where it was, and the greeting is simply
 * replaced by the thread it invited. A composer that starts mid-screen and
 * drops to the bottom on the first send is a page rearranging itself at the
 * exact moment the reader is watching what they just wrote.
 */
function AgentChat({ agent }: { agent: Agent }) {
  const [turns, setTurns] = React.useState<Turn[]>([])
  const [value, setValue] = React.useState("")

  function send(text: string) {
    setTurns((previous) => [...previous, { id: previous.length + 1, text }])
    setValue("")
  }

  return (
    <Pane
      header={<PaneTitle icon={agent.icon}>{agent.name}</PaneTitle>}
      footer={
        /* Held to the thread's own measure rather than the panel's width: a
           field a thousand pixels wide was never the right shape for a line
           of text. */
        <div className={measure}>
          <MessageInput value={value} onValueChange={setValue} onSubmit={send}>
            <MessageInputField placeholder={`Message ${agent.name}…`} />
            <MessageInputSubmit />
          </MessageInput>
        </div>
      }
    >
      <ChatCardThread className={cn(measure, "h-full")}>
        <ChatAvatar>
          <ChatAvatarImage
            src={agent.avatar}
            fallback={
              <HugeiconsIcon
                icon={agent.icon}
                strokeWidth={1.5}
                className="size-6"
              />
            }
          />
          <ChatAvatarName icon={agent.icon} chevron={false}>
            {agent.name}
          </ChatAvatarName>
        </ChatAvatar>

        {turns.length === 0 ? (
          /* Centred in what is left under the portrait rather than following
             it down the page, so the invitation sits where the first answer
             will and the screen has a middle. */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-8">
            <EmptyStateTitle>{agent.greeting}</EmptyStateTitle>
            <EmptyStateDescription>{agent.description}</EmptyStateDescription>
          </div>
        ) : (
          turns.map((turn) => (
            <Bubble key={turn.id} align="end">
              <BubbleContent>{turn.text}</BubbleContent>
            </Bubble>
          ))
        )}
      </ChatCardThread>
    </Pane>
  )
}

export { AgentChat }
