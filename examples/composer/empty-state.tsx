"use client"

import * as React from "react"
import {
  Clock01Icon,
  PlusSignIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  EmptyState,
  EmptyStateComposer,
  EmptyStateContent,
  EmptyStateDescription,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateHeaderActions,
  EmptyStateTitle,
} from "@/components/aiellie-ui/composer/empty-state"
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
import { Suggestions } from "@/components/aiellie-ui/suggestions"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { Kbd } from "@/components/ui/kbd"

const prompts = [
  "Summarise the thread",
  "What changed since Friday?",
  "Draft the release note",
  "Explain the rollout plan",
]

/**
 * The opening screen: what the conversation is set to across the top, the
 * invitation in the middle, and the prompts under the field for anyone who
 * would rather pick than write.
 */
export function EmptyStateDemo() {
  const [value, setValue] = React.useState("")
  const [model, setModel] = React.useState("claude-sonnet-5")
  const [sent, setSent] = React.useState<string | null>(null)

  return (
    <EmptyState className="min-h-[26rem]">
      <EmptyStateHeader>
        <ModelPicker value={model} onValueChange={setModel}>
          <ModelPickerTrigger />
          <ModelPickerContent />
        </ModelPicker>
        <EmptyStateHeaderActions>
          <TooltipIconButton tooltip="History">
            <HugeiconsIcon icon={Clock01Icon} />
          </TooltipIconButton>
          <TooltipIconButton tooltip="Settings">
            <HugeiconsIcon icon={Settings01Icon} />
          </TooltipIconButton>
          <TooltipIconButton tooltip="New chat">
            <HugeiconsIcon icon={PlusSignIcon} />
          </TooltipIconButton>
        </EmptyStateHeaderActions>
      </EmptyStateHeader>

      <EmptyStateContent>
        <EmptyStateTitle>Where would you like to start?</EmptyStateTitle>
        <EmptyStateDescription>
          {sent
            ? `Sent “${sent}”. Ask something else, or pick one of the prompts.`
            : "Ask about the rollout, the thread, or anything else in the project."}
        </EmptyStateDescription>

        <EmptyStateComposer>
          <MessageInput
            value={value}
            onValueChange={setValue}
            onSubmit={setSent}
          >
            <MessageInputField placeholder="Ask anything…" />
            <MessageInputSubmit />
          </MessageInput>
          <Suggestions
            // Three that fit rather than four that scroll: on an opening
            // screen the prompts are meant to be read at a glance, and a strip
            // with one cut off at the edge reads as a mistake.
            suggestions={prompts.slice(0, 3)}
            // Picking fills the field rather than sending: a prompt is a
            // starting point, and the reader may want to change it first.
            onSuggestion={setValue}
            selectedSuggestion={prompts.includes(value) ? value : null}
            className="max-w-full justify-center-safe"
          />
        </EmptyStateComposer>
      </EmptyStateContent>

      <EmptyStateFooter>
        <span>
          <Kbd>⏎</Kbd> to send
        </span>
      </EmptyStateFooter>
    </EmptyState>
  )
}

/**
 * The same screen with the prompts as a column rather than a strip, which is
 * what a wider opening screen tends to want: the choices read as a list of
 * things to ask instead of a row of chips.
 */
export function EmptyStateListDemo() {
  const [value, setValue] = React.useState("")

  return (
    <EmptyState className="min-h-[26rem]">
      <EmptyStateHeader>
        <span className="text-xs font-medium text-muted-foreground">
          New conversation
        </span>
        <EmptyStateHeaderActions>
          <TooltipIconButton tooltip="Settings">
            <HugeiconsIcon icon={Settings01Icon} />
          </TooltipIconButton>
        </EmptyStateHeaderActions>
      </EmptyStateHeader>

      <EmptyStateContent>
        <EmptyStateTitle>Good afternoon, Ellie</EmptyStateTitle>
        <EmptyStateDescription>
          Pick up where the thread left off, or start somewhere new.
        </EmptyStateDescription>

        <EmptyStateComposer className="max-w-sm">
          <MessageInput value={value} onValueChange={setValue}>
            <MessageInputField placeholder="Ask anything…" />
            <MessageInputSubmit />
          </MessageInput>
          <Suggestions
            variant="list"
            suggestions={prompts.slice(0, 3)}
            onSuggestion={setValue}
            selectedSuggestion={prompts.includes(value) ? value : null}
            className="max-w-full self-stretch"
          />
        </EmptyStateComposer>
      </EmptyStateContent>
    </EmptyState>
  )
}
