"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The screen a conversation starts from: whatever the reader needs at hand
 * across the top, an invitation in the middle, and the composer under it with
 * the prompts on offer beneath that.
 *
 * A grid rather than a stack, and three rows of it: the header holds the top,
 * the middle takes the rest and centres what it is given, and the last row is
 * left for anything pinned to the foot. Centring by margins would put the
 * composer in a different place on every screen height, and the composer is
 * the one thing a reader is looking for.
 */
export function EmptyState({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "grid h-full min-h-0 w-full grid-rows-[auto_1fr_auto] gap-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * The row across the top. Anything named goes at the start, the controls at the
 * end — the settings, the model, whatever else is a property of the
 * conversation rather than part of it.
 */
export function EmptyStateHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="empty-state-header"
      className={cn(
        "flex min-h-8 w-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

/** The controls at the end of that row, spaced as a run of icon buttons. */
export function EmptyStateHeaderActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-header-actions"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

/**
 * The middle: the greeting, the composer and the prompts, kept to a readable
 * measure and centred in whatever room is left.
 *
 * `justify-center` with `min-h-0` so a short screen scrolls rather than pushing
 * the composer off the bottom — the invitation is worth losing before the field
 * that answers it is.
 */
export function EmptyStateContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-content"
      className={cn(
        "flex min-h-0 w-full flex-col items-center justify-center gap-4 overflow-y-auto",
        className
      )}
      {...props}
    />
  )
}

/**
 * The line that opens the conversation. An `h1` because on this screen it is
 * the heading — there is nothing else on the page for it to compete with.
 */
export function EmptyStateTitle({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="empty-state-title"
      className={cn(
        "text-center text-xl font-medium tracking-tight text-balance",
        // Arriving rather than appearing: the first thing on an empty screen
        // is the one thing worth animating.
        "animate-in duration-500 fill-mode-both fade-in slide-in-from-bottom-1 motion-reduce:animate-none",
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
  return (
    <p
      data-slot="empty-state-description"
      className={cn(
        "-mt-2 max-w-sm text-center text-sm text-balance text-muted-foreground",
        "animate-in delay-75 duration-500 fill-mode-both fade-in motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

/**
 * The composer and the prompts under it, as one block: they are the same
 * gesture — a thing to write in, and the things somebody might have written.
 */
export function EmptyStateComposer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-composer"
      className={cn(
        "flex w-full max-w-xl flex-col items-stretch gap-3",
        "animate-in delay-150 duration-500 fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

/** Anything pinned to the foot — a disclaimer, a shortcut, a link out. */
export function EmptyStateFooter({
  className,
  ...props
}: React.ComponentProps<"footer">) {
  return (
    <footer
      data-slot="empty-state-footer"
      className={cn(
        "flex w-full items-center justify-center gap-2 text-[11px] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
