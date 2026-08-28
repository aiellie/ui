"use client"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
        <TooltipContent>
          Says the thing the label had no room for
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/** The panel keeps to the side it was given rather than picking its own. */
export function TooltipSidesDemo() {
  return (
    <TooltipProvider>
      <div className="grid max-w-sm grid-cols-2 gap-2">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger
              render={
                <Button variant="outline" className="capitalize">
                  {side}
                </Button>
              }
            />
            <TooltipContent side={side}>Held to the {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

/**
 * A key inside the panel takes the tooltip's own treatment — the surface
 * styles it for exactly this, so the shortcut reads as part of the hint.
 */
export function TooltipShortcutDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Search</Button>} />
        <TooltipContent>
          Search the thread
          <Kbd>⌘</Kbd>
          <Kbd>F</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
