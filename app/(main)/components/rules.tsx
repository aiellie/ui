"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { Tabs } from "@base-ui/react/tabs"
import {
  BlueprintIcon,
  Book02Icon,
  Cancel01Icon,
  DocumentCodeIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { ghostButton, paper } from "@/components/aiellie-ui/actions"
import { cn } from "@/lib/utils"

import { Markdown } from "./markdown"
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
}

/**
 * The tab treatment from `FloatingToolbarTab`, re-shaped for a panel header.
 *
 * The data-scoped hover rules are not redundant: `ghostButton` ends in a plain
 * `hover:` tint that the selected tab would otherwise fade to on pointer-over.
 * These outrank it on specificity, so the accent holds.
 */
const documentTab = cn(
  ghostButton,
  "h-7 shrink-0 cursor-pointer gap-1.5 rounded-lg px-2 font-mono text-[11px] font-medium whitespace-nowrap",
  "data-selected:bg-accent/5 data-selected:text-accent",
  "data-selected:hover:bg-accent/5 data-selected:hover:text-accent",
  "dark:data-selected:hover:bg-accent/5"
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
  if (!first) return null

  return (
    <Dialog.Root>
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
        {/* The viewport centres the panel with flex rather than a translated
            offset, so nothing has to know which way the document runs. */}
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Popup
            data-slot="rules-panel"
            className={cn(
              paper,
              "flex max-h-[min(46rem,100%)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl",
              "transition-[opacity,scale] duration-150 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none data-closed:scale-95 data-closed:opacity-0"
            )}
          >
            <Tabs.Root
              defaultValue={first.name}
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
                  {docs.map((doc) => (
                    <Tabs.Tab
                      key={doc.name}
                      value={doc.name}
                      data-slot="rules-tab"
                      className={documentTab}
                    >
                      <HugeiconsIcon
                        icon={glyphs[doc.name] ?? Book02Icon}
                        strokeWidth={1.75}
                        className="size-3.5"
                      />
                      {doc.title}
                    </Tabs.Tab>
                  ))}
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

              {docs.map((doc) => (
                <Tabs.Panel
                  key={doc.name}
                  value={doc.name}
                  data-slot="rules-document"
                  // A hidden panel is unmounted, so switching documents starts
                  // the new one at the top rather than at the last one's
                  // scroll position, and the fade replays each time.
                  className="min-h-0 flex-1 animate-in overflow-y-auto overscroll-contain px-5 py-5 duration-300 fill-mode-both outline-none fade-in focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-inset motion-reduce:animate-none sm:px-6 sm:py-6"
                >
                  <Markdown source={doc.source} />
                </Tabs.Panel>
              ))}
            </Tabs.Root>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { Rules }
export type { RuleDoc }
