"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { openCommandMenu } from "@/components/aiellie-ui/command-menu"
import { MeshGradientBackground } from "@/components/aiellie-ui/mesh-gradient"
import { Kbd } from "@/components/ui/kbd"

/**
 * The front door as a poster: the house indigo moving, one sentence, and the
 * two ways in — search everything, or walk the shelves. Nothing else. The
 * elements make their own case on their own pages; a homepage restating them
 * in miniature was three demos fighting for a glance, and the glance lost.
 *
 * A client file because the search trigger opens the palette the header
 * mounts, and the gradient is a shader.
 */
export function Home() {
  return (
    <div className="h-[calc(100svh-var(--header-height))] w-full">
      <MeshGradientBackground
        speed={0.4}
        className="h-full rounded-none border-0"
      >
        <div className="flex h-full items-center justify-center p-6">
          {/* The same glass every popup on the site wears, holding the words
              still while the wash moves. */}
          <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-border/40 bg-background/70 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10 dark:bg-popover/70">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              aiellie ui
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              The elements an AI chat is made of.
            </h1>

            <button
              type="button"
              onClick={openCommandMenu}
              className="flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl border border-border/60 bg-background/60 px-3.5 text-sm text-muted-foreground transition-colors hover:bg-background/80 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none"
            >
              <HugeiconsIcon
                aria-hidden
                icon={Search01Icon}
                strokeWidth={1.75}
                className="size-4 shrink-0"
              />
              <span className="flex-1 text-start">Search the elements…</span>
              <Kbd>⌘K</Kbd>
            </button>

            <Link
              href="/elements"
              className="group flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80 motion-reduce:transition-none"
            >
              Browse the elements
              <HugeiconsIcon
                aria-hidden
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </Link>
          </div>
        </div>
      </MeshGradientBackground>
    </div>
  )
}
