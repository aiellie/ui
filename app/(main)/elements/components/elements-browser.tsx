"use client"

import type { ReactNode } from "react"

import {
  ExampleCard,
  ExamplesBrowser,
} from "@/app/(main)/components/examples-browser"
import { examplesWithDemos } from "@/registry/_demos"

/**
 * Every example there is, behind a rail of their categories. The list
 * is imported here rather than handed down from the layout because a variant
 * carries its demo *component*, and a function can't cross into a client
 * component — so the data has to be pulled in on this side of the boundary.
 */
function ElementsBrowser({ children }: { children: ReactNode }) {
  return (
    <ExamplesBrowser examples={examplesWithDemos} noun="elements">
      {children}
    </ExamplesBrowser>
  )
}

/** The card on the stage, resolved from the slug the route was asked for. */
function ElementCard({ slug }: { slug: string }) {
  return <ExampleCard examples={examplesWithDemos} slug={slug} />
}

export { ElementsBrowser, ElementCard }
