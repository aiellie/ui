"use client"

import * as React from "react"
import { AiSearch02Icon } from "@hugeicons/core-free-icons"

import { AgentCard, type AgentState } from "@/components/aiellie-ui/agent-card"
import {
  ChatThreadItem,
  ChatTurn,
  type ChatMessage,
  type ChatPart,
} from "@/components/aiellie-ui/chat"
import {
  AddMenu,
  AddMenuContent,
  AddMenuTrigger,
} from "@/components/aiellie-ui/composer/add-menu"
import {
  ApprovalModeMenu,
  ApprovalModeMenuContent,
  ApprovalModeMenuTrigger,
} from "@/components/aiellie-ui/composer/approval-mode-menu"
import {
  MessageInput,
  MessageInputField,
  MessageInputLine,
  messageInputStack,
  MessageInputSubmit,
  MessageInputToolbar,
} from "@/components/aiellie-ui/composer/message-input"
import {
  ModelPicker,
  ModelPickerContent,
  ModelPickerTrigger,
} from "@/components/aiellie-ui/composer/model-picker"
import { TooltipProvider } from "@/components/ui/tooltip"
import { avatarFor } from "@/lib/avatars"

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

/** The frame a run opens on. */
const OPENING: ChatPart[] = [
  { type: "reasoning", thinking: true, steps: thinking },
]

/**
 * The agent as a block: ask it something and watch the day it has.
 *
 * The composer is real — a question goes in at the bottom and a run comes
 * back down the thread — and so are the settings under it: the approval mode
 * is not a decoration, it decides whether the write stops to ask. On
 * `manual` the run parks at "Waiting on you" with approve and deny standing
 * in the call; on `auto` or `full access` the same call approves itself and
 * the chip never leaves "Working". That is the whole grammar of an agent,
 * on one card.
 */
export function AgentCardDemo() {
  const [question, setQuestion] = React.useState(
    "What changed in the rollout this week?"
  )
  const [cycle, setCycle] = React.useState(0)
  const [state, setState] = React.useState<AgentState>("working")
  const [parts, setParts] = React.useState<ChatPart[]>(OPENING)
  const [mode, setMode] = React.useState("manual")
  const [model, setModel] = React.useState("claude-opus-5")
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

  /* Read at the moment the run reaches the write, not at the moment the run
     was scheduled: flipping the mode while it is still searching should
     count, and re-running the whole script on a settings change would not. */
  const modeRef = React.useRef(mode)
  React.useEffect(() => {
    modeRef.current = mode
  }, [mode])

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

  /* The run up to the write, on timers; the write itself on whichever answer
     the approval mode gives. The effect only schedules — the opening frame
     is state the render already has. */
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
        /* Auto and full access do not stop to ask; everything else does. */
        if (modeRef.current === "auto" || modeRef.current === "full-access") {
          setParts([
            ...searched,
            {
              type: "tool",
              name: "write_report",
              summary: "rollout/notes.md",
              status: "awaiting",
              arguments: REPORT_ARGS,
            },
          ])
          approve()
          return
        }

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

  const ask = (next: string) => {
    setQuestion(next)
    setState("working")
    setParts(OPENING)
    setCycle((count) => count + 1)
  }

  const messages: ChatMessage[] = [
    { id: `q-${cycle}`, role: "user", text: question },
    { id: `a-${cycle}`, role: "assistant", parts },
  ]

  return (
    <TooltipProvider>
      <AgentCard
        persona={researcher}
        state={state}
        className="max-w-md"
        footer={
          <MessageInput onSubmit={ask} className={messageInputStack}>
            <MessageInputLine>
              <AddMenu>
                <AddMenuTrigger />
                <AddMenuContent side="top" />
              </AddMenu>
              <MessageInputField placeholder="Ask the Researcher…" />
              <MessageInputSubmit />
            </MessageInputLine>
            <MessageInputToolbar>
              <ApprovalModeMenu value={mode} onValueChange={setMode}>
                <ApprovalModeMenuTrigger />
                <ApprovalModeMenuContent side="top" />
              </ApprovalModeMenu>
              <ModelPicker value={model} onValueChange={setModel}>
                <ModelPickerTrigger className="ms-auto" />
                <ModelPickerContent side="top" />
              </ModelPicker>
            </MessageInputToolbar>
          </MessageInput>
        }
      >
        {messages.map((message) => (
          <ChatThreadItem
            key={message.id}
            scrollAnchor={message.role === "user"}
          >
            <ChatTurn message={message} />
          </ChatThreadItem>
        ))}
      </AgentCard>
    </TooltipProvider>
  )
}
