"use client"

import * as React from "react"

import {
  RatioMenu,
  RatioMenuContent,
  RatioMenuTrigger,
  findRatio,
} from "@/components/aiellie-ui/composer/ratio-menu"
import {
  MessageInput,
  MessageInputField,
  MessageInputLine,
  messageInputStack,
  MessageInputSubmit,
  MessageInputToolbar,
} from "@/components/aiellie-ui/composer/message-input"
import { TooltipProvider } from "@/components/ui/tooltip"

/**
 * The menu where it lives: on the row under a generator's field, wearing the
 * chosen frame so the toolbar answers "what shape" at a glance.
 */
export function RatioMenuDemo() {
  const [ratio, setRatio] = React.useState("16:9")

  return (
    <TooltipProvider>
      <div className="flex w-full max-w-md flex-col gap-2">
        <MessageInput className={messageInputStack}>
          <MessageInputLine>
            <MessageInputField placeholder="Describe a picture…" />
            <MessageInputSubmit />
          </MessageInputLine>
          <MessageInputToolbar>
            <RatioMenu value={ratio} onValueChange={setRatio}>
              <RatioMenuTrigger showLabel />
              <RatioMenuContent side="top" />
            </RatioMenu>
          </MessageInputToolbar>
        </MessageInput>
        <p className="min-h-4 ps-1 text-xs text-muted-foreground">
          The next run fills a {findRatio(ratio)?.name.toLowerCase()} frame (
          {ratio}).
        </p>
      </div>
    </TooltipProvider>
  )
}

/** The bare trigger, for a toolbar with no room for the word. */
export function RatioMenuBareDemo() {
  return (
    <TooltipProvider>
      <RatioMenu defaultValue="3:4">
        <RatioMenuTrigger />
        <RatioMenuContent />
      </RatioMenu>
    </TooltipProvider>
  )
}
