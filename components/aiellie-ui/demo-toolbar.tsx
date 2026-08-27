"use client"

import Link from "next/link"
import {
  ArrowLeft01Icon,
  Cancel01Icon,
  FullScreenIcon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  FloatingToolbar,
  FloatingToolbarButton,
  FloatingToolbarSeparator,
  FloatingToolbarTab,
  FloatingToolbarTabs,
} from "@/components/aiellie-ui/floating-toolbar"

type DemoToolbarProps = {
  variants: string[]
  active: number
  onActiveChange: (index: number) => void
  /** Source or detail route, opened by the code button. */
  href?: string
  backHref?: string
  fullscreenHref?: string
  fullscreen?: boolean
  title?: string
  className?: string
}

function DemoToolbar({
  variants,
  active,
  onActiveChange,
  href,
  backHref,
  fullscreenHref,
  fullscreen = false,
  title,
  className,
}: DemoToolbarProps) {
  const hasLead = backHref != null || title != null
  const hasTabs = variants.length > 1
  const hasTrail = href != null || fullscreenHref != null

  return (
    <FloatingToolbar aria-label={title ?? "Demo"} className={className}>
      {backHref ? (
        <FloatingToolbarButton tooltip="Back" render={<Link href={backHref} />}>
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={2}
            className="size-3.5"
          />
        </FloatingToolbarButton>
      ) : null}
      {title ? (
        <span className="px-2 text-[11px] font-medium whitespace-nowrap">
          {title}
        </span>
      ) : null}
      {hasLead && hasTabs ? <FloatingToolbarSeparator /> : null}
      {hasTabs ? (
        <FloatingToolbarTabs>
          {variants.map((name, index) => (
            <FloatingToolbarTab
              key={name}
              active={index === active}
              onClick={() => onActiveChange(index)}
            >
              {name}
            </FloatingToolbarTab>
          ))}
        </FloatingToolbarTabs>
      ) : null}
      {hasTrail && (hasTabs || hasLead) ? <FloatingToolbarSeparator /> : null}
      {href ? (
        <FloatingToolbarButton
          tooltip="View source"
          render={<Link href={href} />}
        >
          <HugeiconsIcon
            icon={SourceCodeIcon}
            strokeWidth={2}
            className="size-3.5"
          />
        </FloatingToolbarButton>
      ) : null}
      {fullscreenHref ? (
        <FloatingToolbarButton
          tooltip={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          render={<Link href={fullscreenHref} />}
        >
          <HugeiconsIcon
            icon={fullscreen ? Cancel01Icon : FullScreenIcon}
            strokeWidth={2}
            className="size-3.5"
          />
        </FloatingToolbarButton>
      ) : null}
    </FloatingToolbar>
  )
}

export { DemoToolbar }
export type { DemoToolbarProps }
