"use client"

import * as React from "react"

import {
  MessageContextMenu,
  MessageContextMenuContent,
  MessageContextMenuTrigger,
  MessageReactionPicker,
} from "@/components/aiellie-ui/message-context-menu"
import {
  Reactions,
  toggleReaction,
  type Reaction,
} from "@/components/aiellie-ui/reactions"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

const initial: Reaction[] = [
  { emoji: "👍", count: 3, reacted: true, people: ["Marta", "Sam"] },
  { emoji: "🎉", count: 1, people: ["Ines"] },
]

export function ReactionsDemo() {
  const [reactions, setReactions] = React.useState(initial)

  return (
    <BubbleGroup className="w-full max-w-sm gap-1.5">
      <Bubble variant="muted">
        <BubbleContent>
          Shipping behind a flag next Tuesday, staff first.
        </BubbleContent>
      </Bubble>
      <Reactions
        reactions={reactions}
        onToggle={(emoji) =>
          setReactions((previous) => toggleReaction(previous, emoji))
        }
      />
    </BubbleGroup>
  )
}

/**
 * The picker and the tally are two halves of one thing: the picker sets the
 * reader's own reaction, the row shows what everyone gave. Right click the
 * message, or press one of the pills to take yours back.
 */
export function ReactionsWithPickerDemo() {
  const [reactions, setReactions] = React.useState(initial)
  const toggle = (emoji: string) =>
    setReactions((previous) => toggleReaction(previous, emoji))

  const mine = reactions.find((reaction) => reaction.reacted)?.emoji ?? null

  return (
    <BubbleGroup className="w-full max-w-sm gap-1.5">
      <MessageContextMenu>
        <MessageContextMenuTrigger>
          <Bubble variant="muted">
            <BubbleContent>
              Right click for the picker, or press a pill below.
            </BubbleContent>
          </Bubble>
        </MessageContextMenuTrigger>
        <MessageContextMenuContent className="min-w-0">
          <MessageReactionPicker
            value={mine}
            onValueChange={(value) => {
              if (mine && mine !== value) toggle(mine)
              if (value) toggle(value)
              else if (mine) toggle(mine)
            }}
          />
        </MessageContextMenuContent>
      </MessageContextMenu>
      <Reactions reactions={reactions} onToggle={toggle} />
    </BubbleGroup>
  )
}

/** Both sides of a thread, including the row that has nothing on it yet. */
export function ReactionsThreadDemo() {
  const [theirs, setTheirs] = React.useState<Reaction[]>(initial)
  const [mine, setMine] = React.useState<Reaction[]>([])

  return (
    <BubbleGroup className="w-full max-w-sm gap-4">
      <div className="flex flex-col gap-1.5">
        <Bubble variant="muted">
          <BubbleContent>
            Shipping behind a flag next Tuesday, staff first.
          </BubbleContent>
        </Bubble>
        <Reactions
          reactions={theirs}
          onToggle={(emoji) =>
            setTheirs((previous) => toggleReaction(previous, emoji))
          }
          onAdd={() => setTheirs((previous) => toggleReaction(previous, "👀"))}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Bubble align="end">
          <BubbleContent>That works — I&rsquo;ll tell the team.</BubbleContent>
        </Bubble>
        <Reactions
          align="end"
          reactions={mine}
          onToggle={(emoji) =>
            setMine((previous) => toggleReaction(previous, emoji))
          }
          onAdd={() => setMine((previous) => toggleReaction(previous, "❤️"))}
        />
      </div>
    </BubbleGroup>
  )
}
