"use client"

import { ExamplesBrowser } from "@/app/(main)/components/examples-browser"
import { tokenExamples } from "@/registry/_demos"

/**
 * The token examples, behind a rail of their categories. The list is imported
 * here rather than handed down from the page because a variant carries its demo
 * *component*, and a function can't cross into a client component — so the data
 * has to be pulled in on this side of the boundary.
 */
function DesignBrowser() {
  return <ExamplesBrowser examples={tokenExamples} />
}

export { DesignBrowser }
