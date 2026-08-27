"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { ghostButton } from "@/components/aiellie-ui/actions"
import { cn } from "@/lib/utils"

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
  "h-7 gap-1.5 rounded-lg px-2 text-[11px] font-medium whitespace-nowrap",
  "data-[active=true]:bg-accent/5 data-[active=true]:text-accent",
  "data-[active=true]:hover:bg-accent/5 data-[active=true]:hover:text-accent",
  "dark:data-[active=true]:hover:bg-accent/5"
)

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
}: Omit<React.ComponentProps<typeof Link>, "href" | "children"> & {
  href: string
  label: string
  icon: IconSvgElement
  active?: boolean
}) {
  const pathname = usePathname()

  // "/" would prefix-match every route, so only it is exact. The others match
  // their own section too, keeping the button lit on a detail page like
  // /elements/bubble.
  const selected =
    active ??
    (href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`))

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

export { NavButton, navButton }
