"use client"

import { ExamplesBrowser } from "@/app/(main)/components/examples-browser"
import { tokenExamples } from "@/registry/_demos"

/**
 * Every example carrying a token category, behind a rail of them. Imported here
 * for the same reason as the elements rail: a variant's demo is a function, so
 * the list can't be passed in from a server component.
 */
function TokensBrowser() {
  return <ExamplesBrowser examples={tokenExamples} />
}

export { TokensBrowser }
