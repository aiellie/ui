"use client"

import type { ComponentType } from "react"

import { cn } from "@/lib/utils"

interface DemoVariant {
  name: string
  demo: ComponentType
}

/**
 * One of a set of demos, shown. Which one is the caller's business rather than
 * this component's: the control that picks is a `DemoToolbar` standing in a
 * header of its own, and the two are siblings rather than one inside the other.
 *
 * Keyed on the index so switching re-mounts the demo and it arrives, rather
 * than the old one changing into the new.
 */
function DemosSwitcher({
  variants,
  active,
  className,
}: {
  variants: DemoVariant[]
  active: number
  className?: string
}) {
  const variant = variants[active] ?? variants[0]

  if (!variant) return null

  return (
    <div
      key={active}
      className={cn(
        "flex h-full min-h-0 w-full animate-in items-center justify-center duration-300 fill-mode-both zoom-in-95 fade-in motion-reduce:animate-none",
        className
      )}
    >
      <variant.demo />
    </div>
  )
}

export { DemosSwitcher }
export type { DemoVariant }
