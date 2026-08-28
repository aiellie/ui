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
  icon: IconSvgElement
}

export const agents: Agent[] = [
  {
    id: "researcher",
    name: "Researcher",
    handle: "researcher",
    description: "Reads the sources and comes back with citations",
    icon: AiSearch02Icon,
  },
  {
    id: "reviewer",
    name: "Reviewer",
    handle: "reviewer",
    description: "Reads a diff for bugs before anyone else has to",
    icon: Bug01Icon,
  },
  {
    id: "scribe",
    name: "Scribe",
    handle: "scribe",
    description: "Turns a thread into the note it should have been",
    icon: Note01Icon,
  },
  {
    id: "refactorer",
    name: "Refactorer",
    handle: "refactorer",
    description: "Rewrites what works into what reads",
    icon: SourceCodeIcon,
  },
  {
    id: "planner",
    name: "Planner",
    handle: "planner",
    description: "Breaks the ask into the order it has to happen in",
    icon: AiBrain01Icon,
  },
]
