"use client"

import * as React from "react"

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
  ToolPickerActive,
  ToolPickerContent,
  ToolPickerTrigger,
} from "@/components/aiellie-ui/composer/tool-picker"
import { TooltipProvider } from "@/components/ui/tooltip"
import { tools } from "@/lib/tools"

/**
 * The choice on its own: a wrench that opens a list saying what each tool does
 * before asking whether it should be on, and the ones that are on standing
 * beside it in their own colours — pressed to take one back off.
 */
export function ToolPickerDemo() {
  const [chosen, setChosen] = React.useState<string[]>(["read", "grep"])

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <ToolPicker value={chosen} onValueChange={setChosen}>
        <div className="flex flex-wrap items-center gap-1">
          <ToolPickerTrigger />
          <ToolPickerActive />
        </div>
        <ToolPickerContent />
      </ToolPicker>
      <p className="ps-1 text-xs text-muted-foreground">
        {chosen.length
          ? `${chosen.length} of ${tools.length} on — press one to take it off.`
          : "No tools — it can only answer."}
      </p>
    </div>
  )
}

/**
 * Where it belongs: on the row a composer keeps for the things a message is
 * sent *with*, next to the model, since the two are the same decision asked
 * twice — what is answering, and what it may reach for while it does.
 */
export function ToolPickerComposerDemo() {
  const [chosen, setChosen] = React.useState<string[]>(["bash", "read", "edit"])
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
            placeholder="Ask it to do something…"
            className="h-9 border-transparent bg-transparent px-2 focus-visible:border-transparent"
          />
          <div className="flex items-center gap-1">
            <ToolPicker value={chosen} onValueChange={setChosen}>
              <ToolPickerTrigger />
              <ToolPickerContent side="top" />
              <ToolPickerActive />
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
            ? `Sent with ${chosen.length} ${chosen.length === 1 ? "tool" : "tools"}.`
            : `${chosen.length} of ${tools.length} tools on.`}
        </p>
      </div>
    </TooltipProvider>
  )
}

/**
 * The other starting point: everything on, and the picker used to take things
 * away. An agent is usually given the whole set and then narrowed — a run that
 * should not be touching the filesystem is one where `write` and `edit` come
 * off, rather than one where the other six have to be found and switched on.
 * With the whole catalogue up, the row beside the wrench is the run's
 * capabilities written out, and taking one off is a press on the thing itself.
 */
export function ToolPickerAllDemo() {
  const [chosen, setChosen] = React.useState<string[]>(
    tools.map((tool) => tool.id)
  )
  const off = tools.filter((tool) => !chosen.includes(tool.id))

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <ToolPicker value={chosen} onValueChange={setChosen}>
        <div className="flex flex-wrap items-center gap-1">
          <ToolPickerTrigger />
          <ToolPickerActive />
        </div>
        <ToolPickerContent />
      </ToolPicker>
      <p className="ps-1 text-xs text-muted-foreground">
        {off.length
          ? `Held back: ${off.map((tool) => tool.id).join(", ")}.`
          : "Everything on."}
      </p>
    </div>
  )
}
