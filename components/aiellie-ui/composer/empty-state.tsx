"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * What a screen says while there is nothing on it yet: a line to open with, and
 * a line under it saying what to do about that.
 *
 * Those two things and no more. An opening screen usually wants a composer, the
 * prompts on offer, whatever the conversation is set to across the top — but
 * where each of those sits is a property of the screen holding them rather than
 * of the greeting, and one component owning the layout of all of it could only
 * ever suit the screen it was written for. This fills the room it is given and
 * centres itself in it; put it in the middle of whatever frame you have, and
 * arrange the rest around it.
 *
 * Two sizes, because the greeting lives on two kinds of surface: a page, where
 * it is the only thing there and can speak up, and a card, where it shares a
 * few hundred pixels with an avatar and a composer and a page-sized heading
 * would shout the card down. The size rides on context so a caller sets it
 * once, on the root, and every part follows.
 */

type EmptyStateSize = "default" | "sm"

const SizeContext = React.createContext<EmptyStateSize>("default")

export function EmptyState({
  size = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & { size?: EmptyStateSize }) {
  return (
    <SizeContext.Provider value={size}>
      <div
        data-slot="empty-state"
        data-size={size}
        className={cn(
          "flex h-full min-h-0 w-full flex-col items-center justify-center",
          size === "sm" ? "gap-1" : "gap-2",
          className
        )}
        {...props}
      />
    </SizeContext.Provider>
  )
}

/**
 * The mark above the title: a soft tile with a glyph in it, which is as much
 * picture as an empty screen wants — an illustration would promise more here
 * than there is.
 *
 * It holds whatever icon it is handed rather than drawing one, since what the
 * screen is waiting for is the screen's own business, and sizes it only where
 * the caller has not said otherwise.
 */
export function EmptyStateMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const size = React.useContext(SizeContext)

  return (
    <div
      data-slot="empty-state-media"
      className={cn(
        "flex items-center justify-center rounded-xl bg-muted text-muted-foreground",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        size === "sm"
          ? "mb-1.5 size-7 rounded-lg [&_svg:not([class*='size-'])]:size-4"
          : "mb-2 size-8 [&_svg:not([class*='size-'])]:size-5",
        "animate-in duration-500 fill-mode-both zoom-in-95 fade-in motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

/**
 * The line that opens the conversation. An `h1` because on the screen this is
 * written for it is the heading — there is nothing else there to compete with
 * it.
 */
export function EmptyStateTitle({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  const size = React.useContext(SizeContext)

  return (
    <h1
      data-slot="empty-state-title"
      className={cn(
        "text-center font-medium tracking-tight text-balance",
        /* `lg` at most, even on a page: the greeting is an aside before the
           conversation, not a landing headline. On a card it drops to the
           card's own text size and only the weight says it is the title. */
        size === "sm" ? "text-sm" : "text-lg",
        // Arriving rather than appearing: the first thing on an empty screen
        // is the one thing worth animating, and the three parts land in the
        // order they are read rather than all at once.
        "animate-in delay-75 duration-500 fill-mode-both fade-in slide-in-from-bottom-1 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export function EmptyStateDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const size = React.useContext(SizeContext)

  return (
    <p
      data-slot="empty-state-description"
      className={cn(
        "text-center text-balance text-muted-foreground",
        size === "sm" ? "max-w-56 text-xs" : "max-w-xs text-sm",
        "animate-in delay-150 duration-500 fill-mode-both fade-in motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}
