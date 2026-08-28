import {
  ColorsIcon,
  TextFontIcon,
  AiContentGenerator02Icon,
  SquareTerminalIcon,
  MessageSquareDotIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

/**
 * The two halves of the design page: the elements themselves, and the values
 * they are built from. A section is a label over a run of categories in the
 * rail and nothing more — it holds no examples of its own, so an example is
 * placed by its category and lands in whichever section that category names.
 */
export type SectionSlug = "elements" | "tokens"

export interface RegistrySection {
  name: string
  slug: SectionSlug
}

/** The rail's labels, in the order it shows them. */
export const registrySections: RegistrySection[] = [
  {
    name: "Elements",
    slug: "elements",
  },
  {
    name: "Tokens",
    slug: "tokens",
  },
]

export interface RegistryCategory {
  name: string
  slug: string
  section: SectionSlug
  hidden: boolean
  icon: IconSvgElement
}

/**
 * Every category an example can carry. Grouped here the way the rail groups
 * them, so the file reads in the order the sidebar does — though it is
 * `section` that decides where a category lands, not its place in this list.
 */
export const registryCategories: RegistryCategory[] = [
  {
    name: "Composer",
    slug: "composer",
    section: "elements",
    hidden: false,
    icon: TextFontIcon,
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
]
