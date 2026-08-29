"use client"

import * as React from "react"
import {
  BubbleChatTemporaryIcon,
  MoreHorizontalIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  ChatCard,
  ChatCardActions,
  ChatCardDescription,
  ChatCardFooter,
  ChatCardHeader,
  ChatCardThread,
  ChatCardTitle,
} from "@/components/aiellie-ui/chat-card"
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/components/aiellie-ui/composer/empty-state"
import {
  MessageInput,
  MessageInputField,
  MessageInputSubmit,
} from "@/components/aiellie-ui/composer/message-input"
import { Suggestions } from "@/components/aiellie-ui/suggestions"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { TypingIndicator } from "@/components/aiellie-ui/typing-indicator"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { MessageAvatar } from "@/components/ui/message"

type Turn = { id: number; from: "me" | "them"; text: string }

const opening: Turn[] = [
  { id: 1, from: "them", text: "Morning — did the flag land?" },
  {
    id: 2,
    from: "me",
    text: "It went in behind rollout.tuesday last night.",
  },
  { id: 3, from: "them", text: "And staff first, or everyone?" },
]

function Turns({ turns }: { turns: Turn[] }) {
  return (
    <>
      {turns.map((turn) => (
        <Bubble
          key={turn.id}
          align={turn.from === "me" ? "end" : "start"}
          variant={turn.from === "me" ? "default" : "muted"}
        >
          <BubbleContent>{turn.text}</BubbleContent>
        </Bubble>
      ))}
    </>
  )
}

const ellie = "https://images.aiellie.app/chatcard.png?mode=image&radius=0"

function Header() {
  return (
    <ChatCardHeader>
      <MessageAvatar className="relative size-7 text-[11px] font-medium text-muted-foreground">
        E
        {/* eslint-disable-next-line @next/next/no-img-element -- a plain img
            rather than next/image, because this file is copied into projects
            that are not necessarily Next ones. */}
        <img
          src={ellie}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      </MessageAvatar>
      <div className="min-w-0">
        <ChatCardTitle>Ellie</ChatCardTitle>
        <ChatCardDescription>Rollout thread</ChatCardDescription>
      </div>
      <ChatCardActions>
        <TooltipIconButton tooltip="More">
          <HugeiconsIcon icon={MoreHorizontalIcon} />
        </TooltipIconButton>
      </ChatCardActions>
    </ChatCardHeader>
  )
}

/** A whole little chat: header, thread, composer — written in one place. */
export function ChatCardDemo() {
  const [turns, setTurns] = React.useState(opening)
  const [value, setValue] = React.useState("")

  return (
    <ChatCard className="max-w-sm">
      <Header />
      <ChatCardThread>
        <Turns turns={turns} />
      </ChatCardThread>
      <ChatCardFooter>
        <MessageInput
          value={value}
          onValueChange={setValue}
          onSubmit={(message) =>
            setTurns((previous) => [
              ...previous,
              { id: previous.length + 1, from: "me", text: message },
            ])
          }
        >
          <MessageInputField placeholder="Reply…" />
          <MessageInputSubmit />
        </MessageInput>
      </ChatCardFooter>
    </ChatCard>
  )
}

/**
 * The card following a thread that is still arriving: the newest message stays
 * in view, and scrolling up stops it being pulled back.
 */
export function ChatCardLiveDemo() {
  const [turns, setTurns] = React.useState(opening.slice(0, 1))
  const [typing, setTyping] = React.useState(true)

  const script = React.useMemo(
    () => [
      ...opening.slice(1),
      {
        id: 4,
        from: "me" as const,
        text: "Staff first, everyone on Thursday.",
      },
      { id: 5, from: "them" as const, text: "That works. I'll tell support." },
      {
        id: 6,
        from: "me" as const,
        text: "Thanks — the note is in the rollout doc if they want the detail.",
      },
    ],
    []
  )

  React.useEffect(() => {
    const id = setInterval(() => {
      setTurns((previous) => {
        if (previous.length > script.length) return opening.slice(0, 1)
        const next = script[previous.length - 1]
        return next ? [...previous, next] : previous
      })
      setTyping(true)
    }, 2200)
    return () => clearInterval(id)
  }, [script])

  return (
    <ChatCard className="max-w-sm">
      <Header />
      <ChatCardThread>
        <Turns turns={turns} />
        {typing && turns.length <= script.length ? (
          <TypingIndicator label="Ellie is typing" />
        ) : null}
      </ChatCardThread>
      <ChatCardFooter>
        <MessageInput>
          <MessageInputField placeholder="Reply…" />
          <MessageInputSubmit />
        </MessageInput>
      </ChatCardFooter>
    </ChatCard>
  )
}

const prompts = ["Summarise the thread", "What changed since Friday?"]

/** The same frame with nothing in it yet, which is what an opening screen is. */
export function ChatCardEmptyDemo() {
  const [value, setValue] = React.useState("")

  return (
    <ChatCard className="max-w-sm">
      <Header />
      {/* The greeting takes the thread's place: the card already splits itself
          into a header, a middle that grows and a foot, so an opening screen is
          the same frame with words where the messages will go. */}
      <ChatCardThread>
        <EmptyState className="flex-1">
          <EmptyStateMedia>
            <HugeiconsIcon icon={BubbleChatTemporaryIcon} />
          </EmptyStateMedia>
          <EmptyStateTitle className="text-base">
            Nothing here yet
          </EmptyStateTitle>
          <EmptyStateDescription className="text-xs">
            Ask about the rollout, or pick one of these.
          </EmptyStateDescription>
        </EmptyState>
      </ChatCardThread>
      <ChatCardFooter>
        <Suggestions
          variant="list"
          suggestions={prompts}
          onSuggestion={setValue}
          selectedSuggestion={prompts.includes(value) ? value : null}
          className="max-w-full self-stretch"
        />
        <MessageInput value={value} onValueChange={setValue}>
          <MessageInputField placeholder="Ask anything…" />
          <MessageInputSubmit />
        </MessageInput>
      </ChatCardFooter>
    </ChatCard>
  )
}
