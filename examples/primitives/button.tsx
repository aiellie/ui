"use client"

import {
  ArrowRight02Icon,
  Copy01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"

/** Every emphasis, quietest last — the order a screen should use them in. */
export function ButtonDemo() {
  return (
    <div className="flex max-w-sm flex-wrap items-center justify-center gap-2">
      <Button>Send</Button>
      <Button variant="secondary">Duplicate</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="ghost">Dismiss</Button>
      <Button variant="link">Learn more</Button>
    </div>
  )
}

export function ButtonSizesDemo() {
  return (
    <div className="flex max-w-sm flex-wrap items-center justify-center gap-2">
      <Button size="xs" variant="outline">
        Extra small
      </Button>
      <Button size="sm" variant="outline">
        Small
      </Button>
      <Button variant="outline">Default</Button>
      <Button size="lg" variant="outline">
        Large
      </Button>
    </div>
  )
}

/**
 * `data-icon="inline-start"` is what pulls the padding in on the icon's side,
 * so a labelled button with a glyph does not sit lopsided in its box. The
 * square `icon-*` sizes are the ones the toolbars and the scroller stand on.
 */
export function ButtonIconsDemo() {
  return (
    <div className="flex max-w-sm flex-wrap items-center justify-center gap-2">
      <Button>
        <HugeiconsIcon
          icon={PlusSignIcon}
          strokeWidth={2}
          data-icon="inline-start"
        />
        New thread
      </Button>
      <Button variant="outline">
        Continue
        <HugeiconsIcon
          icon={ArrowRight02Icon}
          strokeWidth={2}
          data-icon="inline-end"
        />
      </Button>
      <Button size="icon-xs" variant="ghost" aria-label="Copy">
        <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
      </Button>
      <Button size="icon-sm" variant="ghost" aria-label="Copy">
        <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
      </Button>
      <Button size="icon" variant="outline" aria-label="Copy">
        <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
      </Button>
    </div>
  )
}
