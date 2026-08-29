"use client"

import * as React from "react"
import {
  AiBrain01Icon,
  AiSearch02Icon,
  Bug01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ChatStatus } from "ai"

import {
  AddMenu,
  AddMenuContent,
  AddMenuTrigger,
  type AddAction,
} from "@/components/aiellie-ui/composer/add-menu"
import {
  ApprovalModeMenu,
  ApprovalModeMenuContent,
  ApprovalModeMenuTrigger,
  findApprovalMode,
} from "@/components/aiellie-ui/composer/approval-mode-menu"
import {
  Composer,
  ComposerField,
  ComposerInput,
  ComposerLine,
  ComposerSubmit,
  ComposerToolbar,
  ComposerToolbarGroup,
} from "@/components/aiellie-ui/composer/composer"
import {
  EffortMenu,
  EffortMenuContent,
  EffortMenuTrigger,
  findEffort,
} from "@/components/aiellie-ui/composer/effort-menu"
import type { MentionItem } from "@/components/aiellie-ui/composer/mentions"
import {
  ModelPicker,
  ModelPickerContent,
  ModelPickerTrigger,
} from "@/components/aiellie-ui/composer/model-picker"
import { Attachment, Attachments } from "@/components/aiellie-ui/attachments"
import { TooltipProvider } from "@/components/ui/tooltip"
import { findModel } from "@/lib/models"
import { tools as toolCatalogue } from "@/lib/tools"

/** Kept short and kept here: a composer demo should not need a directory. */
const mentions: MentionItem[] = [
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
    id: "kenji",
    name: "Kenji Watanabe",
    handle: "kenji",
    description: "Engineering",
    group: "People",
    icon: <span className="text-[10px] font-medium">KW</span>,
  },
  {
    id: "reviewer",
    name: "Reviewer",
    handle: "reviewer",
    description: "Reads a diff before anyone else has to",
    group: "Agents",
    icon: <HugeiconsIcon icon={Bug01Icon} className="size-3.5" />,
  },
  {
    id: "researcher",
    name: "Researcher",
    handle: "researcher",
    description: "Comes back with citations",
    group: "Agents",
    icon: <HugeiconsIcon icon={AiSearch02Icon} className="size-3.5" />,
  },
  {
    id: "planner",
    name: "Planner",
    handle: "planner",
    description: "Breaks the ask into an order",
    group: "Agents",
    icon: <HugeiconsIcon icon={AiBrain01Icon} className="size-3.5" />,
  },
]

interface CarriedFile {
  id: string
  name: string
  size: number
}

/** What the plus can find in a demo that has no filesystem behind it. */
const carriable: CarriedFile[] = [
  { id: "roadmap", name: "Roadmap.pdf", size: 2_413_000 },
  { id: "budget", name: "Budget.xlsx", size: 184_000 },
  { id: "dashboard", name: "Dashboard.png", size: 840_000 },
]

const carriableById = new Map(carriable.map((file) => [file.id, file] as const))

/**
 * The plus's catalogue, cut down to what this demo can actually produce. The
 * shape is the default one's — a heading, a row that opens another menu, a
 * file at the bottom of it — with the connectors left out, since a demo that
 * cannot reach Drive should not offer it.
 */
const addActions: AddAction[] = [
  {
    id: "files",
    group: "Attach",
    label: "Recent files",
    items: carriable.map((file) => ({ id: file.id, label: file.name })),
  },
  { id: "link", group: "Attach", label: "Paste a link", shortcut: "⌘L" },
]

/**
 * The tools, folded into the plus rather than standing on the toolbar.
 * Which tools are on is a setting, not a fifth control: the row under the
 * field stays for what changes per message, and the plus — the door to
 * everything a message can be given — is where a set of capabilities
 * belongs. Checkbox rows keep the menu open, so three tools cost one visit.
 */
function toolsEntry(active: string[]): AddAction {
  return {
    id: "tools",
    group: "Tools",
    label: active.length ? `Tools — ${active.length} on` : "Tools",
    icon: Wrench01Icon,
    items: toolCatalogue.map((tool) => ({
      id: `tool-${tool.id}`,
      label: tool.name,
      description: tool.description,
      icon: tool.icon,
      checked: active.includes(tool.id),
    })),
  }
}

/**
 * The whole of it, in the order the parts belong in: the files it carries
 * above the line, the plus and the send either side of the field on it, and
 * everything the message is being sent with on the row underneath.
 *
 * That row is read from both ends. What the message may *do* is on the left —
 * what it may reach for, and how much of it goes unwatched — and who is
 * *answering* is grouped away at the right: the model, and how hard it is being
 * asked to think, which is a setting on that model rather than a fifth thing in
 * a line of four. Those two go together or neither is worth grouping.
 *
 * Nothing here arranges any of that. The three courses and the run at the end
 * are `composer`'s own parts; this file only says which controls stand where.
 */
