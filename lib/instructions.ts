import {
  ArrowShrink02Icon,
  BookOpen01Icon,
  GitPullRequestIcon,
  Mortarboard01Icon,
  QuoteUpIcon,
  Route01Icon,
  TaskDaily01Icon,
  TestTube01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

/**
 * The prompts an agent can be stood under, and what each one is called when it
 * is. A catalogue in the same spirit as `lib/tools` beside it — a name, the
 * line a menu shows on how it changes the answer, and the text itself — and
 * nothing whatsoever about how it is applied. Where the words end up (a system
 * message, a developer turn, a file on disk) is the caller's business; this
 * file only has to be able to say which prompt was set and hand the words
 * over.
 *
 * The glyph sits on the entry itself rather than in `components/icons`, for
 * the reason `lib/tools` gives at more length: these are interface marks
 * drawn out of one set, and nothing reads this list without drawing them.
 */

/**
 * The groups a prompt falls into. Two here — how the answer reads, and how the
 * work is gone about — but a list rather than a union, so a project's own
 * heading is an entry handed to the menu and not a refactor.
 */
interface InstructionCategory {
  /** The lookup key: what an instruction's `category` names. */
  id: string
  name: string
  /** One line on what the group is for, for a heading with room under it. */
  description: string
  icon: IconSvgElement
}

const instructionCategories: InstructionCategory[] = [
  {
    id: "styles",
    name: "Styles",
    description: "How the answer reads, whatever it is about.",
    icon: QuoteUpIcon,
  },
  {
    id: "workflows",
    name: "Workflows",
    description: "How the work is gone about before it is written up.",
    icon: Route01Icon,
  },
]

interface Instruction {
  /**
   * What the prompt is stored and sent under — the value a session carries,
   * so a transcript can be read straight against this list.
   */
  id: string
  /** The same thing written the way it is spoken, for a row and a trigger. */
  name: string
  /** An `InstructionCategory["id"]`. */
  category: string
  /** One line, in the present tense, on how the answer changes under it. */
  description: string
  /** The instruction itself — the words actually handed to the model. */
  prompt: string
  icon: IconSvgElement
}

/**
 * Styles first and workflows after, matching the category order: the styles
 * are what a first session reaches for, and the workflows are what a team
 * writes for itself once it has opinions. Each prompt is a starting point
 * rather than a house rule — the whole reason the words live here as data is
 * that changing them means editing this file and nothing else.
 */
const instructions: Instruction[] = [
  {
    id: "concise",
    name: "Concise",
    category: "styles",
    description: "Answers in the fewest words that still answer.",
    prompt:
      "Be concise. Lead with the answer, leave the preamble and the hedging out, and stop as soon as the question is dealt with.",
    icon: ArrowShrink02Icon,
  },
  {
    id: "explanatory",
    name: "Explanatory",
    category: "styles",
    description: "Teaches as it goes, saying why before what.",
    prompt:
      "Explain the reasoning as you work: before each step, say why it is the right one, and prefer a short lesson to a bare answer the reader cannot check.",
    icon: Mortarboard01Icon,
  },
  {
    id: "formal",
    name: "Formal",
    category: "styles",
    description: "Writes the way documentation would.",
    prompt:
      "Write formally, as documentation would: full sentences, no asides, and every term defined the first time it is used.",
    icon: BookOpen01Icon,
  },
  {
    id: "code-reviewer",
    name: "Code reviewer",
    category: "workflows",
    description: "Reads a change for what would break, and says where.",
    prompt:
      "Review rather than restate: read the change for what would break, name the file and line it would break at, and rank the findings by how much each one matters.",
    icon: GitPullRequestIcon,
  },
  {
    id: "planner",
    name: "Planner",
    category: "workflows",
    description: "Lays the work out before doing any of it.",
    prompt:
      "Plan before acting: lay the work out as ordered steps, say what each one touches, and wait for agreement before starting on the first.",
    icon: TaskDaily01Icon,
  },
  {
    id: "test-first",
    name: "Test-first",
    category: "workflows",
    description: "Writes the failing test before the code.",
    prompt:
      "Work test-first: write the test that pins the behaviour down, watch it fail, then write the least code that makes it pass.",
    icon: TestTube01Icon,
  },
]

/**
 * The instruction an id names, or nothing. A session outlives the catalogue
 * that was current when it started, so a prompt that has since been renamed or
 * taken away has to come back empty rather than throw — and the empty string a
 * menu uses for "none" falls out the same way.
 */
function findInstruction(id: string, list: Instruction[] = instructions) {
  return list.find((instruction) => instruction.id === id)
}

/** The category an id names, or nothing — for the same reason. */
function findInstructionCategory(
  id: string,
  list: InstructionCategory[] = instructionCategories
) {
  return list.find((category) => category.id === id)
}

/**
 * The list split into the runs a menu labels, in category order rather than
 * the list's. The categories are a parameter as well as the prompts, because
 * a project handing the menu its own catalogue brings its own headings with
 * it — and a category with nothing under it is dropped, so a filtered list
 * leaves no empty headings behind.
 */
function instructionsByCategory(
  list: Instruction[] = instructions,
  categories: InstructionCategory[] = instructionCategories
): { category: InstructionCategory; instructions: Instruction[] }[] {
  return categories.flatMap((category) => {
    const grouped = list.filter(
      (instruction) => instruction.category === category.id
    )
    return grouped.length ? [{ category, instructions: grouped }] : []
  })
}

export {
  findInstruction,
  findInstructionCategory,
  instructionCategories,
  instructions,
  instructionsByCategory,
}
export type { Instruction, InstructionCategory }
