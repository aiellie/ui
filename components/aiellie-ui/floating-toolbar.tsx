"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { useRender } from "@base-ui/react/use-render"

import { floating, ghostButton } from "@/components/aiellie-ui/actions"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/**
 * Motion and colour shared by every control in the pill. Exported so custom
 * children dropped into a toolbar can match the built-in ones.
 *
 * `ghostButton` supplies the flex centring, focus ring, transition and press
 * scale; the rest re-shapes it from a circle into the pill's rounded square.
 */
const floatingToolbarItem = cn(
  ghostButton,
  "cursor-pointer rounded-lg text-muted-foreground ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-foreground active:scale-[0.94]"
)

function FloatingToolbar({
  className,
  children,
  "aria-label": ariaLabel = "Toolbar",
  ...props
}: React.ComponentProps<"div">) {
  return (
    <TooltipProvider>
      <div
        data-slot="floating-toolbar"
        role="toolbar"
        aria-label={ariaLabel}
        className={cn(
          floating,
          "flex w-fit animate-in items-center gap-0.5 rounded-xl border-border/40 p-0 shadow-lg backdrop-blur-xl duration-500 ease-out fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TooltipProvider>
  )
}

function FloatingToolbarSeparator({
  className,
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="floating-toolbar-separator"
      orientation="vertical"
      className={cn("mx-1 my-1.5 w-px self-stretch bg-border", className)}
      {...props}
    />
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
 * Icon control. Pass `render={<Link href="..." />}` to make it a real link —
 * modified clicks then keep working, which a button swallows.
 */
function FloatingToolbarButton({
  tooltip,
  side = "top",
  className,
  children,
  render,
  "aria-label": ariaLabel,
  ...props
}: useRender.ComponentProps<"button"> & {
  tooltip?: React.ReactNode
  side?: TooltipSide
}) {
  const button = useRender({
    render,
    defaultTagName: "button",
    props: {
      // `type` belongs to <button>; a `render` of <a> must not inherit it.
      ...(render ? {} : { type: "button" }),
      "data-slot": "floating-toolbar-button",
      "aria-label": labelFrom(tooltip, ariaLabel),
      className: cn(floatingToolbarItem, "size-7", className),
      children,
      ...props,
    },
  })

  return withTooltip(button, tooltip, side)
}

/**
 * A control in the pill that opens a menu instead of acting on click — for one
 * action with more than one target, like a copy that has two lines to offer.
 */
function FloatingToolbarMenu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="floating-toolbar-menu" {...props} />
}

/**
 * The control itself, styled like `FloatingToolbarButton` and carrying the same
 * tooltip. Base UI merges the trigger through the tooltip's own trigger, so the
 * one element is both without either losing its behaviour.
 */
function FloatingToolbarMenuTrigger({
  tooltip,
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
      data-slot="floating-toolbar-menu-trigger"
      aria-label={labelFrom(tooltip, ariaLabel)}
      className={cn(floatingToolbarItem, "size-7", className)}
      {...props}
    >
      {children}
    </MenuPrimitive.Trigger>
  )

  return withTooltip(trigger, tooltip, side)
}

function FloatingToolbarMenuContent({
  className,
  side = "top",
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <MenuPrimitive.Popup
          data-slot="floating-toolbar-menu-content"
          className={cn(
            floating,
            "min-w-32 origin-(--transform-origin) rounded-xl border-border/40 p-1 shadow-xl backdrop-blur-xl transition-[opacity,scale] duration-150 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none data-closed:scale-95 data-closed:opacity-0",
            className
          )}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function FloatingToolbarMenuItem({
  className,
  ...props
}: MenuPrimitive.Item.Props) {
  return (
    <MenuPrimitive.Item
      data-slot="floating-toolbar-menu-item"
      className={cn(
        floatingToolbarItem,
        "w-full justify-start px-2 py-1.5 text-[11px] font-medium select-none",
        "data-highlighted:bg-foreground/[0.06] data-highlighted:text-foreground dark:data-highlighted:bg-foreground/[0.09]",
        className
      )}
      {...props}
    />
  )
}

function FloatingToolbarTabs({
  className,
  "aria-label": ariaLabel = "Variant",
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="floating-toolbar-tabs"
      role="tablist"
      aria-label={ariaLabel}
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  )
}

/**
 * Text control for `FloatingToolbarTabs`. Belongs inside one — it is a `tab`.
 *
 * The data-scoped hover rules are not redundant: `ghostButton` ends in a plain
 * `hover:` tint, and a selected tab would otherwise fade to it on pointer-over.
 * These outrank it on specificity, so the accent holds.
 */
function FloatingToolbarTab({
  tooltip,
  side = "top",
  active = false,
  className,
  children,
  render,
  "aria-label": ariaLabel,
  ...props
}: useRender.ComponentProps<"button"> & {
  tooltip?: React.ReactNode
  side?: TooltipSide
  active?: boolean
}) {
  const tab = useRender({
    render,
    defaultTagName: "button",
    props: {
      ...(render ? {} : { type: "button" }),
      "data-slot": "floating-toolbar-tab",
      role: "tab",
      "aria-selected": active,
      "aria-label": labelFrom(tooltip, ariaLabel),
      "data-active": active,
      className: cn(
        floatingToolbarItem,
        "h-7 min-w-8 px-2.5 text-[11px] font-medium tabular-nums",
        "data-[active=true]:bg-accent/5 data-[active=true]:text-accent",
        "data-[active=true]:hover:bg-accent/5 data-[active=true]:hover:text-accent",
        "dark:data-[active=true]:hover:bg-accent/5",
        className
      ),
      children,
      ...props,
    },
  })

  return withTooltip(tab, tooltip, side)
}

export {
  FloatingToolbar,
  FloatingToolbarButton,
  FloatingToolbarMenu,
  FloatingToolbarMenuContent,
  FloatingToolbarMenuItem,
  FloatingToolbarMenuTrigger,
  FloatingToolbarSeparator,
  FloatingToolbarTab,
  FloatingToolbarTabs,
  floatingToolbarItem,
}
