"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * A chat, framed: somewhere to put a thread, a composer under it, and a strip
 * across the top saying whose thread it is.
 *
 * This is the frame and nothing else — it holds no messages, owns no state and
 * knows nothing about what a message is. Its whole job is the shape a chat
 * takes: a header that stays, a middle that scrolls, and a foot that does not
 * move when the middle grows.
 */
export function ChatCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-card"
      className={cn(
        "grid h-96 w-full grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl border border-border/60 bg-background",
        // A card with a thread in it is a small window onto a page, so it takes
        // the page's own surface in dark rather than sitting on top of it.
        "dark:bg-input/20",
        className
      )}
      {...props}
    />
  )
}

export function ChatCardHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="chat-card-header"
      className={cn(
        "flex min-h-11 items-center gap-2 border-b border-border/60 px-3 py-2",
        className
      )}
      {...props}
    />
  )
}

export function ChatCardTitle({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="chat-card-title"
      className={cn("truncate text-xs font-medium", className)}
      {...props}
    />
  )
}

export function ChatCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="chat-card-description"
      className={cn("truncate text-[11px] text-muted-foreground", className)}
      {...props}
    />
  )
}

/** The controls at the end of the header, kept off the title's width. */
export function ChatCardActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-card-actions"
      className={cn("ms-auto flex shrink-0 items-center gap-1", className)}
      {...props}
    />
  )
}

export interface ChatCardThreadProps extends React.ComponentProps<"div"> {
  /**
   * Keep the newest message in view as the thread grows. Held back the moment
   * the reader scrolls up: following is a convenience, and yanking somebody
   * back to the bottom while they are reading is not.
   */
  follow?: boolean
}

/**
 * The middle, and the only part that scrolls.
 *
 * For a thread with a jump-to-latest button, an anchored turn and the rest of
 * it, put a `message-scroller` in here instead — this is the small version, for
 * a scene a few messages long.
 */
export function ChatCardThread({
  follow = true,
  className,
  children,
  ...props
}: ChatCardThreadProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const region = ref.current
    if (!region || !follow) return undefined

    function toBottom() {
      const box = ref.current
      if (!box) return
      // Near enough counts: a reader a line or two off the end is still at the
      // end, and a thread that only follows from exactly the bottom stops
      // following the first time a message half-scrolls it.
      const distance = box.scrollHeight - box.scrollTop - box.clientHeight
      if (distance < 80) box.scrollTop = box.scrollHeight
    }

    toBottom()

    // Both, because a thread grows two ways: a message is added, and a message
    // already there gets taller as its text streams in.
    const observer = new ResizeObserver(toBottom)
    for (const child of region.children) observer.observe(child)
    const mutations = new MutationObserver(() => {
      toBottom()
      for (const child of region.children) observer.observe(child)
    })
    mutations.observe(region, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [follow])

  return (
    <div
      ref={ref}
      data-slot="chat-card-thread"
      className={cn(
        "flex min-h-0 flex-col gap-3 overflow-y-auto overscroll-contain p-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * The foot, where the composer goes. Bordered off from the thread so a message
 * scrolling past it is clearly behind the field rather than next to it.
 */
export function ChatCardFooter({
  className,
  ...props
}: React.ComponentProps<"footer">) {
  return (
    <footer
      data-slot="chat-card-footer"
      className={cn(
        "flex flex-col gap-2 border-t border-border/60 p-3",
        className
      )}
      {...props}
    />
  )
}
