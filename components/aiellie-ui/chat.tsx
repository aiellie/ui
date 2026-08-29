"use client"

import * as React from "react"
import {
  ArrowReloadHorizontalIcon,
  Copy01Icon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ChatStatus } from "ai"

import { Attachment, Attachments } from "@/components/aiellie-ui/attachments"
import { ChatCard } from "@/components/aiellie-ui/chat-card"
import {
  SourceItem,
  Sources,
  SourcesContent,
  SourcesTrigger,
  type Source,
} from "@/components/aiellie-ui/citations"
import {
  AddMenu,
  AddMenuContent,
  AddMenuTrigger,
  type AddAction,
} from "@/components/aiellie-ui/composer/add-menu"
import {
  MessageInput,
  MessageInputField,
  MessageInputLine,
  messageInputStack,
  MessageInputSubmit,
  MessageInputToolbar,
  type MessageInputFieldProps,
  type MessageInputProps,
} from "@/components/aiellie-ui/composer/message-input"
import {
  MessageAction,
  MessageActions,
} from "@/components/aiellie-ui/message-actions"
import {
  MessageStatus,
  type MessageStatusValue,
} from "@/components/aiellie-ui/message-status"
import {
  Reasoning,
  ReasoningContent,
  ReasoningStep,
  ReasoningTrigger,
} from "@/components/aiellie-ui/reasoning"
import { Response } from "@/components/aiellie-ui/response"
import {
  StreamingText,
  type StreamingSegment,
} from "@/components/aiellie-ui/streaming-text"
import { Timestamp } from "@/components/aiellie-ui/timestamps"
import {
  ToolCall,
  ToolCallCode,
  ToolCallName,
  ToolCallPanel,
  ToolCallSection,
  ToolCallSummary,
  ToolCallTrigger,
  type ToolCallStatus,
} from "@/components/aiellie-ui/tool-call"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent, MessageFooter } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

/**
 * A whole agentic chat, assembled: the frame, the thread, one turn of it, and
 * the composer under it.
 *
 * Everything here already exists as an element of its own. What this file adds
 * is the *assembly* — the order the parts of an answer arrive in, which of them
 * a turn is drawn from, and where the pieces of a chat sit relative to each
 * other. That is the part every project rewrites, and it is the part that is
 * hardest to get right from a page of separate cards.
 *
 * The turn is written from data rather than from children. An answer is not a
 * layout somebody arranges once: it is a list of parts that arrives in an order
 * nobody chose in advance — a spell of thinking, two tool calls, a paragraph,
 * the sources under it — and rendering that from a `ChatPart[]` is the only
 * shape that survives the parts arriving one at a time. Anything wanting a turn
 * built by hand still has every element underneath to build it from.
 */

/** A file a message is carrying. */
export interface ChatFile {
  id?: string
  name: string
  size?: number
}

/**
 * One piece of an answer, in the order it arrived. A turn is a list of these,
 * because that is what a turn is: thinking, then calls, then words, then what
 * the words were taken from.
 */
export type ChatPart =
  | {
      type: "reasoning"
      steps: readonly string[]
      /** Still going, which is what keeps the panel open and the clock running. */
      thinking?: boolean
      /** How long it took, for a transcript being read back rather than watched. */
      duration?: number
    }
  | {
      type: "tool"
      name: string
      summary?: string
      status?: ToolCallStatus
      arguments?: string
      result?: string
    }
  /** Prose, whole. Takes nodes, so an answer can carry its own citation marks. */
  | { type: "text"; text: React.ReactNode }
  /** Prose still arriving, word by word. */
  | {
      type: "streaming"
      segments: readonly StreamingSegment[]
      count?: number
      streaming?: boolean
    }
  | { type: "sources"; sources: readonly Source[] }

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  /**
   * What a person wrote. An answer's words are a `text` part instead, since
   * they arrive among the rest of it rather than before them.
   */
  text?: string
  parts?: readonly ChatPart[]
  files?: readonly ChatFile[]
  /** How far a sent message got. Only meaningful on a person's own. */
  status?: MessageStatusValue
  at?: Date | string | number
  /**
   * What the copy action puts on the clipboard. Worth setting for an answer
   * whose words are nodes rather than a string — the fallback below can only
   * gather the parts that are already text.
   */
  copyText?: string
}

/** Everything in a turn that is already a string, joined for the clipboard. */
function textOf(message: ChatMessage) {
  if (message.copyText) return message.copyText
  if (message.text) return message.text

  return (message.parts ?? [])
    .map((part) => {
      if (part.type === "text") {
        return typeof part.text === "string" ? part.text : ""
      }
      if (part.type === "streaming") {
        return part.segments
          .map((segment) =>
            typeof segment === "string" ? segment : segment.text
          )
          .join(" ")
      }
      return ""
    })
    .filter(Boolean)
    .join("\n\n")
}

/**
 * The frame. `chat-card`'s, under the name of the thing being built in it —
 * a header that stays, a middle that scrolls, a foot that does not move.
 */
