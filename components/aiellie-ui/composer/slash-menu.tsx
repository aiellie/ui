"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { floating, mono } from "@/components/aiellie-ui/actions"
import { cn } from "@/lib/utils"

export interface SlashCommand {
  id: string
  /** What is typed after the slash, and what the query is matched against. */
  name: string
  description?: string
  /**
   * What the command wants after its name — `<path>`, `<pattern>`. Shown on
   * the row, and the reason taking a command sometimes leaves the caret in the
   * field rather than running it.
   */
  argument?: string
  /** The heading this one sits under. Commands keep the order they arrive in. */
  group?: string
  icon?: React.ReactNode
}

/** Where the slash sits in the text, and what has been typed since. */
type Active = { start: number; query: string }

/**
 * Reads the text in front of the caret for a command being typed.
 *
 * Only at the very start of the field, which is most of what separates this
 * from a mention. An at sign is a name wherever it turns up — the middle of a
 * sentence is the ordinary place to write one — but a slash in the middle of a
 * sentence is a date, a path, an and/or, and a menu that opened on all of
 * those would be in the way of most of the writing it appeared over.
 */
function activeCommand(
  value: string,
  caret: number,
  trigger: string
): Active | null {
  if (!value.startsWith(trigger) || caret < trigger.length) return null

  // The caret has to still be in the command word: past the first space the
  // argument is being written and the command itself has been settled.
  const query = value.slice(trigger.length, caret)
  if (/\s/.test(query)) return null

  return { start: 0, query }
}

function matchesFor(commands: readonly SlashCommand[], query: string) {
  if (!query) return commands
  const needle = query.toLowerCase()

  // Three tiers, because a command is looked for by two different things: by
  // name once it is known, and by what it does while it is not. "rev" should
  // reach /review before /server-revert, and "bug" should reach it at all.
  const prefix: SlashCommand[] = []
  const inside: SlashCommand[] = []
  const described: SlashCommand[] = []
  for (const command of commands) {
    const name = command.name.toLowerCase()
    if (name.startsWith(needle)) prefix.push(command)
    else if (name.includes(needle)) inside.push(command)
    else if (command.description?.toLowerCase().includes(needle))
      described.push(command)
  }
  return [...prefix, ...inside, ...described]
}

export interface UseSlashCommandsOptions {
  value: string
  onValueChange: (value: string) => void
  commands: readonly SlashCommand[]
  trigger?: string
  /**
   * What taking a command that wants nothing else does. Given one, the field
   * is emptied and this runs, which is what a slash command mostly is: a thing
   * done rather than a thing written. Left out, every command is written into
   * the field and the submit is left to make sense of the line.
   */
  onRun?: (command: SlashCommand) => void
  /** What goes into the field for a command still waiting on its argument. */
  format?: (command: SlashCommand) => string
}

/**
 * The behaviour half of a command menu: what is being typed, what matches it,
 * which match is in hand, and what taking one does to the field.
 *
 * A hook rather than a wrapper, for the same reason the mention menu is one —
 * the field belongs to whoever is using this. Spread `fieldProps` onto it and
 * the keys, the roles and the caret all follow.
 */
