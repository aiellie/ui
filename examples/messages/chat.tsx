"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import {
  BubbleChatTemporaryIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ChatStatus } from "ai"

import {
  Chat,
  ChatComposer,
  ChatThread,
  ChatThreadItem,
  ChatTurn,
  type ChatFile,
  type ChatMessage,
  type ChatPart,
} from "@/components/aiellie-ui/chat"
import {
  ChatCardActions,
  ChatCardDescription,
  ChatCardFooter,
  ChatCardHeader,
  ChatCardTitle,
} from "@/components/aiellie-ui/chat-card"
import { Citation, type Source } from "@/components/aiellie-ui/citations"
import { type AddAction } from "@/components/aiellie-ui/composer/add-menu"
import {
  ApprovalModeMenu,
  ApprovalModeMenuContent,
  ApprovalModeMenuTrigger,
} from "@/components/aiellie-ui/composer/approval-mode-menu"
import {
  EffortMenu,
  EffortMenuContent,
  EffortMenuTrigger,
} from "@/components/aiellie-ui/composer/effort-menu"
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/components/aiellie-ui/composer/empty-state"
import {
  Mentions,
  MentionsGroupLabel,
  MentionsItem,
  useMentions,
  type MentionItem,
} from "@/components/aiellie-ui/composer/mentions"
import { MessageInputToolbarGroup } from "@/components/aiellie-ui/composer/message-input"
import {
  ModelPicker,
  ModelPickerContent,
  ModelPickerTrigger,
} from "@/components/aiellie-ui/composer/model-picker"
import {
  SlashMenu,
  SlashMenuItem,
  useSlashCommands,
  type SlashCommand,
} from "@/components/aiellie-ui/composer/slash-menu"
import {
  ToolPicker,
  ToolPickerActive,
  ToolPickerContent,
  ToolPickerTrigger,
} from "@/components/aiellie-ui/composer/tool-picker"
import { ResponseCodeBlock } from "@/components/aiellie-ui/response"
import { Suggestions } from "@/components/aiellie-ui/suggestions"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { TypingIndicator } from "@/components/aiellie-ui/typing-indicator"
import { MessageAvatar } from "@/components/ui/message"
import { TooltipProvider } from "@/components/ui/tooltip"

/* ---------------------------------------------------------------------------
 * The scene. One rollout question, answered the way an agent answers: a spell
 * of thinking, two tools, a paragraph, and what the paragraph was taken from.
 * ------------------------------------------------------------------------- */

const sources: Source[] = [
  {
    id: "notes",
    title: "Rollout notes — week of the 12th",
    url: "https://example.com/notes/rollout",
    snippet:
      "Ship dark on Tuesday, staff first, everyone once the migration lands.",
  },
  {
    id: "thread",
    title: "#launch — Marta on holding the date",
    url: "https://example.com/threads/launch",
    origin: "Slack",
    snippet: "I'd rather hold it than turn it on over a half-finished index.",
  },
  {
    id: "flags",
    title: "flags.rollout in production",
    url: "https://example.com/flags/rollout",
    origin: "Dashboard",
  },
]

const SEARCH_ARGS = `{
  "pattern": "rollout",
  "path": "config/flags",
  "limit": 20
}`

const SEARCH_RESULT = `config/flags/rollout.ts:12
config/flags/rollout.ts:31
config/flags/index.ts:8`

const READ_RESULT = `export const rollout = {
  enabled: true,
  audience: "staff",
  since: "2026-08-11T18:04:00Z",
}`

const FLAG_CHECK = `export function canSeeRollout(user: User) {
  if (!flags.rollout.enabled) return false
  if (flags.rollout.audience === "everyone") return true
  return user.isStaff
}`

const thinking = [
  "The question is about the rollout date, so the flag state is what matters.",
  "rollout.tuesday is on for staff and off for everyone else.",
  "The migration is the blocker on turning it on more widely.",
  "So: shipped, but only staff can see it until Thursday.",
]

/**
 * Fixed moments rather than `Date.now()`: a demo re-rendered on the server and
 * again in the browser has to stamp both the same, and `format="time"` on a
 * settled date is the one reading that cannot drift between them.
 */
const at = (time: string) => `2026-08-28T${time}:00`

const answer = (
  <p>
    It shipped behind a flag on Tuesday and is on for staff only
    <Citation source={sources[0]} index={1} />. Marta asked for it to be held
    until the migration lands
    <Citation source={sources[1]} index={2} />, which is why{" "}
    <code>flags.rollout</code> still reads <code>staff</code> in production
    <Citation source={sources[2]} index={3} />.
  </p>
)

