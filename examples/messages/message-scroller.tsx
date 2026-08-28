"use client"

import * as React from "react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@/components/ui/message-scroller"
import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------------------
 * Shared fixtures. `anchor` marks the row that starts a turn — the message the
 * reply is an answer to — which is what the scroller brings to the top of the
 * viewport rather than the newest row.
 * ------------------------------------------------------------------------- */

type Turn = {
  id: string
  from: string
  text: string
  anchor?: boolean
}

const thread: Turn[] = [
  { id: "t1", from: "me", text: "Morning — did the flag land?", anchor: true },
  { id: "t2", from: "RK", text: "It did. Off by default." },
  { id: "t3", from: "me", text: "Who is on the rollout call?", anchor: true },
  { id: "t4", from: "RK", text: "Rae, Sam, and whoever picks up support." },
  { id: "t5", from: "me", text: "What is left before Tuesday?", anchor: true },
  {
    id: "t6",
    from: "RK",
    text: "The migration note, and someone has to sign off on the copy.",
  },
  {
    id: "t7",
    from: "me",
    text: "I can do the copy pass tonight.",
    anchor: true,
  },
  { id: "t8", from: "RK", text: "Then we are clear. Thanks." },
]

const history: Turn[] = [
  {
    id: "h1",
    from: "RK",
    text: "Parking the adapter work until the flag ships.",
  },
  { id: "h2", from: "me", text: "Agreed. It can wait a week.", anchor: true },
  { id: "h3", from: "RK", text: "I will note it on the board." },
]

function Row({ turn, className }: { turn: Turn; className?: string }) {
  const mine = turn.from === "me"

  return (
    <Message align={mine ? "end" : "start"} className={className}>
      {mine ? null : (
        <MessageAvatar className="size-8 text-xs font-medium">
          {turn.from}
        </MessageAvatar>
      )}
      <MessageContent>
        <Bubble variant={mine ? "default" : "muted"}>
          <BubbleContent>{turn.text}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}

function Rows({ turns }: { turns: Turn[] }) {
  return turns.map((turn) => (
    <MessageScrollerItem
      key={turn.id}
      messageId={turn.id}
      scrollAnchor={turn.anchor}
    >
      <Row turn={turn} />
    </MessageScrollerItem>
  ))
}

/** The frame every demo below sits in, so each one only shows its own idea. */
function Frame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn("flex size-full w-full max-w-sm flex-col gap-3", className)}
    >
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * 01 — Anchoring turns
 * ------------------------------------------------------------------------- */

/**
 * `scrollAnchor` marks the row that begins a turn. A new turn is brought to the
 * top of the viewport so it can be read from its first line, rather than being
 * shoved up by the reply that follows it.
 */
