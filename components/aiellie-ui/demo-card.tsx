"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type DemoCardProps = {
  /** The row across the card's top — a `DemoToolbar`, or nothing. */
  toolbar?: React.ReactNode
  wide?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * The stage an example is shown on, and nothing else: what it is called and
 * what it is for is a caption's business, not the frame's.
 *
 * It takes the height it is given rather than a height of its own, so a page
 * that hands it the window gets a demo the size of the window. Its parent has
 * to have a height for that to mean anything — `h-full` against an auto-height
 * parent resolves to auto, and the frame collapses to its contents.
 */
function DemoCard({
  toolbar,
  wide = false,
  className,
  children,
}: DemoCardProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true)
          observer.disconnect()
        }
      },
      { rootMargin: "240px 0px" }
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return (
    /* min-w-0: a grid item's automatic minimum is its content's min-content
       width, so a demo sized to its own maximum — the code block's max-w-lg —
       would widen the track it sits in rather than being held by it, taking
       the whole grid past the viewport on a narrow screen. */
    <div
      ref={rootRef}
      data-slot="demo-card"
      className={cn(
        /* Named so `DemoToolbar` can hang its reveal off the whole card
           rather than off the preview box alone. */
        "group/demo-card flex h-full min-w-0 flex-col",
        wide && "md:col-span-2",
        className
      )}
    >
      {/* The frame is the border and the corners; what is inside it is a
          header and a stage, so the toolbar can run edge to edge under its own
          hairline rather than floating in the demo's padding. */}
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        {toolbar}
        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-dotted p-6 md:p-10">
          {mounted ? (
            <div className="flex h-full min-h-0 w-full items-center justify-center">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export { DemoCard }
export type { DemoCardProps }
