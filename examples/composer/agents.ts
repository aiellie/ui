import {
  AiBrain01Icon,
  AiSearch02Icon,
  Bug01Icon,
  Note01Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

/** Example data. The agents a message can be handed to instead of a person. */
export interface Agent {
  id: string
  name: string
  handle: string
  description: string
  /** What stands in for the avatar until it loads, and if it never does. */
  icon: IconSvgElement
  /** A picture, served from elsewhere — hence the glyph underneath it. */
  avatar: string
}

export const agents: Agent[] = [
  {
    id: "researcher",
    name: "Researcher",
    handle: "researcher",
    description: "Reads the sources and comes back with citations",
    icon: AiSearch02Icon,
    avatar: "https://images.aiellie.app/researcher.png?mode=image&radius=0",
  },
  {
    id: "reviewer",
    name: "Reviewer",
    handle: "reviewer",
    description: "Reads a diff for bugs before anyone else has to",
    icon: Bug01Icon,
    avatar: "https://images.aiellie.app/reviewer.png?mode=image&radius=0",
  },
  {
    id: "scribe",
    name: "Scribe",
    handle: "scribe",
    description: "Turns a thread into the note it should have been",
    icon: Note01Icon,
    avatar: "https://images.aiellie.app/scribe.png?mode=image&radius=0",
  },
  {
    id: "refactorer",
    name: "Refactorer",
    handle: "refactorer",
    description: "Rewrites what works into what reads",
    icon: SourceCodeIcon,
    avatar: "https://images.aiellie.app/refactorer.png?mode=image&radius=0",
  },
  {
    id: "planner",
    name: "Planner",
    handle: "planner",
    description: "Breaks the ask into the order it has to happen in",
    icon: AiBrain01Icon,
    avatar: "https://images.aiellie.app/planner.png?mode=image&radius=0",
  },
]
