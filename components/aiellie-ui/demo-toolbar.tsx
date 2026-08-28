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
  iconSwap,
  iconSwapIn,
  iconSwapOut,
} from "@/components/aiellie-ui/actions"
import {
  FloatingToolbar,
  FloatingToolbarButton,
  FloatingToolbarMenu,
  FloatingToolbarMenuContent,
  FloatingToolbarMenuItem,
  FloatingToolbarMenuTrigger,
  FloatingToolbarSeparator,
  FloatingToolbarTab,
  FloatingToolbarTabs,
} from "@/components/aiellie-ui/floating-toolbar"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

/**
 * Inside a `DemoCard` the toolbar is an affordance rather than furniture: it
 * keeps out of the demo's way until the card is hovered. The hiding is scoped
 * to the card, so a toolbar anywhere else — a detail route, where it is the way
 * back — is untouched, and to pointers that can hover, since on a touch screen
 * nothing would ever bring it back.
 *
 * It holds as well while a control inside it has focus, so tabbing to it isn't
 * chasing something invisible, and while its menu is open, since that popup is
 * portalled out of the card and hovering it is no longer hovering the card.
 *
 * Every rule that reveals outranks the one that hides: `group-*` and `has-*`
 * each add a pseudo-class, where the `:where()` behind `in-*` counts for
 * nothing. So the cascade doesn't come down to the order Tailwind emitted them
 * in.
 *
 * `animate-none` because the pill's entrance animation fills forwards, and
 * would otherwise settle over the hidden state — it has nothing to slide in
 * for while it is invisible anyway. The fade is set as a bare property since
 * `duration-*` feeds that same entrance, and this shouldn't quicken it where
 * it still plays.
 */
const revealedOnCardHover = cn(
  "pointer-fine:in-[[data-slot=demo-card]]:animate-none",
  "pointer-fine:in-[[data-slot=demo-card]]:opacity-0",
  "transition-opacity [transition-duration:200ms] ease-out motion-reduce:transition-none",
  "group-hover/demo-card:opacity-100",
  "group-focus-within/demo-card:opacity-100",
  "has-[[data-popup-open]]:opacity-100"
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

  const hasLead = backHref != null || title != null
  const hasTabs = variants.length > 1
  const hasTrail = commands.length > 0 || href != null || fullscreenHref != null

  const copyTooltip = isCopied ? "Copied" : "Copy install command"

  /* The two icons share one grid cell and cross-fade, so the button never
     changes size as it swaps. */
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
    <FloatingToolbar
      aria-label={title ?? "Demo"}
      className={cn(revealedOnCardHover, className)}
    >
      {backHref ? (
        <FloatingToolbarButton tooltip="Back" render={<Link href={backHref} />}>
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={2}
            className="size-3.5"
          />
        </FloatingToolbarButton>
      ) : null}
      {title ? (
        <span className="px-2 text-[11px] whitespace-nowrap">{title}</span>
      ) : null}
      {hasLead && hasTabs ? <FloatingToolbarSeparator /> : null}
      {hasTabs ? (
        <FloatingToolbarTabs>
          {variants.map((name, index) => (
            <FloatingToolbarTab
              key={name}
              active={index === active}
              tooltip={name}
              onClick={() => onActiveChange(index)}
              className="font-mono font-normal"
            >
              {String(index + 1).padStart(2, "0")}
            </FloatingToolbarTab>
          ))}
        </FloatingToolbarTabs>
      ) : null}
      {hasTrail && (hasTabs || hasLead) ? <FloatingToolbarSeparator /> : null}
      {commands.length === 1 ? (
        /* `grid place-items-center` outranks the item's own `flex`, so the
           icons stack in one cell. The tooltip doubles as the label, so the
           tick is announced. */
        <FloatingToolbarButton
          tooltip={copyTooltip}
          className="grid place-items-center"
          onClick={() => copyToClipboard(commands[0].command)}
        >
          {copyIcons}
        </FloatingToolbarButton>
      ) : null}
      {commands.length > 1 ? (
        <FloatingToolbarMenu>
          <FloatingToolbarMenuTrigger
            tooltip={copyTooltip}
            className="grid place-items-center"
          >
            {copyIcons}
          </FloatingToolbarMenuTrigger>
          <FloatingToolbarMenuContent>
            {commands.map((option) => (
              <FloatingToolbarMenuItem
                key={option.label}
                onClick={() => copyToClipboard(option.command)}
              >
                {option.label}
              </FloatingToolbarMenuItem>
            ))}
          </FloatingToolbarMenuContent>
        </FloatingToolbarMenu>
      ) : null}
      {href ? (
        <FloatingToolbarButton
          tooltip="View source"
          render={<Link href={href} />}
        >
          <HugeiconsIcon
            icon={SourceCodeIcon}
            strokeWidth={2}
            className="size-3.5"
          />
        </FloatingToolbarButton>
      ) : null}
      {fullscreenHref ? (
        <FloatingToolbarButton
          tooltip={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          render={<Link href={fullscreenHref} />}
        >
          <HugeiconsIcon
            icon={fullscreen ? Cancel01Icon : FullScreenIcon}
            strokeWidth={2}
            className="size-3.5"
          />
        </FloatingToolbarButton>
      ) : null}
    </FloatingToolbar>
  )
}

export { DemoToolbar }
export type { DemoToolbarProps }
