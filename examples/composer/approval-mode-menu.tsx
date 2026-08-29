"use client"

import * as React from "react"

import {
  ApprovalModeMenu,
  ApprovalModeMenuContent,
  ApprovalModeMenuTrigger,
  findApprovalMode,
} from "@/components/aiellie-ui/composer/approval-mode-menu"
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

/**
 * The choice on its own: five modes, each saying what running under it means
 * before it is taken.
 */
export function ApprovalModeMenuDemo() {
  const [mode, setMode] = React.useState("auto")

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <ApprovalModeMenu value={mode} onValueChange={setMode}>
        <ApprovalModeMenuTrigger />
        <ApprovalModeMenuContent />
      </ApprovalModeMenu>
      <p className="ps-1 text-xs text-muted-foreground">
        {findApprovalMode(mode)?.description}
      </p>
    </div>
  )
}

/**
 * Where it belongs: on the row a composer keeps for the things a message is
 * sent *with*, next to the model — what is answering, and how much it may do
 * without being asked again.
 */
export function ApprovalModeMenuComposerDemo() {
  const [mode, setMode] = React.useState("accept-edits")
  const [model, setModel] = React.useState("claude-opus-5")
  const [sent, setSent] = React.useState<string | null>(null)

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
            <MessageInputField placeholder="Ask it to do something…" />
            <MessageInputSubmit />
          </MessageInputLine>
          <MessageInputToolbar>
            <ApprovalModeMenu value={mode} onValueChange={setMode}>
              <ApprovalModeMenuTrigger />
              <ApprovalModeMenuContent side="top" />
            </ApprovalModeMenu>
            <ModelPicker value={model} onValueChange={setModel}>
              <ModelPickerTrigger />
              <ModelPickerContent side="top" />
            </ModelPicker>
          </MessageInputToolbar>
        </MessageInput>
        <p className="ps-1 text-xs text-muted-foreground">
          {sent
            ? `Sent under ${findApprovalMode(mode)?.name.toLowerCase()}.`
            : "Send it and it runs under the mode on the left."}
        </p>
      </div>
    </TooltipProvider>
  )
}

/**
 * The mode that asks for nothing, and what the composer does about it: the
 * trigger goes red with the row, so a session left in full access says so
 * without the menu being opened. Starting here on purpose — the state worth
 * seeing is the one that is dangerous to miss.
 */
export function ApprovalModeMenuFullAccessDemo() {
  const [mode, setMode] = React.useState("full-access")
  const chosen = findApprovalMode(mode)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <ApprovalModeMenu value={mode} onValueChange={setMode}>
        <ApprovalModeMenuTrigger />
        <ApprovalModeMenuContent />
      </ApprovalModeMenu>
      <p
        className={
          chosen?.destructive
            ? "ps-1 text-xs text-destructive"
            : "ps-1 text-xs text-muted-foreground"
        }
      >
        {chosen?.destructive
          ? "Nothing will stop to ask. Pick another mode to put the gate back."
          : `Back to ${chosen?.name.toLowerCase()} — it stops to ask again.`}
      </p>
    </div>
  )
}
