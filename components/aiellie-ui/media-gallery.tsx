"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * A run's results side by side, one of them chosen.
 *
 * Generators come back with variations, and the act the grid exists for is
 * picking: which of the four gets kept, upscaled, sent on. So every tile is a
 * real button, the chosen one wears the ring, and the choice itself lives
 * with the caller — picking a variation is usually the same event as doing
 * something with it, and a grid holding that state privately would only have
 * to hand it straight back.
 */

export interface MediaGalleryProps extends React.ComponentProps<"div"> {
  /** Columns at the grid's own width. Two reads as a contact sheet; four is
   * a filmstrip and wants the room to be one. */
  columns?: 2 | 3 | 4
}

export function MediaGallery({
  columns = 2,
  className,
  ...props
}: MediaGalleryProps) {
  return (
    <div
      data-slot="media-gallery"
      role="group"
      className={cn(
        "grid w-full gap-2",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-4",
        className
      )}
      {...props}
    />
  )
}

export interface MediaGalleryItemProps extends React.ComponentProps<"button"> {
  selected?: boolean
}

/**
 * One tile. The ring says chosen and `aria-pressed` says it out loud; the
 * media inside keeps its own corners clipped by the tile, so a `MediaFrame`
 * dropped straight in lines up without either knowing about the other.
 */
export function MediaGalleryItem({
  selected = false,
  className,
  children,
  ...props
}: MediaGalleryItemProps) {
  return (
    <button
      type="button"
      data-slot="media-gallery-item"
      data-selected={selected || undefined}
      aria-pressed={selected}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-xl transition-[box-shadow,opacity] duration-150 outline-none motion-reduce:transition-none",
        /* The ring rides inside the tile's own edge so neighbours never
           overlap it, and the unchosen dim a shade rather than the chosen
           one shouting — four bright tiles and one ring reads faster than
           three grey ones and a spotlight. */
        selected
          ? "ring-2 ring-primary ring-inset"
          : "opacity-80 hover:opacity-100 focus-visible:opacity-100",
        "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-inset",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
