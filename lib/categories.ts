import {
  ColorsIcon,
  CubeIcon,
  TextFontIcon,
  AiContentGenerator02Icon,
  ShapesIcon,
  SquareTerminalIcon,
  MessageSquareDotIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

/**
 * The design page in the order it is read: the elements themselves, the
 * primitives they are assembled from, the icon sets the badges are drawn from,
 * and the values underneath the lot. A section is a label over a run of
 * categories in the rail and nothing more — it holds no examples of its own,
 * so an example is placed by its category and lands in whichever section that
 * category names.
 */
export type SectionSlug = "elements" | "primitives" | "icons" | "tokens"

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
    name: "Primitives",
    slug: "primitives",
  },
  {
    name: "Icons",
    slug: "icons",
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
  /* Primitives and icons each fill their section alone for now, so the label
     and the row repeat a word. Deliberate: the section is what places them in
     the page's reading order, and the first split of either — controls against
     overlays, brand sets against interface sets — is a row here rather than a
     rework. */
  {
    name: "Primitives",
    slug: "primitives",
    section: "primitives",
    hidden: false,
    icon: CubeIcon,
  },
  {
    name: "Icons",
    slug: "icons",
    section: "icons",
    hidden: false,
    icon: ShapesIcon,
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