export function useSlashCommands<
  Field extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>({
  value,
  onValueChange,
  commands,
  trigger = "/",
  onRun,
  format = (command) => `${trigger}${command.name} `,
}: UseSlashCommandsOptions) {
  const ref = React.useRef<Field>(null)
  const [active, setActive] = React.useState<Active | null>(null)
  const [index, setIndex] = React.useState(0)
  const listId = React.useId()

  const matches = React.useMemo(
    () => (active ? matchesFor(commands, active.query) : []),
    [commands, active]
  )
  // Open on the slash rather than on a match, which is the other way round
  // from the mention menu. An at sign that names nobody is still ordinary
  // writing and the menu gets out of the way; a slash at the head of the field
  // is a command being typed, so "no command by that name" is the answer to
  // give rather than a menu that silently vanishes. The keys only belong to it
  // while there is something to take, or Enter would be swallowed by a list
  // with nothing in it.
  const open = active !== null
  const holdsKeys = open && matches.length > 0

  // The caret is on the element, not in the value: the same text can be typed
  // into two places and only the DOM knows which one is being written at.
  const read = React.useCallback(() => {
    const field = ref.current
    if (!field) return
    const caret = field.selectionStart ?? field.value.length
    setActive(activeCommand(field.value, caret, trigger))
    setIndex(0)
  }, [trigger])

  const dismiss = React.useCallback(() => setActive(null), [])

  const accept = React.useCallback(
    (command: SlashCommand) => {
      const field = ref.current
      if (!active || !field) return

      // A command that wants nothing else is run rather than written: leaving
      // "/clear" sitting in the field asks for a second Enter to do what the
      // first one already meant. One that wants an argument cannot be run yet
      // — the field is where the argument goes — so it is written in and the
      // caret left after it.
      if (!command.argument && onRun) {
        onValueChange("")
        setActive(null)
        onRun(command)
        requestAnimationFrame(() => field.focus())
        return
      }

      const caret = field.selectionStart ?? value.length
      const inserted = format(command)
      const next = value.slice(0, active.start) + inserted + value.slice(caret)

      onValueChange(next)
      setActive(null)

      const at = active.start + inserted.length
      requestAnimationFrame(() => {
        field.focus()
        field.setSelectionRange(at, at)
      })
    },
    [active, value, format, onRun, onValueChange]
  )

  const activeId = holdsKeys ? `${listId}-${matches[index]?.id}` : undefined

  const fieldProps = {
    ref,
    // A field with a list attached to it is a combobox, and saying so is what
    // makes the arrow keys mean anything to a screen reader.
    role: "combobox" as const,
    "aria-expanded": open,
    "aria-controls": open ? listId : undefined,
    "aria-activedescendant": activeId,
    "aria-autocomplete": "list" as const,
    onKeyDown: (event: React.KeyboardEvent<Field>) => {
      if (!holdsKeys) {
        // Nothing to move through or take, so the field keeps its keys — but
        // a message is not what Escape is for while a menu is stood over the
        // field, even one saying it has nothing.
        if (open && event.key === "Escape") {
          event.preventDefault()
          dismiss()
        }
        return
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        const step = event.key === "ArrowDown" ? 1 : -1
        setIndex((previous) => {
          const next = previous + step
          // Wrapping, because a list this short is a ring rather than a page.
          return (next + matches.length) % matches.length
        })
        return
      }

      // Enter belongs to the menu while it is open — a half-typed command is
      // not a message, and sending it would send the slash along with it.
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault()
        const command = matches[index]
        if (command) accept(command)
        return
      }

      if (event.key === "Escape") {
        event.preventDefault()
        dismiss()
      }
    },
    onKeyUp: read,
    onClick: read,
    onInput: read,
  }

  return {
    open,
    /** Whether the arrows and Enter are the menu's, which needs a match. */
    holdsKeys,
    query: active?.query ?? "",
    matches,
    index,
    setIndex,
    accept,
    dismiss,
    read,
    ref,
    listId,
    activeId,
    trigger,
    fieldProps,
  }
}

export type SlashCommandsController<
  Field extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
> = ReturnType<typeof useSlashCommands<Field>>

/**
 * The menu itself, over the field it belongs to.
 *
 * Fixed to the field's own box rather than dropped into the layout: a command
 * menu opens over whatever is above the composer, and a menu that pushed the
 * thread up every time somebody typed a slash would be unusable.
 *
 * Portalled to the body, and not optionally. `position: fixed` resolves
 * against the nearest ancestor carrying a transform, a filter or paint
 * containment rather than against the window — and a composer is very often
 * inside one. Rendered in place, the menu is measured against the window and
 * then positioned inside that ancestor, which puts it somewhere else entirely
 * and usually behind an `overflow: hidden`.
 *
 * The press is defaulted away so taking a command does not first take the
 * caret out of the field it is being typed into.
 */
