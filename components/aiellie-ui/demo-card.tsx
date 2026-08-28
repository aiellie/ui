"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

type DemoCardProps = {
  href: string
  index: number
  title: string
  description: string
  /** Hugeicons glyph shown beside the title. */
  icon?: IconSvgElement
  wide?: boolean
  className?: string
  children: React.ReactNode
}

function DemoCard({
  href,
  index,
  title,
  description,
  icon,
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
       the whole grid past the viewport on a narrow screen. The detail route
       never shows it, since there the card is a plain block and simply
       inherits the page's width. */
    <div
      ref={rootRef}
      data-slot="demo-card"
      className={cn(
        /* Named so `DemoToolbar` can hang its reveal off the whole card —
           frame and caption both — rather than the preview box alone. */
        "group/demo-card flex min-w-0 flex-col",
        wide && "md:col-span-2",
        className
      )}
    >
      <div className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-2xl border bg-dotted p-6 md:p-10">
        {mounted ? (
          <div className="flex h-full min-h-0 w-full items-center justify-center">
            {children}
          </div>
        ) : null}
      </div>
    {/*  <Link href={href} className="group/link mt-4 flex items-baseline gap-2.5">
        <span className="font-mono text-[11px] tracking-tight text-foreground/30 tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
        {icon ? (
          <HugeiconsIcon
            icon={icon}
            strokeWidth={2}
            className="size-3.5 shrink-0 self-center text-foreground/40"
          />
        ) : null}
        <h3 className="text-[13.5px] font-medium group-hover/link:underline group-hover/link:underline-offset-4">
          {title}
        </h3>
      </Link>
      <p className="mt-1 text-[13px] leading-relaxed text-foreground/50">
        {description}
      </p>
      */}
    </div>
  )
}

export { DemoCard }
export type { DemoCardProps }
