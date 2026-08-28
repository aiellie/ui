"use client"

import * as React from "react"
import { Tabs } from "@base-ui/react/tabs"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { iconSwap, mono } from "@/components/aiellie-ui/actions"
import { codeIconFrom, type CodeIconSet } from "@/components/icons/code-icons"
import { cn } from "@/lib/utils"

/**
 * Several files in one block: the strip of names a code block's header takes,
 * and the panels behind them.
 *
 * Base UI's tabs rather than a row of buttons, because a tab strip has
 * keyboard behaviour a row of buttons does not — arrows move between tabs,
 * Home and End reach the ends, and only the selected tab is a tab stop, so
 * eleven files cost one stop rather than eleven.
 *
 * The value is the caller's, since picking a file is usually the same event as
 * something else changing with it: the copy action in the same header has to
 * be handed the file that is actually showing.
 */
function CodeTabs({ className, ...props }: Tabs.Root.Props) {
  return (
    <Tabs.Root
      data-slot="code-tabs"
      className={cn("contents", className)}
      {...props}
    />
  )
}

/**
 * `contents` above, so the root disappears from the layout and the block it
 * wraps is still the block — a tabs root that boxed the card would have to be
 * given the card's own shape back, and the two would drift.
 */
function CodeTabsList({ className, ...props }: Tabs.List.Props) {
  return (
    <Tabs.List
      data-slot="code-tabs-list"
      className={cn(
        /* The actions beside this do not shrink, so the strip has to: more
           files than the header is wide scrolls them rather than pushing the
           copy off the end of the block. `py-1 -my-1` buys back the room a
           scroller clips on the other axis, which is where the focus ring
           lives. */
        "-my-1 -ms-1 flex min-w-0 items-center gap-0.5 overflow-x-auto py-1",
        className
      )}
      {...props}
    />
  )
}

/**
 * The seam for a tab that has to match but is not one of these — a strip built
 * from a router, say, where each tab is really a `<Link>`.
 */
export const codeTab = cn(
  mono,
  "shrink-0 cursor-pointer rounded-full px-2 py-1 whitespace-nowrap transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 active:scale-[0.94] motion-reduce:transition-none",
  "text-foreground/35 hover:text-foreground/70",
  /* Keyed off `aria-selected` rather than a data attribute: that is the state
     the tab actually announces, so a hand-rolled tab wearing this class gets
     the look by being accessible rather than by remembering a second flag. */
  "aria-selected:bg-foreground/[0.06] aria-selected:text-foreground/90 dark:aria-selected:bg-foreground/[0.09]"
)

/**
 * The two halves of the badge slot. `iconSwap` carries the timing and the
 * blur; what differs from the copy button's version is that the state is a
 * hover rather than a prop, so the classes have to be written out under the
 * group variants instead of picked between.
 *
 * Focus counts as well as hover: a keyboard never hovers anything, and a
 * close that only answers the mouse cannot be reached at all.
 */
const badgeResting = cn(
  iconSwap,
  "scale-100 opacity-100 blur-none",
  "group-hover/tab:scale-[0.25] group-hover/tab:opacity-0 group-hover/tab:blur-[4px]",
  "group-focus-within/tab:scale-[0.25] group-focus-within/tab:opacity-0 group-focus-within/tab:blur-[4px]"
)

const badgeHovered = cn(
  iconSwap,
  /* Reveal by opacity, never by mounting: the slot keeps its width either way,
     so a tab does not change size under the pointer that is reaching for it.
     `pointer-events-none` keeps the invisible half from taking the click. */
  "pointer-events-none scale-[0.25] opacity-0 blur-[4px]",
  "group-hover/tab:pointer-events-auto group-hover/tab:scale-100 group-hover/tab:opacity-100 group-hover/tab:blur-none",
  "group-focus-within/tab:pointer-events-auto group-focus-within/tab:scale-100 group-focus-within/tab:opacity-100 group-focus-within/tab:blur-none"
)

