"use client"

import * as React from "react"

import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { cn } from "@/lib/utils"

const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

export type TimestampFormat = "auto" | "relative" | "time" | "day" | "datetime"

export interface TimestampProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  date: Date | string | number
  format?: TimestampFormat
  variant?: "default" | "separator" | "border"
  /** Under the message, or alongside it. */
  placement?: "footer" | "side"
  /**
   * Hold the stamp back until the message is hovered or focused. Needs a
   * `group/message` ancestor — `Message`, or `TimestampRow` — to hover against.
   */
  showOnHover?: boolean
  locale?: string
  /** The twelve-hour clock, unless a caller would rather have the other. */
  hour12?: boolean
  /** Re-stamp on an interval: `true` is every minute, a number is milliseconds. */
  live?: boolean | number
  icon?: React.ReactNode
  /** A label of your own, for the cases a formatter cannot know about. */
  children?: React.ReactNode
}

function toDate(value: Date | string | number) {
  return value instanceof Date ? value : new Date(value)
}

/** Midnight local to the reader, which is where "today" and "yesterday" turn. */
function startOfDay(value: number) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

/**
 * Whole days between two moments, counted by the calendar rather than by
 * elapsed time: 23:59 and 00:01 are a minute apart and still different days,
 * which is the distinction a thread divider is making.
 */
function dayDelta(date: Date, now: number) {
  return Math.round((startOfDay(date.getTime()) - startOfDay(now)) / DAY)
}

function timeOf(date: Date, locale: string, hour12: boolean) {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    // Left to the locale, en-GB reads a message as sent at 14:32 — how a
    // timetable talks rather than how anyone says it. The twelve-hour clock is
    // the default, and the other one is a prop away.
    hour12,
  }).format(date)
}

function dayOf(date: Date, now: number, locale: string) {
  const delta = dayDelta(date, now)
  if (delta === 0) return "Today"
  if (delta === -1) return "Yesterday"
  if (delta === 1) return "Tomorrow"
  if (delta < 0 && delta > -7) {
    return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date)
  }
  const sameYear = date.getFullYear() === new Date(now).getFullYear()
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(date)
}

function relativeOf(date: Date, now: number, locale: string) {
  const difference = date.getTime() - now
  const distance = Math.abs(difference)
  // Under a minute there is nothing useful to count, and "in 0 minutes" is
  // worse than saying so plainly.
  if (distance < 45_000) return "Just now"

  const relative = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  if (distance < HOUR) return relative.format(Math.round(difference / MINUTE), "minute") // prettier-ignore
  if (distance < DAY) return relative.format(Math.round(difference / HOUR), "hour") // prettier-ignore

  const days = dayDelta(date, now)
  if (Math.abs(days) < 7) return relative.format(days, "day")
  return dayOf(date, now, locale)
}

/** The label a `Timestamp` carries, exported for anything formatting its own. */
export function formatTimestamp(
  date: Date,
  now: number,
  format: TimestampFormat,
  locale: string,
  hour12 = true
) {
  switch (format) {
    case "relative":
      return relativeOf(date, now, locale)
    case "time":
      return timeOf(date, locale, hour12)
    case "day":
      return dayOf(date, now, locale)
    case "datetime":
      return `${dayOf(date, now, locale)} at ${timeOf(date, locale, hour12)}`
    default:
      // Within the hour the gap is the point; later the same day the clock
      // time is; further back the day is, and the clock time is noise.
      if (Math.abs(date.getTime() - now) < HOUR) {
        return relativeOf(date, now, locale)
      }
      return dayDelta(date, now) === 0
        ? timeOf(date, locale, hour12)
        : dayOf(date, now, locale)
  }
}

/**
 * One clock per interval, shared by every stamp reading it. A clock is an
 * external thing a render reads rather than state a render owns, which is what
 * `useSyncExternalStore` is for: the reading is cached between ticks, so the
 * render stays pure and every stamp on screen agrees about what "now" is.
 */
type Clock = {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => number
}

const clocks = new Map<number, Clock>()

