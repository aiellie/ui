import {
  AiBrain01Icon,
  Book02Icon,
  Bug01Icon,
  EraserIcon,
  FoldVerticalIcon,
  HelpCircleIcon,
  TestTube01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

/** Example data. What a slash reaches for in a coding agent's composer. */
export interface Command {
  id: string
  name: string
  description: string
  /** What the ones that want something after the name want. */
  argument?: string
  group: string
  icon: IconSvgElement
}

export const commands: Command[] = [
  {
    id: "model",
    name: "model",
    description: "Change which model answers, from here on",
    argument: "<name>",
    group: "Session",
    icon: AiBrain01Icon,
  },
  {
    id: "clear",
    name: "clear",
    description: "Forget the thread and start again",
    group: "Session",
    icon: EraserIcon,
  },
  {
    id: "compact",
    name: "compact",
    description: "Fold what has been said into a summary and carry on",
    argument: "<focus>",
    group: "Session",
    icon: FoldVerticalIcon,
  },
  {
    id: "init",
    name: "init",
    description: "Write the file that tells an agent about this repository",
    group: "Repository",
    icon: Book02Icon,
  },
  {
    id: "review",
    name: "review",
    description: "Read the diff for what it will cost later",
    argument: "<path>",
    group: "Repository",
    icon: Bug01Icon,
  },
  {
    id: "test",
    name: "test",
    description: "Run the tests, or only the ones that match",
    argument: "<pattern>",
    group: "Repository",
    icon: TestTube01Icon,
  },
  {
    id: "help",
    name: "help",
    description: "List everything that can be typed here",
    group: "Help",
    icon: HelpCircleIcon,
  },
]