/**
 * One file in the strip, wearing the badge its name earns. A strip of files is
 * scanned rather than read — the eye is hunting for the CSS one — and a glyph
 * is what it finds first, so the badge is on by default and the strip scrolls
 * when the names outgrow the header.
 *
 * `icon` takes a set name to derive from — `"brand"` by default, since a strip
 * is where colour pays for itself, `"mono"` for the interface glyph — an icon
 * of your own, or `null` for the strip that really is better bare.
 *
 * The badge is also the slot the close control swaps into on hover: the glyph
 * that says what the file is becomes the one that shuts it, in the place the
 * pointer is already heading. Closing still needs an `onClose`, since a tab
 * cannot take itself out of a list it does not own.
 */
function CodeTabsTab({
  icon,
  onClose,
  closeLabel,
  children,
  className,
  onKeyDown,
  ...props
}: Tabs.Tab.Props & {
  icon?: React.ReactNode | CodeIconSet
  /** Offered as a cross in the badge slot, and on Delete or Backspace. */
  onClose?: () => void
  closeLabel?: string
}) {
  const closable = onClose != null

  const badge = codeIconFrom(icon, children, "brand")

  const slot = closable || badge != null

  return (
    <Tabs.Tab
      data-slot="code-tabs-tab"
      /* A `<div>` once there is a close control, because a `<button>` inside a
         `<button>` is invalid and the inner one stops working. Base UI still
         puts `role="tab"`, the selection and the arrow-key behaviour on it —
         `nativeButton` only tells it to stop assuming a native one. */
      {...(closable ? { render: <div />, nativeButton: false } : null)}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (!closable || event.defaultPrevented) return
        /* The keyboard half of the close. The cross is a pointer affordance —
           it is `tabIndex={-1}`, since a strip of five files would otherwise
           cost five tab stops on top of the one the strip already has — so
           Delete is what a keyboard reaches for, which is what the tabs
           pattern says it should be. */
        if (event.key === "Delete" || event.key === "Backspace") {
          event.preventDefault()
          onClose()
        }
      }}
      className={cn(
        codeTab,
        "group/tab",
        slot &&
          "flex items-center gap-1.5 [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    >
      {slot && (
        <span className="grid size-3 shrink-0 place-items-center">
          {/* Only a closable tab's badge gets out of the way — with nothing to
              swap in, fading it on hover would just make the tab flicker. */}
          <span
            aria-hidden
            className={closable ? badgeResting : "[grid-area:1/1]"}
          >
            {badge}
          </span>
          {closable && (
            <button
              type="button"
              data-slot="code-tabs-close"
              tabIndex={-1}
              aria-label={
                closeLabel ??
                (typeof children === "string"
                  ? `Close ${children}`
                  : "Close tab")
              }
              onClick={(event) => {
                /* The tab is listening for this click too, and closing a file
                   is not a request to open it first. */
                event.stopPropagation()
                onClose()
              }}
              className={cn(
                badgeHovered,
                "grid cursor-pointer place-items-center rounded-sm text-foreground/50 outline-none hover:text-foreground focus-visible:text-foreground"
              )}
            >
              <HugeiconsIcon
                aria-hidden
                icon={Cancel01Icon}
                strokeWidth={2.5}
              />
            </button>
          )}
        </span>
      )}
      {children}
    </Tabs.Tab>
  )
}

/**
 * A panel mounts when it is chosen and goes when it is not, so switching files
 * reads as the new code arriving rather than as the old code changing under
 * the same rows. `keepMounted` is there for the block that has to keep a
 * scroll position, or a selection, across a switch.
 */
function CodeTabsPanel({ className, ...props }: Tabs.Panel.Props) {
  return (
    <Tabs.Panel
      data-slot="code-tabs-panel"
      className={cn("outline-none", className)}
      {...props}
    />
  )
}

export { CodeTabs, CodeTabsList, CodeTabsPanel, CodeTabsTab }