export function ComposerDemo() {
  const [model, setModel] = React.useState("claude-opus-5")
  const [effort, setEffort] = React.useState("medium")
  const [tools, setTools] = React.useState<string[]>(["read", "grep"])
  const [mode, setMode] = React.useState("auto")
  const [carrying, setCarrying] = React.useState<CarriedFile[]>([])
  const [status, setStatus] = React.useState<ChatStatus>("ready")
  const [sent, setSent] = React.useState<string | null>(null)
  const answering = findModel(model)?.name ?? model

  React.useEffect(() => {
    if (status !== "streaming") return undefined
    const id = setTimeout(() => setStatus("ready"), 4000)
    return () => clearTimeout(id)
  }, [status])

  const carry = (action: AddAction) => {
    if (action.id.startsWith("tool-")) {
      const id = action.id.slice("tool-".length)
      setTools((list) =>
        list.includes(id) ? list.filter((tool) => tool !== id) : [...list, id]
      )
      return
    }
    const file = carriableById.get(action.id)
    // The link row opens something a demo has not got.
    if (!file) return
    setCarrying((list) =>
      list.some((item) => item.id === file.id) ? list : [...list, file]
    )
  }

  const thinking = findEffort(effort)?.name.toLowerCase() ?? effort
  const note =
    status === "streaming"
      ? `${answering} is answering.`
      : sent
        ? `Sent to ${answering} on ${thinking} effort, under ${findApprovalMode(mode)?.name.toLowerCase()}${carrying.length ? `, carrying ${carrying.length} ${carrying.length === 1 ? "file" : "files"}` : ""}.`
        : `Writing to ${answering}, thinking ${thinking}. Type @ for people and agents.`

  return (
    <TooltipProvider>
      <div className="flex w-full max-w-md flex-col gap-2">
        <Composer
          mentions={mentions}
          onSubmit={(message) => {
            setSent(message)
            setStatus("streaming")
          }}
        >
          <ComposerInput>
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

            <ComposerLine>
              <AddMenu
                actions={[...addActions, toolsEntry(tools)]}
                onSelect={carry}
              >
                <AddMenuTrigger />
                <AddMenuContent side="top" />
              </AddMenu>
              <ComposerField placeholder="Send a message, @ to name someone…" />
              <ComposerSubmit
                status={status}
                onStop={() => setStatus("ready")}
              />
            </ComposerLine>

            <ComposerToolbar>
              <ApprovalModeMenu value={mode} onValueChange={setMode}>
                <ApprovalModeMenuTrigger />
                <ApprovalModeMenuContent side="top" />
              </ApprovalModeMenu>

              <ComposerToolbarGroup end>
                <ModelPicker value={model} onValueChange={setModel}>
                  <ModelPickerTrigger />
                  <ModelPickerContent side="top" />
                </ModelPicker>
                <EffortMenu value={effort} onValueChange={setEffort}>
                  <EffortMenuTrigger />
                  <EffortMenuContent side="top" />
                </EffortMenu>
              </ComposerToolbarGroup>
            </ComposerToolbar>
          </ComposerInput>
        </Composer>
        {/* The state the controls hold, said back in a sentence — the point of
            the demo is that every menu below the line is feeding one message. */}
        <p className="min-h-4 ps-1 text-xs text-muted-foreground">{note}</p>
      </div>
    </TooltipProvider>
  )
}

/**
 * The line on its own, with nothing under it: a plus, a field and a send. Worth
 * showing, because the shape is not a thing you grow into — the line here is
 * the line up there, and a composer that starts this bare has somewhere to put
 * the first picker without moving anything the reader had already found.
 */
export function ComposerBareDemo() {
  const [sent, setSent] = React.useState<string | null>(null)

  return (
    <TooltipProvider>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Composer onSubmit={(message) => setSent(message)}>
          <ComposerInput>
            <ComposerLine>
              <AddMenu>
                <AddMenuTrigger />
                <AddMenuContent side="top" />
              </AddMenu>
              <ComposerField placeholder="Send a message…" />
              <ComposerSubmit />
            </ComposerLine>
          </ComposerInput>
        </Composer>
        <p className="min-h-4 ps-1 text-xs text-muted-foreground">
          {sent ? `Sent: ${sent}` : "The line, with nothing standing under it."}
        </p>
      </div>
    </TooltipProvider>
  )
}
