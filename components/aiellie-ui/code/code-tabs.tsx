"use client"

import * as React from "react"
import { Tabs } from "@base-ui/react/tabs"
import { HugeiconsIcon } from "@hugeicons/react"

import { mono } from "@/components/aiellie-ui/actions"
import { iconFor } from "@/lib/highlight"
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
        "-ms-1 -my-1 flex min-w-0 items-center gap-0.5 overflow-x-auto py-1",
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
  "shrink-0 cursor-pointer rounded-full px-2 py-1 whitespace-nowrap outline-none transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-1 focus-visible:ring-foreground/20 active:scale-[0.94] motion-reduce:transition-none",
  "text-foreground/35 hover:text-foreground/70",
  "data-selected:bg-foreground/[0.06] data-selected:text-foreground/90 dark:data-selected:bg-foreground/[0.09]"
)

/**
 * One file in the strip. No badge by default, unlike `CodeBlockTitle`: a
 * header showing one name has room for a glyph beside it, and a header showing
 * five does not — a badge on each is most of the width the names need. Pass
 * `icon` where it earns the room, or `icon="derive"` to take it from the name.
 */
function CodeTabsTab({
  icon,
  children,
  className,
  ...props
}: Tabs.Tab.Props & { icon?: React.ReactNode | "derive" }) {
  /* `iconFor` keys on the extension and on the language name alike, so a tab
     named `copy.ts` and one named `typescript` land on the same glyph. A name
     assembled from several children cannot be read that way, so pass the icon
     itself there. */
  const badge =
    icon === "derive" ? (
      typeof children === "string" ? (
        <HugeiconsIcon
          aria-hidden
          icon={iconFor(children)}
          className="shrink-0"
          strokeWidth={2}
        />
      ) : null
    ) : (
      icon
    )

  return (
    <Tabs.Tab
      data-slot="code-tabs-tab"
      className={cn(
        codeTab,
        badge != null &&
          "flex items-center gap-1.5 [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    >
      {badge}
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
