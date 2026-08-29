"use client"

import { BubbleChatTemporaryIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/components/aiellie-ui/composer/empty-state"

/**
 * The greeting on its own, centred in whatever room it is handed — the mark and
 * the words an opening screen leads with, before a composer and its prompts are
 * arranged beneath them.
 */
export function EmptyStateDemo() {
  return (
    <EmptyState className="min-h-64">
      <EmptyStateMedia>
        <HugeiconsIcon icon={BubbleChatTemporaryIcon} />
      </EmptyStateMedia>
      <EmptyStateTitle>Where would you like to start?</EmptyStateTitle>
      <EmptyStateDescription>
        Ask about the rollout, the thread, or anything else in the project.
      </EmptyStateDescription>
    </EmptyState>
  )
}
