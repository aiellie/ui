"use client"

import * as React from "react"
import { AiChat02Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ChatStatus } from "ai"

import {
  Chat,
  ChatComposer,
  ChatThread,
  ChatThreadItem,
  ChatTurn,
  type ChatMessage,
} from "@/components/aiellie-ui/chat"
import {
  ChatAvatar,
  ChatAvatarActions,
  ChatAvatarImage,
  ChatAvatarName,
} from "@/components/aiellie-ui/chat-avatar"
import { ChatCardFooter } from "@/components/aiellie-ui/chat-card"
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/components/aiellie-ui/composer/empty-state"
import {
  ModelPicker,
  ModelPickerContent,
  ModelPickerTrigger,
} from "@/components/aiellie-ui/composer/model-picker"
import { Suggestions } from "@/components/aiellie-ui/suggestions"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { TypingIndicator } from "@/components/aiellie-ui/typing-indicator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { avatarFor } from "@/lib/avatars"
import { findModel } from "@/lib/models"

/**
 * The chat, as a block, and deliberately a plain one: a person and an
 * assistant trading text.
 *
 * No tool calls, no thinking, no sources — those are the agent card's day.
 * This is the shape nearly every product actually ships first: a thread of
 * words, a composer with a plus and a model to choose, and an opening screen
 * that says what the thing is. The agentic machinery is one part-type away
 * when a project grows into it, because the thread here is the same
 * `ChatTurn` the agent card draws with.
 */

const suggestions = [
  "What shipped this week?",
  "Summarise the rollout thread",
  "Draft the Thursday note",
]

/* What Ellie says back, matched loosely to what was asked and cycled so a
   longer conversation does not repeat itself on the second turn. */
const answers = [
  "The flag landed Tuesday night — staff have it now, everyone else gets it Thursday once the migration lands.",
  "Short version: shipped dark, staff first, support gets the note this afternoon, and Thursday is still the date.",
  "Drafted. It leads with the date, keeps the flag detail to one line, and points at the rollout doc for the rest.",
  "Nothing else moved today — the index rebuild is the only thing between here and Thursday.",
]

interface Turn extends ChatMessage {
  id: string
}

export function ChatDemo() {
  const [messages, setMessages] = React.useState<Turn[]>([])
  const [status, setStatus] = React.useState<ChatStatus>("ready")
  const [model, setModel] = React.useState("claude-opus-5")
  const ids = React.useRef(0)
  const answered = React.useRef(0)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

  /* Every scheduled beat dies with the card. */
  React.useEffect(() => {
    const running = timers.current
    return () => running.forEach(clearTimeout)
  }, [])

  const stop = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setStatus("ready")
  }

  const send = (text: string) => {
    const askId = `q-${(ids.current += 1)}`
    const replyId = `a-${(ids.current += 1)}`
    const answer = answers[answered.current++ % answers.length]

    setMessages((list) => [
      ...list,
      { id: askId, role: "user", text, status: "sent", at: new Date() },
    ])
    setStatus("submitted")

    timers.current.push(
      setTimeout(() => {
        setStatus("streaming")
        setMessages((list) => [
          ...list,
          {
            id: replyId,
            role: "assistant",
            parts: [{ type: "streaming", streaming: true, segments: [answer] }],
          },
        ])
      }, 900),
      setTimeout(() => {
        setStatus("ready")
        setMessages((list) =>
          list.map((message) =>
            message.id === replyId
              ? {
                  ...message,
                  parts: [
                    { type: "streaming", streaming: false, segments: [answer] },
                  ],
                }
              : message
          )
        )
      }, 3400)
    )
  }

  const empty = messages.length === 0
  const answering = findModel(model)?.name ?? model

  return (
    <TooltipProvider>
      <Chat className="max-w-2xl">
        <ChatThread>
          {empty ? null : (
            <ChatAvatar>
              <ChatAvatarImage
                src={avatarFor("ellie")}
                fallback="E"
                className="size-10"
              />
              <ChatAvatarName render={<button type="button" />}>
                Ellie
              </ChatAvatarName>
              <ChatAvatarActions side="end">
                <TooltipIconButton
                  tooltip="New chat"
                  onClick={() => {
                    stop()
                    setMessages([])
                  }}
                >
                  <HugeiconsIcon icon={PlusSignIcon} />
                </TooltipIconButton>
              </ChatAvatarActions>
            </ChatAvatar>
          )}

          {empty ? (
            <EmptyState className="min-h-full">
              <EmptyStateMedia>
                <HugeiconsIcon icon={AiChat02Icon} />
              </EmptyStateMedia>
              <EmptyStateTitle>Ask Ellie anything</EmptyStateTitle>
              <EmptyStateDescription>
                A plain text chat: the plus attaches, the model is chosen under
                the field, and the answer streams back in words.
              </EmptyStateDescription>
            </EmptyState>
          ) : (
            messages.map((message) => (
              <ChatThreadItem
                key={message.id}
                scrollAnchor={message.role === "user"}
              >
                <ChatTurn message={message} />
              </ChatThreadItem>
            ))
          )}
          {status === "submitted" ? (
            <TypingIndicator
              variant="label"
              label={`${answering} is reading`}
            />
          ) : null}
        </ChatThread>

        <ChatCardFooter>
          {empty ? (
            <Suggestions suggestions={suggestions} onSuggestion={send} />
          ) : null}
          <ChatComposer
            placeholder="Message Ellie…"
            status={status}
            onStop={stop}
            onSubmit={send}
          >
            <ModelPicker value={model} onValueChange={setModel}>
              <ModelPickerTrigger className="ms-auto" />
              <ModelPickerContent side="top" />
            </ModelPicker>
          </ChatComposer>
        </ChatCardFooter>
      </Chat>
    </TooltipProvider>
  )
}
