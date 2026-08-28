"use client"

import Link from "next/link"
import {
  ArrowLeft01Icon,
  BashIcon,
  Cancel01Icon,
  FullScreenIcon,
  SourceCodeIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  ghostButton,
  iconSwap,
  iconSwapIn,
  iconSwapOut,
} from "@/components/aiellie-ui/actions"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/components/aiellie-ui/menu"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

/**
 * The kit's ghost treatment, re-shaped for a variant tab: the same pill the
 * navs use, so a row of them reads as one system with the rest of the site.
 *
 * The data-scoped hover rules are not redundant — `ghostButton` ends in a plain
 * `hover:` tint that the chosen tab would otherwise fade to on pointer-over.
 * These outrank it on specificity, so the fill holds.
 */
const toolbarTab = cn(
  ghostButton,
  "h-6.5 shrink-0 rounded-md px-2 text-[11px] font-medium whitespace-nowrap",
  "data-[active=true]:bg-muted data-[active=true]:text-foreground",
  "data-[active=true]:hover:bg-muted data-[active=true]:hover:text-foreground",
  "dark:data-[active=true]:hover:bg-muted"
)

type DemoToolbarProps = {
  variants: string[]
  active: number
  onActiveChange: (index: number) => void
  /** Source or detail route, opened by the code button. */
  href?: string
  /** The whole line that installs the element, under the terminal button. */
  installCommand?: string
  /** The same, for the example that demos it — the button's second option. */
  demoInstallCommand?: string
  backHref?: string
  fullscreenHref?: string
  fullscreen?: boolean
  title?: string
  className?: string
}

/**
 * The row an example is read under: which variant is on show, and what can be
 * done with it — copied, opened at its source, given the whole window.
 *
 * A row across the top rather than a pill over the demo. A toolbar that floats
 * has to hide to stay out of the way, and a control that hides is one a reader
 * has to discover twice; standing in a header of its own it costs the demo
 * nothing and is always where it was left.
 *
 * The tabs are buttons marked `aria-pressed`, not `role="tab"` — that role
 * promises arrow-key navigation between them, and there is nothing here to
 * navigate to.
 */
function DemoToolbar({
  variants,
  active,
  onActiveChange,
  href,
  installCommand,
  demoInstallCommand,
  backHref,
  fullscreenHref,
  fullscreen = false,
  title,
  className,
}: DemoToolbarProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  /* What the terminal button offers. One line copies on click; two go behind a
     menu, so the choice is only in the way when there is a choice to make. */
  const commands = [
    { label: "Just component", command: installCommand },
    { label: "With demo", command: demoInstallCommand },
  ].filter((option): option is { label: string; command: string } =>
    Boolean(option.command)
  )

  const copyTooltip = isCopied ? "Copied" : "Copy install command"

  /* The two icons share one grid cell and cross-fade, so the button never
     changes size as it swaps. Every glyph in this row states `size-3.5`,
     including the ones that never swap: `Button` sizes any icon that does not
     say otherwise to `size-4`, so an icon left bare comes out two pixels
     larger than the one beside it. */
  const copyIcons = (
    <>
      <HugeiconsIcon
        icon={BashIcon}
        strokeWidth={1.75}
        className={cn(
          iconSwap,
          "size-3.5",
          isCopied ? iconSwapOut : iconSwapIn
        )}
      />
      <HugeiconsIcon
        icon={Tick02Icon}
        strokeWidth={1.75}
        className={cn(
          iconSwap,
          "size-3.5",
          isCopied ? iconSwapIn : iconSwapOut
        )}
      />
    </>
  )

  return (
    <header
      data-slot="demo-toolbar"
      aria-label={title ?? "Demo"}
      className={cn(
        "flex h-9 shrink-0 items-center gap-1 border-b border-border/40 px-4",
        className
      )}
    >
      {backHref ? (
        <TooltipIconButton
          tooltip="Back"
          render={<Link href={backHref} />}
          nativeButton={false}
          className="shrink-0"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={2}
            className="size-3.5"
          />
        </TooltipIconButton>
      ) : null}
      {title ? (
        <span className="truncate px-1 text-[12.5px] font-medium">{title}</span>
      ) : null}
      {/* The tabs scroll rather than squeeze: a demo with six variants on a
          narrow stage would otherwise shrink every name to nothing. `py-1 -my-1`
          because a box that scrolls on one axis clips on both, and the pills'
          focus ring lives just outside them. */}
      {variants.length > 1 ? (
        <div className="-my-1 flex min-w-0 items-center gap-0.5 overflow-x-auto py-1">
          {variants.map((name, index) => (
            <button
              key={name}
              type="button"
              onClick={() => onActiveChange(index)}
              data-active={index === active}
              aria-pressed={index === active}
              className={toolbarTab}
            >
              {name}
            </button>
          ))}
        </div>
      ) : null}
      {/* Pushed to the end whatever is in front of it, so the controls are in
          the same place on every example. */}
      <div className="ms-auto flex shrink-0 items-center gap-0.5 ps-1">
        {commands.length === 1 ? (
          /* `grid place-items-center` outranks the button's own `flex`, so the
             icons stack in one cell. The tooltip doubles as the label, so the
             tick is announced. */
          <TooltipIconButton
            tooltip={copyTooltip}
            className="grid place-items-center"
            onClick={() => copyToClipboard(commands[0].command)}
          >
            {copyIcons}
          </TooltipIconButton>
        ) : null}
        {commands.length > 1 ? (
          <Menu>
            <MenuTrigger
              render={
                <TooltipIconButton
                  tooltip={copyTooltip}
                  className="grid place-items-center"
                />
              }
            >
              {copyIcons}
            </MenuTrigger>
            <MenuContent align="end">
              {commands.map((option) => (
                <MenuItem
                  key={option.label}
                  onClick={() => copyToClipboard(option.command)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </MenuContent>
          </Menu>
        ) : null}
        {href ? (
          <TooltipIconButton
            tooltip="View source"
            render={<Link href={href} />}
            nativeButton={false}
          >
            <HugeiconsIcon
              icon={SourceCodeIcon}
              strokeWidth={2}
              className="size-3.5"
            />
          </TooltipIconButton>
        ) : null}
        {fullscreenHref ? (
          <TooltipIconButton
            tooltip={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            render={<Link href={fullscreenHref} />}
            nativeButton={false}
          >
            <HugeiconsIcon
              icon={fullscreen ? Cancel01Icon : FullScreenIcon}
              strokeWidth={2}
              className="size-3.5"
            />
          </TooltipIconButton>
        ) : null}
      </div>
    </header>
  )
}

export { DemoToolbar }
export type { DemoToolbarProps }
