"use client"

import * as React from "react"
import {
  Alert01Icon,
  Clock01Icon,
  Tick02Icon,
  TickDouble02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

export type MessageStatusValue =
  "sending" | "sent" | "delivered" | "read" | "failed"

/**
 * What each state is called when it is read out. Overridable, since a thread
 * that is not a chat may want other words for the same five moments.
 */
const defaultLabels: Record<MessageStatusValue, string> = {
  sending: "Sending",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Not sent",
}

const MARK_ICONS: Record<MessageStatusValue, IconSvgElement> = {
  sending: Clock01Icon,
  sent: Tick02Icon,
  /* Read is the same double tick as delivered rather than a third shape: the
     difference between them is not worth a new glyph to learn, so the colour
     carries it and the label says it outright for anyone the colour does not
     reach. */
  delivered: TickDouble02Icon,
  read: TickDouble02Icon,
  failed: Alert01Icon,
}

export interface MessageStatusProps extends Omit<
  React.ComponentProps<"span">,
  "children"
> {
  status: MessageStatusValue
  labels?: Partial<Record<MessageStatusValue, string>>
  showLabel?: boolean
  /** Offered on `failed`, where the state is a question rather than a report. */
  onRetry?: () => void
}

/**
 * How far a message has got: waiting, gone, arrived, seen — or not sent, which
 * is the only one of the five that asks something of the reader.
 *
 * Read is the same double tick as delivered rather than a third shape: the
 * colour carries the difference, and the label says it outright for anyone the
 * colour does not reach.
 */
export function MessageStatus({
  status,
  labels,
  showLabel = false,
  onRetry,
  className,
  ...props
}: MessageStatusProps) {
  const label = labels?.[status] ?? defaultLabels[status]
  const failed = status === "failed"

  return (
    <span
      data-slot="message-status"
      data-status={status}
      // A status that changes as a message travels is worth announcing once it
      // settles, but never worth interrupting for.
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1 text-xs text-muted-foreground",
        status === "read" && "text-primary",
        failed && "text-destructive",
        // Sending is the one state that is still happening, so it says so
        // rather than sitting there looking like a state that has settled.
        status === "sending" && "animate-pulse motion-reduce:animate-none",
        className
      )}
      {...props}
    >
      <HugeiconsIcon
        aria-hidden
        icon={MARK_ICONS[status]}
        strokeWidth={1.75}
        className="size-3.5 shrink-0"
      />
      <span className={showLabel ? undefined : "sr-only"}>{label}</span>
      {failed && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer underline underline-offset-3 hover:text-destructive/80"
        >
          Try again
        </button>
      ) : null}
    </span>
  )
}
