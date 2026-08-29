"use client"

import * as React from "react"
import { type IconSvgElement } from "@hugeicons/react"

import {
  ChatAvatar,
  ChatAvatarImage,
  ChatAvatarName,
} from "@/components/aiellie-ui/chat-avatar"
import { ChatCard, ChatCardFooter } from "@/components/aiellie-ui/chat-card"
import { ChatThread } from "@/components/aiellie-ui/chat"
import { cn } from "@/lib/utils"

/**
 * An agent at work, on a card: who it is floating at the top, what it is
 * doing coming down the thread, and — the part that makes it an agent card
 * rather than a chat — a state the reader can check from across the room.
 *
 * The thread is `chat`'s: an agent's turn is the same `ChatPart[]` an
 * assistant's answer is (thinking, calls, words, sources), so everything the
 * chat assembly renders, this card renders, approvals included. What this
 * file adds is the persona and the standing answer to "does it need me?" —
 * which for an agent that runs while nobody watches is the first question
 * every glance at the card is asking.
 */

export type AgentState = "idle" | "working" | "awaiting" | "done" | "failed"

const STATE_LABELS: Record<AgentState, string> = {
  idle: "Idle",
  working: "Working",
  awaiting: "Waiting on you",
  done: "Done",
  failed: "Failed",
}

const STATE_DOTS: Record<AgentState, string> = {
  idle: "bg-foreground/25",
  working: "bg-primary",
  /* The same amber an awaiting tool call wears — one colour for "a person is
     needed", wherever it is said. */
  awaiting: "bg-amber-500",
  done: "bg-emerald-500",
  failed: "bg-destructive",
}

export interface AgentStateChipProps extends React.ComponentProps<"span"> {
  state: AgentState
  /** A project's own words for the states, where the defaults are not them. */
  labels?: Partial<Record<AgentState, string>>
}

/**
 * The state, worn as a chip: a dot that can be read at a distance and the
 * word for anyone closer. A `status` region, so the moment the run turns to
 * `awaiting` is announced rather than discovered.
 */
export function AgentStateChip({
  state,
  labels,
  className,
  ...props
}: AgentStateChipProps) {
  return (
    <span
      data-slot="agent-state-chip"
      data-state={state}
      role="status"
      className={cn(
        "flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          STATE_DOTS[state],
          /* Only the state that is spending time moves. */
          state === "working" && "animate-pulse motion-reduce:animate-none"
        )}
      />
      {labels?.[state] ?? STATE_LABELS[state]}
    </span>
  )
}

export interface AgentPersona {
  name: string
  /** The portrait — `avatarFor(name)` from `lib/avatars` is the house source. */
  avatar?: string
  /** The glyph beside the name, saying what kind of agent this one is. */
  icon?: IconSvgElement
}

export interface AgentCardProps extends React.ComponentProps<typeof ChatCard> {
  persona: AgentPersona
  state?: AgentState
  labels?: Partial<Record<AgentState, string>>
  /** A composer, a run button, a report line — whatever stands in the foot. */
  footer?: React.ReactNode
}

export function AgentCard({
  persona,
  state = "idle",
  labels,
  footer,
  className,
  children,
  ...props
}: AgentCardProps) {
  return (
    <ChatCard
      data-slot="agent-card"
      data-state={state}
      className={cn("h-140 max-w-md", className)}
      {...props}
    >
      <ChatThread>
        <ChatAvatar>
          <ChatAvatarImage src={persona.avatar} className="size-10" />
          <ChatAvatarName chevron={false} icon={persona.icon}>
            {persona.name}
          </ChatAvatarName>
          <AgentStateChip state={state} labels={labels} />
        </ChatAvatar>
        {children}
      </ChatThread>
      {footer ? <ChatCardFooter>{footer}</ChatCardFooter> : null}
    </ChatCard>
  )
}
