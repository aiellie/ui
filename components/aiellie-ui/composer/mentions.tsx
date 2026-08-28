"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { ArrowTurnBackwardIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { floating } from "@/components/aiellie-ui/actions"
import { cn } from "@/lib/utils"

export interface MentionItem {
  id: string
  /** What is shown, and what the query is matched against with the handle. */
  name: string
  /** What is written into the field, after the trigger. */
  handle: string
  description?: string
  /** The heading this one sits under. Items keep the order they arrive in. */
  group?: string
  icon?: React.ReactNode
}

/** Where the trigger sits in the text, and what has been typed since. */
type Active = { start: number; query: string }

/**
 * Reads the text behind the caret for a mention being typed. A trigger only
 * counts at the start of a word — an email address is not a mention — and the
 * query stops at whitespace, so the menu closes as soon as the writing moves on.
 */
function activeMention(
  value: string,
  caret: number,
  trigger: string
): Active | null {
  const before = value.slice(0, caret)
  const start = before.lastIndexOf(trigger)
  if (start < 0) return null

  const preceding = start === 0 ? "" : before[start - 1]
  if (preceding && !/\s/.test(preceding)) return null

  const query = before.slice(start + trigger.length)
  if (/\s/.test(query)) return null

  return { start, query }
}

function matchesFor(items: readonly MentionItem[], query: string) {
  if (!query) return items
  const needle = query.toLowerCase()

  // Prefix first: someone typing "ma" means Marta before they mean anyone with
  // an "ma" in the middle of a surname.
  const prefix: MentionItem[] = []
  const rest: MentionItem[] = []
  for (const item of items) {
    const name = item.name.toLowerCase()
    const handle = item.handle.toLowerCase()
    if (name.startsWith(needle) || handle.startsWith(needle)) prefix.push(item)
    else if (name.includes(needle) || handle.includes(needle)) rest.push(item)
  }
  return [...prefix, ...rest]
}

export interface UseMentionsOptions {
  value: string
  onValueChange: (value: string) => void
  items: readonly MentionItem[]
  trigger?: string
  /** What goes into the text. The handle with the trigger, unless told otherwise. */
  format?: (item: MentionItem) => string
}

/**
 * The behaviour half of a mention menu: what is being typed, what matches it,
 * which match is in hand, and what happens to the text when one is taken.
 *
 * A hook rather than a wrapper because the field belongs to whoever is using
 * this — a bare input, a textarea, a `MessageInputField`. Spread `fieldProps`
 * onto it and the keys, the roles and the caret all follow.
 */
