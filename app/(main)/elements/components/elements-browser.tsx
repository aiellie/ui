"use client"

import type { ReactNode } from "react"

import {
  ExampleCard,
  ExamplesBrowser,
} from "@/app/(main)/components/examples-browser"
import type { ElementDoc } from "@/components/aiellie-ui/element-docs"
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

/**
 * The card on the stage, resolved from the slug the route was asked for.
 *
 * The docs come the other way — resolved by the route, on the server, and
 * handed through as plain data. They are a hundred kilobytes of props tables
 * across the whole registry, and only the one being read is ever wanted, so
 * they are passed rather than imported here the way the demos have to be.
 */
function ElementCard({ slug, docs }: { slug: string; docs?: ElementDoc }) {
  return <ExampleCard examples={examplesWithDemos} slug={slug} docs={docs} />
}

export { ElementsBrowser, ElementCard }
