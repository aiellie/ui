"use client"

import { ExamplesBrowser } from "@/app/(main)/components/examples-browser"
import { examplesWithDemos } from "@/registry/_demos"

/**
 * Every example there is, behind the rail. The list is imported here rather
 * than handed down from the page because a variant carries its demo
 * *component*, and a function can't cross into a client component — so the data
 * has to be pulled in on this side of the boundary.
 */
function DesignBrowser() {
  return <ExamplesBrowser examples={examplesWithDemos} />
}

export { DesignBrowser }
