"use client"

import * as React from "react"

import {
  MicMenu,
  MicMenuContent,
  MicMenuTrigger,
} from "@/components/aiellie-ui/audio/mic-menu"
import { TooltipProvider } from "@/components/ui/tooltip"

/**
 * The system's own input list. Until the page has been granted the
 * microphone once the browser blanks the names — the menu numbers them
 * honestly and offers the one-tap grant that reveals them.
 */
export function MicMenuDemo() {
  const [device, setDevice] = React.useState("")

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-2">
        <MicMenu value={device} onValueChange={setDevice}>
          <MicMenuTrigger showLabel />
          <MicMenuContent />
        </MicMenu>
        <p className="max-w-60 text-center text-[11px] text-muted-foreground">
          {device
            ? "Chosen for the next call."
            : "The system default, until one is chosen."}
        </p>
      </div>
    </TooltipProvider>
  )
}
