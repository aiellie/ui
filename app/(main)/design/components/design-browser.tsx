"use client"

import type { ReactNode } from "react"

import {
  ExampleCard,
  ExamplesBrowser,
} from "@/app/(main)/components/examples-browser"
import { tokenExamples } from "@/registry/_demos"

/**
 * The token examples, behind a rail of their categories. The list is imported
 * here rather than handed down from the layout because a variant carries its
 * demo *component*, and a function can't cross into a client component — so the
 * data has to be pulled in on this side of the boundary.
 */
function DesignBrowser({ children }: { children: ReactNode }) {
  return <ExamplesBrowser examples={tokenExamples}>{children}</ExamplesBrowser>
}

/** The card on the stage, resolved from the slug the route was asked for. */
function TokenCard({ slug }: { slug: string }) {
  return <ExampleCard examples={tokenExamples} slug={slug} />
}

export { DesignBrowser, TokenCard }
