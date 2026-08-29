"use client"

import * as React from "react"
import { Popover } from "@base-ui/react/popover"
import { Settings01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import type { ChatStatus } from "ai"

import {
  ChatAvatar,
  ChatAvatarActions,
  ChatAvatarImage,
  ChatAvatarName,
} from "@/components/aiellie-ui/chat-avatar"
import {
  ChatCard,
  ChatCardFooter,
  ChatCardThread,
} from "@/components/aiellie-ui/chat-card"
import {
  MessageInput,
  MessageInputField,
  MessageInputSubmit,
} from "@/components/aiellie-ui/composer/message-input"
import { menuPopup } from "@/components/aiellie-ui/menu"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { cn } from "@/lib/utils"

/**
 * A generator, framed as the chat it really is: a persona floating at the top,
 * prompts going down the thread, and what they made coming back up it.
 *
 * The framing is the point. A prompt box over a gallery treats generation as
 * a form to fill in; a thread treats it as an exchange with something — which
 * is what it is, and which is why every part of the chat family works here
 * unchanged: the prompt is a message, the result is a reply, a failure is a
 * reply too, and the wait between them is the same wait a streaming answer
 * makes. Nothing in this file knows *how* anything is generated — the caller
 * hands a prompt out and hands results back in as children.
 */

export interface GeneratorPersona {
  name: string
  /** The portrait — `avatarFor(name)` from `lib/avatars` is the house source. */
  avatar?: string
  /** The glyph beside the name, saying what kind of maker this one is. */
  icon?: IconSvgElement
}

export interface GeneratorCardProps extends Omit<
  React.ComponentProps<typeof ChatCard>,
  "onSubmit"
> {
  persona: GeneratorPersona
  /** What a submitted prompt starts. */
  onPrompt?: (prompt: string) => void
  /** A run is going: the send becomes a stop, which `onStop` answers. */
  busy?: boolean
  onStop?: () => void
  placeholder?: string
  /**
   * The panel behind the gear — a `KeyField`, a model note, whatever the
   * generator can be handed. No gear renders when there is nothing to set.
   */
  settings?: React.ReactNode
}

export function GeneratorCard({
  persona,
  onPrompt,
  busy = false,
  onStop,
  placeholder = "Describe it…",
  settings,
  className,
  children,
  ...props
}: GeneratorCardProps) {
  /* The composer's vocabulary for "still working", borrowed rather than
     re-invented: the submit control already knows how to be a stop. */
  const status: ChatStatus = busy ? "submitted" : "ready"

  return (
    <ChatCard
      data-slot="generator-card"
      className={cn("max-w-sm", className)}
      {...props}
    >
      <ChatCardThread>
        <ChatAvatar>
          <ChatAvatarImage src={persona.avatar} className="size-10" />
          <ChatAvatarName chevron={false} icon={persona.icon}>
            {persona.name}
          </ChatAvatarName>
          {settings ? (
            <ChatAvatarActions side="end">
              <GeneratorSettings>{settings}</GeneratorSettings>
            </ChatAvatarActions>
          ) : null}
        </ChatAvatar>
        {children}
      </ChatCardThread>

      <ChatCardFooter>
        <MessageInput onSubmit={onPrompt}>
          <MessageInputField placeholder={placeholder} />
          <MessageInputSubmit status={status} onStop={onStop} />
        </MessageInput>
      </ChatCardFooter>
    </ChatCard>
  )
}

/**
 * One exchange: what was asked, then what came of it. The prompt keeps the
 * asker's side of the thread and the outcome the maker's, so a card with
 * three runs in it reads as the conversation it was.
 */
export function GeneratorRun({
  prompt,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { prompt: string }) {
  return (
    <div
      data-slot="generator-run"
      className={cn("flex shrink-0 flex-col gap-2", className)}
      {...props}
    >
      <Bubble align="end">
        <BubbleContent>{prompt}</BubbleContent>
      </Bubble>
      <div className="flex w-full flex-col items-start gap-1.5">{children}</div>
    </div>
  )
}

/**
 * What the card says before it has made anything. Rendered by the caller only
 * while the thread is empty — a greeting that hangs around under real work
 * stops being a greeting.
 */
export function GeneratorEmpty({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="generator-empty"
      className={cn(
        "m-auto max-w-60 text-center text-xs text-balance text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/**
 * The gear and its panel. A popover rather than a page: a key and a model
 * note are a paragraph of settings, and sending somebody away from the card
 * to type a key means they come back to a card that has forgotten the prompt.
 */
function GeneratorSettings({ children }: { children: React.ReactNode }) {
  return (
    <Popover.Root>
      <Popover.Trigger
        render={<TooltipIconButton tooltip="Generator settings" />}
      >
        <HugeiconsIcon icon={Settings01Icon} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="end"
          sideOffset={6}
          collisionPadding={8}
          className="isolate z-50"
        >
          <Popover.Popup className={cn(menuPopup("glass"), "w-72 p-3")}>
            {children}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
