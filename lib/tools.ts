import {
  BrowserIcon,
  ComputerTerminal01Icon,
  FileAddIcon,
  FileEditIcon,
  FileSearchIcon,
  FileViewIcon,
  GlobalSearchIcon,
  Robot01Icon,
  TextSearchIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

/**
 * The tools an agent can be handed, and what each one is called when it is.
 * A catalogue in the same spirit as `lib/models` beside it — a name, a line on
 * what a call does, and nothing whatsoever about how it is run. The work
 * happens on the far side of the call; this file only has to be able to say
 * which tool was reached for and draw it.
 *
 * Unlike the catalogues next door, the glyph sits on the entry itself rather
 * than in `components/icons`. That split earns its keep for providers and
 * models, where the marks are two dozen brand logos a filter has no business
 * installing. These are interface marks from one set, and nothing reads this
 * list without drawing from it, so a second module keyed by id would be a file
 * to keep in step for no saving at all.
 */

/**
 * The groups a tool falls into. One for now — the set an agent is given to
 * work a sandbox with — but a list rather than a union of one, so a second
 * group is an entry here and not a refactor.
 */
interface ToolCategory {
  /** The lookup key: what a tool's `category` names, and what a route says. */
  id: string
  name: string
  /** One line on what the group is for, for a heading with room under it. */
  description: string
  icon: IconSvgElement
}

const toolCategories: ToolCategory[] = [
  {
    id: "agents",
    name: "Agents",
    description: "The sandbox an agent works in: a shell, files, the web.",
    icon: Robot01Icon,
  },
]

interface Tool {
  /**
   * What the tool is registered under, and the name that turns up in a
   * tool-use block — so a transcript can be read straight against this list.
   */
  id: string
  /** The same thing written the way it is spoken, for a label. */
  name: string
  /** A `ToolCategory["id"]`. */
  category: string
  /** One line, in the present tense, on what a call to it does. */
  description: string
  icon: IconSvgElement
}

/**
 * In the order the work tends to be done in rather than alphabetically: the
 * shell first, then the filesystem in the order a file is met — read, written,
 * edited — then the two ways of finding one, then the web. A list ordered by
 * name would scatter that, and the grouping is the only thing a reader
 * skimming eight rows actually gets from the order.
 */
const tools: Tool[] = [
  {
    id: "bash",
    name: "Bash",
    category: "agents",
    description: "Execute bash commands in a shell session",
    icon: ComputerTerminal01Icon,
  },
  {
    id: "read",
    name: "Read",
    category: "agents",
    description: "Read a file from the sandbox filesystem",
    icon: FileViewIcon,
  },
  {
    id: "write",
    name: "Write",
    category: "agents",
    description: "Write a file to the sandbox filesystem",
    icon: FileAddIcon,
  },
  {
    id: "edit",
    name: "Edit",
    category: "agents",
    description: "Perform string replacement in a file",
    icon: FileEditIcon,
  },
  {
    id: "glob",
    name: "Glob",
    category: "agents",
    description: "Fast file pattern matching using glob patterns",
    icon: FileSearchIcon,
  },
  {
    id: "grep",
    name: "Grep",
    category: "agents",
    description: "Text search using regex patterns",
    icon: TextSearchIcon,
  },
  {
    id: "web_fetch",
    name: "Web fetch",
    category: "agents",
    description: "Fetch content from a URL",
    icon: BrowserIcon,
  },
  {
    id: "web_search",
    name: "Web search",
    category: "agents",
    description: "Search the web for information",
    icon: GlobalSearchIcon,
  },
]

/**
 * The tool an id names, or nothing. A transcript outlives the catalogue that
 * was current when it was written, so a call to a tool that has since been
 * renamed or taken away has to come back empty rather than throw.
 */
function findTool(id: string, list: Tool[] = tools) {
  return list.find((tool) => tool.id === id)
}

/** The category an id names, or nothing — for the same reason. */
function findToolCategory(id: string) {
  return toolCategories.find((category) => category.id === id)
}

/**
 * The list split into the runs a menu labels, in `toolCategories` order rather
 * than the list's. A category with nothing under it is dropped, so a filtered
 * list leaves no empty headings behind.
 */
function toolsByCategory(
  list: Tool[] = tools
): { category: ToolCategory; tools: Tool[] }[] {
  return toolCategories.flatMap((category) => {
    const grouped = list.filter((tool) => tool.category === category.id)
    return grouped.length ? [{ category, tools: grouped }] : []
  })
}

export { findTool, findToolCategory, toolCategories, tools, toolsByCategory }
export type { Tool, ToolCategory }
