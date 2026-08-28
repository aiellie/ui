"use client"

import { useCallback, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Layers01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { DemoCard } from "@/components/aiellie-ui/demo-card"
import { DemosSwitcher } from "@/components/aiellie-ui/demos-switcher"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { registryCategories } from "@/lib/categories"
import { cn } from "@/lib/utils"
import type { Example } from "@/registry/_demos"
import { slugFor } from "@/registry/_paths"

import { navButton } from "./nav-button"

/** A run of rail items under one label: a category, and what fell into it. */
type Group = {
  slug: string
  name: string
  icon: IconSvgElement
  examples: Example[]
}

/** One rail item, with the place it holds in the run it is standing in. */
type Item = {
  example: Example
  index: number
}

/**
 * The rail's two resting widths, in pixels. Anything between them is a size the
 * handle passes through rather than settles at, which is what makes a single
 * comparison enough to know which of the two the rail is in.
 */
const RAIL_COLLAPSED = 48
const RAIL_MIN = 176

/** The hairline only firms up under the pointer, so it reads as a divider first and a control second. */
const handle = "bg-border/50 transition-colors hover:bg-border active:bg-border"

/**
 * The bucket for an example whose categories name nothing visible. Its slug is
 * never a category's, so the two can't collide in the rail — it is a run of its
 * own at the foot of the list.
 */
const ungrouped = { slug: "ungrouped", name: "Other", icon: Layers01Icon }

/** The lit-while-current treatment both shapes of rail item share. */
const railCurrent = cn(
  "data-[active=true]:bg-muted data-[active=true]:text-foreground",
  "data-[active=true]:hover:bg-muted data-[active=true]:hover:text-foreground"
)

/**
 * The kit's ghost treatment again, re-shaped for a sidebar row: the header
 * nav's own button, stretched to the rail's width and set left. It keeps that
 * button's selected pill, so the two navs read as one system.
 */
const sidebarItem = cn(
  navButton,
  "h-7.5 w-full shrink-0 justify-start px-2 text-[13px] font-normal"
)

/**
 * The label a run stands under. The same mono-uppercase treatment the sections
 * once had, since it is doing the same job one rung further down: it names the
 * run rather than being something to press, so it takes the category's glyph
 * at a smaller, dimmer size than the items and carries their count.
 */
const sidebarLabel =
  "mb-1 flex shrink-0 items-center gap-1.5 px-2 font-mono text-[10px] tracking-[0.08em] text-foreground/30 uppercase"

/**
 * The page's examples split into the categories `lib/categories.ts` names, in
 * the order it names them. An example falls into the first category it carries,
 * so one listing several never appears twice; one that matches no visible
 * category is kept in a group of its own rather than going missing, which is
 * the same reason `registry/_demos.ts` warns instead of dropping.
 *
 * A category holding nothing gets no run at all: the sidebar shows what the
 * page has, not everything the registry could name.
 */
function groupsFor(examples: Example[]): Group[] {
  const taken = new Set<string>()
  const groups: Group[] = []

  for (const category of registryCategories) {
    if (category.hidden) continue

    const items = examples.filter(
      (example) =>
        !taken.has(example.name) && example.categories.includes(category.slug)
    )
    if (!items.length) continue

    for (const example of items) taken.add(example.name)
    groups.push({
      slug: category.slug,
      name: category.name,
      icon: category.icon,
      examples: items,
    })
  }

  const rest = examples.filter((example) => !taken.has(example.name))
  if (rest.length) groups.push({ ...ungrouped, examples: rest })

  return groups
}

/**
 * One example resolved out of the page's list, with the place it holds in its
 * own run — so a card is numbered from one inside its category rather than on
 * down the page, the way the grid used to number it.
 */
function itemFor(examples: Example[], slug: string): Item | undefined {
  for (const group of groupsFor(examples)) {
    const index = group.examples.findIndex(
      (example) => slugFor(example.name) === slug
    )
    if (index >= 0) return { example: group.examples[index], index: index + 1 }
  }
}

/**
 * The card for one example, which is what a route under `/elements` or
 * `/design` puts on the stage. The list is searched here rather than handed the
 * example, because only this side of the RSC boundary can hold one: a variant
 * carries its demo *component*, and a function cannot cross it.
 *
 * A slug with no card behind it renders nothing rather than throwing — the
 * route has already turned an unknown one away, so what is left is an example
 * that is registered but has no demo, which `registry/_demos.ts` drops and
 * warns about in dev.
 */
function ExampleCard({
  examples,
  slug,
}: {
  examples: Example[]
  slug: string
}) {
  const item = useMemo(() => itemFor(examples, slug), [examples, slug])
  if (!item) return null

  const { example, index } = item

  return (
    <DemoCard
      href={example.href}
      index={index}
      title={example.title}
      description={example.description}
      icon={example.icon}
    >
      <DemosSwitcher
        variants={example.variants}
        installCommand={example.installCommand}
        demoInstallCommand={example.demoInstallCommand}
        fullscreenHref={example.fullscreenHref}
      />
    </DemoCard>
  )
}

/**
 * A page's examples behind a rail of all of them, labelled by the category each
 * fell into, with the one being read beside it. Which examples arrive here is
 * the page's business — `/design` passes the token ones, `/elements` the rest —
 * so a new demo needs an item in `registry/_examples-registry.ts`, its
 * components in `registry/_demos.ts`, a category in `lib/categories.ts` if it
 * carries a new one, and nothing here.
 *
 * The items are links to real URLs (`/elements/bubble`), so this belongs in a
 * *layout* rather than a page: a layout is what survives a navigation between
 * two of them, which is what keeps the rail's scroll position and the width you
 * dragged it to from being thrown away on every click.
 *
 * The two are a resizable group rather than a fixed column and the rest,
 * because the reading shifts: a long list wants the names wide enough to read
 * whole, a demo wants everything the window has. It divides a frame the page
 * gives it, the same way `/agents` does — given the document's height the
 * panels would grow with the page instead of splitting it, and the handle would
 * have nothing to move.
 */
function ExamplesBrowser({
  examples,
  children,
}: {
  examples: Example[]
  children: ReactNode
}) {
  const groups = useMemo(() => groupsFor(examples), [examples])
  const pathname = usePathname()

  /* Dragged past its minimum the rail collapses to a strip of glyphs, so what
     it is showing has to be known here and not just in CSS: the two shapes are
     different markup, not one restyled.

     Measured off the rail itself rather than taken from the panel's `onResize`,
     which reports a drag long after the width it is reporting has been applied
     — the shape would go on lagging the box it is drawn in. A callback ref
     rather than an effect, so the observer is attached to whatever node is
     actually mounted and torn down with it. */
  const [collapsed, setCollapsed] = useState(false)
  const measure = useCallback((node: HTMLElement | null) => {
    if (!node) return

    const observer = new ResizeObserver(([entry]) => {
      /* The border box, not `contentRect`: the rail's own padding changes with
         the shape, so the content width would answer a question about the box
         with a measure of what is left after it. */
      const width =
        entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width
      setCollapsed(width < RAIL_MIN)
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <ResizablePanelGroup orientation="horizontal">
      {/* The rail is a nav of destinations now, so the items are links marked
          `aria-current` — a modified click opens one in a tab, and the one you
          are reading has a URL to send someone. Each run is a group of its own
          so its label names the items it stands over, rather than floating
          above the whole list. */}
      <ResizablePanel
        id="examples"
        collapsible
        collapsedSize={RAIL_COLLAPSED}
        defaultSize={240}
        minSize={RAIL_MIN}
        maxSize={384}
      >
        {/* The scrolling lives on the nav rather than the panel: a panel is
            left `overflow: visible` by the library, and a rail listing every
            example the page has is taller than the frame. `h-full` is what
            gives it something to overflow.

            `relative` is load-bearing, not decoration. Collapsed, every item
            carries its name in an `sr-only` span, and `sr-only` is
            `position: absolute` — with no positioned ancestor those spans hang
            off the initial containing block, where no `overflow` between here
            and the page can clip them, and the document grows to the height of
            a list that is supposed to be scrolling inside this box. Making the
            rail their containing block puts them back inside what clips
            them. */}
        <nav
          ref={measure}
          aria-label="Examples"
          data-collapsed={collapsed}
          className={cn(
            "relative flex h-full flex-col gap-5 overflow-x-hidden overflow-y-auto py-4",
            collapsed ? "items-center px-2" : "px-4"
          )}
        >
          {groups.map((group) => (
            <div
              key={group.slug}
              role="group"
              aria-label={group.name}
              className="flex shrink-0 flex-col gap-0.5"
            >
              {/* aria-hidden either way: the run is already named by
                  `aria-label` above, so the label would only say it twice.
                  Collapsed it keeps the glyph alone — the run still has to be
                  told from the one above it, and the names are on the items'
                  tooltips by then. */}
              {collapsed ? (
                <span
                  aria-hidden
                  className="mb-1 flex h-4 items-center justify-center text-foreground/25"
                >
                  <HugeiconsIcon
                    icon={group.icon}
                    strokeWidth={2}
                    className="size-3"
                  />
                </span>
              ) : (
                <span aria-hidden className={sidebarLabel}>
                  <HugeiconsIcon
                    icon={group.icon}
                    strokeWidth={2}
                    className="size-3 shrink-0"
                  />
                  {group.name}
                  <span className="ms-auto ps-2 tracking-tight tabular-nums">
                    {String(group.examples.length).padStart(2, "0")}
                  </span>
                </span>
              )}
              {group.examples.map((example) => {
                const current = pathname === example.href
                const glyph = (
                  <HugeiconsIcon
                    icon={example.icon}
                    strokeWidth={2}
                    className="size-3.5 shrink-0"
                  />
                )

                return collapsed ? (
                  <TooltipIconButton
                    key={example.name}
                    tooltip={example.title}
                    side="right"
                    /* The rail item is a link wherever it is drawn, collapsed
                       or not. `nativeButton={false}` is Base UI being told so:
                       left true it expects a real `<button>` in `render` and
                       warns that it is handing an anchor button semantics it
                       cannot keep. */
                    render={<Link href={example.href} />}
                    nativeButton={false}
                    data-active={current}
                    aria-current={current ? "page" : undefined}
                    className={cn("size-7.5 rounded-md", railCurrent)}
                  >
                    {glyph}
                  </TooltipIconButton>
                ) : (
                  <Link
                    key={example.name}
                    href={example.href}
                    data-active={current}
                    aria-current={current ? "page" : undefined}
                    className={sidebarItem}
                  >
                    {glyph}
                    <span className="min-w-0 truncate">{example.title}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </ResizablePanel>

      <ResizableHandle withHandle className={handle} />

      <ResizablePanel id="stage" defaultSize="80" minSize="40">
        <div className="h-full overflow-y-auto px-6 py-4">
          {/* Keyed on the route so moving between examples re-mounts the card
              and it fades in, rather than the card swapping its contents in
              place. */}
          <div
            key={pathname}
            className="min-w-0 animate-in duration-300 fade-in motion-reduce:animate-none"
          >
            {children}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export { ExamplesBrowser, ExampleCard }