export function Chat({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <ChatCard data-slot="chat" className={cn("h-140", className)} {...props} />
  )
}

/**
 * The middle. `message-scroller` rather than the card's own small thread,
 * because an agentic answer is tall — a spell of thinking and three tool calls
 * before a word of it appears — and a reader who scrolls up to re-read a tool
 * result should not be dragged back down by the next part landing.
 *
 * The jump-to-latest is what makes that safe: the thread stops following, and
 * the way back is a button rather than a scroll.
 */
export function ChatThread({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MessageScroller>) {
  return (
    <MessageScrollerProvider>
      <MessageScroller data-slot="chat-thread" className={className} {...props}>
        <MessageScrollerViewport className="px-3 py-3">
          <MessageScrollerContent className="gap-5">
            {children}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

/**
 * One row of the thread. Wrap each turn in one — `scrollAnchor` marks the ones
 * a reader is brought back to, which for a chat is the question rather than the
 * answer: an answer that has run to three screens is read from its question
 * down, not from its last line up.
 */
export function ChatThreadItem(
  props: React.ComponentProps<typeof MessageScrollerItem>
) {
  return <MessageScrollerItem data-slot="chat-thread-item" {...props} />
}

/** One piece of an answer, drawn as whichever element that piece is. */
export function ChatTurnPart({ part }: { part: ChatPart }) {
  switch (part.type) {
    case "reasoning":
      return (
        <Reasoning thinking={part.thinking} duration={part.duration}>
          <ReasoningTrigger />
          <ReasoningContent>
            {part.steps.map((step) => (
              <ReasoningStep key={step}>{step}</ReasoningStep>
            ))}
          </ReasoningContent>
        </Reasoning>
      )

    case "tool":
      return (
        <ToolCall status={part.status}>
          <ToolCallTrigger>
            <ToolCallName>{part.name}</ToolCallName>
            {part.summary ? (
              <ToolCallSummary>{part.summary}</ToolCallSummary>
            ) : null}
          </ToolCallTrigger>
          {/* No panel at all when there is nothing in it: a chevron that opens
              onto an empty box is worse than a row that plainly does not open. */}
          {part.arguments || part.result ? (
            <ToolCallPanel>
              {part.arguments ? (
                <ToolCallSection label="Arguments">
                  <ToolCallCode>{part.arguments}</ToolCallCode>
                </ToolCallSection>
              ) : null}
              {part.result ? (
                <ToolCallSection label="Result">
                  <ToolCallCode>{part.result}</ToolCallCode>
                </ToolCallSection>
              ) : null}
            </ToolCallPanel>
          ) : null}
        </ToolCall>
      )

    case "text":
      return (
        // Ghost rather than a filled bubble: an answer is the page's own voice
        // and the longest thing on it, and a paragraph of prose in a tinted box
        // reads as a quotation of itself.
        <Bubble variant="ghost">
          <BubbleContent>
            <Response>{part.text}</Response>
          </BubbleContent>
        </Bubble>
      )

    case "streaming":
      return (
        <Bubble variant="ghost">
          <BubbleContent>
            <StreamingText
              segments={part.segments}
              count={part.count}
              streaming={part.streaming}
            />
          </BubbleContent>
        </Bubble>
      )

    case "sources":
      return (
        <Sources>
          <SourcesTrigger count={part.sources.length} />
          <SourcesContent>
            {part.sources.map((source, index) => (
              <SourceItem key={source.id} source={source} index={index + 1} />
            ))}
          </SourcesContent>
        </Sources>
      )
  }
}

/**
 * What an answer can be done to: copied, rated, run again. Held back until the
 * turn is hovered or focused, so a thread of six answers is not also a wall of
 * thirty buttons.
 *
 * The rating is kept here rather than asked of the caller. It is the one piece
 * of state in this file, and it is here because a thumb that does not stay down
 * has not registered anything: `onRate` hears about it, and the row shows it
 * either way.
 */
export function ChatTurnActions({
  message,
  onRetry,
  onRate,
  className,
  ...props
}: Omit<React.ComponentProps<typeof MessageActions>, "children"> & {
  message: ChatMessage
  onRetry?: (message: ChatMessage) => void
  onRate?: (rating: "up" | "down" | null, message: ChatMessage) => void
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const [rating, setRating] = React.useState<"up" | "down" | null>(null)

  const rate = (next: "up" | "down") => {
    const value = rating === next ? null : next
    setRating(value)
    onRate?.(value, message)
  }

  return (
    <MessageActions showOnHover className={className} {...props}>
      <MessageAction
        tooltip={isCopied ? "Copied" : "Copy"}
        active={isCopied}
        onClick={() => copyToClipboard(textOf(message))}
      >
        <HugeiconsIcon icon={isCopied ? Tick02Icon : Copy01Icon} />
      </MessageAction>
      <MessageAction
        tooltip="Good answer"
        active={rating === "up"}
        onClick={() => rate("up")}
      >
        <HugeiconsIcon icon={ThumbsUpIcon} />
      </MessageAction>
      <MessageAction
        tooltip="Bad answer"
        active={rating === "down"}
        onClick={() => rate("down")}
      >
        <HugeiconsIcon icon={ThumbsDownIcon} />
      </MessageAction>
      {onRetry ? (
        <MessageAction tooltip="Try again" onClick={() => onRetry(message)}>
          <HugeiconsIcon icon={ArrowReloadHorizontalIcon} />
        </MessageAction>
      ) : null}
    </MessageActions>
  )
}

export interface ChatTurnProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  message: ChatMessage
  /** Replaces the row under an answer. */
  actions?: React.ReactNode
  onRetry?: (message: ChatMessage) => void
}

/**
 * One turn, drawn from what it is: a person's message is their files, their
 * words and how far the message got; an answer is its parts in the order they
 * arrived, with the row of what can be done to it underneath.
 *
 * The two sides are one component rather than two, because everything that
 * differs between them is a branch on `role` and everything else — the width,
 * the footer, the alignment — is the same thing twice. Two components drift the
 * first time either is touched.
 */
export function ChatTurn({
  message,
  actions,
  onRetry,
  className,
  ...props
}: ChatTurnProps) {
  const user = message.role === "user"
  const footer = message.at || (user && message.status) || !user

  return (
    <Message
      data-slot="chat-turn"
      align={user ? "end" : "start"}
      className={className}
      {...props}
    >
      <MessageContent>
        {message.files?.length ? (
          <Attachments className={user ? "justify-end" : undefined}>
            {message.files.map((file) => (
              <Attachment
                key={file.id ?? file.name}
                name={file.name}
                size={file.size}
              />
            ))}
          </Attachments>
        ) : null}

        {user
          ? message.text && (
              <Bubble align="end">
                <BubbleContent>{message.text}</BubbleContent>
              </Bubble>
            )
          : message.parts?.map((part, index) => (
              <ChatTurnPart key={index} part={part} />
            ))}

        {footer ? (
          <MessageFooter className="gap-2">
            {message.at ? (
              <Timestamp date={message.at} showOnHover placement="footer" />
            ) : null}
            {user && message.status ? (
              <MessageStatus status={message.status} />
            ) : null}
            {user
              ? null
              : (actions ?? (
                  <ChatTurnActions message={message} onRetry={onRetry} />
                ))}
          </MessageFooter>
        ) : null}
      </MessageContent>
    </Message>
  )
}

export interface ChatComposerProps extends Omit<MessageInputProps, "children"> {
  placeholder?: string
  /** The files the message is carrying, drawn above the line. */
  files?: readonly ChatFile[]
  onRemoveFile?: (file: ChatFile) => void
  /** The plus's catalogue, and what was chosen from it. */
  addActions?: AddAction[]
  onAdd?: (action: AddAction) => void
  /** Turns the send into a stop while an answer is coming back. */
  status?: ChatStatus
  onStop?: () => void
  /**
   * Handed straight to the field. This is where a mention or slash controller's
   * `fieldProps` go — the menus those open are the caller's to render, since
   * both want to sit against the composer rather than inside it.
   */
  fieldProps?: MessageInputFieldProps
  /** What stands on the row underneath: the model, the tools, the rest. */
  children?: React.ReactNode
}

/**
 * The composer, in the arrangement `message-input` sets out: the files above
 * the line, the plus and the send either side of the field, and whatever a chat
 * is being sent with underneath.
 *
 * The pickers are `children` rather than props because they are the one part of
 * a composer that is genuinely different per product — a chat with no tools has
 * no tool picker, and a component taking `models`, `tools`, `effort` and
 * `approval` as props would be re-declaring four elements that already exist.
 */
export function ChatComposer({
  placeholder = "Ask anything…",
  files,
  onRemoveFile,
  addActions,
  onAdd,
  status,
  onStop,
  fieldProps,
  className,
  children,
  ...props
}: ChatComposerProps) {
  return (
    <MessageInput
      data-slot="chat-composer"
      className={cn(messageInputStack, className)}
      {...props}
    >
      {files?.length ? (
        <Attachments>
          {files.map((file) => (
            <Attachment
              key={file.id ?? file.name}
              name={file.name}
              size={file.size}
              onRemove={onRemoveFile ? () => onRemoveFile(file) : undefined}
            />
          ))}
        </Attachments>
      ) : null}

      <MessageInputLine>
        <AddMenu actions={addActions} onSelect={onAdd}>
          <AddMenuTrigger />
          <AddMenuContent side="top" />
        </AddMenu>
        <MessageInputField placeholder={placeholder} {...fieldProps} />
        <MessageInputSubmit status={status} onStop={onStop} />
      </MessageInputLine>

      {/* No empty row: a chat with nothing to set is a plus, a field and a
          send, and a toolbar holding nothing is a gap under all three. */}
      {children ? <MessageInputToolbar>{children}</MessageInputToolbar> : null}
    </MessageInput>
  )
}
