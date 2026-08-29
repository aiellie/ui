"use client"

import * as React from "react"
import {
  BubbleChatIcon,
  PencilEdit02Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Attachment, Attachments } from "@/components/aiellie-ui/attachments"
import {
  ChatAvatar,
  ChatAvatarActions,
  ChatAvatarImage,
  ChatAvatarName,
} from "@/components/aiellie-ui/chat-avatar"
import {
  ChatCard,
  ChatCardFooter,
  ChatCardThread,
} from "@/components/aiellie-ui/chat-card"
import {
  AddMenu,
  AddMenuContent,
  AddMenuTrigger,
  type AddAction,
} from "@/components/aiellie-ui/composer/add-menu"
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/components/aiellie-ui/composer/empty-state"
import {
  MessageInput,
  MessageInputField,
  MessageInputLine,
  messageInputStack,
  MessageInputSubmit,
} from "@/components/aiellie-ui/composer/message-input"
import { MessageStatus } from "@/components/aiellie-ui/message-status"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { TypingIndicator } from "@/components/aiellie-ui/typing-indicator"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { avatarFor } from "@/lib/avatars"

const ines = avatarFor("ines")

interface CarriedFile {
  id: string
  name: string
  size?: number
}

interface Turn {
  id: number
  from: "me" | "them"
  text: string
  files?: CarriedFile[]
}

/* What Inés says back, in order — enough that a conversation can be had
   before the script laps itself. */
const replies = [
  "Perfect timing — I was about to ask.",
  "Got it. I'll fold that into the doc.",
  "Agreed. Thursday still holds?",
  "Nice. Send the note to support too?",
]

/** The files the plus can put on the message, keyed by catalogue id. */
const carriable = new Map<string, CarriedFile>([
  ["upload", { id: "upload", name: "rollout-notes.md", size: 4_812 }],
  [
    "photos-library",
    { id: "photos-library", name: "IMG_0412.jpg", size: 1_284_301 },
  ],
  [
    "drive-roadmap",
    { id: "drive-roadmap", name: "Roadmap.pdf", size: 2_412_881 },
  ],
  ["drive-budget", { id: "drive-budget", name: "Budget.xlsx", size: 88_202 }],
  [
    "drive-kickoff",
    { id: "drive-kickoff", name: "Kickoff.docx", size: 219_004 },
  ],
])

/**
 * The chat card as a block: a whole, working direct-message card.
 *
 * Not a gallery of its states — it opens empty and explains itself, and every
 * other state is reached by using it: send something and the message carries
 * its tick, attach something from the plus and the chips ride above the
 * field until the send takes them, and Inés types back on her own time.
 * Everything the block is made of installs separately; this file is only the
 * conversation between the parts.
 */
export function ChatCardDemo() {
  const [turns, setTurns] = React.useState<Turn[]>([])
  const [carrying, setCarrying] = React.useState<CarriedFile[]>([])
  const [typing, setTyping] = React.useState(false)
  const ids = React.useRef(0)
  const replied = React.useRef(0)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

  React.useEffect(() => {
    const running = timers.current
    return () => running.forEach(clearTimeout)
  }, [])

  const add = (action: AddAction) => {
    const file = carriable.get(action.id)
    // The catalogue is deeper than the demo's pretend filesystem; a row it
    // has no file for simply adds nothing.
    if (!file) return
    setCarrying((list) =>
      list.some((item) => item.id === file.id) ? list : [...list, file]
    )
  }

  /* Derived from the list rather than read off the ref: the render is not
     allowed to peek at `ids`, and the last of my messages is what the tick
     belongs to anyway. */
  const lastMine = [...turns].reverse().find((turn) => turn.from === "me")

  const send = (message: string) => {
    setTurns((list) => [
      ...list,
      {
        id: (ids.current += 1),
        from: "me",
        text: message,
        files: carrying.length ? carrying : undefined,
      },
    ])
    setCarrying([])

    /* She reads, then types, then answers — the three beats a real reply
       has, so the typing indicator earns its moment on screen. */
    timers.current.push(
      setTimeout(() => setTyping(true), 900),
      setTimeout(() => {
        setTyping(false)
        setTurns((list) => [
          ...list,
          {
            id: (ids.current += 1),
            from: "them",
            text: replies[replied.current++ % replies.length],
          },
        ])
      }, 2_600)
    )
  }

  return (
    <ChatCard className="max-w-sm">
      <ChatCardThread>
        <ChatAvatar floating={turns.length > 0}>
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

        {turns.length === 0 ? (
          <EmptyState className="m-auto">
            <EmptyStateMedia>
              <HugeiconsIcon icon={BubbleChatIcon} />
            </EmptyStateMedia>
            <EmptyStateTitle>No messages yet</EmptyStateTitle>
            <EmptyStateDescription>
              Say something — files, photos and the connectors live behind the
              plus, and she types back.
            </EmptyStateDescription>
          </EmptyState>
        ) : (
          turns.map((turn) => (
            <div
              key={turn.id}
              className={
                turn.from === "me"
                  ? "flex flex-col items-end gap-1"
                  : "flex flex-col items-start gap-1"
              }
            >
              {turn.files?.length ? (
                <Attachments className="justify-end">
                  {turn.files.map((file) => (
                    <Attachment
                      key={file.id}
                      name={file.name}
                      size={file.size}
                    />
                  ))}
                </Attachments>
              ) : null}
              <Bubble
                align={turn.from === "me" ? "end" : "start"}
                variant={turn.from === "me" ? "default" : "muted"}
              >
                <BubbleContent>{turn.text}</BubbleContent>
              </Bubble>
              {turn.from === "me" && turn.id === lastMine?.id ? (
                <MessageStatus status="delivered" />
              ) : null}
            </div>
          ))
        )}
        {typing ? <TypingIndicator label="Inés is typing" /> : null}
      </ChatCardThread>

      <ChatCardFooter>
        <MessageInput onSubmit={send} className={messageInputStack}>
          {carrying.length ? (
            <Attachments>
              {carrying.map((file) => (
                <Attachment
                  key={file.id}
                  name={file.name}
                  size={file.size}
                  onRemove={() =>
                    setCarrying((list) =>
                      list.filter((item) => item.id !== file.id)
                    )
                  }
                />
              ))}
            </Attachments>
          ) : null}
          <MessageInputLine>
            <AddMenu onSelect={add}>
              <AddMenuTrigger />
              <AddMenuContent side="top" />
            </AddMenu>
            <MessageInputField placeholder="Message Inés…" />
            <MessageInputSubmit />
          </MessageInputLine>
        </MessageInput>
      </ChatCardFooter>
    </ChatCard>
  )
}
