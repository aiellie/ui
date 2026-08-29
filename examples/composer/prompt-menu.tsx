"use client"

import * as React from "react"
import {
  Folder01Icon,
  Note01Icon,
  PaintBoardIcon,
} from "@hugeicons/core-free-icons"

import {
  PromptMenu,
  PromptMenuContent,
  PromptMenuTrigger,
} from "@/components/aiellie-ui/composer/prompt-menu"
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
import type { Instruction, InstructionCategory } from "@/lib/instructions"
import { findInstruction } from "@/lib/instructions"

/**
 * The choice on its own: a trigger wearing the prompt in force, and a list
 * that says how each one changes the answer before it is taken.
 */
export function PromptMenuDemo() {
  const [prompt, setPrompt] = React.useState("concise")
  const chosen = findInstruction(prompt)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <PromptMenu value={prompt} onValueChange={setPrompt}>
        <PromptMenuTrigger />
        <PromptMenuContent />
      </PromptMenu>
      <p className="ps-1 text-xs text-muted-foreground">
        {chosen?.description ?? "Nothing set — the agent answers as it comes."}
      </p>
    </div>
  )
}

/**
 * Where it belongs: on the row a composer keeps for the things a message is
 * sent *with*, next to the model — what is answering, and what it has been
 * told about how.
 */
export function PromptMenuComposerDemo() {
  const [prompt, setPrompt] = React.useState("code-reviewer")
  const [model, setModel] = React.useState("claude-opus-5")
  const [sent, setSent] = React.useState<string | null>(null)
  const chosen = findInstruction(prompt)

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
            <PromptMenu value={prompt} onValueChange={setPrompt}>
              <PromptMenuTrigger />
              <PromptMenuContent side="top" />
            </PromptMenu>
            <ModelPicker value={model} onValueChange={setModel}>
              <ModelPickerTrigger showIcon={false} />
              <ModelPickerContent side="top" />
            </ModelPicker>
          </MessageInputToolbar>
        </MessageInput>
        <p className="ps-1 text-xs text-muted-foreground">
          {sent
            ? chosen
              ? `Sent under ${chosen.name.toLowerCase()}.`
              : "Sent with nothing stood over it."
            : "Send it and the prompt on the left goes with it."}
        </p>
      </div>
    </TooltipProvider>
  )
}

/**
 * What a choice actually sets: the catalogue keeps the words as well as the
 * name, so picking a row is setting a system prompt without pasting one — and
 * picking none sets nothing at all.
 */
export function PromptMenuTextDemo() {
  const [prompt, setPrompt] = React.useState("test-first")
  const chosen = findInstruction(prompt)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <PromptMenu value={prompt} onValueChange={setPrompt}>
        <PromptMenuTrigger />
        <PromptMenuContent />
      </PromptMenu>
      {chosen ? (
        <p className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2 font-mono text-[11px] leading-4 text-muted-foreground">
          {chosen.prompt}
        </p>
      ) : (
        <p className="ps-1 text-xs text-muted-foreground">
          No prompt, no words: nothing is added to the run.
        </p>
      )}
    </div>
  )
}

/**
 * The prompts a project keeps for itself, heading and all — the built-in set
 * is nowhere in this menu.
 */
const projectCategory: InstructionCategory = {
  id: "project",
  name: "Project",
  description: "The prompts this project keeps for itself.",
  icon: Folder01Icon,
}

const projectInstructions: Instruction[] = [
  {
    id: "house-style",
    name: "House style",
    category: "project",
    description: "Answers the way this codebase writes.",
    prompt:
      "Match the register of the codebase: British spelling, comments that say why rather than what, and prose that reads as prose.",
    icon: PaintBoardIcon,
  },
  {
    id: "release-notes",
    name: "Release notes",
    category: "project",
    description: "Turns a diff into notes a reader can use.",
    prompt:
      "Write release notes rather than a changelog: group the changes by what a reader can now do, and leave the commit hashes out of it.",
    icon: Note01Icon,
  },
]

/**
 * A catalogue of your own: the menu takes any list and any headings, so the
 * house set is a default rather than a fixture.
 */
export function PromptMenuOwnDemo() {
  const [prompt, setPrompt] = React.useState("house-style")
  const chosen = findInstruction(prompt, projectInstructions)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <PromptMenu
        value={prompt}
        onValueChange={setPrompt}
        instructions={projectInstructions}
        categories={[projectCategory]}
      >
        <PromptMenuTrigger />
        <PromptMenuContent />
      </PromptMenu>
      <p className="ps-1 text-xs text-muted-foreground">
        {chosen?.description ?? "Nothing set — the agent answers as it comes."}
      </p>
    </div>
  )
}
