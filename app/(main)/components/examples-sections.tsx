"use client"

import { HugeiconsIcon } from "@hugeicons/react"

import { DemoCard } from "@/components/aiellie-ui/demo-card"
import { DemosSwitcher } from "@/components/aiellie-ui/demos-switcher"
import { Separator } from "@/components/ui/separator"
import { registryCategories } from "@/lib/categories"
import type { Example } from "@/registry/_demos"

/**
 * Numbered once for the whole page rather than per section, so the count reads
 * straight on down the page instead of restarting under every heading.
 */
type NumberedExample = { example: Example; index: number }

const dashed = "border-t border-dashed border-border bg-transparent"

/**
 * The page's examples split into the categories `lib/categories.ts` names, in
 * the order it names them. An example falls into the first category it carries,
 * so one listing several never appears twice; one that matches no visible
 * category is kept in a trailing section of its own rather than going missing,
 * which is the same reason `registry/_demos.ts` warns instead of dropping.
 */
function sectionsFor(examples: Example[]) {
  const numbered: NumberedExample[] = examples.map((example, index) => ({
    example,
    index: index + 1,
  }))

  const taken = new Set<string>()
  const sections: {
    category: (typeof registryCategories)[number]
    items: NumberedExample[]
  }[] = []

  for (const category of registryCategories) {
    if (category.hidden) continue

    const items = numbered.filter(
      ({ example }) =>
        !taken.has(example.name) && example.categories.includes(category.slug)
    )
    if (!items.length) continue

    for (const { example } of items) taken.add(example.name)
    sections.push({ category, items })
  }

  return {
    sections,
    ungrouped: numbered.filter(({ example }) => !taken.has(example.name)),
  }
}

/** The cards of one section, in the order the registry lists them. */
function ExamplesGrid({ items }: { items: NumberedExample[] }) {
  return (
    <div
      data-slot="examples-grid"
      className="mt-6 grid items-start gap-x-6 gap-y-12 md:grid-cols-2"
    >
      {items.map(({ example, index }) => (
        <DemoCard
          key={example.name}
          href={example.href}
          index={index}
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
 * A page's examples under a heading per category. Which examples arrive here is
 * the page's business — `/tokens` passes the token ones, `/elements` the rest —
 * so a new demo needs an item in `registry/_examples-registry.ts`, its
 * components in `registry/_demos.ts`, and nothing here.
 */
function ExamplesSections({ examples }: { examples: Example[] }) {
  const { sections, ungrouped } = sectionsFor(examples)

  return (
    <>
      {sections.map(({ category, items }) => (
        <section key={category.slug} className="mt-12">
          <Separator className={dashed} />
          <div className="mt-4 flex items-center gap-2">
            <HugeiconsIcon
              icon={category.icon}
              strokeWidth={2}
              className="size-3.5 text-foreground/40"
            />
            <h2 className="text-[13px] font-normal">{category.name}</h2>
            <span className="ms-auto font-mono text-[11px] tracking-tight text-foreground/30 tabular-nums">
              {String(items.length).padStart(2, "0")}
            </span>
          </div>
          <ExamplesGrid items={items} />
        </section>
      ))}
      {ungrouped.length > 0 ? (
        <section className="mt-12">
          <Separator className={dashed} />
          <ExamplesGrid items={ungrouped} />
        </section>
      ) : null}
    </>
  )
}

export { ExamplesSections }
