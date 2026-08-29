"use client"

import * as React from "react"
import { BubbleChatIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/components/aiellie-ui/composer/empty-state"
import { MeshGradientBackground } from "@/components/aiellie-ui/mesh-gradient"

/** The house indigo, folding over itself at a walking pace. */
export function MeshGradientDemo() {
  return <MeshGradientBackground className="max-w-lg" />
}

/**
 * What it is for: a wash to stand glass on. The panel above it borrows the
 * menus' own surface, so backdrop and card read as one design rather than a
 * screenshot with a widget pasted over it.
 */
export function MeshGradientBackdropDemo() {
  return (
    <MeshGradientBackground className="h-80 max-w-lg" speed={0.35}>
      <div className="flex h-full items-center justify-center p-6">
        <div className="w-full max-w-2xs rounded-2xl border border-white/30 bg-background/70 p-6 shadow-xl backdrop-blur-xl dark:bg-popover/70">
          <EmptyState size="sm">
            <EmptyStateMedia>
              <HugeiconsIcon icon={BubbleChatIcon} />
            </EmptyStateMedia>
            <EmptyStateTitle>Ask anything</EmptyStateTitle>
            <EmptyStateDescription>
              Glass over the gradient — the wash stays busy, the words stay
              still.
            </EmptyStateDescription>
          </EmptyState>
        </div>
      </div>
    </MeshGradientBackground>
  )
}
