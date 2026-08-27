"use client"

import * as React from "react"
import {
  Bookmark02Icon,
  Copy01Icon,
  MessageSquareReplyIcon,
  PencilEdit02Icon,
  PinIcon,
  TrashIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  MenuItem,
  MenuSeparator,
  MenuShortcut,
} from "@/components/aiellie-ui/menu"
import {
  MessageContextMenu,
  MessageContextMenuContent,
  MessageContextMenuTrigger,
  MessageReactionPicker,
} from "@/components/aiellie-ui/message-context-menu"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"

type Turn = {
  id: string
  text: string
  align: "start" | "end"
  variant: "muted" | "default"
}

const thread: Turn[] = [
  {
    id: "a",
    text: "Three people debated the rollout date and settled on shipping behind a flag next Tuesday.",
    align: "start",
    variant: "muted",
  },
  {
    id: "b",
    text: "That works — I'll let the team know.",
    align: "end",
    variant: "default",
  },
]

/**
 * Right click a message — or press and hold it on a touch screen, which Base UI
 * treats as the same gesture — for the things that can be done to it, with the
 * reactions across the top where they can be picked in one movement.
 */
export function MessageContextMenuDemo() {
  const [reactions, setReactions] = React.useState<
    Record<string, string | null>
  >({ a: "👍" })

  return (
    <BubbleGroup className="w-full max-w-sm gap-4">
      {thread.map((turn) => (
        <MessageContextMenu key={turn.id}>
          <MessageContextMenuTrigger
            className={turn.align === "end" ? "self-end" : undefined}
          >
            <Bubble variant={turn.variant} align={turn.align}>
              <BubbleContent>{turn.text}</BubbleContent>
              {reactions[turn.id] ? (
                <BubbleReactions
                  align={turn.align}
                  role="img"
                  aria-label={`Reaction: ${reactions[turn.id]}`}
                >
                  <span>{reactions[turn.id]}</span>
                </BubbleReactions>
              ) : null}
            </Bubble>
          </MessageContextMenuTrigger>

          <MessageContextMenuContent>
            <MessageReactionPicker
              value={reactions[turn.id] ?? null}
              onValueChange={(value) =>
                setReactions((previous) => ({ ...previous, [turn.id]: value }))
              }
            />
            <MenuSeparator />
            <MenuItem>
              <HugeiconsIcon icon={MessageSquareReplyIcon} />
              Reply
              <MenuShortcut>⌘R</MenuShortcut>
            </MenuItem>
            <MenuItem>
              <HugeiconsIcon icon={Copy01Icon} />
              Copy text
              <MenuShortcut>⌘C</MenuShortcut>
            </MenuItem>
            {turn.align === "end" ? (
              <MenuItem>
                <HugeiconsIcon icon={PencilEdit02Icon} />
                Edit
              </MenuItem>
            ) : null}
            <MenuItem>
              <HugeiconsIcon icon={PinIcon} />
              Pin to thread
            </MenuItem>
            <MenuItem>
              <HugeiconsIcon icon={Bookmark02Icon} />
              Save to notes
            </MenuItem>
            <MenuSeparator />
            <MenuItem variant="destructive">
              <HugeiconsIcon icon={TrashIcon} />
              Delete
            </MenuItem>
          </MessageContextMenuContent>
        </MessageContextMenu>
      ))}
    </BubbleGroup>
  )
}

/**
 * The picker on its own, for the cases where reactions are the whole menu — a
 * thread where nothing else can be done to a message that has already been sent.
 */
export function MessageContextMenuReactionsDemo() {
  const [reaction, setReaction] = React.useState<string | null>(null)

  return (
    <MessageContextMenu>
      <MessageContextMenuTrigger>
        <Bubble variant="muted">
          <BubbleContent>
            Right click for the reactions, and nothing else.
          </BubbleContent>
          {reaction ? (
            <BubbleReactions role="img" aria-label={`Reaction: ${reaction}`}>
              <span>{reaction}</span>
            </BubbleReactions>
          ) : null}
        </Bubble>
      </MessageContextMenuTrigger>
      <MessageContextMenuContent className="min-w-0">
        <MessageReactionPicker value={reaction} onValueChange={setReaction} />
      </MessageContextMenuContent>
    </MessageContextMenu>
  )
}
