"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { floating } from "@/components/aiellie-ui/actions"
import { cn } from "@/lib/utils"

/**
 * Base UI's menu with this registry's surface on it — the popup, the rows and
 * the rules — so anything that needs a menu is styling none of it again.
 *
 * The trigger is deliberately left alone: a menu hangs off whatever opens it,
 * and every one of those already has a shape of its own. Pass `render` to make
 * an existing control the trigger rather than nesting a button inside one.
 */
function Menu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menu" {...props} />
}

function MenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />
}

/**
 * Glass is the default because a menu is a thing floating over the page rather
 * than part of it: the blur is what says so, and the fill stays translucent
 * enough for there to be something to blur. `variant="solid"` is for the times
 * the backdrop is busy enough that a blurred one is worse than no blur at all.
 */
const menuPopup = (variant: "glass" | "solid") =>
  cn(
    floating,
    "min-w-40 origin-(--transform-origin) rounded-xl p-1 shadow-xl transition-[opacity,scale] duration-150 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none data-closed:scale-95 data-closed:opacity-0",
    variant === "glass" &&
      // The border lightens with the fill — a solid edge around a soft panel
      // reads as a card with a blurry picture in it.
      "border-border/40 bg-background/70 backdrop-blur-xl dark:bg-popover/70"
  )

type PositionerProps = Pick<
  MenuPrimitive.Positioner.Props,
  "align" | "alignOffset" | "side" | "sideOffset" | "collisionPadding"
>

function MenuContent({
  className,
  variant = "glass",
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  collisionPadding = 8,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  PositionerProps & { variant?: "glass" | "solid" }) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className="isolate z-50"
      >
        <MenuPrimitive.Popup
          data-slot="menu-content"
          data-variant={variant}
          className={cn(menuPopup(variant), className)}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

/**
 * One row, and the shape every other kind of row borrows. The icon sizing rule
 * is here rather than on each item so a menu can be written as an icon and a
 * word without either being wrapped in anything.
 */
const menuItem = cn(
  "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors outline-none select-none",
  "data-highlighted:bg-foreground/[0.06] data-highlighted:text-foreground dark:data-highlighted:bg-foreground/[0.09]",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "[&_svg:not([class*='size-'])]:size-4",
  "motion-reduce:transition-none"
)

function MenuItem({
  className,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & { variant?: "default" | "destructive" }) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      data-variant={variant}
      className={cn(
        menuItem,
        variant === "destructive" &&
          // The dark tint is the heavier one, as it is on the bubble and the
          // button: the same alpha that reads as a warning over a light surface
          // barely registers over a dark one, and over glass there is a
          // translucent popup fill in the way of it as well.
          "text-destructive data-highlighted:bg-destructive/5 data-highlighted:text-destructive dark:data-highlighted:bg-destructive/15",
        className
      )}
      {...props}
    />
  )
}

/** The same row as a real link, so modified clicks keep working. */
function MenuLinkItem({ className, ...props }: MenuPrimitive.LinkItem.Props) {
  return (
    <MenuPrimitive.LinkItem
      data-slot="menu-link-item"
      className={cn(menuItem, className)}
      {...props}
    />
  )
}

/** The mark a chosen row carries. */
function MenuIndicatorMark({ className }: { className?: string }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={Tick02Icon}
      strokeWidth={2}
      className={cn("size-3.5", className)}
    />
  )
}

/**
 * A row that keeps its own state. The indicator sits at the end rather than the
 * start so a menu of them still reads as a list of words, and the space it
 * takes is held whether or not it is showing.
 */
function MenuCheckboxItem({
  className,
  children,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menu-checkbox-item"
      className={cn(menuItem, className)}
      {...props}
    >
      {children}
      <MenuPrimitive.CheckboxItemIndicator
        data-slot="menu-checkbox-item-indicator"
        keepMounted
        className="ms-auto ps-2 opacity-0 data-checked:opacity-100"
      >
        <MenuIndicatorMark />
      </MenuPrimitive.CheckboxItemIndicator>
    </MenuPrimitive.CheckboxItem>
  )
}

function MenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />
}

function MenuRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menu-radio-item"
      className={cn(menuItem, className)}
      {...props}
    >
      {children}
      <MenuPrimitive.RadioItemIndicator
        data-slot="menu-radio-item-indicator"
        keepMounted
        className="ms-auto ps-2 opacity-0 data-checked:opacity-100"
      >
        <MenuIndicatorMark />
      </MenuPrimitive.RadioItemIndicator>
    </MenuPrimitive.RadioItem>
  )
}

function MenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />
}

function MenuGroupLabel({
  className,
  ...props
}: MenuPrimitive.GroupLabel.Props) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="menu-group-label"
      className={cn(
        "px-2 py-1.5 text-[11px] font-medium text-muted-foreground/70",
        className
      )}
      {...props}
    />
  )
}

function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/** The keystroke a row also answers to, set at the end of it. */
function MenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menu-shortcut"
      className={cn(
        "ms-auto ps-3 text-[11px] tracking-wide text-muted-foreground/70",
        className
      )}
      {...props}
    />
  )
}

function MenuSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="menu-sub" {...props} />
}

/**
 * A row that opens another menu. The chevron is drawn rather than imported, and
 * it is logical rather than left-to-right: in an RTL layout the submenu opens
 * the other way, and an arrow pointing the wrong way is worse than none.
 */
function MenuSubTrigger({
  className,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menu-sub-trigger"
      className={cn(
        menuItem,
        "data-popup-open:bg-foreground/[0.06] data-popup-open:text-foreground dark:data-popup-open:bg-foreground/[0.09]",
        className
      )}
      {...props}
    >
      {children}
      <HugeiconsIcon
        aria-hidden
        icon={ArrowRight01Icon}
        strokeWidth={2}
        className="ms-auto size-3.5 rtl:-scale-x-100"
      />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function MenuSubContent({
  side = "inline-end",
  align = "start",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  return (
    <MenuContent
      data-slot="menu-sub-content"
      side={side}
      align={align}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

export {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  menuItem,
  menuPopup,
}