const transcript: ChatMessage[] = [
  {
    id: "q1",
    role: "user",
    text: "Did the rollout ship? The brief is attached if it helps.",
    files: [{ id: "brief", name: "rollout-brief.pdf", size: 2_413_000 }],
    status: "read",
    at: at("09:12"),
  },
  {
    id: "a1",
    role: "assistant",
    at: at("09:12"),
    copyText:
      "It shipped behind a flag on Tuesday and is on for staff only. Marta asked for it to be held until the migration lands, which is why flags.rollout still reads staff in production.",
    parts: [
      { type: "reasoning", duration: 6, steps: thinking },
      {
        type: "tool",
        name: "search_files",
        summary: "3 matches",
        status: "done",
        arguments: SEARCH_ARGS,
        result: SEARCH_RESULT,
      },
      {
        type: "tool",
        name: "read_file",
        summary: "config/flags/rollout.ts",
        status: "done",
        result: READ_RESULT,
      },
      { type: "text", text: answer },
      { type: "sources", sources },
    ],
  },
  {
    id: "q2",
    role: "user",
    text: "Show me where the check happens.",
    status: "delivered",
    at: at("09:14"),
  },
  {
    id: "a2",
    role: "assistant",
    at: at("09:14"),
    copyText: FLAG_CHECK,
    parts: [
      {
        type: "text",
        text: (
          <>
            <p>
              One place, and it reads the flag rather than the audience list:
            </p>
            <ResponseCodeBlock
              code={FLAG_CHECK}
              language="ts"
              filename="lib/rollout.ts"
            />
            <p>
              Turning it on for everyone is a change to <code>audience</code>{" "}
              and nothing else.
            </p>
          </>
        ),
      },
    ],
  },
]

/* ---------------------------------------------------------------------------
 * What the composer offers
 * ------------------------------------------------------------------------- */

const attachable: AddAction[] = [
  {
    id: "files",
    group: "Attach",
    label: "Recent files",
    items: [
      { id: "brief", label: "rollout-brief.pdf" },
      { id: "migration", label: "migration-plan.md" },
      { id: "metrics", label: "launch-metrics.xlsx" },
    ],
  },
  { id: "link", group: "Context", label: "Paste a link", shortcut: "⌘L" },
]

const files: Record<string, ChatFile> = {
  brief: { id: "brief", name: "rollout-brief.pdf", size: 2_413_000 },
  migration: { id: "migration", name: "migration-plan.md", size: 8_400 },
  metrics: { id: "metrics", name: "launch-metrics.xlsx", size: 184_000 },
}

const people: MentionItem[] = [
  {
    id: "marta",
    name: "Marta Oyelaran",
    handle: "marta",
    description: "Engineering",
    group: "People",
    icon: <span className="text-[10px] font-medium">MO</span>,
  },
  {
    id: "ines",
    name: "Inés Bonilla",
    handle: "ines",
    description: "Design",
    group: "People",
    icon: <span className="text-[10px] font-medium">IB</span>,
  },
  {
    id: "reviewer",
    name: "Reviewer",
    handle: "reviewer",
    description: "Reads a diff before anyone else has to",
    group: "Agents",
    icon: <span className="text-[10px] font-medium">RV</span>,
  },
]

const commands: SlashCommand[] = [
  { id: "model", name: "model", description: "Answer with a different model" },
  { id: "clear", name: "clear", description: "Empty the thread" },
  { id: "diff", name: "diff", description: "Show what has changed" },
]

/** The strip across the top: whose thread it is, and the way to start another. */
function Header({ subtitle }: { subtitle: string }) {
  return (
    <ChatCardHeader>
      <MessageAvatar className="size-7 text-[11px] font-medium text-muted-foreground">
        E
      </MessageAvatar>
      <div className="min-w-0">
        <ChatCardTitle>Ellie</ChatCardTitle>
        <ChatCardDescription>{subtitle}</ChatCardDescription>
      </div>
      <ChatCardActions>
        <TooltipIconButton tooltip="New chat">
          <HugeiconsIcon icon={PlusSignIcon} />
        </TooltipIconButton>
      </ChatCardActions>
    </ChatCardHeader>
  )
}

/**
 * Everything the composer is being sent with. Four menus and the tools that are
 * on, on the row under the field — which is the whole reason that row exists.
 *
 * Read from both ends: what the message may *do* on the left, who is
 * *answering* grouped away at the right, as in the composer's own demo.
 */
