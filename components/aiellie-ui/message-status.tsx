"use client"

import * as React from "react"

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

/**
 * The marks are drawn rather than imported: a single tick and a double tick
 * have to be the same tick, one shifted, or the pair reads as two unrelated
 * glyphs. No icon set is going to guarantee that.
 */
function Tick({ double }: { double?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3.5"
    >
      <path
        d={double ? "M1.5 8.5 4.5 11.5 10 5.5" : "M3.5 8.5 6.5 11.5 12.5 4.5"}
      />
      {double ? <path d="M7 8.5 9.5 11.5 15 5.5" /> : null}
    </svg>
  )
}

function Clock() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3.5"
    >
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 4.75V8l2.25 1.5" />
    </svg>
  )
}

function Alert() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3.5"
    >
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 5v3.5" />
      <path d="M8 11h.01" />
    </svg>
  )
}

const marks: Record<MessageStatusValue, React.ReactNode> = {
  sending: <Clock />,
  sent: <Tick />,
  delivered: <Tick double />,
  read: <Tick double />,
  failed: <Alert />,
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
 * Read is the same double tick as delivered rather than a third shape, because
 * the difference between them is not worth a new glyph to learn: the colour
 * carries it, and the label says it outright for anyone the colour does not
 * reach.
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
      <span aria-hidden="true" className="shrink-0">
        {marks[status]}
      </span>
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
