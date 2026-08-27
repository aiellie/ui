"use client"

import { ExamplesGrid } from "@/app/(main)/components/examples-grid"
import { tokenExamples } from "@/registry/_demos"

/**
 * Every example carrying the "tokens" category, in registry order. Imported
 * here for the same reason as the elements grid: a variant's demo is a
 * function, so the list can't be passed in from a server component.
 */
function TokensGrid(
  props: Omit<React.ComponentProps<typeof ExamplesGrid>, "examples">
) {
  return <ExamplesGrid examples={tokenExamples} {...props} />
}

export { TokensGrid }
