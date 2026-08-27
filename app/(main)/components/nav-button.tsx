"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { ghostButton } from "@/components/aiellie-ui/actions"
import {
  Menu,
  MenuContent,
  MenuLinkItem,
  MenuTrigger,
} from "@/components/aiellie-ui/menu"
import { cn } from "@/lib/utils"

interface NavPage {
  href: string
  label: string
  icon: IconSvgElement
}

/**
 * The kit's ghost treatment, re-shaped for a nav item: a rounded rectangle that
 * grows a label from `sm` up. `ghostButton` already carries the flex centering,
 * focus ring, transition and press scale.
 *
 * The data-scoped hover rules are not redundant — `ghostButton` ends in a plain
 * `hover:` tint that a selected item would otherwise fade to on pointer-over.
 * These outrank it on specificity, so the accent holds. Same treatment as
 * `FloatingToolbarTab` and the theme pill, so the three read as one system.
 */
const navButton = cn(
  ghostButton,
  "h-6.5 gap-1.5 rounded-md px-2 text-[11px] font-medium whitespace-nowrap",
  "data-[active=true]:bg-muted data-[active=true]:text-foreground",
  "data-[active=true]:hover:bg-muted data-[active=true]:hover:text-foreground",
  "dark:data-[active=true]:hover:bg-muted"
)

/**
 * Whether `href` is the section on screen. "/" would prefix-match every route,
 * so only it is exact; the rest match their own section too, keeping a button
 * lit on a detail page like /elements/bubble.
 */
function isCurrent(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * One destination in the site nav: a glyph that carries a label from `sm` up,
 * lit in the accent while its section is the one on screen.
 *
 * The button reads the pathname itself rather than being told whether it is
 * selected, so a nav is just its list of pages. Pass `active` to override that
 * — for a nav whose selection isn't the route.
 */
function NavButton({
  href,
  label,
  icon,
  active,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href" | "children"> &
  NavPage & { active?: boolean }) {
  const pathname = usePathname()
  const selected = active ?? isCurrent(pathname, href)

  return (
    <Link
      href={href}
      data-slot="nav-button"
      data-active={selected}
      aria-current={selected ? "page" : undefined}
      className={cn(navButton, className)}
      {...props}
    >
      <HugeiconsIcon icon={icon} strokeWidth={1.75} className="size-3.5" />
      {/* Below `sm` the row collapses to glyphs, but the label stays in the
          DOM so the link is still announced and still has an accessible name. */}
      <span className="sr-only sm:not-sr-only">{label}</span>
    </Link>
  )
}

/**
 * A nav item that holds a group of pages rather than being one: the same button,
 * with a chevron and a menu of destinations under it.
 *
 * It lights up for any page it contains, so the section stays marked while you
 * are inside it and the menu doesn't have to be open to say where you are.
 */
function NavMenu({
  label,
  icon,
  items,
  className,
  ...props
}: Omit<React.ComponentProps<typeof MenuTrigger>, "children"> & {
  label: string
  icon: IconSvgElement
  items: NavPage[]
}) {
  const pathname = usePathname()
  const selected = items.some((item) => isCurrent(pathname, item.href))

  return (
    <Menu>
      <MenuTrigger
        data-active={selected}
        className={cn(
          navButton,
          "group/nav-menu",
          // Held open, the trigger should look pressed. Scoped to the
          // unselected case so it can't fight the accent above it — both are
          // one-attribute selectors, so neither wins on specificity and the
          // cascade would decide by whatever order Tailwind emitted them in.
          "not-data-[active=true]:data-popup-open:bg-foreground/[0.06]",
          "not-data-[active=true]:data-popup-open:text-foreground/90",
          "dark:not-data-[active=true]:data-popup-open:bg-foreground/[0.09]",
          className
        )}
        {...props}
      >
        <HugeiconsIcon icon={icon} strokeWidth={2} className="size-3.5" />
        <span className="sr-only sm:not-sr-only">{label}</span>
        
      </MenuTrigger>
      <MenuContent aria-label={label}>
        {items.map((item) => {
          const current = isCurrent(pathname, item.href)

          return (
            <MenuLinkItem
              key={item.href}
              // The rows navigate client-side, so nothing unmounts the menu on
              // its own — Base UI leaves a link item open by default because it
              // assumes the page is about to go away.
              closeOnClick
              render={<Link href={item.href} />}
              data-active={current}
              aria-current={current ? "page" : undefined}
              className={cn(
                "data-[active=true]:text-accent",
                "data-[active=true]:data-highlighted:text-accent"
              )}
            >
              <HugeiconsIcon
                icon={item.icon}
                strokeWidth={2}
                className="size-3.5"
              />
              {item.label}
            </MenuLinkItem>
          )
        })}
      </MenuContent>
    </Menu>
  )
}

export { NavButton, NavMenu, navButton, isCurrent }
export type { NavPage }
