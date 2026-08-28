"use client"

import * as React from "react"
import {
  AiBrain01Icon,
  AiSearch02Icon,
  Bug01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ChatStatus } from "ai"

import {
  Composer,
  ComposerField,
  ComposerInput,
  ComposerSubmit,
  ComposerToolbar,
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
import { TooltipProvider } from "@/components/ui/tooltip"
import { findModel } from "@/lib/models"

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

/**
 * The field, the names an at sign reaches, and the row underneath saying who
 * is answering — one composer rather than three controls that happen to have
 * been put near each other.
 */
export function ComposerDemo() {
  const [model, setModel] = React.useState("claude-opus-5")
  const [effort, setEffort] = React.useState("medium")
  const [status, setStatus] = React.useState<ChatStatus>("ready")
  const [sent, setSent] = React.useState<string | null>(null)
  const answering = findModel(model)?.name ?? model

  React.useEffect(() => {
    if (status !== "streaming") return undefined
    const id = setTimeout(() => setStatus("ready"), 4000)
    return () => clearTimeout(id)
  }, [status])

  const thinking = findEffort(effort)?.name.toLowerCase() ?? effort
  const note =
    status === "streaming"
      ? `${answering} is answering.`
      : sent
        ? `Sent to ${answering} on ${thinking} effort: ${sent}`
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
            <ComposerField placeholder="Send a message, @ to name someone…" />
            <ComposerSubmit status={status} onStop={() => setStatus("ready")} />
          </ComposerInput>
          <ComposerToolbar>
            <ModelPicker value={model} onValueChange={setModel}>
              <ModelPickerTrigger />
              <ModelPickerContent side="top" />
            </ModelPicker>
            <EffortMenu value={effort} onValueChange={setEffort}>
              <EffortMenuTrigger />
              <EffortMenuContent side="top" />
            </EffortMenu>
          </ComposerToolbar>
        </Composer>
        <p className="min-h-4 ps-1 text-xs text-muted-foreground">{note}</p>
      </div>
    </TooltipProvider>
  )
}
