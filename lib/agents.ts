import { BotMessageSquareIcon } from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

/**
 * The agents the workspace can be pointed at, in the order its sidebar stands
 * them in.
 *
 * A catalogue in the same spirit as `lib/tools` and `lib/models` beside it:
 * what an agent is called, the face it wears and one line on what it is for.
 * Nothing here runs anything — an agent is reached by `id`, and that is the
 * whole contract.
 *
 * The glyph sits on the entry rather than in a lookup keyed by id, for the
 * reason `lib/tools` gives: these are interface marks from one set, and a
 * second module to keep in step would save nothing.
 */
interface Agent {
  /** What a selection is held as, and what a route would say. */
  id: string
  name: string
  /** One line on what this one is for — the reason a reader would pick it. */
  description: string
  /**
   * The portrait, drawn by `ChatAvatarImage`. It comes off a host this app
   * does not control, which is why the avatar is given a fallback wherever it
   * is drawn rather than being trusted to arrive.
   */
  avatar: string
  /** The mark beside the name, where the portrait would be too much. */
  icon: IconSvgElement
}

const agents: Agent[] = [
  {
    id: "chat",
    name: "Chat",
    description: "Answers in the thread, and asks before it reaches further.",
    avatar: "https://images.aiellie.app/chatagent.png?mode=image&radius=0",
    icon: BotMessageSquareIcon,
  },
]

function findAgent(id: string) {
  return agents.find((agent) => agent.id === id)
}

export { agents, findAgent }
export type { Agent }
