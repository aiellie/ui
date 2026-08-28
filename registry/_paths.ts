import type { RegistryItem } from "shadcn/schema"

import {
  pathFor,
  registryCategories,
  sectionFor,
  type SectionSlug,
} from "@/lib/categories"

/**
 * The one place a registry item's name is turned into a URL. Kept apart from
 * `_demos.ts` because the routes need it on the server, where pulling that file
 * in would drag every demo component along with it — and because a link and the
 * route answering it should be the one convention rather than two that can
 * drift.
 */

/** The name is the item's, minus the suffix: `colors-demo` → `colors`. */
export function slugFor(name: string) {
  return name.replace(/-demo$/, "")
}

/**
 * Where an example is read: the page its categories put it on, and its own
 * slug under that — `bubble-demo` in `chat` → `/elements/bubble`. It is what
 * the rail links to and what a card's caption points at, so the two agree by
 * construction.
 */
export function hrefFor(name: string, categories: string[]) {
  return `${pathFor(categories)}/${slugFor(name)}`
}

/**
 * The route that hands one example the whole viewport, which the toolbar's
 * fullscreen button opens: `colors-demo` → `/demo/colors`. The page under
 * `app/demo/[name]` resolves the slug back with `slugFor`.
 */
export function fullscreenHrefFor(name: string) {
  return `/demo/${slugFor(name)}`
}

/**
 * The example the rail stands first under its first label, which is where a
 * bare `/elements` or `/design` sends you. It walks the categories in the
 * rail's order rather than the registry's, so the address you land on is the
 * item the rail lights — the two orders are not the same, and the registry's is
 * the wrong one to answer with.
 */
export function firstItemIn(items: RegistryItem[], section: SectionSlug) {
  const inSection = items.filter(
    (item) => (sectionFor(item.categories ?? []) ?? "elements") === section
  )

  for (const category of registryCategories) {
    if (category.hidden || category.section !== section) continue

    const found = inSection.find((item) =>
      item.categories?.includes(category.slug)
    )
    if (found) return found
  }

  /* Nothing named a category of this section's, so what is left is the rail's
     trailing "Other" run — still this page's, and still first in it. */
  return inSection[0]
}
