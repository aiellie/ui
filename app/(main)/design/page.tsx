import { redirect } from "next/navigation"

import { examples } from "@/registry/_examples-registry"
import { firstItemIn, hrefFor } from "@/registry/_paths"

/**
 * Every token is read at a URL of its own, so the bare route sends you to the
 * first one rather than being a second address for it. Matched against the
 * plain registry: this half of the route only needs the name and its
 * categories, and `registry/_demos.ts` would drag every demo component in.
 */
export default function Page() {
  const first = firstItemIn(examples, "tokens")
  if (!first) return null

  redirect(hrefFor(first.name, first.categories ?? []))
}
