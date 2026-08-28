"use client"

import { Calendar03Icon, StickyNote01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export function MarkerDemo() {
  return (
    <div className="w-full max-w-sm">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
    </div>
  )
}

/** The three treatments: bare, ruled out to either side, and underlined. */
export function MarkerVariantsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Marker>
        <MarkerContent>Yesterday</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>4 unread messages</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>Alex joined the thread</MarkerContent>
      </Marker>
    </div>
  )
}

export function MarkerIconDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Marker>
        <MarkerIcon>
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
        </MarkerIcon>
        <MarkerContent>Monday, 12 January</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <HugeiconsIcon icon={StickyNote01Icon} strokeWidth={2} />
        </MarkerIcon>
        <MarkerContent>
          The thread above was imported from the old workspace.
        </MarkerContent>
      </Marker>
    </div>
  )
}