export function MessageScrollerAnchoringDemo() {
  return (
    <MessageScrollerProvider>
      <MessageScroller className="w-full max-w-sm">
        <MessageScrollerViewport>
          <MessageScrollerContent className="gap-4 px-1">
            <Rows turns={thread} />
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

/* ---------------------------------------------------------------------------
 * 02 — Group chat
 * ------------------------------------------------------------------------- */

const groupThread: Turn[] = [
  { id: "g1", from: "RK", text: "Marcus joined the chat.", anchor: true },
  { id: "g2", from: "MB", text: "Hello — catching up on the flag thread." },
  { id: "g3", from: "RK", text: "It is in, off by default." },
  {
    id: "g4",
    from: "MB",
    text: "Can someone summarise where the copy review landed?",
    anchor: true,
  },
  { id: "g5", from: "me", text: "I am doing the pass tonight." },
  { id: "g6", from: "RK", text: "And I will sign it off in the morning." },
]

/**
 * In a group chat the turn boundary is not simply "the message I sent" — it is
 * whichever row opens an exchange, including a join notice. Anchor those and
 * the transcript breaks where the conversation actually breaks.
 */
export function MessageScrollerGroupChatDemo() {
  return (
    <MessageScrollerProvider>
      <MessageScroller className="w-full max-w-sm">
        <MessageScrollerViewport>
          <MessageScrollerContent className="gap-4 px-1">
            <Rows turns={groupThread} />
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

/* ---------------------------------------------------------------------------
 * 03 — Keeping context visible
 * ------------------------------------------------------------------------- */

/**
 * `scrollPreviousItemPeek` leaves a slice of the previous row above the anchor,
 * so a new turn still reads as part of the same thread instead of arriving as
 * the top of a blank screen.
 */
export function MessageScrollerContextDemo() {
  return (
    <MessageScrollerProvider scrollPreviousItemPeek={48}>
      <MessageScroller className="w-full max-w-sm">
        <MessageScrollerViewport>
          <MessageScrollerContent className="gap-4 px-1">
            <Rows turns={thread} />
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

/* ---------------------------------------------------------------------------
 * 04 — Following the live edge
 * ------------------------------------------------------------------------- */

const reply =
  "The scroller follows this reply while you are at the live edge. Scroll up and it lets go, and keeps streaming out of sight until you come back."

/**
 * `autoScroll` follows streamed output only while the reader is at the live
 * edge. Send, then scroll up mid-stream: the text keeps arriving and the
 * viewport stays where you left it.
 */
export function MessageScrollerLiveEdgeDemo() {
  const [turns, setTurns] = React.useState(thread.slice(0, 4))
  const [streaming, setStreaming] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current)
    },
    []
  )

  const send = () => {
    if (streaming) return
    setStreaming(true)

    const id = `s${Date.now()}`
    setTurns((current) => [
      ...current,
      {
        id: `${id}-q`,
        from: "me",
        text: "Say that again, slowly.",
        anchor: true,
      },
      { id, from: "RK", text: "" },
    ])

    const words = reply.split(" ")
    let index = 0
    timer.current = setInterval(() => {
      index += 1
      setTurns((current) =>
        current.map((turn) =>
          turn.id === id
            ? { ...turn, text: words.slice(0, index).join(" ") }
            : turn
        )
      )
      if (index >= words.length && timer.current) {
        clearInterval(timer.current)
        setStreaming(false)
      }
    }, 90)
  }

  return (
    <Frame>
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-4 px-1">
              <Rows turns={turns} />
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <Button
        size="sm"
        onClick={send}
        disabled={streaming}
        className="self-center"
      >
        {streaming ? "Streaming…" : "Send"}
      </Button>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------
 * 05 — Opening saved threads
 * ------------------------------------------------------------------------- */

/**
 * `defaultScrollPosition="last-anchor"` reopens a saved thread at the last turn
 * that started an exchange rather than at the absolute bottom, so the reader
 * arrives with the question that produced the final answer still on screen.
 */
export function MessageScrollerSavedThreadDemo() {
  return (
    <MessageScrollerProvider defaultScrollPosition="last-anchor">
      <MessageScroller className="w-full max-w-sm">
        <MessageScrollerViewport>
          <MessageScrollerContent className="gap-4 px-1">
            <Rows turns={thread} />
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

/* ---------------------------------------------------------------------------
 * 06 — Loading earlier messages
 * ------------------------------------------------------------------------- */

/**
 * `preserveScrollOnPrepend` holds the reader's place when older rows are added
 * above. Load the history and the row you were reading stays exactly where it
 * was, rather than being pushed down the viewport.
 */
export function MessageScrollerHistoryDemo() {
  const [turns, setTurns] = React.useState(thread)
  const loaded = turns.length > thread.length

  return (
    <Frame>
      <MessageScrollerProvider>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport preserveScrollOnPrepend>
            <MessageScrollerContent className="gap-4 px-1">
              <Rows turns={turns} />
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <Button
        size="sm"
        variant="outline"
        disabled={loaded}
        onClick={() => setTurns((current) => [...history, ...current])}
        className="self-center"
      >
        {loaded ? "No earlier messages" : "Load earlier messages"}
      </Button>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------
 * 07 — Animating new messages
 * ------------------------------------------------------------------------- */

/**
 * An item can be animated as it arrives so long as `messageId` and
 * `scrollAnchor` stay on it. Transform and opacity only — animating height
 * would fight the scroller for the reader's position.
 */
export function MessageScrollerAnimatedDemo() {
  const [turns, setTurns] = React.useState(thread.slice(0, 3))

  const append = () => {
    const next = thread[turns.length % thread.length]
    setTurns((current) => [
      ...current,
      { ...next, id: `a${current.length}-${next.id}` },
    ])
  }

  return (
    <Frame>
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-4 px-1">
              {turns.map((turn) => (
                <MessageScrollerItem
                  key={turn.id}
                  messageId={turn.id}
                  scrollAnchor={turn.anchor}
                  className="animate-in duration-300 fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
                >
                  <Row turn={turn} />
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <Button size="sm" onClick={append} className="self-center">
        Add a message
      </Button>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------
 * 08 — Jumping to messages
 * ------------------------------------------------------------------------- */

function JumpControls() {
  const { scrollToStart, scrollToMessage, scrollToEnd } = useMessageScroller()

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button size="xs" variant="outline" onClick={() => scrollToStart()}>
        Oldest
      </Button>
      <Button
        size="xs"
        variant="outline"
        onClick={() => scrollToMessage("t5", { align: "start" })}
      >
        Tuesday
      </Button>
      <Button size="xs" variant="outline" onClick={() => scrollToEnd()}>
        Newest
      </Button>
    </div>
  )
}

/**
 * `useMessageScroller` drives the transcript from outside the list — a search
 * result, a permalink, an outline. The hook reads the provider's context, so
 * the control has to live inside the provider, not beside it.
 */
export function MessageScrollerJumpDemo() {
  return (
    <MessageScrollerProvider>
      <Frame>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-4 px-1">
              <Rows turns={thread} />
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
        <JumpControls />
      </Frame>
    </MessageScrollerProvider>
  )
}

/* ---------------------------------------------------------------------------
 * 09 — Tracking the reader's position
 * ------------------------------------------------------------------------- */

function TurnOutline() {
  const { currentAnchorId, visibleMessageIds } = useMessageScrollerVisibility()
  const { scrollToMessage } = useMessageScroller()
  const anchors = thread.filter((turn) => turn.anchor)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-center gap-1">
        {anchors.map((turn) => (
          <button
            key={turn.id}
            type="button"
            onClick={() => scrollToMessage(turn.id, { align: "start" })}
            data-current={turn.id === currentAnchorId}
            className="h-1.5 w-6 rounded-full bg-border transition-colors data-[current=true]:bg-foreground/60"
          >
            <span className="sr-only">{turn.text}</span>
          </button>
        ))}
      </div>
      <p className="text-center font-mono text-[11px] text-foreground/40 tabular-nums">
        {visibleMessageIds.length} of {thread.length} in view
      </p>
    </div>
  )
}

/**
 * `useMessageScrollerVisibility` reports the anchored turn and every row on
 * screen — enough to drive an outline, an unread marker, or a jump menu that
 * keeps up with the reader.
 */
export function MessageScrollerPositionDemo() {
  return (
    <MessageScrollerProvider>
      <Frame>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-4 px-1">
              <Rows turns={thread} />
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
        <TurnOutline />
      </Frame>
    </MessageScrollerProvider>
  )
}

/* ---------------------------------------------------------------------------
 * 10 — Reading scroll state
 * ------------------------------------------------------------------------- */

function ScrollState() {
  const { start, end } = useMessageScrollerScrollable()
  const { scrollToEnd } = useMessageScroller()

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="font-mono text-[11px] text-foreground/40">
        {start ? "↑ more above" : "at the start"}
      </span>
      <Button
        size="xs"
        variant="outline"
        disabled={!end}
        onClick={() => scrollToEnd()}
      >
        {end ? "Jump to latest" : "At the latest"}
      </Button>
    </div>
  )
}

/**
 * `useMessageScrollerScrollable` reports which edges are still reachable, which
 * is what a "jump to latest" control needs in order to disable itself once
 * there is nothing left to jump to.
 */
export function MessageScrollerScrollStateDemo() {
  return (
    <MessageScrollerProvider>
      <Frame>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-4 px-1">
              <Rows turns={thread} />
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
        <ScrollState />
      </Frame>
    </MessageScrollerProvider>
  )
}
