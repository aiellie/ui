"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun01Icon, Moon02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ghostButton } from "@/components/aiellie-ui/actions"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const noopSubscribe = () => () => {}
const getMounted = () => true
const getServerMounted = () => false

// Add `{ value: "system", label: "Match system", icon: ComputerIcon }` here to
// bring the system option back — the pill sizes itself around the list.
const modes = [
  { value: "light", label: "Light mode", icon: Sun01Icon },
  { value: "dark", label: "Dark mode", icon: Moon02Icon },
] as const

// The kit's ghost treatment, re-shaped for the pill: a rounded square rather
// than a circle. `ghostButton` already carries the flex centering, focus ring,
// transition and press scale that `Button variant="ghost"` used to supply.
//
// The data-scoped hover rules are not redundant. `ghostButton` ends in a plain
// `hover:` tint, and a selected item would otherwise fade to it on pointer-over
// — these outrank it on specificity, so the accent holds.
const itemClass = cn(
  ghostButton,
  "size-7 cursor-pointer rounded-lg text-muted-foreground ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-foreground",
  "data-[active=true]:bg-accent/5 data-[active=true]:text-accent",
  "data-[active=true]:hover:bg-accent/5 data-[active=true]:hover:text-accent",
  "dark:data-[active=true]:bg-accent dark:data-[active=true]:text-accent-foreground",
  "dark:data-[active=true]:hover:bg-accent dark:data-[active=true]:hover:text-accent-foreground"
)

/**
 * Floating toolbar for the theme switch, built like `DemoToolbar`: one blurred
 * pill of ghost buttons, stacked vertically and positionally agnostic — the
 * caller places it with `className`.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  // `false` for the server render and the hydrating pass, `true` after — the
  // server/client-snapshot split of useSyncExternalStore, without an effect.
  const mounted = React.useSyncExternalStore(
    noopSubscribe,
    getMounted,
    getServerMounted
  )

  // Avoid hydration mismatch: theme is unknown on the server. `theme` is
  // "system" until a mode is picked, so fall back to what that resolves to and
  // the pill always shows the mode actually on screen.
  const current = mounted
    ? modes.some((mode) => mode.value === theme)
      ? theme
      : resolvedTheme
    : undefined

  return (
    <TooltipProvider>
      <div
        role="toolbar"
        aria-label="Theme"
        className={cn(
          "flex shrink-0 animate-in flex-col items-center gap-0.5 rounded-xl p-0 shadow-xl backdrop-blur-xl duration-500 ease-out fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none dark:bg-card/90",
          className
        )}
      >
        {modes.map((mode) => {
          const active = current === mode.value

          return (
            <Tooltip key={mode.value}>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    aria-label={mode.label}
                    aria-pressed={active}
                    data-active={active}
                    onClick={() => setTheme(mode.value)}
                    className={itemClass}
                  />
                }
              >
                {/* Active icon fills and spins in as it becomes selected. */}
                <HugeiconsIcon
                  icon={mode.icon}
                  strokeWidth={2}
                  fill={active ? "currentColor" : "none"}
                  className={cn(
                    "size-3.5",
                    active &&
                      "animate-in duration-300 zoom-in-50 spin-in-90 motion-reduce:animate-none"
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="left">
                {mode.label} <Kbd>D</Kbd>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
