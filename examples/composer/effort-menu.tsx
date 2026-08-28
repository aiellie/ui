"use client"

import * as React from "react"

import type { Effort } from "@/components/aiellie-ui/composer/effort-menu"
import {
  EffortMenu,
  EffortMenuContent,
  EffortMenuTrigger,
  efforts,
  findEffort,
} from "@/components/aiellie-ui/composer/effort-menu"
import {
  MessageInput,
  MessageInputField,
  MessageInputSubmit,
} from "@/components/aiellie-ui/composer/message-input"
import {
  ModelPicker,
  ModelPickerContent,
  ModelPickerTrigger,
} from "@/components/aiellie-ui/composer/model-picker"
import {
  ToolPicker,
  ToolPickerContent,
  ToolPickerTrigger,
} from "@/components/aiellie-ui/composer/tool-picker"
import { TooltipProvider } from "@/components/ui/tooltip"

/**
 * The setting on its own: six bars that fill as the slider moves, and a slider
 * whose stops are named so the ladder does not have to be guessed at.
 */
export function EffortMenuDemo() {
  const [effort, setEffort] = React.useState("high")

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <EffortMenu value={effort} onValueChange={setEffort}>
        <EffortMenuTrigger />
        <EffortMenuContent />
      </EffortMenu>
      <p className="ps-1 text-xs text-muted-foreground">
        {findEffort(effort)?.name} — rung{" "}
        {efforts.findIndex((rung) => rung.id === effort) + 1} of{" "}
        {efforts.length}.
      </p>
    </div>
  )
}

/**
 * Where it belongs: on the row a composer keeps for the things a message is
 * sent *with*. Three questions asked of the same message — what is answering,
 * what it may reach for, and how hard it should think — and effort is the one
 * whose control says its answer without being opened.
 */
export function EffortMenuComposerDemo() {
  const [effort, setEffort] = React.useState("medium")
  const [tools, setTools] = React.useState<string[]>(["read", "grep"])
  const [model, setModel] = React.useState("claude-opus-5")
  const [sent, setSent] = React.useState<string | null>(null)

  return (
    <TooltipProvider>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <MessageInput
          className="flex-col items-stretch gap-1 rounded-2xl border border-border/60 bg-background p-1.5 dark:bg-popover"
          onSubmit={(message) => setSent(message)}
        >
          <MessageInputField
            placeholder="Ask it something hard…"
            className="h-9 border-transparent bg-transparent px-2 focus-visible:border-transparent"
          />
          <div className="flex items-center gap-1">
            <EffortMenu value={effort} onValueChange={setEffort}>
              <EffortMenuTrigger />
              <EffortMenuContent side="top" />
            </EffortMenu>
            <ToolPicker value={tools} onValueChange={setTools}>
              <ToolPickerTrigger />
              <ToolPickerContent side="top" />
            </ToolPicker>
            <ModelPicker value={model} onValueChange={setModel}>
              <ModelPickerTrigger />
              <ModelPickerContent side="top" />
            </ModelPicker>
            <MessageInputSubmit className="ms-auto size-7" />
          </div>
        </MessageInput>
        <p className="ps-1 text-xs text-muted-foreground">
          {sent
            ? `Sent on ${findEffort(effort)?.name.toLowerCase()} effort.`
            : `Thinking ${findEffort(effort)?.name.toLowerCase()}, with ${tools.length} ${tools.length === 1 ? "tool" : "tools"}.`}
        </p>
      </div>
    </TooltipProvider>
  )
}

/**
 * A ladder of three, to show that the glyph is not a picture of six bars. The
 * bar count is the catalogue's length and the fill is its index, so a shorter
 * ladder is a shorter icon — no class, no variant, nothing to keep in step.
 *
 * The name rides on the trigger here as well, which is what a ladder nobody
 * has seen before wants: three bars out of three says "the top" only once you
 * know how many there are.
 */
const budgets: Effort[] = [
  {
    id: "draft",
    name: "Draft",
    description: "First thing that works. For a shape you are still moving.",
  },
  {
    id: "review",
    name: "Review",
    description: "Checked once through, the way a second pair of eyes would.",
  },
  {
    id: "ship",
    name: "Ship",
    description: "Everything it has, for the version somebody else will read.",
  },
]

export function EffortMenuLadderDemo() {
  const [effort, setEffort] = React.useState("review")

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <EffortMenu efforts={budgets} value={effort} onValueChange={setEffort}>
        <EffortMenuTrigger showLabel />
        <EffortMenuContent />
      </EffortMenu>
      <p className="ps-1 text-xs text-muted-foreground">
        {findEffort(effort, budgets)?.description}
      </p>
    </div>
  )
}
