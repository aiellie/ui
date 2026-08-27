"use client"

import { ExamplesGrid } from "@/app/(main)/components/examples-grid"
import { elementExamples } from "@/registry/_demos"

/**
 * Every example that isn't a token, in registry order. The list is imported
 * here rather than handed down from the page because a variant carries its
 * demo *component*, and a function can't cross into a client component — so
 * the data has to be pulled in on this side of the boundary.
 */
function ElementsGrid(
  props: Omit<React.ComponentProps<typeof ExamplesGrid>, "examples">
) {
  return <ExamplesGrid examples={elementExamples} {...props} />
}

export { ElementsGrid }
