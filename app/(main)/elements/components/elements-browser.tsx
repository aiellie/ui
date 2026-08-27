"use client"

import { ExamplesBrowser } from "@/app/(main)/components/examples-browser"
import { elementExamples } from "@/registry/_demos"

/**
 * Every example that isn't a token, behind a rail of its categories. The list
 * is imported here rather than handed down from the page because a variant
 * carries its demo *component*, and a function can't cross into a client
 * component — so the data has to be pulled in on this side of the boundary.
 */
function ElementsBrowser() {
  return <ExamplesBrowser examples={elementExamples} />
}

export { ElementsBrowser }