export function useMentions<
  // The field this attaches to decides the type: an input by default, a
  // textarea when a composer grows into one.
  Field extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>({
  value,
  onValueChange,
  items,
  trigger = "@",
  format = (item) => `${trigger}${item.handle} `,
}: UseMentionsOptions) {
  const ref = React.useRef<Field>(null)
  // The mention being typed and the row in hand are one piece of state, not
  // two. They only ever change together — a new query starts at the first
  // match — and holding them apart is what lets a stray read send a highlight
  // home that nothing had asked to move.
  const [{ active, index }, setState] = React.useState<{
    active: Active | null
    index: number
  }>({ active: null, index: 0 })
  const listId = React.useId()

  const matches = React.useMemo(
    () => (active ? matchesFor(items, active.query) : []),
    [items, active]
  )
  // Open on the trigger rather than on the matches. A menu that disappears
  // when nothing matches reads as the at sign having stopped working, where
  // one saying nobody matched is an answer — and Enter goes back to being the
  // message's in that state rather than being swallowed by an empty list.
  const open = active !== null

  // The caret is on the element, not in the value: the same text can be typed
  // into two places and only the DOM knows which one is being written at.
  const read = React.useCallback(() => {
    const field = ref.current
    if (!field) return
    const caret = field.selectionStart ?? field.value.length
    const next = activeMention(field.value, caret, trigger)

    setState((previous) => {
      const same =
        previous.active && next
          ? previous.active.start === next.start &&
            previous.active.query === next.query
          : previous.active === next
      // Reading the same mention back is no reason to send the highlight home.
      // This runs on every key released — the arrows raise one too — so a read
      // that reset the row in hand would undo the press that moved it.
      return same ? previous : { active: next, index: 0 }
    })
  }, [trigger])

  const setIndex = React.useCallback(
    (next: number) => setState((previous) => ({ ...previous, index: next })),
    []
  )

  const dismiss = React.useCallback(
    () =>
      setState((previous) =>
        previous.active ? { active: null, index: 0 } : previous
      ),
    []
  )

  // Every row is in the list already — only the highlight moves — so the row
  // moved to can be brought into view now rather than a render later. Keys
  // only: doing this on hover would scroll the list out from under a pointer
  // that was merely passing over it.
  const highlight = React.useCallback(
    (next: number) => {
      setIndex(next)
      const item = matches[next]
      if (!item) return
      document
        .getElementById(`${listId}-${item.id}`)
        ?.scrollIntoView({ block: "nearest" })
    },
    [matches, listId, setIndex]
  )

  const accept = React.useCallback(
    (item: MentionItem) => {
      const field = ref.current
      if (!active || !field) return

      const caret = field.selectionStart ?? value.length
      const inserted = format(item)
      const next = value.slice(0, active.start) + inserted + value.slice(caret)

      onValueChange(next)
      setState({ active: null, index: 0 })

      // The caret goes after what was inserted rather than to the end: a
      // mention is often written into the middle of a sentence.
      const at = active.start + inserted.length
      requestAnimationFrame(() => {
        field.focus()
        field.setSelectionRange(at, at)
      })
    },
    [active, value, format, onValueChange]
  )

  const highlighted = matches[index]
  const activeId = highlighted ? `${listId}-${highlighted.id}` : undefined

  const fieldProps = {
    ref,
    // A field with a list attached to it is a combobox, and saying so is what
    // makes the arrow keys mean anything to a screen reader.
    role: "combobox" as const,
    "aria-expanded": open,
    "aria-controls": open ? listId : undefined,
    "aria-activedescendant": activeId,
    "aria-autocomplete": "list" as const,
    "aria-haspopup": "listbox" as const,
    onKeyDown: (event: React.KeyboardEvent<Field>) => {
      if (!open) return

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (!matches.length) return
        event.preventDefault()
        const step = event.key === "ArrowDown" ? 1 : -1
        // Wrapping, because a list this short is a ring rather than a page.
        highlight((index + step + matches.length) % matches.length)
        return
      }

      // Enter belongs to the menu while it has a name to take — the message is
      // not finished if the reader is halfway through naming somebody — and
      // goes straight back to the message when it has none.
      if (event.key === "Enter" || event.key === "Tab") {
        if (!highlighted) return
        event.preventDefault()
        accept(highlighted)
        return
      }

      if (event.key === "Escape") {
        event.preventDefault()
        dismiss()
      }
    },
    onKeyUp: read,
    onClick: read,
    // A menu left hanging over the page with nothing focused behind it is a
    // menu nobody asked for. Taking a name does not blur the field — the list
    // defaults its own presses away — so this only fires on leaving properly.
    onBlur: dismiss,
    onInput: read,
  }

  return {
    open,
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
    fieldProps,
  }
}

export type MentionsController<
  Field extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
> = ReturnType<typeof useMentions<Field>>

/**
 * The menu itself, over the field it belongs to.
 *
 * Fixed to the field's own box rather than dropped into the layout: a mention
 * menu opens over whatever is above the composer, and a menu that pushed the
 * thread up every time somebody typed an at sign would be unusable.
 *
 * Portalled to the body, and not optionally. `position: fixed` resolves against
 * the nearest ancestor carrying a transform, a filter or paint containment
 * rather than against the window — and a composer is very often inside one: a
 * card that animates in, a panel that blurs what is behind it. Rendered in
 * place, the menu is measured against the window and then positioned inside
 * that ancestor, which puts it somewhere else entirely and usually behind an
 * `overflow: hidden`.
 *
 * The press is defaulted away so choosing a name does not first take the caret
 * out of the field it is being written into.
 */
