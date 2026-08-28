"use client"

import {
  Home02Icon,
  AiDrawingIcon,
  AiElementsIcon,
  MachineRobotIcon,
  AiSwapIcon,
} from "@hugeicons/core-free-icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { NavButton, type NavPage } from "./nav-button"
import { Rules, type RuleDoc } from "./rules"

const pages: NavPage[] = [
  { href: "/", label: "Home", icon: Home02Icon },
  { href: "/elements", label: "Elements", icon: AiElementsIcon },
  { href: "/design", label: "Design", icon: AiDrawingIcon },
  { href: "/agents", label: "Agents", icon: MachineRobotIcon },
  { href: "/playground", label: "Playground", icon: AiSwapIcon },
]

export function SiteHeader({ docs }: { docs: RuleDoc[] }) {
  return (
    <header className="sticky top-0 z-30 flex h-11 shrink-0 items-center gap-2 border-b border-border/40 bg-background/30 px-6 backdrop-blur-md transition-[background-color,backdrop-filter] duration-200">
      <div className="flex w-full items-center gap-4">
        <nav aria-label="Site" className="flex items-center gap-0.5">
          {pages.map((page) => (
            <NavButton key={page.href} {...page} />
          ))}
        </nav>
        {/* Stood apart from the nav at the far end: it opens a panel over the
            page rather than going anywhere, and a destination is the one thing
            a button sitting in a run of links claims to be. */}
        <Rules docs={docs} className="ms-auto" />
        <ThemeToggle />
      </div>
    </header>
  )
}
