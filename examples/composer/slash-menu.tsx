"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"

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
} from "@/components/aiellie-ui/composer/message-input"
import {
  SlashMenu,
  SlashMenuEmpty,
  SlashMenuGroupLabel,
  SlashMenuItem,
  useSlashCommands,
  type SlashCommand,
} from "@/components/aiellie-ui/composer/slash-menu"
import { TooltipProvider } from "@/components/ui/tooltip"
import { commands } from "@/examples/composer/commands"

const catalogue: SlashCommand[] = commands.map((command) => ({
  ...command,
  icon: <HugeiconsIcon icon={command.icon} className="size-3.5" />,
}))

/** The ones that cannot be run on the spot, since the field is where the rest goes. */
const waiting: SlashCommand[] = catalogue
  .filter((command) => command.argument)
  .map((command) => ({ ...command, group: undefined }))

/** The matches, still in the order the list gave them, under their headings. */
function grouped(matches: readonly SlashCommand[]) {
  const groups = new Map<string, SlashCommand[]>()
  for (const match of matches) {
    const key = match.group ?? ""
    const existing = groups.get(key)
    if (existing) existing.push(match)
    else groups.set(key, [match])
  }
  return [...groups]
}

function CommandComposer({
  items,
  placeholder,
  onRun,
  onSend,
}: {
  items: SlashCommand[]
  placeholder: string
  onRun?: (command: SlashCommand) => void
  onSend: (message: string) => void
}) {
  const [value, setValue] = React.useState("")
  const slash = useSlashCommands({
    value,
    onValueChange: setValue,
    commands: items,
    onRun,
  })

  return (
    <TooltipProvider>
      <MessageInput
        className={messageInputStack}
        value={value}
        onValueChange={setValue}
        onSubmit={onSend}
      >
        <MessageInputLine>
          <AddMenu>
            <AddMenuTrigger />
            <AddMenuContent side="top" />
          </AddMenu>
          <MessageInputField placeholder={placeholder} {...slash.fieldProps} />
          <MessageInputSubmit />
        </MessageInputLine>
      </MessageInput>

      <SlashMenu controller={slash}>
        {slash.matches.length ? (
          grouped(slash.matches).map(([group, matches]) => (
            <React.Fragment key={group}>
              {group ? (
                <SlashMenuGroupLabel>{group}</SlashMenuGroupLabel>
              ) : null}
              {matches.map((command) => (
                <SlashMenuItem
                  key={command.id}
                  command={command}
                  controller={slash}
                />
              ))}
            </React.Fragment>
          ))
        ) : (
          <SlashMenuEmpty>No command by that name.</SlashMenuEmpty>
        )}
      </SlashMenu>
    </TooltipProvider>
  )
}

/**
 * A slash at the start of the field for the catalogue, arrows to move through
 * it, Enter to take the one in hand. A command that wants nothing else runs on
 * the spot and empties the field; one that wants an argument is written in and
 * left waiting for it.
 */
export function SlashMenuDemo() {
  const [line, setLine] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <CommandComposer
        items={catalogue}
        placeholder="Try /model or /clear…"
        onRun={(command) => setLine(`Ran /${command.name}`)}
        onSend={setLine}
      />
      <p className="min-h-4 ps-1 text-xs text-muted-foreground">
        {line ?? "Type / at the start of the field."}
      </p>
    </div>
  )
}

/** Only the ones that want something after the name, so every one of them waits. */
export function SlashMenuArgumentsDemo() {
  const [line, setLine] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <CommandComposer
        items={waiting}
        placeholder="Try /review…"
        onSend={setLine}
      />
      <p className="min-h-4 ps-1 text-xs text-muted-foreground">
        {line ?? "Take one and the caret waits after it."}
      </p>
    </div>
  )
}