export function Mentions<
  Field extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>({
  controller,
  side = "top",
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  controller: MentionsController<Field>
  side?: "top" | "bottom"
  children: React.ReactNode
}) {
  const { open, listId, ref } = controller
  const [box, setBox] = React.useState<DOMRect | null>(null)

  React.useLayoutEffect(() => {
    if (!open) return undefined
    const field = ref.current
    if (!field) return undefined

    function measure() {
      const field = ref.current
      if (!field) return
      const next = field.getBoundingClientRect()
      // Scrolling anywhere on the page fires this every frame, and a fresh
      // rect is a fresh object however still the field has been. Without the
      // comparison the whole menu re-renders for a field that has not moved.
      setBox((previous) =>
        previous &&
        previous.top === next.top &&
        previous.left === next.left &&
        previous.width === next.width &&
        previous.height === next.height
          ? previous
          : next
      )
    }

    measure()
    // The window is not the only thing that moves the field: a composer grows
    // as it is written into, and the menu is stood on the field's own edge.
    const observer = new ResizeObserver(measure)
    observer.observe(field)
    window.addEventListener("resize", measure)
    window.addEventListener("scroll", measure, true)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", measure, true)
    }
  }, [open, ref])

  if (!open || !box) return null

  // The menu takes the room it has rather than the room it wants. A composer
  // usually sits at the foot of the page, so above is the right side to open
  // on — but a long list will run off the top of the window, and a menu whose
  // first names are unreachable is worse than one that opened downwards.
  const gap = 8
  const above = box.top - gap
  const below = window.innerHeight - box.bottom - gap
  const placement =
    side === "top" && above < Math.min(below, 160) ? "bottom" : side
  const room = placement === "top" ? above : below

  return createPortal(
    <div
      data-slot="mentions"
      id={listId}
      role="listbox"
      aria-label="Mentions"
      data-side={placement}
      onMouseDownCapture={(event) => event.preventDefault()}
      style={{
        position: "fixed",
        left: box.left,
        // The field's width, within reason: a menu drawn the full span of a
        // wide composer is a great deal of paper for six names.
        width: Math.min(Math.max(box.width, 240), 380),
        maxHeight: Math.max(Math.min(256, room), 96),
        ...(placement === "top"
          ? { bottom: window.innerHeight - box.top + gap }
          : { top: box.bottom + gap }),
      }}
      className={cn(
        floating,
        // `scroll-p-1` so a row brought into view stops inside the padding
        // rather than flush against the edge it was scrolled to.
        "z-50 scroll-p-1 overflow-y-auto overscroll-contain rounded-xl border-border/40 p-1 shadow-xl backdrop-blur-xl",
        // Grown out of the field rather than out of its own middle: the menu
        // belongs to the edge it opened from, whichever edge that turned out
        // to be.
        "animate-in duration-150 ease-out zoom-in-95 fade-in data-[side=bottom]:origin-top data-[side=bottom]:slide-in-from-top-1 data-[side=top]:origin-bottom data-[side=top]:slide-in-from-bottom-1 motion-reduce:animate-none",
        className
      )}
      {...props}
    >
      {children}
    </div>,
    document.body
  )
}

export function MentionsGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mentions-group-label"
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
 * A name with the part that was typed picked back out of it, so a list of six
 * near-identical handles says which one is answering the query.
 *
 * A `mark` because that is the element for text picked out for reference,
 * stripped of the yellow a browser would otherwise give it.
 */
export function MentionsMatch({
  text,
  query,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  text: string
  query: string
}) {
  const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1

  return (
    <span data-slot="mentions-match" className={className} {...props}>
      {at < 0 ? (
        text
      ) : (
        <>
          {text.slice(0, at)}
          <mark className="bg-transparent font-semibold text-foreground">
            {text.slice(at, at + query.length)}
          </mark>
          {text.slice(at + query.length)}
        </>
      )}
    </span>
  )
}

/**
 * One name. Highlighted by the keyboard as much as by the pointer, so moving
 * with the arrows and moving with the mouse look like the same thing.
 *
 * The icon sits in a round frame that clips and is positioned, so `icon` can be
 * a glyph, a pair of letters, or a picture laid over the letters it falls back
 * to while it loads or if it never arrives.
 */
export function MentionsItem<
  Field extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>({
  item,
  controller,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  item: MentionItem
  controller: MentionsController<Field>
  children?: React.ReactNode
}) {
  const { matches, index, setIndex, accept, listId, query } = controller
  const position = matches.findIndex((match) => match.id === item.id)
  const highlighted = position === index

  return (
    <div
      data-slot="mentions-item"
      id={`${listId}-${item.id}`}
      role="option"
      aria-selected={highlighted}
      data-highlighted={highlighted || undefined}
      onPointerMove={() => {
        if (position >= 0 && position !== index) setIndex(position)
      }}
      onClick={() => accept(item)}
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
          {item.icon ? (
            <span className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground/[0.06] text-muted-foreground dark:bg-foreground/[0.09]">
              {item.icon}
            </span>
          ) : null}
          <span className="min-w-0 truncate font-medium">
            <MentionsMatch text={item.name} query={query} />
          </span>
          {/* Takes what is left over and nothing else: sized from nought, it
              collapses when there is no room rather than taking the room the
              name needed — a row that answers "R…" has hidden the one thing
              the reader was scanning for. It is the spacer either way, so it
              is drawn whether or not there is a description to put in it. */}
          <span className="min-w-0 flex-1 truncate text-end text-muted-foreground">
            {item.description}
          </span>
          <span className="shrink-0 text-muted-foreground">
            @<MentionsMatch text={item.handle} query={query} />
          </span>
          {/* The key that takes the row, on the row it would take. Drawn on
              every row and hidden rather than mounted with the highlight, so
              the names do not shuffle sideways as it moves down them. */}
          <HugeiconsIcon
            icon={ArrowTurnBackwardIcon}
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-opacity duration-150 motion-reduce:transition-none",
              highlighted ? "opacity-100" : "opacity-0"
            )}
          />
        </>
      )}
    </div>
  )
}

/** Shown in place of the list when nothing matches what is being typed. */
export function MentionsEmpty({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mentions-empty"
      role="presentation"
      className={cn("px-2 py-3 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}
