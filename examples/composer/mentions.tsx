"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Mentions,
  MentionsEmpty,
  MentionsGroupLabel,
  MentionsItem,
  useMentions,
  type MentionItem,
} from "@/components/aiellie-ui/composer/mentions"
import {
  MessageInput,
  MessageInputField,
  MessageInputSubmit,
} from "@/components/aiellie-ui/composer/message-input"
import { TooltipProvider } from "@/components/ui/tooltip"
import { agents } from "@/examples/composer/agents"
import { users } from "@/examples/composer/users"

const people: MentionItem[] = users.map((user) => ({
  id: user.id,
  name: user.name,
  handle: user.handle,
  description: user.role,
  group: "People",
  // The initials stay under the picture rather than being replaced by it: the
  // avatars come off a host this list does not control, and a name with a blank
  // disc against it reads worse than one that simply never got a picture.
  icon: (
    <>
      <span className="text-[10px] font-medium">{user.initials}</span>
      {/* eslint-disable-next-line @next/next/no-img-element -- a plain img
          rather than next/image, because this file is copied into projects
          that are not necessarily Next ones. */}
      <img
        src={user.avatar}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
    </>
  ),
}))

const bots: MentionItem[] = agents.map((agent) => ({
  id: agent.id,
  name: agent.name,
  handle: agent.handle,
  description: agent.description,
  group: "Agents",
  // The glyph stays underneath for the same reason the initials do.
  icon: (
    <>
      <HugeiconsIcon icon={agent.icon} className="size-3.5" />
      {/* eslint-disable-next-line @next/next/no-img-element -- as above. */}
      <img
        src={agent.avatar}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
    </>
  ),
}))

/** The matches, still in the order the list gave them, under their headings. */
function grouped(matches: readonly MentionItem[]) {
  const groups = new Map<string, MentionItem[]>()
  for (const match of matches) {
    const key = match.group ?? ""
    const existing = groups.get(key)
    if (existing) existing.push(match)
    else groups.set(key, [match])
  }
  return [...groups]
}

function MentionsComposer({
  items,
  placeholder,
  onSend,
}: {
  items: MentionItem[]
  placeholder: string
  onSend: (message: string) => void
}) {
  const [value, setValue] = React.useState("")
  const mentions = useMentions({ value, onValueChange: setValue, items })

  return (
    <TooltipProvider>
      <MessageInput value={value} onValueChange={setValue} onSubmit={onSend}>
        <MessageInputField placeholder={placeholder} {...mentions.fieldProps} />
        <MessageInputSubmit />
      </MessageInput>

      <Mentions controller={mentions}>
        {mentions.matches.length ? (
          grouped(mentions.matches).map(([group, matches]) => (
            <React.Fragment key={group}>
              {group ? <MentionsGroupLabel>{group}</MentionsGroupLabel> : null}
              {matches.map((item) => (
                <MentionsItem key={item.id} item={item} controller={mentions} />
              ))}
            </React.Fragment>
          ))
        ) : (
          <MentionsEmpty>Nobody by that name.</MentionsEmpty>
        )}
      </Mentions>
    </TooltipProvider>
  )
}

/**
 * Type an at sign for the menu, arrows to move through it, Enter to take the
 * one in hand — and Enter still sends the message when the menu is not open.
 */
export function MentionsDemo() {
  const [sent, setSent] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <MentionsComposer
        items={[...people, ...bots]}
        placeholder="Try @marta or @reviewer…"
        onSend={setSent}
      />
      <p className="min-h-4 ps-1 text-xs text-muted-foreground">
        {sent ? `Sent: ${sent}` : "Type @ for people and agents."}
      </p>
    </div>
  )
}

/** One list rather than two, for a thread where only the agents are addressable. */
export function MentionsAgentsDemo() {
  const [sent, setSent] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <MentionsComposer
        items={bots.map((bot) => ({ ...bot, group: undefined }))}
        placeholder="Hand it to an agent with @…"
        onSend={setSent}
      />
      <p className="min-h-4 ps-1 text-xs text-muted-foreground">
        {sent ? `Sent: ${sent}` : "Type @ for the agents."}
      </p>
    </div>
  )
}