function Settings({
  model,
  onModel,
  tools,
  onTools,
  effort,
  onEffort,
  mode,
  onMode,
}: {
  model: string
  onModel: (id: string) => void
  tools: string[]
  onTools: (ids: string[]) => void
  effort: string
  onEffort: (id: string) => void
  mode: string
  onMode: (id: string) => void
}) {
  return (
    <>
      <ToolPicker value={tools} onValueChange={onTools}>
        <ToolPickerTrigger />
        <ToolPickerContent side="top" />
        <ToolPickerActive />
      </ToolPicker>
      <ApprovalModeMenu value={mode} onValueChange={onMode}>
        <ApprovalModeMenuTrigger />
        <ApprovalModeMenuContent side="top" />
      </ApprovalModeMenu>

      <MessageInputToolbarGroup end>
        <ModelPicker value={model} onValueChange={onModel}>
          <ModelPickerTrigger />
          <ModelPickerContent side="top" />
        </ModelPicker>
        <EffortMenu value={effort} onValueChange={onEffort}>
          <EffortMenuTrigger />
          <EffortMenuContent side="top" />
        </EffortMenu>
      </MessageInputToolbarGroup>
    </>
  )
}

/** The four decisions a message is sent with, held in one place. */
function useSettings() {
  const [model, setModel] = React.useState("claude-opus-5")
  const [tools, setTools] = React.useState<string[]>(["read", "grep", "edit"])
  const [effort, setEffort] = React.useState("medium")
  const [mode, setMode] = React.useState("auto")

  return {
    model,
    onModel: setModel,
    tools,
    onTools: setTools,
    effort,
    onEffort: setEffort,
    mode,
    onMode: setMode,
  }
}

/* ---------------------------------------------------------------------------
 * The demos
 * ------------------------------------------------------------------------- */

/**
 * The whole thing: a thread that has already happened, and a composer able to
 * carry the next message. Ask it something and it thinks, calls a tool and
 * answers — scripted, since a demo has no model behind it, but arriving in the
 * order and at the pace a real one would.
 */
