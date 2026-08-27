"use client"

import { useState, type ComponentType } from "react"

import { DemoToolbar } from "@/components/aiellie-ui/demo-toolbar"
import { cn } from "@/lib/utils"

interface DemoVariant {
  name: string
  demo: ComponentType
}

function DemosSwitcher({
  variants,
  href,
  installCommand,
  demoInstallCommand,
  backHref,
  fullscreenHref,
  fullscreen,
  title,
  className,
}: {
  variants: DemoVariant[]
  href?: string
  installCommand?: string
  demoInstallCommand?: string
  backHref?: string
  fullscreenHref?: string
  fullscreen?: boolean
  title?: string
  className?: string
}) {
  const [active, setActive] = useState(0)
  const variant = variants[active] ?? variants[0]

  if (!variant) return null

  return (
    // Deliberately not `relative`: the toolbar's `absolute bottom-3` is meant to
    // anchor to the card's own preview box, so it floats near the frame's edge
    // rather than inside the box's padding.
    <div
      className={cn(
        "flex h-full min-h-0 w-full items-center justify-center",
        className
      )}
    >
      <div
        key={active}
        className="flex h-full min-h-0 w-full animate-in items-center justify-center duration-300 fill-mode-both zoom-in-95 fade-in motion-reduce:animate-none"
      >
        <variant.demo />
      </div>
      <DemoToolbar
        variants={variants.map((item) => item.name)}
        active={active}
        onActiveChange={setActive}
        href={href}
        installCommand={installCommand}
        demoInstallCommand={demoInstallCommand}
        backHref={backHref}
        fullscreenHref={fullscreenHref}
        fullscreen={fullscreen}
        title={title}
        className="absolute bottom-3 z-20"
      />
    </div>
  )
}

export { DemosSwitcher }
export type { DemoVariant }
