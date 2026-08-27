"use client"

import {
  Home02Icon,
  AiDrawingIcon,
  MachineRobotIcon,
  AiSwapIcon,
} from "@hugeicons/core-free-icons"

import { NavButton, type NavPage } from "./nav-button"

const pages: NavPage[] = [
  { href: "/", label: "Home", icon: Home02Icon },
  { href: "/design", label: "Design", icon: AiDrawingIcon },
  { href: "/agents", label: "Agents", icon: MachineRobotIcon },
  { href: "/playground", label: "Playground", icon: AiSwapIcon },
]

export function SiteHeader() {
  return (
    <header className="border-b border-border/40 sticky top-0 z-30 flex h-11 shrink-0 items-center gap-2 px-4 transition-[background-color,backdrop-filter] duration-200 bg-background/30 backdrop-blur-md">
      <div className="flex w-full items-center gap-4">
        <nav aria-label="Site" className="flex items-center gap-0.5">
          {pages.map((page) => (
            <NavButton key={page.href} {...page} />
          ))}
        </nav>
      </div>
    </header>
  )
}