export function SlashMenu<
  Field extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>({
  controller,
  side = "top",
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  controller: SlashCommandsController<Field>
  side?: "top" | "bottom"
  children: React.ReactNode
}) {
  const { open, listId, ref } = controller
  const [box, setBox] = React.useState<DOMRect | null>(null)

  React.useLayoutEffect(() => {
    if (!open) return undefined

    function measure() {
      const field = ref.current
      if (field) setBox(field.getBoundingClientRect())
    }

    measure()
    window.addEventListener("resize", measure)
    window.addEventListener("scroll", measure, true)
    return () => {
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", measure, true)
    }
  }, [open, ref])

  if (!open || !box) return null

  // The menu takes the room it has rather than the room it wants. A composer
  // usually sits at the foot of the page, so above is the right side to open
  // on — but a long catalogue will run off the top of the window, and a menu
  // whose first commands are unreachable is worse than one that opened down.
  const gap = 8
  const above = box.top - gap
  const below = window.innerHeight - box.bottom - gap
  const placement =
    side === "top" && above < Math.min(below, 160) ? "bottom" : side
  const room = placement === "top" ? above : below

  return createPortal(
    <div
      data-slot="slash-menu"
      id={listId}
      role="listbox"
      aria-label="Commands"
      data-side={placement}
      onMouseDownCapture={(event) => event.preventDefault()}
      style={{
        position: "fixed",
        left: box.left,
        width: Math.max(box.width, 280),
        maxHeight: Math.max(Math.min(288, room), 96),
        ...(placement === "top"
          ? { bottom: window.innerHeight - box.top + gap }
          : { top: box.bottom + gap }),
      }}
      className={cn(
        floating,
        "z-50 overflow-y-auto overscroll-contain rounded-xl border-border/40 p-1 shadow-xl backdrop-blur-xl",
        "animate-in duration-150 ease-out zoom-in-95 fade-in motion-reduce:animate-none",
        className
      )}
      {...props}
    >
      {children}
    </div>,
    document.body
  )
}

export function SlashMenuGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="slash-menu-group-label"
      role="presentation"
      className={cn(
        "px-2 pt-2 pb-1 text-[11px] font-medium text-muted-foreground/70",
        className
      )}
      {...props}
    />
  )
}

/**
 * One command. Highlighted by the keyboard as much as by the pointer, so
 * moving with the arrows and moving with the mouse look like the same thing.
 *
 * The name holds its width and the description gives way, which is the other
 * way round from a mention row. A name is what the row is for — a command
 * cropped to "/rev" is unreadable — while a description clipped at the fold
 * still says most of what it came to say.
 */
export function SlashMenuItem<
  Field extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>({
  command,
  controller,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  command: SlashCommand
  controller: SlashCommandsController<Field>
  children?: React.ReactNode
}) {
  const { matches, index, setIndex, accept, listId, trigger } = controller
  const position = matches.findIndex((match) => match.id === command.id)
  const highlighted = position === index

  return (
    <div
      data-slot="slash-menu-item"
      id={`${listId}-${command.id}`}
      role="option"
      aria-selected={highlighted}
      data-highlighted={highlighted || undefined}
      onPointerMove={() => {
        if (position >= 0 && position !== index) setIndex(position)
      }}
      onClick={() => accept(command)}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors duration-100 select-none",
        "data-highlighted:bg-foreground/[0.06] dark:data-highlighted:bg-foreground/[0.09]",
        "motion-reduce:transition-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {command.icon ? (
            // A square rather than the mention menu's disc: what is in it is a
            // glyph for a thing done, not a face.
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground/[0.06] text-muted-foreground dark:bg-foreground/[0.09]">
              {command.icon}
            </span>
          ) : null}
          <span className="flex shrink-0 items-center gap-1.5">
            <span className={cn(mono, "font-medium")}>
              {trigger}
              {command.name}
            </span>
            {command.argument ? (
              <span className={cn(mono, "text-muted-foreground/60")}>
                {command.argument}
              </span>
            ) : null}
          </span>
          {command.description ? (
            <span className="min-w-0 flex-1 truncate text-end text-muted-foreground">
              {command.description}
            </span>
          ) : null}
        </>
      )}
    </div>
  )
}

/** Shown in place of the list when nothing matches what is being typed. */
export function SlashMenuEmpty({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="slash-menu-empty"
      role="presentation"
      className={cn("px-2 py-3 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}
