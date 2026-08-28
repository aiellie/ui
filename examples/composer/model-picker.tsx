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
import { TooltipProvider } from "@/components/ui/tooltip"
import { findModel, formatContextWindow } from "@/lib/models"

/**
 * The choice on its own: the trigger says which model is answering, and the
 * list says what each of the others would be answering instead — a name, a
 * sentence on what it is for, what it can do, and how much it holds.
 */
export function ModelPickerDemo() {
  const [model, setModel] = React.useState("claude-sonnet-5")
  const chosen = findModel(model)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <ModelPicker value={model} onValueChange={setModel}>
        <ModelPickerTrigger />
        <ModelPickerContent />
      </ModelPicker>
      <p className="ps-1 text-xs text-muted-foreground">
        {chosen
          ? `${chosen.id} · ${formatContextWindow(chosen.contextWindow)} context`
          : "No model chosen."}
      </p>
    </div>
  )
}

/**
 * Where it belongs: under the field rather than beside it, on the row the
 * composer keeps for the things a message is sent *with* — so the choice is
 * within reach of every message without ever being in the way of writing one.
 */
export function ModelPickerComposerDemo() {
  const [model, setModel] = React.useState("claude-opus-5")
  const [sent, setSent] = React.useState<string | null>(null)
  const chosen = findModel(model)

  return (
    <TooltipProvider>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <MessageInput
          className="flex-col items-stretch gap-1 rounded-2xl border border-border/60 bg-background p-1.5 dark:bg-popover"
          onSubmit={(message) => setSent(message)}
        >
          <MessageInputField
            placeholder="Send a message…"
            className="h-9 border-transparent bg-transparent px-2 focus-visible:border-transparent"
          />
          <div className="flex items-center justify-between gap-2">
            <ModelPicker value={model} onValueChange={setModel}>
              <ModelPickerTrigger />
              <ModelPickerContent side="top" />
            </ModelPicker>
            <MessageInputSubmit className="size-7" />
          </div>
        </MessageInput>
        <p className="ps-1 text-xs text-muted-foreground">
          {sent
            ? `Sent to ${chosen?.name ?? model}.`
            : `Writing to ${chosen?.name ?? model}.`}
        </p>
      </div>
    </TooltipProvider>
  )
}

/**
 * The same list drawn for an account that cannot reach all of it. The models
 * above the plan stay on the list, locked — hiding them would answer which
 * model this is without ever answering what else there is.
 */
export function ModelPickerPlanDemo() {
  const [model, setModel] = React.useState("claude-haiku-4-5")

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <ModelPicker plan="free" value={model} onValueChange={setModel}>
        <ModelPickerTrigger />
        <ModelPickerContent />
      </ModelPicker>
      <p className="ps-1 text-xs text-muted-foreground">
        On the free plan, so the deeper models are shown but cannot be picked.
      </p>
    </div>
  )
}
