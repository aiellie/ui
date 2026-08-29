import {
  SquareTerminalIcon,
  MessageSquareDotIcon,
  BubbleChatEditIcon,
  BubbleChatSparkIcon,
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
  /* Journey order, not alphabetical: the assembled chat first, then the
     messages inside it, the composer under it, and the code the answers
     carry. */
  {
    name: "Chat",
    slug: "chat",
    hidden: false,
    icon: BubbleChatSparkIcon,
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
    name: "Coding",
    slug: "coding",
    hidden: false,
    icon: SquareTerminalIcon,
  },
]
