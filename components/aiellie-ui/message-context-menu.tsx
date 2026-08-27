"use client"

import * as React from "react"
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { MenuContent } from "@/components/aiellie-ui/menu"
import { cn } from "@/lib/utils"

/**
 * The menu a message answers a right click with — the actions that belong to it
 * and the reactions that can be put on it, in the place the pointer already is.
 *
 * Everything below the reactions is `menu`'s own parts: `MenuItem`, `MenuSub`,
 * `MenuSeparator`. This file adds only what a context menu needs that a dropdown
 * does not — an area that opens it, and a row of emoji to pick from.
 */
function MessageContextMenu(props: ContextMenuPrimitive.Root.Props) {
  return (
    <ContextMenuPrimitive.Root data-slot="message-context-menu" {...props} />
  )
}

/**
 * The area the menu belongs to. Base UI opens it on right click and on long
 * press, so touch is covered without a second gesture to write.
 *
 * `w-fit` by default: the trigger wraps a bubble, and a full-width one would
 * claim the empty half of the thread — a right click over nothing would open
 * the menu for a message the pointer was nowhere near.
 */
function MessageContextMenuTrigger({
  className,
  ...props
}: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="message-context-menu-trigger"
      className={cn(
        "w-fit rounded-xl transition-opacity duration-150 motion-reduce:transition-none data-open:opacity-90",
        className
      )}
      {...props}
    />
  )
}

/**
 * The same surface every other menu here uses, hung off the pointer rather than
 * a control: a context menu is already where the reader is looking, so it sits
 * closer than a dropdown does.
 */
function MessageContextMenuContent({
  side = "bottom",
  align = "start",
  sideOffset = 2,
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  return (
    <MenuContent
      data-slot="message-context-menu-content"
      side={side}
      align={align}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

const defaultReactions = ["👍", "❤️", "😂", "🎉", "👀", "🙏"]

/**
 * The reactions on offer, as a row rather than a list: emoji are read as
 * pictures, so stacking them into a menu of rows makes six of them look like
 * six separate decisions.
 *
 * They are checkbox items, not radio ones, because a reaction has to come off
 * again — clicking the one already given takes it back, which a radio group
 * cannot express.
 */
function MessageReactionPicker({
  reactions = defaultReactions,
  value = null,
  onValueChange,
  className,
  "aria-label": ariaLabel = "React to this message",
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  reactions?: readonly string[]
  value?: string | null
  onValueChange?: (value: string | null) => void
}) {
  return (
    <div
      data-slot="message-reaction-picker"
      role="group"
      aria-label={ariaLabel}
      className={cn("flex items-center gap-0.5 p-0.5", className)}
      {...props}
    >
      {reactions.map((reaction) => {
        const picked = value === reaction

        return (
          <MenuPrimitive.CheckboxItem
            key={reaction}
            data-slot="message-reaction"
            data-picked={picked || undefined}
            checked={picked}
            onCheckedChange={() => onValueChange?.(picked ? null : reaction)}
            className={cn(
              "flex size-8 cursor-pointer items-center justify-center rounded-full text-base leading-none transition-[background-color,scale] duration-150 outline-none select-none",
              "data-highlighted:bg-foreground/[0.06] dark:data-highlighted:bg-foreground/[0.09]",
              // The one already given keeps a tint of its own, so the row still
              // says which reaction is on the message once the pointer has
              // moved on to another of them.
              "data-picked:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] dark:data-picked:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)]",
              "hover:scale-110 active:scale-95 motion-reduce:transition-none"
            )}
          >
            <span aria-hidden="true">{reaction}</span>
            <span className="sr-only">{reaction}</span>
          </MenuPrimitive.CheckboxItem>
        )
      })}
    </div>
  )
}

export {
  MessageContextMenu,
  MessageContextMenuContent,
  MessageContextMenuTrigger,
  MessageReactionPicker,
  defaultReactions,
}
