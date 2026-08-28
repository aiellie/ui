import { BotMessageSquareIcon, Message01Icon } from "@hugeicons/core-free-icons"
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

/**
 * The kinds an agent falls into, and what the sidebar's filter offers. One for
 * now — but a list rather than a union of one, so a second kind is an entry
 * here and not a refactor.
 */
interface AgentCategory {
  /** The lookup key: what an agent's `category` names. */
  id: string
  name: string
  /** One line on what the kind is, read out under the name in the filter. */
  description: string
  icon: IconSvgElement
}

const agentCategories: AgentCategory[] = [
  {
    id: "conversation",
    name: "Conversation",
    description: "Answers in a thread, a turn at a time.",
    icon: Message01Icon,
  },
]

interface Agent {
  /** What a selection is held as, and what a route would say. */
  id: string
  name: string
  /** One line on what this one is for — the reason a reader would pick it. */
  description: string
  /** The line its opening screen asks. Its own, because a greeting that could
   *  belong to any agent is a greeting that says nothing about this one. */
  greeting: string
  /** An `AgentCategory["id"]`. */
  category: string
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
    greeting: "What would you like to talk through?",
    category: "conversation",
    avatar: "https://images.aiellie.app/chatagent.png?mode=image&radius=0",
    icon: BotMessageSquareIcon,
  },
]

function findAgent(id: string) {
  return agents.find((agent) => agent.id === id)
}

function findAgentCategory(id: string) {
  return agentCategories.find((category) => category.id === id)
}

export interface AgentFilter {
  /** Matched against the name and the description, case-insensitively. */
  query?: string
  /**
   * The categories to keep. Empty means every one of them — a filter nobody
   * has touched should not be a filter that hides everything.
   */
  categories?: string[]
}

/**
 * The list as the sidebar shows it. Written here rather than in the sidebar so
 * what "matches" means is a property of the catalogue: a second surface reading
 * the same agents does not get to disagree about it.
 */
function filterAgents(
  { query = "", categories = [] }: AgentFilter = {},
  list: Agent[] = agents
) {
  const needle = query.trim().toLowerCase()

  return list.filter((agent) => {
    if (categories.length && !categories.includes(agent.category)) return false
    if (!needle) return true
    return (
      agent.name.toLowerCase().includes(needle) ||
      agent.description.toLowerCase().includes(needle)
    )
  })
}

export { agentCategories, agents, filterAgents, findAgent, findAgentCategory }
export type { Agent, AgentCategory }
