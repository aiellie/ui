import {
  ColorsIcon,
  AiContentGenerator02Icon,
  SquareTerminalIcon,
  MessageSquareDotIcon,
  CodeIcon,
  BubbleChatSparkIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

/**
 * The two pages: the elements themselves, and the values they are built from.
 * A section is the page a category's examples go to and nothing more — it
 * holds no examples of its own, so an example is placed by its category and
 * lands on whichever page that category names.
 */
export type SectionSlug = "elements" | "tokens"

export interface RegistryCategory {
  name: string
  slug: string
  section: SectionSlug
  hidden: boolean
  icon: IconSvgElement
}

/**
 * Every category an example can carry, in the order the rail stands them in —
 * each one a label over the examples that fell into it. Which page it stands
 * on is `section`, not its place in this list.
 */
export const registryCategories: RegistryCategory[] = [
  {
    name: "Chat",
    slug: "chat",
    section: "elements",
    hidden: false,
    icon: BubbleChatSparkIcon,
  },
  {
    name: "Coding",
    slug: "coding",
    section: "elements",
    hidden: false,
    icon: SquareTerminalIcon,
  },
  {
    name: "Messages",
    slug: "messages",
    section: "elements",
    hidden: false,
    icon: MessageSquareDotIcon,
  },
  {
    name: "Colors",
    slug: "colors",
    section: "tokens",
    hidden: false,
    icon: ColorsIcon,
  },
  {
    name: "Typography",
    slug: "typography",
    section: "tokens",
    hidden: false,
    icon: AiContentGenerator02Icon,
  },
  {
    name: "Syntax",
    slug: "syntax",
    section: "tokens",
    hidden: false,
    icon: CodeIcon,
  },
]

/**
 * The section a set of categories places something in, or `null` when none of
 * them names a visible category.
 *
 * The slugs are read in the rail's order rather than the order they were
 * written in, which is the same order `groupsFor` places a card in — so the
 * page an example goes to and the rail item it lands under can never disagree
 * about which of its categories won. Hidden categories place nothing: one is
 * left out of the rail, so it cannot pull an example onto a page either.
 */
export function sectionFor(slugs: string[]): SectionSlug | null {
  for (const category of registryCategories) {
    if (category.hidden) continue
    if (slugs.includes(category.slug)) return category.section
  }
  return null
}

/** The page each section's examples are read on. */
export const sectionPaths: Record<SectionSlug, string> = {
  elements: "/elements",
  tokens: "/design",
}

/**
 * The page a set of categories puts something on. Elements is the fallback for
 * a set naming no visible category, which is the useful default: a demo is a
 * component until something says otherwise.
 */
export function pathFor(slugs: string[]) {
  return sectionPaths[sectionFor(slugs) ?? "elements"]
}
