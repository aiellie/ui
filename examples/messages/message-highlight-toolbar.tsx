"use client"

import * as React from "react"
import {
  AiIdeaIcon,
  Bookmark02Icon,
  Brain02Icon,
  MessageSquareReplyIcon,
  Note01Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  MessageHighlight,
  MessageHighlightAction,
  MessageHighlightMenu,
  MessageHighlightMenuContent,
  MessageHighlightMenuItem,
  MessageHighlightMenuTrigger,
  MessageHighlightSeparator,
  MessageHighlightToolbar,
  useMessageHighlight,
} from "@/components/aiellie-ui/message-highlight-toolbar"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

const answer =
  "Three people debated the rollout date and settled on shipping behind a flag next Tuesday. Marta wanted the whole thing held until the migration lands, and the compromise was to ship dark and turn it on for staff first."

/**
 * The controls read the selection out of context rather than being handed it,
 * so an action can be dropped into the pill without the toolbar knowing what it
 * does with the words.
 */
function HighlightActions({ onAction }: { onAction: (line: string) => void }) {
  const { highlight, clear } = useMessageHighlight()
  const text = highlight?.text ?? ""

  const act = (line: string) => {
    onAction(line)
    clear()
  }

  const quoted = text.length > 32 ? `${text.slice(0, 32)}…` : text

  return (
    <>
      <MessageHighlightAction
        tooltip="Reply"
        onClick={() => act(`Replying to “${quoted}”`)}
      >
        <HugeiconsIcon icon={MessageSquareReplyIcon} />
      </MessageHighlightAction>
      <MessageHighlightAction
        tooltip="Explain"
        onClick={() => act(`Explaining “${quoted}”`)}
      >
        <HugeiconsIcon icon={AiIdeaIcon} />
      </MessageHighlightAction>
      <MessageHighlightAction
        tooltip="Edit"
        onClick={() => act(`Editing “${quoted}”`)}
      >
        <HugeiconsIcon icon={PencilEdit02Icon} />
      </MessageHighlightAction>
      <MessageHighlightSeparator />
      <MessageHighlightMenu>
        <MessageHighlightMenuTrigger tooltip="Save as">
          <HugeiconsIcon icon={Bookmark02Icon} />
        </MessageHighlightMenuTrigger>
        <MessageHighlightMenuContent align="end">
          <MessageHighlightMenuItem onClick={() => act(`Saved as a note`)}>
            <HugeiconsIcon icon={Note01Icon} />
            Note
          </MessageHighlightMenuItem>
          <MessageHighlightMenuItem onClick={() => act(`Saved to memory`)}>
            <HugeiconsIcon icon={Brain02Icon} />
            Memory
          </MessageHighlightMenuItem>
          <MessageHighlightMenuItem onClick={() => act(`Saved as a snippet`)}>
            <HugeiconsIcon icon={Bookmark02Icon} />
            Snippet
          </MessageHighlightMenuItem>
        </MessageHighlightMenuContent>
      </MessageHighlightMenu>
    </>
  )
}

export function MessageHighlightToolbarDemo() {
  const [done, setDone] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!done) return undefined
    const id = setTimeout(() => setDone(null), 2600)
    return () => clearTimeout(id)
  }, [done])

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <MessageHighlight>
        <BubbleGroup>
          <Bubble variant="muted">
            <BubbleContent>{answer}</BubbleContent>
          </Bubble>
        </BubbleGroup>
        <MessageHighlightToolbar>
          <HighlightActions onAction={setDone} />
        </MessageHighlightToolbar>
      </MessageHighlight>
      <p className="min-h-4 ps-1 text-xs text-muted-foreground">
        {done ?? "Select any of the text above."}
      </p>
    </div>
  )
}

/**
 * The region can be the whole thread rather than one message: the toolbar is
 * positioned against whatever was selected inside it, so a quote spanning two
 * turns is still one selection.
 */
export function MessageHighlightToolbarThreadDemo() {
  const [done, setDone] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!done) return undefined
    const id = setTimeout(() => setDone(null), 2600)
    return () => clearTimeout(id)
  }, [done])

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <MessageHighlight>
        <BubbleGroup className="gap-3">
          <Bubble align="end">
            <BubbleContent>What did they decide about the date?</BubbleContent>
          </Bubble>
          <Bubble variant="muted">
            <BubbleContent>{answer}</BubbleContent>
          </Bubble>
        </BubbleGroup>
        <MessageHighlightToolbar>
          <HighlightActions onAction={setDone} />
        </MessageHighlightToolbar>
      </MessageHighlight>
      <p className="min-h-4 ps-1 text-xs text-muted-foreground">
        {done ?? "Select across either message."}
      </p>
    </div>
  )
}
