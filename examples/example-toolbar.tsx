"use client"

import * as React from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  FloatingToolbar,
  FloatingToolbarTab,
  FloatingToolbarTabs,
} from "@/components/aiellie-ui/floating-toolbar"
import { cn } from "@/lib/utils"

type ExampleTab = {
  value: string
  label: string
  icon?: IconSvgElement
  content: React.ReactNode
}

type ExampleToolbarProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  tabs: ExampleTab[]
  /** Extra classes for the scrolling panel below the strip. */
  contentClassName?: string
}

/**
 * A `FloatingToolbar` of tabs over a scrolling panel — one tab per example
 * section, so a card shows a single section at a time instead of every one
 * stacked.
 *
 * The pill wraps rather than scrolls: a tab hidden off the edge is a tab
 * nobody clicks, and the labels are short enough to afford the extra row.
 */
function ExampleToolbar({
  tabs,
  className,
  contentClassName,
  children,
  ...props
}: ExampleToolbarProps) {
  const [selected, setSelected] = React.useState(0)
  // Tabs can change between renders, so never index past the end.
  const active = Math.min(selected, Math.max(tabs.length - 1, 0))
  const panelRef = React.useRef<HTMLDivElement>(null)

  function selectTab(index: number) {
    setSelected(index)
    // A new section starts at the top; carrying the old offset over would drop
    // the reader into the middle of it.
    panelRef.current?.scrollTo({ top: 0 })
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)} {...props}>
      {tabs.length > 1 ? (
        <div className="flex shrink-0 border-b px-3 py-2.5">
          <FloatingToolbar aria-label="Sections" className="max-w-full">
            <FloatingToolbarTabs aria-label="Section" className="flex-wrap">
              {tabs.map((tab, index) => (
                <FloatingToolbarTab
                  key={tab.value}
                  active={index === active}
                  aria-controls={`example-panel-${tab.value}`}
                  onClick={() => selectTab(index)}
                >
                  {tab.icon ? (
                    <HugeiconsIcon
                      icon={tab.icon}
                      strokeWidth={2}
                      className="me-1.5 size-3.5"
                    />
                  ) : null}
                  {tab.label}
                </FloatingToolbarTab>
              ))}
            </FloatingToolbarTabs>
          </FloatingToolbar>
        </div>
      ) : null}
      <div
        ref={panelRef}
        data-slot="example-content"
        id={tabs[active] ? `example-panel-${tabs[active].value}` : undefined}
        // `min-h-0` is what lets this shrink inside the flex column and scroll,
        // rather than pushing the card past its max height.
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-5",
          contentClassName
        )}
      >
        {children}
        {tabs[active]?.content}
      </div>
    </div>
  )
}

export { ExampleToolbar }
export type { ExampleTab, ExampleToolbarProps }
