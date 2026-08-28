"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { Tabs } from "@base-ui/react/tabs"
import {
  BlueprintIcon,
  Book02Icon,
  Cancel01Icon,
  CheckListIcon,
  DocumentCodeIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { ghostButton, paper } from "@/components/aiellie-ui/actions"
import { cn } from "@/lib/utils"

import { Markdown, countMatches } from "./markdown"
import { navButton } from "./nav-button"

/**
 * One of the repository's own documents, read off disk and handed over as
 * plain data.
 *
 * The type lives here rather than beside the reader because `rules-docs.ts`
 * touches `node:fs`: a client module importing anything but a type from it
 * would drag the file system into the browser bundle, and the failure would
 * surface as a build error a long way from its cause.
 */
interface RuleDoc {
  /** Stable key, also the tab's value and the glyph's lookup. */
  name: string
  /** The file's own name, which is what a reader would go looking for. */
  title: string
  source: string
}

/**
 * The site half of a document, in the same spirit as `exampleDemos`: the glyph
 * a card carries cannot be put in JSON, and a document read off disk cannot
 * carry an icon across the server boundary either, so the two are joined here
 * by name. A document with no glyph gets the generic one rather than nothing.
 */
const glyphs: Record<string, IconSvgElement> = {
  claude: DocumentCodeIcon,
  design: BlueprintIcon,
  todo: CheckListIcon,
}

/**
 * The tab treatment from `FloatingToolbarTab`, re-shaped for a panel header.
 *
 * Base UI writes the selected tab as a bare `data-active`, not `data-active="true"`
 * the way the nav button sets it by hand, so the variants here are the bare
 * form. The data-scoped hover rules are not redundant either: `ghostButton`
 * ends in a plain `hover:` tint that the selected tab would otherwise fade to
 * on pointer-over. These outrank it on specificity, so the accent holds.
 */
const documentTab = cn(
  ghostButton,
  "h-7 shrink-0 cursor-pointer gap-1.5 rounded-lg px-2 font-mono text-[11px] font-medium whitespace-nowrap",
  "data-active:bg-accent/5 data-active:text-accent",
  "data-active:hover:bg-accent/5 data-active:hover:text-accent",
  "dark:data-active:hover:bg-accent/5"
)

/** The count beside a tab, which is only ever there while something is typed. */
const tabCount = cn(
  "rounded-full bg-foreground/[0.06] px-1.5 text-[10px] leading-4 font-medium text-muted-foreground tabular-nums",
  "in-data-active:bg-accent/10 in-data-active:text-accent",
  "dark:bg-foreground/[0.09]"
)

/**
 * The rules the registry is built to, as a panel over whatever page is open.
 *
 * They are a dialog rather than a route because they are read against
 * something — a card you are looking at, an element you are about to add — and
 * a page would cost you your place in it. `modal` is left at its default so the
 * page behind stops scrolling while a long document is being read in front of
 * it.
 *
 * The surface is solid rather than glass. Glass says "floating over the page",
 * which is true of a menu and a toolbar, but a wall of prose needs its
 * background to hold still — a blurred page moving under a paragraph is the one
 * place the treatment costs more than it says.
 */
function Rules({
  docs,
  className,
  ...props
}: Omit<Dialog.Trigger.Props, "children"> & { docs: RuleDoc[] }) {
  const first = docs[0]
  const [active, setActive] = React.useState(first?.name ?? "")
  const [query, setQuery] = React.useState("")
  const search = React.useRef<HTMLInputElement>(null)

  /* Every document is counted, not just the one on screen: the point of
     searching three files at once is to be told the rule is in another one. */
  const counts = React.useMemo(
    () =>
      new Map(docs.map((doc) => [doc.name, countMatches(doc.source, query)])),
    [docs, query]
  )

  const searching = query.trim() !== ""
  const elsewhere = docs.filter(
    (doc) => doc.name !== active && (counts.get(doc.name) ?? 0) > 0
  )

  if (!first) return null

  const doc = docs.find((item) => item.name === active) ?? first
  const empty = searching && (counts.get(doc.name) ?? 0) === 0

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        // A search is about the reading in front of you, so it does not
        // outlive it — reopening the panel starts on the whole document again
        // rather than on last week's half-remembered query.
        if (!open) setQuery("")
      }}
    >
      <Dialog.Trigger
        data-slot="rules-trigger"
        className={cn(
          navButton,
          // Held open, the trigger should look pressed — the same treatment
          // `NavMenu` gives a trigger standing under its own menu.
          "data-popup-open:bg-foreground/[0.06] data-popup-open:text-foreground/90",
          "dark:data-popup-open:bg-foreground/[0.09]",
          className
        )}
        {...props}
      >
        <HugeiconsIcon
          icon={Book02Icon}
          strokeWidth={1.75}
          className="size-3.5"
        />
        {/* Below `sm` the header collapses to glyphs, but the label stays in
            the DOM so the control is still announced and still has a name. */}
        <span className="sr-only sm:not-sr-only">Rules</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop
          data-slot="rules-backdrop"
          className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-opacity duration-150 ease-out data-starting-style:opacity-0 motion-reduce:transition-none dark:bg-background/70 data-closed:opacity-0"
        />
        {/* Centred by `inset-0` and an auto margin rather than by a wrapper or
            a translated offset: a wrapper would take the outside clicks that
            have to reach the backdrop for the panel to dismiss, and a
            translation would have to know which way the document runs. */}
        <Dialog.Popup
          data-slot="rules-panel"
          className={cn(
            paper,
            "fixed inset-0 z-50 m-auto flex h-fit max-h-[min(46rem,calc(100dvh-2rem))] w-[calc(100%-2rem)] max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl",
            "transition-[opacity,scale] duration-150 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none data-closed:scale-95 data-closed:opacity-0"
          )}
        >
          <Tabs.Root
            value={active}
            onValueChange={(value) => setActive(String(value))}
            className="flex min-h-0 flex-1 flex-col"
          >
            <header className="flex shrink-0 items-center gap-2 border-b border-border/60 px-3 py-2">
              <Dialog.Title className="px-1 text-xs font-medium text-foreground max-sm:sr-only">
                Rules
              </Dialog.Title>
              {/* A row aligned in a bounded box hides its far end once the
                    content outgrows it, and `overflow-x-auto` clips vertically
                    too — hence the room given back as padding. */}
              <Tabs.List
                aria-label="Documents"
                className="-my-1 flex min-w-0 items-center gap-0.5 overflow-x-auto py-1"
              >
                {docs.map((item) => {
                  const found = counts.get(item.name) ?? 0

                  return (
                    <Tabs.Tab
                      key={item.name}
                      value={item.name}
                      data-slot="rules-tab"
                      className={cn(
                        documentTab,
                        // A document with nothing in it is still reachable —
                        // dimmed rather than disabled, because the reader is
                        // mid-word and the next keystroke may bring it back.
                        searching && found === 0 && "opacity-40"
                      )}
                    >
                      <HugeiconsIcon
                        icon={glyphs[item.name] ?? Book02Icon}
                        strokeWidth={1.75}
                        className="size-3.5"
                      />
                      {item.title}
                      {searching ? (
                        <span className={tabCount}>{found}</span>
                      ) : null}
                    </Tabs.Tab>
                  )
                })}
              </Tabs.List>
              <Dialog.Close
                aria-label="Close"
                className={cn(
                  ghostButton,
                  "ms-auto size-7 shrink-0 rounded-lg"
                )}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  strokeWidth={2}
                  className="size-4"
                />
              </Dialog.Close>
            </header>

            <Dialog.Description className="sr-only">
              The conventions this registry is built to, read from the
              repository&rsquo;s own documents.
            </Dialog.Description>

            {/* A bare field rather than a bordered one: the panel is already
                  a box divided by rules, and a second box inside it competes
                  with the reading for the edge it draws. */}
            <div className="flex shrink-0 items-center gap-2 border-b border-border/60 px-4 py-2">
              <HugeiconsIcon
                icon={Search01Icon}
                strokeWidth={1.75}
                className="size-4 shrink-0 text-muted-foreground/70"
                aria-hidden
              />
              <InputPrimitive
                ref={search}
                // `role` rather than `type="search"`, which reads the same to
                // a screen reader but hands WebKit both the Escape key and a
                // clear cross of its own.
                type="text"
                role="searchbox"
                data-slot="rules-search"
                value={query}
                // `Escape` closes the panel, which is the wrong thing to do
                // to someone clearing a search — so the field takes the first
                // press and hands the second on.
                onKeyDown={(event) => {
                  if (event.key === "Escape" && query !== "") {
                    event.stopPropagation()
                    setQuery("")
                  }
                }}
                onChange={(event) => {
                  setQuery(event.target.value)
                  // The results changed under the reader, so the scroll they
                  // had is no longer a position in anything. Done here rather
                  // than in an effect: it answers an event.
                  const body = document.querySelector(
                    '[data-slot="rules-document"]'
                  )
                  if (body) body.scrollTop = 0
                }}
                placeholder={`Search ${docs.length} documents`}
                aria-label="Search the rules"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              {/* Kept in the row at zero opacity rather than mounted on
                    demand, so the field does not change width on the first
                    keystroke. */}
              <button
                type="button"
                aria-label="Clear search"
                aria-hidden={!searching}
                tabIndex={searching ? undefined : -1}
                onClick={() => {
                  setQuery("")
                  search.current?.focus()
                }}
                className={cn(
                  ghostButton,
                  "size-6 shrink-0 rounded-md transition-opacity duration-150 motion-reduce:transition-none",
                  !searching && "pointer-events-none opacity-0"
                )}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
              </button>
            </div>

            {docs.map((item) => (
              <Tabs.Panel
                key={item.name}
                value={item.name}
                data-slot="rules-document"
                // A hidden panel is unmounted, so switching documents starts
                // the new one at the top rather than at the last one's
                // scroll position, and the fade replays each time.
                className="min-h-0 flex-1 animate-in overflow-y-auto overscroll-contain px-5 py-5 duration-300 fill-mode-both outline-none fade-in focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-inset motion-reduce:animate-none sm:px-6 sm:py-6"
              >
                {empty ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      strokeWidth={1.5}
                      className="size-5 text-muted-foreground/60"
                      aria-hidden
                    />
                    <p className="text-sm text-muted-foreground">
                      Nothing in {item.title} for &ldquo;{query.trim()}
                      &rdquo;.
                    </p>
                    {/* The search already knows where the answer is, so it
                          says so rather than leaving the reader to try each
                          tab in turn. */}
                    {elsewhere.length > 0 ? (
                      <p className="flex flex-wrap items-center justify-center gap-1 text-xs text-muted-foreground">
                        <span>Found in</span>
                        {elsewhere.map((other) => (
                          <button
                            key={other.name}
                            type="button"
                            onClick={() => setActive(other.name)}
                            className="cursor-pointer rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-foreground/80 transition-colors hover:bg-foreground/[0.1] motion-reduce:transition-none dark:bg-foreground/[0.09]"
                          >
                            {other.title} ({counts.get(other.name)})
                          </button>
                        ))}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <Markdown
                    source={item.source}
                    query={query}
                    // The mark is a highlight rather than a fill: a solid
                    // block of colour behind a run of words takes them out
                    // of the paragraph they belong to.
                    className="[&_mark]:rounded-sm [&_mark]:bg-accent/15 [&_mark]:px-0.5 [&_mark]:text-foreground"
                  />
                )}
              </Tabs.Panel>
            ))}
          </Tabs.Root>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { Rules }
export type { RuleDoc }