export function ChatDemo() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(transcript)
  const [carrying, setCarrying] = React.useState<ChatFile[]>([])
  const [value, setValue] = React.useState("")
  const [status, setStatus] = React.useState<ChatStatus>("ready")
  const settings = useSettings()

  const mentions = useMentions({
    value,
    onValueChange: setValue,
    items: people,
  })
  const slash = useSlashCommands({
    value,
    onValueChange: setValue,
    commands,
  })

  // Counted rather than stamped: a clock read during a render is a value that
  // changes on its own, and the ids only have to tell the new turns apart.
  const ids = React.useRef(0)

  // The scripted answer, in the three beats it arrives in: thinking, then the
  // call, then the words. Cleared on unmount so a card scrolled away mid-run
  // does not keep writing into a thread nobody is looking at.
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])
  React.useEffect(() => {
    const running = timers.current
    return () => running.forEach(clearTimeout)
  }, [])

  const answerTo = (question: string) => {
    const id = `a-${(ids.current += 1)}`
    setStatus("streaming")

    const patch = (parts: ChatPart[]) =>
      setMessages((list) =>
        list.map((message) =>
          message.id === id ? { ...message, parts } : message
        )
      )

    setMessages((list) => [
      ...list,
      {
        id,
        role: "assistant",
        parts: [
          { type: "reasoning", thinking: true, steps: thinking.slice(0, 2) },
        ],
      },
    ])

    // The answer's settled shape, written once: the third beat shows it still
    // arriving, and the last beat shows the same parts with the caret gone —
    // a part left `streaming: true` after the run keeps its pulse forever.
    const answered: ChatPart[] = [
      { type: "reasoning", duration: 3, steps: thinking.slice(0, 2) },
      {
        type: "tool",
        name: "search_files",
        summary: "3 matches",
        status: "done",
        arguments: SEARCH_ARGS,
        result: SEARCH_RESULT,
      },
      {
        type: "streaming",
        streaming: true,
        segments: [
          `Nothing has changed since Tuesday: ${question.replace(/[?.]+$/, "")} still comes down to the same flag, and it is staff-only until the migration lands.`,
        ],
      },
    ]

    timers.current.push(
      setTimeout(
        () =>
          patch([
            { type: "reasoning", duration: 3, steps: thinking.slice(0, 2) },
            {
              type: "tool",
              name: "search_files",
              summary: "searching",
              status: "running",
            },
          ]),
        1600
      ),
      setTimeout(() => patch(answered), 3200),
      setTimeout(() => {
        patch(
          answered.map((part) =>
            part.type === "streaming" ? { ...part, streaming: false } : part
          )
        )
        setStatus("ready")
      }, 6000)
    )
  }

  const send = (message: string) => {
    setMessages((list) => [
      ...list,
      {
        id: `q-${(ids.current += 1)}`,
        role: "user",
        text: message,
        files: carrying.length ? carrying : undefined,
        status: "sent",
      },
    ])
    setCarrying([])
    answerTo(message)
  }

  return (
    <TooltipProvider>
      <Chat className="max-w-2xl">
        <Header subtitle="Rollout thread" />

        <ChatThread>
          {messages.map((message) => (
            <ChatThreadItem
              key={message.id}
              scrollAnchor={message.role === "user"}
            >
              <ChatTurn
                message={message}
                onRetry={() => answerTo(message.text ?? "that")}
              />
            </ChatThreadItem>
          ))}
          {status === "streaming" ? (
            <TypingIndicator variant="label" label="Ellie is working" />
          ) : null}
        </ChatThread>

        <ChatCardFooter>
          <ChatComposer
            value={value}
            onValueChange={setValue}
            onSubmit={send}
            placeholder="Ask about the rollout, @ someone, or / for a command…"
            files={carrying}
            onRemoveFile={(file) =>
              setCarrying((list) => list.filter((item) => item.id !== file.id))
            }
            addActions={attachable}
            onAdd={(action) => {
              const file = files[action.id]
              if (!file) return
              setCarrying((list) =>
                list.some((item) => item.id === file.id)
                  ? list
                  : [...list, file]
              )
            }}
            status={status}
            onStop={() => setStatus("ready")}
            fieldProps={mergeProps<"input">(
              mentions.fieldProps,
              slash.fieldProps
            )}
          >
            <Settings {...settings} />
          </ChatComposer>

          <Mentions controller={mentions} side="top">
            {mentions.matches.map((item, index) => (
              <React.Fragment key={item.id}>
                {item.group &&
                item.group !== mentions.matches[index - 1]?.group ? (
                  <MentionsGroupLabel>{item.group}</MentionsGroupLabel>
                ) : null}
                <MentionsItem item={item} controller={mentions} />
              </React.Fragment>
            ))}
          </Mentions>

          <SlashMenu controller={slash} side="top">
            {slash.matches.map((command) => (
              <SlashMenuItem
                key={command.id}
                command={command}
                controller={slash}
              />
            ))}
          </SlashMenu>
        </ChatCardFooter>
      </Chat>
    </TooltipProvider>
  )
}

/**
 * The same chat with nothing in it: the greeting where the thread will be, and
 * the prompts on offer above the composer rather than inside the greeting —
 * picking one writes it into the field, which is where a message goes.
 */
const prompts = [
  "What shipped this week?",
  "Who is on the rollout call?",
  "Draft the note to support",
]

export function ChatOpeningDemo() {
  const [value, setValue] = React.useState("")
  const [sent, setSent] = React.useState<string | null>(null)
  const settings = useSettings()

  return (
    <TooltipProvider>
      <Chat className="max-w-2xl">
        <Header subtitle="Nothing asked yet" />

        <ChatThread>
          {sent ? (
            <ChatThreadItem scrollAnchor>
              <ChatTurn
                message={{ id: "q", role: "user", text: sent, status: "sent" }}
              />
            </ChatThreadItem>
          ) : (
            <EmptyState className="min-h-full">
              <EmptyStateMedia>
                <HugeiconsIcon icon={BubbleChatTemporaryIcon} />
              </EmptyStateMedia>
              <EmptyStateTitle>Where would you like to start?</EmptyStateTitle>
              <EmptyStateDescription>
                Ask about the rollout, the thread, or anything else in the
                project.
              </EmptyStateDescription>
            </EmptyState>
          )}
        </ChatThread>

        <ChatCardFooter>
          {sent ? null : (
            <Suggestions
              suggestions={prompts}
              onSuggestion={setValue}
              selectedSuggestion={prompts.includes(value) ? value : null}
            />
          )}
          <ChatComposer
            value={value}
            onValueChange={setValue}
            onSubmit={setSent}
            placeholder="Ask anything…"
            addActions={attachable}
          >
            <Settings {...settings} />
          </ChatComposer>
        </ChatCardFooter>
      </Chat>
    </TooltipProvider>
  )
}
