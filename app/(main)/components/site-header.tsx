"use client"

import {
  AiElementsIcon,
  Home02Icon,
  AiDrawingIcon,
  MachineRobotIcon,
  AiSwapIcon,
  TokenCircleIcon,
} from "@hugeicons/core-free-icons"

import { NavButton, NavMenu, type NavPage } from "./nav-button"

/** A page the nav links straight to, or a group of them behind one button. */
type NavEntry = NavPage | (Omit<NavPage, "href"> & { items: NavPage[] })

const pages: NavEntry[] = [
  { href: "/", label: "Home", icon: Home02Icon },
  {
    label: "Design",
    icon: AiDrawingIcon,
    items: [
      { href: "/elements", label: "Elements", icon: AiElementsIcon },
      { href: "/tokens", label: "Tokens", icon: TokenCircleIcon },
    ],
  },
  { href: "/agents", label: "Agents", icon: MachineRobotIcon },
  { href: "/playground", label: "Playground", icon: AiSwapIcon },
]

export function SiteHeader() {
  return (
    <header className="border-b border-border/40 sticky top-0 z-30 flex h-11 shrink-0 items-center gap-2 px-4 transition-[background-color,backdrop-filter] duration-200 bg-background/30 backdrop-blur-md">
      <div className="flex w-full items-center gap-4">
        <nav aria-label="Site" className="flex items-center gap-0.5">
          {pages.map((page) =>
            "items" in page ? (
              <NavMenu key={page.label} {...page} />
            ) : (
              <NavButton key={page.href} {...page} />
            )
          )}
        </nav>
      </div>
    </header>
  )
}
