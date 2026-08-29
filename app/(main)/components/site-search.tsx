"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  AiElementsIcon,
  Github01Icon,
  Home02Icon,
  Moon02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"

import {
  CommandMenu,
  openCommandMenu,
  type CommandGroup,
} from "@/components/aiellie-ui/command-menu"
import { Kbd } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"
import { registryCategories } from "@/lib/categories"
import { examplesWithDemos } from "@/registry/_demos"

import { navButton } from "./nav-button"

/**
 * The palette, loaded with the whole site: every element under its category,
 * the pages, and the two verbs worth a keystroke. Client-side on purpose —
 * the elements carry their demo components, so the list is looked up on this
 * side of the boundary, the same reasoning `elements-browser` writes down.
 */
function useSiteGroups(): CommandGroup[] {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  return React.useMemo(() => {
    const labelFor = new Map(
      registryCategories.map((category) => [category.slug, category.name])
    )

    return [
      {
        label: "Pages",
        items: [
          {
            id: "page-home",
            label: "Home",
            icon: Home02Icon,
            onSelect: () => router.push("/"),
          },
          {
            id: "page-elements",
            label: "Elements",
            icon: AiElementsIcon,
            keywords: "browse components registry",
            onSelect: () => router.push("/elements"),
          },
        ],
      },
      {
        label: "Elements",
        items: examplesWithDemos.map((example) => ({
          id: example.name,
          label: example.title,
          icon: example.icon,
          hint: labelFor.get(example.categories[0] ?? "") ?? undefined,
          /* The description rides as keywords, so "approval" finds the agent
             card and "shimmer" the transcript without either word being in a
             title. */
          keywords: example.description,
          onSelect: () => router.push(example.href),
        })),
      },
      {
        label: "Anywhere",
        items: [
          {
            id: "theme",
            label: "Toggle the theme",
            icon: Moon02Icon,
            keywords: "dark light mode",
            onSelect: () =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark"),
          },
          {
            id: "github",
            label: "Open the GitHub repository",
            icon: Github01Icon,
            keywords: "source code star",
            onSelect: () =>
              window.open("https://github.com/aiellie/ui", "_blank"),
          },
        ],
      },
    ]
  }, [router, resolvedTheme, setTheme])
}

/** Mounted once in the header; every trigger on the site opens this one. */
export function SiteSearch() {
  const groups = useSiteGroups()

  return <CommandMenu groups={groups} placeholder="Search the elements…" />
}

/** The header's way in — and the keystroke, said out loud beside it. */
export function SiteSearchTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openCommandMenu}
      className={cn(navButton, className)}
    >
      <HugeiconsIcon
        aria-hidden
        icon={Search01Icon}
        strokeWidth={1.75}
        className="size-3.5"
      />
      <span className="sr-only sm:not-sr-only">Search</span>
      <Kbd className="max-sm:hidden">⌘K</Kbd>
    </button>
  )
}
