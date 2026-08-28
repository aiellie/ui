import type { RegistryItem } from "shadcn/schema"

import { registryCategories } from "@/lib/categories"

/**
 * The one place a registry item's name is turned into a URL. Kept apart from
 * `_demos.ts` because the routes need it on the server, where pulling that file
 * in would drag every demo component along with it — and because a link and the
 * route answering it should be the one convention rather than two that can
 * drift.
 */

/** Every example is read under this one. */
export const basePath = "/elements"

/** The name is the item's, minus the suffix: `bubble-demo` → `bubble`. */
export function slugFor(name: string) {
  return name.replace(/-demo$/, "")
}

/**
 * Where an example is read: `bubble-demo` → `/elements/bubble`. It is what the
 * rail links to and what a card's caption points at, so the two agree by
 * construction.
 */
export function hrefFor(name: string) {
  return `${basePath}/${slugFor(name)}`
}

/**
 * The route that hands one example the whole viewport, which the toolbar's
 * fullscreen button opens: `bubble-demo` → `/demo/bubble`. The page under
 * `app/demo/[name]` resolves the slug back with `slugFor`.
 */
export function fullscreenHrefFor(name: string) {
  return `/demo/${slugFor(name)}`
}

/**
 * The example the rail stands first under its first label, which is where a
 * bare `/elements` sends you. It walks the categories in the rail's order
 * rather than the registry's, so the address you land on is the item the rail
 * lights — the two orders are not the same, and the registry's is the wrong one
 * to answer with.
 */
export function firstItem(items: RegistryItem[]) {
  for (const category of registryCategories) {
    if (category.hidden) continue

    const found = items.find((item) => item.categories?.includes(category.slug))
    if (found) return found
  }

  /* Nothing named a visible category, so what is left is the rail's trailing
     "Other" run — still first in it. */
  return items[0]
}
