"use client"

import * as React from "react"
import type { ChatStatus } from "ai"

import {
  MessageInput,
  MessageInputField,
  MessageInputSubmit,
} from "@/components/aiellie-ui/composer/message-input"
import { TooltipProvider } from "@/components/ui/tooltip"

/**
 * The control at the end of the field is whichever one the field is asking for:
 * voice while there is nothing written, send once there is, and stop while an
 * answer is coming back.
 */
export function MessageInputDemo() {
  const [status, setStatus] = React.useState<ChatStatus>("ready")
  const [value, setValue] = React.useState("")
  const [outcome, setOutcome] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (status !== "streaming") return undefined
    const id = setTimeout(() => {
      setStatus("ready")
      setOutcome("Answered.")
    }, 4000)
    return () => clearTimeout(id)
  }, [status])

  // Derived rather than set from each handler: the note is a reading of the
  // state, and a note written by whichever handler fired last is a note that
  // disagrees with what is on screen.
  const note =
    status === "streaming"
      ? "Answering, so the control is stop."
      : value.trim()
        ? "Something to send, so the control is send."
        : (outcome ?? "Empty, so the control offers voice.")

  return (
    <TooltipProvider>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <MessageInput
          value={value}
          onValueChange={(next) => {
            setValue(next)
            if (next) setOutcome(null)
          }}
          onSubmit={() => setStatus("streaming")}
        >
          <MessageInputField placeholder="Send a message…" />
          <MessageInputSubmit
            status={status}
            onStop={() => {
              setStatus("ready")
              setOutcome("Stopped.")
            }}
            onVoice={() => setOutcome("Voice chat.")}
          />
        </MessageInput>
        <p className="ps-1 text-xs text-muted-foreground">{note}</p>
      </div>
    </TooltipProvider>
  )
}

/** The three the control can be, side by side rather than one at a time. */
export function MessageInputStatesDemo() {
  return (
    <TooltipProvider>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="ps-1 text-xs text-muted-foreground">Empty — voice</p>
          <MessageInput value="" onValueChange={() => {}}>
            <MessageInputField placeholder="Send a message…" />
            <MessageInputSubmit />
          </MessageInput>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="ps-1 text-xs text-muted-foreground">Written — send</p>
          <MessageInput
            value="Are we still shipping on Tuesday?"
            onValueChange={() => {}}
          >
            <MessageInputField />
            <MessageInputSubmit />
          </MessageInput>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="ps-1 text-xs text-muted-foreground">Answering — stop</p>
          <MessageInput value="" onValueChange={() => {}}>
            <MessageInputField placeholder="Answering…" disabled />
            <MessageInputSubmit status="streaming" onStop={() => {}} />
          </MessageInput>
        </div>
      </div>
    </TooltipProvider>
  )
}
