"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { paper } from "@/components/aiellie-ui/actions"
import { Kbd } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"

/**
 * Everything on the site, one keystroke away.
 *
 * ⌘K opens it from anywhere — any trigger on any page can too, through
 * `openCommandMenu`, so the header's search and a hero's search are the same
 * palette rather than two. Inside, one field filters everything at once:
 * the query is matched against names, categories and keywords, arrows walk
 * the flat result list across its group headings, and Enter goes.
 *
 * The wiring is the combobox contract, not a lookalike: the input names the
 * active option for assistive tech, the options really are options, and the
 * pointer and the keyboard move the same highlight — a row hovered is a row
 * Enter will take.
 */

export interface CommandItem {
  id: string
  label: string
  icon?: IconSvgElement
  /** The word at the row's end — a category, a section. */
  hint?: string
  /** Extra words the query may match that the label does not carry. */
  keywords?: string
  /** Chosen: either side-effect or destination; the caller decides which. */
  onSelect: () => void
}

export interface CommandGroup {
  label: string
  items: CommandItem[]
}

/* Any trigger, anywhere, opens the one palette: a module-scope channel
   rather than context, because the hero and the header do not share a tree
   worth threading for one verb. */
const channel = new EventTarget()

export function openCommandMenu() {
  channel.dispatchEvent(new Event("open"))
}

function matches(item: CommandItem, query: string) {
  const haystack =
    `${item.label} ${item.hint ?? ""} ${item.keywords ?? ""}`.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word))
}

export interface CommandMenuProps {
  groups: CommandGroup[]
  placeholder?: string
}

export function CommandMenu({
  groups,
  placeholder = "Search…",
}: CommandMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [active, setActive] = React.useState(0)
  const listRef = React.useRef<HTMLDivElement>(null)
  const listId = React.useId()

  React.useEffect(() => {
    const show = () => setOpen(true)
    const onKey = (event: KeyboardEvent) => {
      /* ⌘K everywhere, fields included — the shortcut is the palette's whole
         address, and a search that cannot be reached from a search box has
         misread why people press it. */
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    channel.addEventListener("open", show)
    window.addEventListener("keydown", onKey)
    return () => {
      channel.removeEventListener("open", show)
      window.removeEventListener("keydown", onKey)
    }
  }, [])

  const trimmed = query.trim()
  const filtered = groups
    .map((group) => ({
      label: group.label,
      items: trimmed
        ? group.items.filter((item) => matches(item, trimmed))
        : group.items,
    }))
    .filter((group) => group.items.length > 0)
  const flat = filtered.flatMap((group) => group.items)
  const current = Math.min(active, Math.max(0, flat.length - 1))

  const choose = (item: CommandItem) => {
    setOpen(false)
    item.onSelect()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      const step = event.key === "ArrowDown" ? 1 : -1
      const next = (current + step + flat.length) % Math.max(1, flat.length)
      setActive(next)
      listRef.current
        ?.querySelector(`[data-index="${next}"]`)
        ?.scrollIntoView({ block: "nearest" })
      return
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault()
      setActive(event.key === "Home" ? 0 : Math.max(0, flat.length - 1))
      return
    }
    if (event.key === "Enter" && flat[current]) {
      event.preventDefault()
      choose(flat[current])
    }
  }

  /* Indexed across the whole flat list so arrows sail through the group
     headings instead of stopping at each border. */
  let index = -1

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        // A fresh open starts a fresh search, exactly as the rules panel
        // reasons about its own query.
        if (!next) {
          setQuery("")
          setActive(0)
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop
          data-slot="command-menu-backdrop"
          className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-opacity duration-150 ease-out data-starting-style:opacity-0 motion-reduce:transition-none dark:bg-background/70 data-closed:opacity-0"
        />
        <Dialog.Popup
          data-slot="command-menu"
          aria-label="Site search"
          /* Held to the upper third rather than centred: a palette grows and
             shrinks with every keystroke, and anchoring its top edge keeps
             the input — the part being used — from jumping. */
          className={cn(
            paper,
            "fixed inset-x-4 top-[12svh] z-50 mx-auto flex max-h-[min(24rem,70svh)] w-auto max-w-lg flex-col overflow-hidden rounded-2xl shadow-2xl",
            "transition-[opacity,scale] duration-150 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none data-closed:scale-95 data-closed:opacity-0"
          )}
        >
          <Dialog.Title className="sr-only">Search the site</Dialog.Title>
          <div className="flex shrink-0 items-center gap-2 border-b border-border/60 px-3">
            <HugeiconsIcon
              aria-hidden
              icon={Search01Icon}
              strokeWidth={1.75}
              className="size-4 shrink-0 text-muted-foreground"
            />
            <input
              autoFocus
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-activedescendant={
                flat[current] ? `${listId}-${flat[current].id}` : undefined
              }
              aria-label="Search the site"
              placeholder={placeholder}
              spellCheck={false}
              autoComplete="off"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActive(0)
              }}
              onKeyDown={onKeyDown}
              className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Kbd className="max-sm:hidden">esc</Kbd>
          </div>

          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Results"
            className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-1.5"
          >
            {flat.length === 0 ? (
              <p className="px-2.5 py-6 text-center text-xs text-muted-foreground">
                Nothing matches “{trimmed}”.
              </p>
            ) : (
              filtered.map((group) => (
                <div key={group.label} role="group" aria-label={group.label}>
                  <p className="px-2.5 pt-1.5 pb-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    {group.label}
                  </p>
                  {group.items.map((item) => {
                    index += 1
                    const at = index
                    return (
                      <div
                        key={item.id}
                        id={`${listId}-${item.id}`}
                        role="option"
                        data-index={at}
                        aria-selected={at === current}
                        onMouseMove={() => setActive(at)}
                        onClick={() => choose(item)}
                        className={cn(
                          "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm",
                          at === current &&
                            "bg-foreground/[0.05] dark:bg-foreground/[0.08]"
                        )}
                      >
                        {item.icon ? (
                          <HugeiconsIcon
                            aria-hidden
                            icon={item.icon}
                            strokeWidth={1.75}
                            className="size-4 shrink-0 text-muted-foreground"
                          />
                        ) : null}
                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                        </span>
                        {item.hint ? (
                          <span className="shrink-0 text-[11px] text-muted-foreground/70">
                            {item.hint}
                          </span>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
