"use client"

import { ExamplesSections } from "@/app/(main)/components/examples-sections"
import { tokenExamples } from "@/registry/_demos"

/**
 * Every example carrying the "tokens" category, under a heading per category.
 * Imported here for the same reason as the elements sections: a variant's demo
 * is a function, so the list can't be passed in from a server component.
 */
function TokensSections() {
  return <ExamplesSections examples={tokenExamples} />
}

export { TokensSections }
