"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { useRender } from "@base-ui/react/use-render"

import { ghostButton } from "@/components/aiellie-ui/actions"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from "@/components/aiellie-ui/menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/**
 * Shape and motion shared by every control in the row, and by the items in the
 * menu that hangs off it. `ghostButton` brings the centring, focus ring,
 * transition and press scale; the rest rounds off the corners a little less
 * than a circle, which is what keeps a row of them from reading as bubbles.
 */
const messageActionItem = cn(
  ghostButton,
  "cursor-pointer rounded-lg text-muted-foreground ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-foreground active:scale-[0.94]"
)

/**
 * The actions that belong to one message — copy, rate, retry — with everything
 * rarer folded into the menu at the end of the row.
 *
 * `showOnHover` holds the row back until the message is hovered or focused,
 * which is how a thread stays readable: a dozen messages each wearing five
 * buttons is a toolbar with a conversation in it. The space is held either way,
 * so revealing the row never moves the message it belongs to.
 */
function MessageActions({
  showOnHover = false,
  className,
  children,
  "aria-label": ariaLabel = "Message actions",
  ...props
}: React.ComponentProps<"div"> & { showOnHover?: boolean }) {
  return (
    <TooltipProvider>
      <div
        data-slot="message-actions"
        role="toolbar"
        aria-label={ariaLabel}
        className={cn(
          "flex w-fit items-center gap-0.5",
          // Focus counts as well as hover: a keyboard never hovers anything,
          // and a row that only answers the mouse cannot be reached at all.
          // `has-data-open` keeps the row up while its menu is open, so the
          // trigger does not vanish from under the popup.
          showOnHover &&
            "opacity-0 transition-opacity duration-150 group-focus-within/message:opacity-100 group-hover/message:opacity-100 has-data-open:opacity-100 motion-reduce:transition-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TooltipProvider>
  )
}

type TooltipSide = React.ComponentProps<typeof TooltipContent>["side"]

/**
 * A tooltip is wired up as `aria-describedby`, not a name — so an icon-only
 * control still needs a label. Borrow the tooltip when it is plain text.
 */
function labelFrom(tooltip: React.ReactNode, ariaLabel?: string) {
  return ariaLabel ?? (typeof tooltip === "string" ? tooltip : undefined)
}

/** Wraps a control in its tooltip, or returns it bare when there is none. */
function withTooltip(
  control: React.ReactElement,
  tooltip: React.ReactNode,
  side: TooltipSide
) {
  if (tooltip == null) {
    return control
  }

  return (
    <Tooltip>
      <TooltipTrigger render={control} />
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

/**
 * One icon action. `active` is for the ones that answer back — a thumbs up that
 * stays up, a copy that has just happened — since an icon that does not change
 * after a click leaves the reader guessing whether it took.
 *
 * `busy` is for the ones that take a moment: the icon turns for as long as the
 * work is running, which is the whole feedback a retry gets before its answer
 * arrives. The control stops taking clicks while it turns, so a slow retry
 * cannot be fired three times over.
 */
function MessageAction({
  tooltip,
  side = "top",
  active = false,
  busy = false,
  className,
  children,
  render,
  "aria-label": ariaLabel,
  ...props
}: useRender.ComponentProps<"button"> & {
  tooltip?: React.ReactNode
  side?: TooltipSide
  active?: boolean
  busy?: boolean
}) {
  const action = useRender({
    render,
    defaultTagName: "button",
    props: {
      // `type` belongs to <button>; a `render` of <a> must not inherit it.
      ...(render ? {} : { type: "button" }),
      "data-slot": "message-action",
      "aria-label": labelFrom(tooltip, ariaLabel),
      "aria-pressed": active || undefined,
      "aria-busy": busy || undefined,
      "data-active": active || undefined,
      "data-busy": busy || undefined,
      className: cn(
        messageActionItem,
        "size-7 [&_svg:not([class*='size-'])]:size-4",
        "data-active:text-foreground",
        "data-busy:pointer-events-none data-busy:text-foreground data-busy:[&_svg]:animate-spin motion-reduce:data-busy:[&_svg]:animate-none",
        className
      ),
      children,
      ...props,
    },
  })

  return withTooltip(action, tooltip, side)
}

/** The rest of the actions, behind one control at the end of the row. */
function MessageActionsMenu(props: MenuPrimitive.Root.Props) {
  return <Menu data-slot="message-actions-menu" {...props} />
}

/**
 * The control itself, styled like `MessageAction` and carrying the same
 * tooltip. Base UI merges the trigger through the tooltip's own trigger, so the
 * one element is both without either losing its behaviour.
 */
function MessageActionsMenuTrigger({
  tooltip = "More",
  side = "top",
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: MenuPrimitive.Trigger.Props & {
  tooltip?: React.ReactNode
  side?: TooltipSide
}) {
  const trigger = (
    <MenuPrimitive.Trigger
      data-slot="message-actions-menu-trigger"
      aria-label={labelFrom(tooltip, ariaLabel)}
      className={cn(
        messageActionItem,
        "size-7 [&_svg:not([class*='size-'])]:size-4",
        "data-popup-open:bg-foreground/[0.06] data-popup-open:text-foreground dark:data-popup-open:bg-foreground/[0.09]",
        className
      )}
      {...props}
    >
      {children}
    </MenuPrimitive.Trigger>
  )

  return withTooltip(trigger, tooltip, side)
}

/**
 * The shared menu surface, hung the way a row at the foot of a message wants
 * it: above the control, and lined up with the end of the row so a menu opened
 * from the last button does not reach off the side of the thread.
 */
function MessageActionsMenuContent({
  side = "top",
  align = "end",
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  return (
    <MenuContent
      data-slot="message-actions-menu-content"
      side={side}
      align={align}
      {...props}
    />
  )
}

function MessageActionsMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof MenuItem>) {
  return (
    <MenuItem
      data-slot="message-actions-menu-item"
      className={className}
      {...props}
    />
  )
}

function MessageActionsMenuSeparator(
  props: React.ComponentProps<typeof MenuSeparator>
) {
  return <MenuSeparator data-slot="message-actions-menu-separator" {...props} />
}

export {
  MessageAction,
  MessageActions,
  MessageActionsMenu,
  MessageActionsMenuContent,
  MessageActionsMenuItem,
  MessageActionsMenuSeparator,
  MessageActionsMenuTrigger,
  messageActionItem,
}
