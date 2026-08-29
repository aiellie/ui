import {
  SquareTerminalIcon,
  MessageSquareDotIcon,
  BubbleChatEditIcon,
  Cards01Icon,
  Image01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

export interface RegistryCategory {
  name: string
  slug: string
  hidden: boolean
  icon: IconSvgElement
}

/**
 * Every category an example can carry, in the order the rail stands them in —
 * each one a label over the examples that fell into it.
 */
export const registryCategories: RegistryCategory[] = [
  /* Journey order, not alphabetical: the finished cards first — a chat, a
     generator, an agent, each one something whole — then the messages inside
     them, the composer under them, and the code the answers carry. */
  {
    name: "Cards",
    slug: "cards",
    hidden: false,
    icon: Cards01Icon,
  },
  {
    name: "Messages",
    slug: "messages",
    hidden: false,
    icon: MessageSquareDotIcon,
  },
  {
    name: "Composer",
    slug: "composer",
    hidden: false,
    icon: BubbleChatEditIcon,
  },
  {
    name: "Media",
    slug: "media",
    hidden: false,
    icon: Image01Icon,
  },
  {
    name: "Coding",
    slug: "coding",
    hidden: false,
    icon: SquareTerminalIcon,
  },
]
