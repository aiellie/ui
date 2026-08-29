"use client"

import * as React from "react"
import { PencilEdit02Icon, Video01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  ChatAvatar,
  ChatAvatarActions,
  ChatAvatarImage,
  ChatAvatarName,
  ChatAvatarStack,
} from "@/components/aiellie-ui/chat-avatar"
import {
  ChatCard,
  ChatCardFooter,
  ChatCardThread,
} from "@/components/aiellie-ui/chat-card"
import {
  MessageInput,
  MessageInputField,
  MessageInputSubmit,
} from "@/components/aiellie-ui/composer/message-input"
import { Timestamp } from "@/components/aiellie-ui/timestamps"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { TypingIndicator } from "@/components/aiellie-ui/typing-indicator"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { avatarFor } from "@/lib/avatars"

const HOUR = 3_600_000

/** One moment per mount, so the stamps read consistently while it is open. */
function useMountedAt() {
  return React.useState(() => Date.now())[0]
}

type Turn = { id: number; from: "me" | "them"; text: string }

/* Long enough to overflow the card, which is the point of the default demo:
   the messages have to have somewhere to go before it is clear that where
   they go is behind the glass. */
const thread: Turn[] = [
  { id: 1, from: "them", text: "Did the flag land in the end?" },
  { id: 2, from: "me", text: "Last night, behind rollout.tuesday." },
  { id: 3, from: "them", text: "Staff first, or everyone at once?" },
  { id: 4, from: "me", text: "Staff first. Everyone on Thursday." },
  { id: 5, from: "them", text: "Good — I'll warn support this afternoon." },
  {
    id: 6,
    from: "me",
    text: "The note is in the rollout doc if they want the detail.",
  },
  { id: 7, from: "them", text: "Perfect. Thank you!" },
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

const ines = avatarFor("ines")

function InesHeader() {
  return (
    <ChatAvatar>
      <ChatAvatarActions side="start">
        <TooltipIconButton tooltip="New message">
          <HugeiconsIcon icon={PencilEdit02Icon} />
        </TooltipIconButton>
      </ChatAvatarActions>

      <ChatAvatarImage src={ines} fallback="IB" className="size-10" />
      <ChatAvatarName render={<button type="button" />}>
        Inés Bonilla
      </ChatAvatarName>

      <ChatAvatarActions side="end">
        <TooltipIconButton tooltip="Call">
          <HugeiconsIcon icon={Video01Icon} />
        </TooltipIconButton>
      </ChatAvatarActions>
    </ChatAvatar>
  )
}

/**
 * The card as it is meant to be worn: the avatar floating over the thread
 * rather than barred across the top of it, so messages thin out into the
 * glass instead of stopping at a border. Everything else on this page — the
 * generators, the agents, the assembled chat — is this card with different
 * things in the thread.
 */
export function ChatCardDemo() {
  const now = useMountedAt()
  const [turns, setTurns] = React.useState(thread)

  return (
    <ChatCard className="max-w-sm">
      <ChatCardThread>
        <InesHeader />
        <Timestamp variant="separator" date={now - 26 * HOUR} format="day" />
        <Turns turns={turns} />
      </ChatCardThread>
      <ChatCardFooter>
        <MessageInput
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
 * The card following a thread that is still arriving: the newest message
 * stays in view, and scrolling up stops it being pulled back — glance at the
 * glass while the messages pass under it.
 */
export function ChatCardArrivingDemo() {
  const [turns, setTurns] = React.useState(thread.slice(0, 1))

  React.useEffect(() => {
    const id = setInterval(() => {
      setTurns((previous) => {
        if (previous.length >= thread.length) return thread.slice(0, 1)
        return [...previous, thread[previous.length]]
      })
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <ChatCard className="max-w-sm">
      <ChatCardThread>
        <InesHeader />
        <Turns turns={turns} />
        {turns.length < thread.length ? (
          <TypingIndicator label="Inés is typing" />
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

const party = [
  { id: "marta", initials: "MO", name: "Marta" },
  { id: "sam", initials: "SW", name: "Sam" },
  { id: "kenji", initials: "KW", name: "Kenji" },
]

/**
 * A group thread, where the header has three faces to fit and no more room
 * to fit them in — so they overlap and shrink rather than the cluster
 * growing.
 */
export function ChatCardGroupDemo() {
  const now = useMountedAt()

  return (
    <ChatCard className="max-w-sm">
      <ChatCardThread>
        <ChatAvatar>
          <ChatAvatarStack>
            {party.map((person) => (
              <ChatAvatarImage
                key={person.id}
                src={avatarFor(person.name)}
                fallback={
                  <span className="text-[11px]">{person.initials}</span>
                }
                className="size-10"
              />
            ))}
          </ChatAvatarStack>
          <ChatAvatarName render={<button type="button" />}>
            Rollout, 3 people
          </ChatAvatarName>

          <ChatAvatarActions side="end">
            <TooltipIconButton tooltip="Call">
              <HugeiconsIcon icon={Video01Icon} />
            </TooltipIconButton>
          </ChatAvatarActions>
        </ChatAvatar>

        <Timestamp variant="separator" date={now - 2 * HOUR} format="time" />
        <Turns turns={thread} />
      </ChatCardThread>
      <ChatCardFooter>
        <MessageInput>
          <MessageInputField placeholder="Message the group…" />
          <MessageInputSubmit />
        </MessageInput>
      </ChatCardFooter>
    </ChatCard>
  )
}

/**
 * `floating={false}`, for a thread with nothing in it yet. There is nothing
 * to float over, and glass over an empty card is a pane of it over a blank
 * wall.
 */
export function ChatCardOpeningDemo() {
  return (
    <ChatCard className="max-w-sm">
      <ChatCardThread className="items-center">
        <ChatAvatar floating={false} className="w-full pt-6">
          <ChatAvatarImage src={ines} fallback="IB" className="size-10" />
          <ChatAvatarName render={<button type="button" />}>
            Inés Bonilla
          </ChatAvatarName>
        </ChatAvatar>
        <p className="text-xs text-muted-foreground">
          No messages yet. Say something.
        </p>
      </ChatCardThread>
      <ChatCardFooter>
        <MessageInput>
          <MessageInputField placeholder="Message Inés…" />
          <MessageInputSubmit />
        </MessageInput>
      </ChatCardFooter>
    </ChatCard>
  )
}
