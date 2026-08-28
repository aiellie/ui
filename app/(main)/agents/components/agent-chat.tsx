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
  EmptyState,
  EmptyStateComposer,
  EmptyStateContent,
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

import { Pane } from "./pane"

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
 * The portrait and the name, drawn the same either side of the first message —
 * only the glass behind it changes. The glyph stands in while the picture is
 * still coming off its host, and stays if it never does.
 */
function Portrait({ agent, floating }: { agent: Agent; floating: boolean }) {
  return (
    <ChatAvatar floating={floating}>
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
      <ChatAvatarName chevron={false}>{agent.name}</ChatAvatarName>
    </ChatAvatar>
  )
}

/**
 * The middle of the workspace: the agent's opening screen until there is
 * something in the thread, and the thread itself after that.
 *
 * The composer moves rather than being duplicated. On the opening screen it is
 * the middle of the page — the one thing a reader is there to reach — and once
 * a thread exists it belongs at the foot, under what has been said. That is
 * also why the state lives here: it is the same field, and where it sits is the
 * only thing the first message changes.
 */
function AgentChat({ agent }: { agent: Agent }) {
  const [turns, setTurns] = React.useState<Turn[]>([])
  const [value, setValue] = React.useState("")

  function send(text: string) {
    setTurns((previous) => [...previous, { id: previous.length + 1, text }])
    setValue("")
  }

  const opening = turns.length === 0

  return (
    <Pane
      icon={agent.icon}
      title={agent.name}
      footer={
        opening ? null : (
          /* Held to the thread's own measure rather than the panel's width.
             A composer as wide as the window puts its send control in the
             bottom corner of the screen — which on this site is where the
             theme toggle floats — and a field a thousand pixels wide was
             never the right shape for a line of text anyway. */
          <div className={measure}>
            <MessageInput
              value={value}
              onValueChange={setValue}
              onSubmit={send}
            >
              <MessageInputField placeholder={`Message ${agent.name}…`} />
              <MessageInputSubmit />
            </MessageInput>
          </div>
        )
      }
    >
      {opening ? (
        <EmptyState className="p-3">
          <div />
          <EmptyStateContent>
            <Portrait agent={agent} floating={false} />
            <EmptyStateTitle>Where would you like to start?</EmptyStateTitle>
            <EmptyStateDescription>{agent.description}</EmptyStateDescription>
            <EmptyStateComposer className="max-w-lg">
              <MessageInput
                value={value}
                onValueChange={setValue}
                onSubmit={send}
              >
                <MessageInputField placeholder="Ask anything…" />
                <MessageInputSubmit />
              </MessageInput>
            </EmptyStateComposer>
          </EmptyStateContent>
        </EmptyState>
      ) : (
        <ChatCardThread className={cn(measure, "h-full")}>
          <Portrait agent={agent} floating />
          {turns.map((turn) => (
            <Bubble key={turn.id} align="end">
              <BubbleContent>{turn.text}</BubbleContent>
            </Bubble>
          ))}
        </ChatCardThread>
      )}
    </Pane>
  )
}

export { AgentChat }
