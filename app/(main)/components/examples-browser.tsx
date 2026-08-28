"use client"

import { useMemo, useState } from "react"
import { Layers01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { DemoCard } from "@/components/aiellie-ui/demo-card"
import { DemosSwitcher } from "@/components/aiellie-ui/demos-switcher"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { registryCategories } from "@/lib/categories"
import { cn } from "@/lib/utils"
import type { Example } from "@/registry/_demos"

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

/** The hairline only firms up under the pointer, so it reads as a divider first and a control second. */
const handle = "bg-border/50 transition-colors hover:bg-border active:bg-border"

/**
 * The bucket for an example whose categories name nothing visible. Its slug is
 * never a category's, so the two can't collide in the rail — it is a run of its
 * own at the foot of the list.
 */
const ungrouped = { slug: "ungrouped", name: "Other", icon: Layers01Icon }

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
 * Every rail item in the order the rail draws them, each carrying its place
 * within its own run — so a card is numbered from one inside its category
 * rather than on down the page, the way the grid used to number it.
 */
function itemsFor(groups: Group[]): Item[] {
  return groups.flatMap((group) =>
    group.examples.map((example, index) => ({ example, index: index + 1 }))
  )
}

/**
 * The selected example, with the stage to itself. One card rather than a grid:
 * the rail names every example the page has now, so picking one is asking to
 * look at that one.
 */
function ExampleStage({ example, index }: Item) {
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
 * fell into, one example on screen at a time. Which examples arrive here is the
 * page's business — `/design` passes the token ones, `/elements` the rest — so
 * a new demo needs an item in `registry/_examples-registry.ts`, its components
 * in `registry/_demos.ts`, a category in `lib/categories.ts` if it carries a
 * new one, and nothing here.
 *
 * The two are a resizable group rather than a fixed column and the rest,
 * because the reading shifts: a long list wants the names wide enough to read
 * whole, a demo wants everything the window has. It divides a frame the page
 * gives it, the same way `/agents` does — given the document's height the
 * panels would grow with the page instead of splitting it, and the handle would
 * have nothing to move.
 *
 * The selection is state rather than a route: the rail moves within one page,
 * and the card beside it is already client-side.
 */
function ExamplesBrowser({ examples }: { examples: Example[] }) {
  const groups = useMemo(() => groupsFor(examples), [examples])
  const items = useMemo(() => itemsFor(groups), [groups])
  const [selected, setSelected] = useState(() => items[0]?.example.name)

  /* Falling back keeps the stage filled if the selected name ever goes away —
     the page's list changing under a selection made against the old one. */
  const current =
    items.find((item) => item.example.name === selected) ?? items[0]

  if (!current) return null

  return (
    <ResizablePanelGroup orientation="horizontal">
      {/* The rail is a nav of filters, not of destinations, so the items are
          buttons marked `aria-current` rather than links — and not tabs, whose
          role promises arrow-key navigation between them. Each run is a group
          of its own so its label names the items it stands over, rather than
          floating above the whole list. */}
      <ResizablePanel id="examples" defaultSize="20" minSize="14" maxSize="34">
        {/* The scrolling lives on the nav rather than the panel: a panel is
            left `overflow: visible` by the library, and a rail listing every
            example the page has is taller than the frame. `h-full` is what
            gives it something to overflow. */}
        <nav
          aria-label="Examples"
          className="flex h-full flex-col gap-5 overflow-y-auto px-4 py-4"
        >
          {groups.map((group) => (
            <div
              key={group.slug}
              role="group"
              aria-label={group.name}
              className="flex shrink-0 flex-col gap-0.5"
            >
              {/* aria-hidden: the run is already named by `aria-label` above,
                  so the label would only say it twice. */}
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
              {group.examples.map((example) => {
                const active = example.name === current.example.name

                return (
                  <button
                    key={example.name}
                    type="button"
                    onClick={() => setSelected(example.name)}
                    data-active={active}
                    aria-current={active ? "true" : undefined}
                    className={sidebarItem}
                  >
                    <HugeiconsIcon
                      icon={example.icon}
                      strokeWidth={2}
                      className="size-3.5 shrink-0"
                    />
                    <span className="min-w-0 truncate">{example.title}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
      </ResizablePanel>

      <ResizableHandle withHandle className={handle} />

      <ResizablePanel id="stage" defaultSize="80" minSize="40">
        <div className="h-full overflow-y-auto px-6 py-4">
          {/* Keyed on the example so switching re-mounts the card and it fades
              in, rather than the card swapping its contents in place. */}
          <div
            key={current.example.name}
            className="min-w-0 animate-in duration-300 fade-in motion-reduce:animate-none"
          >
            <ExampleStage {...current} />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export { ExamplesBrowser }
