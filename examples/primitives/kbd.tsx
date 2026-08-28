"use client"

import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function KbdDemo() {
  return (
    <div className="flex max-w-sm flex-wrap items-center justify-center gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⌃</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>Tab</Kbd>
      <Kbd>⏎</Kbd>
    </div>
  )
}

/** A chord is one gesture, so the keys share one group rather than a row. */
export function KbdGroupDemo() {
  return (
    <div className="flex max-w-sm flex-col items-center gap-3">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>⌃</Kbd>
        <Kbd>C</Kbd>
      </KbdGroup>
    </div>
  )
}

/** Held to the line height, so a key named mid-sentence does not push it. */
export function KbdSentenceDemo() {
  return (
    <p className="max-w-sm text-sm leading-relaxed text-pretty text-foreground">
      Press{" "}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{" "}
      to open the palette, <Kbd>Esc</Kbd> to put it away, and <Kbd>⏎</Kbd> to
      take whatever it is offering.
    </p>
  )
}
