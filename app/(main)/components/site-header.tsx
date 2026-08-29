"use client"

import {
  Home02Icon,
  AiElementsIcon,
  Github01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ghostButton } from "@/components/aiellie-ui/actions"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { NavButton, type NavPage } from "./nav-button"
import { Rules, type RuleDoc } from "./rules"

// The nav lists what is finished — a stub in it costs more than a short nav.
const pages: NavPage[] = [
  { href: "/", label: "Home", icon: Home02Icon },
  { href: "/elements", label: "Elements", icon: AiElementsIcon },
]

export function SiteHeader({ docs }: { docs: RuleDoc[] }) {
  return (
    <header className="sticky top-0 z-30 flex h-11 shrink-0 items-center gap-2 border-b border-border/40 bg-background/30 px-3 backdrop-blur-md transition-[background-color,backdrop-filter] duration-200">
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
        {/* The source stands with the controls rather than in the nav: the
            nav's buttons light up for the section on screen, and a link that
            leaves the site has no section to light. The tooltip describes it,
            but a tooltip is not a name — hence the explicit label. */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href="https://github.com/aiellie/ui"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub repository"
                  className={cn(ghostButton, "size-7 shrink-0 rounded-lg")}
                />
              }
            >
              <HugeiconsIcon
                icon={Github01Icon}
                strokeWidth={1.75}
                className="size-4"
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">GitHub</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}