function clockFor(interval: number): Clock {
  const existing = clocks.get(interval)
  if (existing) return existing

  let now = Date.now()
  let id: ReturnType<typeof setInterval> | undefined
  const listeners = new Set<() => void>()

  const clock: Clock = {
    subscribe(listener) {
      listeners.add(listener)
      // Subscribing only ever happens on the client, so this is the first
      // reading taken from the reader's own clock rather than the server's.
      now = Date.now()

      // One interval for the clock rather than one per subscriber, so a
      // remount — or a strict-mode double subscribe — cannot leave a second
      // one ticking behind it.
      if (interval && id === undefined) {
        id = setInterval(() => {
          now = Date.now()
          for (const notify of listeners) notify()
        }, interval)
      }

      return () => {
        listeners.delete(listener)
        if (!listeners.size && id !== undefined) {
          clearInterval(id)
          id = undefined
        }
      }
    },
    getSnapshot: () => now,
  }

  clocks.set(interval, clock)
  return clock
}

/**
 * The moment to measure against. A timestamp rendered on the server is already
 * stale by the time it is read, so the first client render re-stamps it, and
 * `live` keeps it honest after that.
 */
function useNow(live: boolean | number) {
  const interval = live === true ? MINUTE : live === false ? 0 : live
  const clock = clockFor(interval)

  return React.useSyncExternalStore(
    clock.subscribe,
    clock.getSnapshot,
    clock.getSnapshot
  )
}

/**
 * When a message was sent, as a marker: inline under a bubble, or drawn across
 * the thread as the divider a new day starts with.
 *
 * The label is a `<time>` with the full moment on it, so the exact value is
 * always a hover or a screen reader away no matter how loosely it is phrased.
 */
export function Timestamp({
  date,
  format = "auto",
  variant = "default",
  placement = "footer",
  showOnHover = false,
  locale = "en-GB",
  hour12 = true,
  live = false,
  icon,
  className,
  children,
  ...props
}: TimestampProps) {
  const value = toDate(date)
  const now = useNow(live)
  const valid = !Number.isNaN(value.getTime())

  if (!valid) return null

  return (
    <Marker
      variant={variant}
      data-slot="timestamp"
      data-placement={placement}
      className={cn(
        "text-xs",
        // A marker is a line across the thread; beside a message it is a note
        // in the margin instead, so it stops claiming the width and holds
        // itself to the bubble's last line.
        placement === "side" &&
          "w-auto shrink-0 self-end whitespace-nowrap [&]:min-h-0",
        // Held back rather than absent: the space stays reserved either way, so
        // revealing a stamp never shifts the message it belongs to. Focus
        // counts as well, since a keyboard never hovers anything.
        showOnHover &&
          "opacity-0 transition-opacity duration-150 group-focus-within/message:opacity-100 group-hover/message:opacity-100 hover:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none",
        className
      )}
      render={
        <time
          dateTime={value.toISOString()}
          title={new Intl.DateTimeFormat(locale, {
            dateStyle: "full",
            timeStyle: "short",
            hour12,
          }).format(value)}
          // The label depends on the reader's clock and time zone, so the
          // server's guess at it is never the one that survives hydration.
          suppressHydrationWarning
        />
      }
      {...props}
    >
      {icon ? <MarkerIcon>{icon}</MarkerIcon> : null}
      <MarkerContent>
        {children ?? formatTimestamp(value, now, format, locale, hour12)}
      </MarkerContent>
    </Marker>
  )
}

/**
 * A message and its stamp on one line, for `placement="side"`. The row is the
 * `group/message` a hovered stamp reveals against, and `align="end"` reverses
 * it so the stamp stays on the outside of the thread rather than crossing to
 * the far side of a bubble that has moved.
 */
export function TimestampRow({
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  return (
    <div
      data-slot="timestamp-row"
      data-align={align}
      className={cn(
        "group/message flex w-full min-w-0 items-end gap-2",
        align === "end" ? "flex-row-reverse" : "flex-row",
        className
      )}
      {...props}
    />
  )
}
