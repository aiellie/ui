"use client"

import * as React from "react"

import {
  AddMenu,
  AddMenuContent,
  AddMenuTrigger,
} from "@/components/aiellie-ui/composer/add-menu"
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
          className={messageInputStack}
          onSubmit={(message) => setSent(message)}
        >
          <MessageInputLine>
            <AddMenu>
              <AddMenuTrigger />
              <AddMenuContent side="top" />
            </AddMenu>
            <MessageInputField placeholder="Send a message…" />
            <MessageInputSubmit />
          </MessageInputLine>
          <MessageInputToolbar>
            <ModelPicker value={model} onValueChange={setModel}>
              <ModelPickerTrigger />
              <ModelPickerContent side="top" />
            </ModelPicker>
          </MessageInputToolbar>
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

/**
 * The three ways the marks can come out. The default is the mixed one: models
 * in colour because the model is what is being picked, houses in plain ink
 * because the house is the heading it sits under. `icons` forces everything
 * one way or the other for the places that want it — a composer with no colour
 * in it, or a settings page where each house is the row rather than the label.
 *
 * Open all three: the set carries to the rows, the group labels and the
 * trigger together, since it is held on the picker rather than per glyph.
 */
export function ModelPickerBrandDemo() {
  const [a, setA] = React.useState("claude-sonnet-5")
  const [b, setB] = React.useState("claude-sonnet-5")
  const [c, setC] = React.useState("claude-sonnet-5")

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col items-start gap-1.5">
        <p className="ps-1 text-xs text-muted-foreground">
          Default — coloured models, plain houses
        </p>
        <ModelPicker value={a} onValueChange={setA}>
          <ModelPickerTrigger />
          <ModelPickerContent />
        </ModelPicker>
      </div>

      <div className="flex flex-col items-start gap-1.5">
        <p className="ps-1 text-xs text-muted-foreground">
          icons=&quot;mono&quot; — no colour anywhere
        </p>
        <ModelPicker icons="mono" value={b} onValueChange={setB}>
          <ModelPickerTrigger />
          <ModelPickerContent />
        </ModelPicker>
      </div>

      <div className="flex flex-col items-start gap-1.5">
        <p className="ps-1 text-xs text-muted-foreground">
          icons=&quot;brand&quot; — colour wherever there is any
        </p>
        <ModelPicker icons="brand" value={c} onValueChange={setC}>
          <ModelPickerTrigger />
          <ModelPickerContent />
        </ModelPicker>
      </div>
    </div>
  )
}
