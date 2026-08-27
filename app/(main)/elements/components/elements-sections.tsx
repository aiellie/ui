"use client"

import { ExamplesSections } from "@/app/(main)/components/examples-sections"
import { elementExamples } from "@/registry/_demos"

/**
 * Every example that isn't a token, under a heading per category. The list is
 * imported here rather than handed down from the page because a variant carries
 * its demo *component*, and a function can't cross into a client component — so
 * the data has to be pulled in on this side of the boundary.
 */
function ElementsSections() {
  return <ExamplesSections examples={elementExamples} />
}

export { ElementsSections }
