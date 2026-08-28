"use client"

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

export interface PaneProps {
  icon: IconSvgElement
  title: string
  /** The controls at the end of the header row. */
  actions?: React.ReactNode
  /** Pinned under the body, for a composer or anything else that stays put. */
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

/**
 * One region of the workspace, in the shape `ChatCard` gives a chat: a header
 * that stays, a middle that takes the rest, and a foot that does not move when
 * the middle grows.
 *
 * The middle sets no overflow of its own. What goes in it is already a
 * scroller — a thread, an empty state, a list — and a second one wrapped round
 * it only adds a scrollbar that never moves. It is `min-h-0` so those can
 * measure themselves against the row rather than against their contents.
 */
function Pane({
  icon,
  title,
  actions,
  footer,
  children,
  className,
}: PaneProps) {
  return (
    <section className={cn("grid h-full grid-rows-[auto_1fr_auto]", className)}>
      <header className="flex h-9 shrink-0 items-center gap-2 border-b border-border/40 px-3">
        <HugeiconsIcon
          icon={icon}
          strokeWidth={2}
          className="size-3.5 shrink-0 text-foreground/40"
        />
        <h2 className="truncate text-[12.5px] font-medium">{title}</h2>
        {actions ? (
          <div className="ms-auto flex shrink-0 items-center gap-1">
            {actions}
          </div>
        ) : null}
      </header>
      <div className="min-h-0">{children}</div>
      {footer ? (
        <div className="border-t border-border/40 p-3">{footer}</div>
      ) : null}
    </section>
  )
}

/** Placeholder for a region that has nothing in it yet. */
function PaneEmpty({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 py-2.5 text-[12.5px] text-foreground/35">{children}</p>
  )
}

export { Pane, PaneEmpty }
