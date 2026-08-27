"use client"

import { useMemo, useState } from "react"
import { Layers01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { DemoCard } from "@/components/aiellie-ui/demo-card"
import { DemosSwitcher } from "@/components/aiellie-ui/demos-switcher"
import { Separator } from "@/components/ui/separator"
import {
  registryCategories,
  registrySections,
  type SectionSlug,
} from "@/lib/categories"
import { cn } from "@/lib/utils"
import type { Example } from "@/registry/_demos"

import { navButton } from "./nav-button"

/** One item in the rail: a category, and the examples that fell into it. */
type Group = {
  slug: string
  name: string
  icon: IconSvgElement
  section: SectionSlug | null
  examples: Example[]
}

/** A run of rail items under one label — a section's, or none. */
type Run = {
  key: string
  label: string | null
  groups: Group[]
}

const dashed = "border-t border-dashed border-border bg-transparent"

/**
 * The bucket for an example whose categories name nothing visible. Its slug is
 * never a category's, so the two can't collide in the rail, and it belongs to
 * no section — it is a run of its own at the foot of the list.
 */
const ungrouped = { slug: "ungrouped", name: "Other", icon: Layers01Icon }

/**
 * The kit's ghost treatment again, re-shaped for a sidebar row: the header
 * nav's own button, stretched to the rail's width and set left. It keeps that
 * button's selected pill, so the two navs read as one system.
 *
 * Below `md` the rail is a scrolling row instead, where a stretched item would
 * be wrong — hence `md:w-full` rather than `w-full`.
 */
const sidebarItem = cn(
  navButton,
  "h-7.5 shrink-0 justify-start px-2 text-[13px] font-normal md:w-full"
)

/**
 * The page's examples split into the categories `lib/categories.ts` names, in
 * the order it names them. An example falls into the first category it carries,
 * so one listing several never appears twice; one that matches no visible
 * category is kept in a group of its own rather than going missing, which is
 * the same reason `registry/_demos.ts` warns instead of dropping.
 *
 * A category holding nothing gets no rail item: the sidebar shows what the page
 * has, not everything the registry could name.
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
      section: category.section,
      examples: items,
    })
  }

  const rest = examples.filter((example) => !taken.has(example.name))
  if (rest.length) groups.push({ ...ungrouped, section: null, examples: rest })

  return groups
}

/**
 * The rail as it is drawn: the sections `lib/categories.ts` names, in its
 * order, each holding the categories that named it, with the sectionless bucket
 * last under no label at all. An empty section is left out rather than left
 * standing as a heading over nothing.
 */
function runsFor(groups: Group[]): Run[] {
  const runs: Run[] = registrySections.map((section) => ({
    key: section.slug,
    label: section.name,
    groups: groups.filter((group) => group.section === section.slug),
  }))

  runs.push({
    key: "ungrouped",
    label: null,
    groups: groups.filter((group) => group.section === null),
  })

  return runs.filter((run) => run.groups.length > 0)
}

/**
 * The cards of the selected category, in the order the registry lists them.
 * Numbered from one within the category rather than on down the page, since a
 * category is now all that is on screen at a time.
 */
function ExamplesGrid({ examples }: { examples: Example[] }) {
  return (
    <div
      data-slot="examples-grid"
      className="grid items-start gap-x-6 gap-y-12 md:grid-cols-2"
    >
      {examples.map((example, index) => (
        <DemoCard
          key={example.name}
          href={example.href}
          index={index + 1}
          title={example.title}
          description={example.description}
          icon={example.icon}
          wide={example.wide}
        >
          <DemosSwitcher
            variants={example.variants}
            installCommand={example.installCommand}
            demoInstallCommand={example.demoInstallCommand}
          />
        </DemoCard>
      ))}
    </div>
  )
}

/**
 * Every example behind a rail of the categories they fall into, labelled by
 * section, one category's grid at a time. What arrives here is the whole
 * registry: a new demo needs an item in `registry/_examples-registry.ts`, its
 * components in `registry/_demos.ts`, a category in `lib/categories.ts` if it
 * carries a new one, and nothing here.
 *
 * The selection is state rather than a route: the rail moves within one page,
 * and the cards under it are already client-side.
 */
function ExamplesBrowser({ examples }: { examples: Example[] }) {
  const runs = useMemo(() => runsFor(groupsFor(examples)), [examples])
  const groups = useMemo(() => runs.flatMap((run) => run.groups), [runs])
  const [selected, setSelected] = useState(() => groups[0]?.slug)

  /* Falling back keeps the grid filled if the selected slug ever goes away —
     the page's list changing under a selection made against the old one. */
  const group = groups.find((item) => item.slug === selected) ?? groups[0]

  if (!group) return null

  return (
    <div className="mt-10">
      <Separator className={dashed} />
      <div className="mt-6 flex flex-col gap-6 md:flex-row md:gap-10">
        {/* The rail is a nav of filters, not of destinations, so the items are
            buttons marked `aria-current` rather than links — and not tabs,
            whose role promises arrow-key navigation between them. Each run is
            a group of its own so its label names the items it stands over,
            rather than floating above the whole list. */}
        <nav
          aria-label="Categories"
          className="-mx-4 px-4 md:mx-0 md:w-44 md:shrink-0 md:px-0"
        >
          {/* Sticky only from `md` up: as a row above the grid it would sit
              over the cards it scrolls past, having no ground of its own to
              hide them behind. `top-15` clears the sticky site header. */}
          <div className="flex gap-3 overflow-x-auto pb-1 md:sticky md:top-15 md:flex-col md:gap-5 md:overflow-visible md:pb-0">
            {runs.map((run) => (
              <div
                key={run.key}
                role="group"
                aria-label={run.label ?? undefined}
                className="flex shrink-0 items-center gap-1 md:flex-col md:items-stretch md:gap-0.5"
              >
                {run.label ? (
                  /* aria-hidden: the run is already named by `aria-label`
                     above, so the heading would only say it twice. */
                  <span
                    aria-hidden
                    className="shrink-0 px-2 font-mono text-[10px] tracking-[0.08em] text-foreground/30 uppercase md:mb-1"
                  >
                    {run.label}
                  </span>
                ) : null}
                {run.groups.map((item) => {
                  const current = item.slug === group.slug

                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => setSelected(item.slug)}
                      data-active={current}
                      aria-current={current ? "true" : undefined}
                      className={sidebarItem}
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        strokeWidth={2}
                        className="size-3.5 shrink-0"
                      />
                      {item.name}
                      <span className="ms-auto ps-2 font-mono text-[11px] tracking-tight text-foreground/30 tabular-nums">
                        {String(item.examples.length).padStart(2, "0")}
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </nav>
        {/* Keyed on the category so switching re-mounts the grid and it fades
            in, rather than the cards swapping their contents in place. */}
        <div
          key={group.slug}
          className="min-w-0 flex-1 animate-in duration-300 fade-in motion-reduce:animate-none"
        >
          <ExamplesGrid examples={group.examples} />
        </div>
      </div>
    </div>
  )
}

export { ExamplesBrowser }
