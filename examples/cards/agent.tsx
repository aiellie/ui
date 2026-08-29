"use client"

import * as React from "react"

import { AgentCard, type AgentState } from "@/components/aiellie-ui/agent-card"
import {
  ChatThreadItem,
  ChatTurn,
  type ChatMessage,
  type ChatPart,
} from "@/components/aiellie-ui/chat"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/aiellie-ui/code/code-block"
import { CodeDiffBody } from "@/components/aiellie-ui/code/code-diff"
import { Button } from "@/components/ui/button"
import { AiSearch02Icon } from "@hugeicons/core-free-icons"
import { avatarFor } from "@/lib/avatars"

/**
 * The Researcher, run: given a question, it thinks, reads, and then — the
 * moment this card exists for — stops and asks before it writes anything.
 * An agent's day is made of exactly these states, and `awaiting` is the one
 * that separates an agent from an autocomplete: the run is not stuck, it is
 * waiting on you, and the card says so from the state chip down to the call.
 */

/* The same persona the composer's mention menu offers — one Researcher,
   one face, wherever it turns up. */
const researcher = {
  name: "Researcher",
  avatar: avatarFor("researcher"),
  icon: AiSearch02Icon,
}

const thinking = [
  "The question is about this week, so the notes since Monday are the set.",
  "Three files mention the rollout; the flag note is the newest.",
]

const REPORT_ARGS = `{
  "path": "rollout/notes.md",
  "length": "short"
}`

/** The frame the run opens on — also what a replay resets to. */
const OPENING: ChatPart[] = [
  { type: "reasoning", thinking: true, steps: thinking },
]

export function AgentCardDemo() {
  const [state, setState] = React.useState<AgentState>("working")
  const [parts, setParts] = React.useState<ChatPart[]>(OPENING)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])
  const [cycle, setCycle] = React.useState(0)

  /* Swap the last part for its settled form and let the close of the answer
     follow it. Stable, because the scripted beats close over it. */
  const settle = React.useCallback(
    (tool: ChatPart, closing: ChatPart[]) =>
      setParts((current) => [...current.slice(0, -1), tool, ...closing]),
    []
  )

  const approve = React.useCallback(() => {
    setState("working")
    settle(
      {
        type: "tool",
        name: "write_report",
        summary: "writing…",
        status: "running",
        arguments: REPORT_ARGS,
      },
      []
    )
    timers.current.push(
      setTimeout(() => {
        setState("done")
        settle(
          {
            type: "tool",
            name: "write_report",
            summary: "84 lines",
            status: "done",
            arguments: REPORT_ARGS,
            result: `rollout/notes.md written`,
          },
          [
            {
              type: "streaming",
              streaming: false,
              segments: [
                "Done — the week in short: the flag landed Tuesday night, staff have it now, and everyone else gets it Thursday. The full report is in rollout/notes.md.",
              ],
            },
          ]
        )
      }, 1600)
    )
  }, [settle])

  const deny = React.useCallback(() => {
    setState("done")
    settle(
      {
        type: "tool",
        name: "write_report",
        summary: "denied",
        status: "error",
        arguments: REPORT_ARGS,
      },
      [
        {
          type: "text",
          text: "Alright — nothing written. The three files are listed above if you want them raw.",
        },
      ]
    )
  }, [settle])

  /* The run up to the question, on timers; everything after it on the
     reader's answer. A script that approves itself would demo the one thing
     this card is not. The effect only schedules — the opening frame is the
     initial state, and a replay resets it from the button's own handler —
     so no render is spent re-saying what is already on screen. */
  React.useEffect(() => {
    const searched: ChatPart[] = [
      { type: "reasoning", duration: 2, steps: thinking },
      {
        type: "tool",
        name: "search_notes",
        summary: "3 files",
        status: "done",
        arguments: `{ "query": "rollout", "since": "monday" }`,
      },
    ]

    const running = timers.current
    running.push(
      setTimeout(() => setParts(searched), 1800),
      setTimeout(() => {
        setState("awaiting")
        setParts([
          ...searched,
          {
            type: "tool",
            name: "write_report",
            summary: "rollout/notes.md",
            status: "awaiting",
            arguments: REPORT_ARGS,
            approval: {
              question: "Write the report into rollout/notes.md?",
              onApprove: approve,
              onDeny: deny,
            },
          },
        ])
      }, 3400)
    )

    return () => {
      running.forEach(clearTimeout)
      running.length = 0
    }
  }, [cycle, approve, deny])

  const messages: ChatMessage[] = [
    { id: "q", role: "user", text: "What changed in the rollout this week?" },
    { id: "a", role: "assistant", parts },
  ]

  const settled = state === "done" || state === "failed"

  return (
    <AgentCard
      persona={{
        name: researcher.name,
        avatar: researcher.avatar,
        icon: researcher.icon,
      }}
      state={state}
      className="max-w-md"
      footer={
        settled ? (
          <Button
            size="sm"
            variant="outline"
            className="self-center"
            onClick={() => {
              setState("working")
              setParts(OPENING)
              setCycle((count) => count + 1)
            }}
          >
            Run it again
          </Button>
        ) : null
      }
    >
      {messages.map((message) => (
        <ChatThreadItem key={message.id} scrollAnchor={message.role === "user"}>
          <ChatTurn message={message} />
        </ChatThreadItem>
      ))}
    </AgentCard>
  )
}

const DIFF = `@@ -410,7 +410,9 @@ export function Attachment({
-  const label = name
+  const stem = splitName(name).stem
+  const label = stem || name
   return (
     <button type="button" aria-label={label}>`

/**
 * The Reviewer, reading a diff — an agent whose answer is not prose but a
 * verdict over code, which is why the coding family renders inside the same
 * thread the chat parts do. A transcript is whatever the work was.
 */
export function AgentReviewerDemo() {
  const verdict: ChatMessage[] = [
    { id: "q", role: "user", text: "Review the attachment label change." },
    {
      id: "a",
      role: "assistant",
      parts: [
        {
          type: "reasoning",
          duration: 1,
          steps: [
            "One hunk, one behaviour change: the label loses its extension.",
          ],
        },
        {
          type: "tool",
          name: "read_diff",
          summary: "1 file",
          status: "done",
        },
      ],
    },
  ]

  return (
    <AgentCard
      persona={{
        name: "Reviewer",
        avatar: avatarFor("reviewer"),
      }}
      state="done"
      className="max-w-md"
    >
      {verdict.map((message) => (
        <ChatThreadItem key={message.id} scrollAnchor={message.role === "user"}>
          <ChatTurn message={message} />
        </ChatThreadItem>
      ))}
      <ChatThreadItem>
        <CodeBlock className="max-w-full">
          <CodeBlockHeader>
            <CodeBlockTitle>attachments.tsx</CodeBlockTitle>
          </CodeBlockHeader>
          <CodeDiffBody diff={DIFF} lineNumbers={false} />
        </CodeBlock>
      </ChatThreadItem>
      <ChatThreadItem>
        <p className="text-sm text-foreground/80">
          Sound. The fallback to the full name covers a file that is all
          extension — worth a demo case before it merges.
        </p>
      </ChatThreadItem>
    </AgentCard>
  )
}
