"use client"

import * as React from "react"
import {
  ArrowDown01Icon,
  CircleDashedIcon,
  QuillWrite01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/aiellie-ui/menu"
import { Button } from "@/components/ui/button"
import type { Instruction, InstructionCategory } from "@/lib/instructions"
import {
  findInstruction,
  instructionCategories as defaultCategories,
  instructions as defaultInstructions,
  instructionsByCategory,
} from "@/lib/instructions"
import { cn } from "@/lib/utils"

/**
 * Which prompt the agent is stood under — the last of the decisions a composer
 * asks before a message is sent, after the model, the tools and the rope.
 * Those three set what a run may do; this one sets what it is like, and it is
 * usually the one buried in a settings page as a box to paste a system prompt
 * into. A menu instead, because most sessions want one of a house set, and a
 * house set has names — "code reviewer" is a thing to pick, not a paragraph to
 * retype.
 *
 * Radios rather than the tool picker's checkboxes, because prompts contradict
 * each other in a way tools cannot: concise and explanatory are not a set
 * anyone means to be under at once. One is in force at a time, so the menu
 * shuts on a press.
 *
 * Unlike an approval mode, none is a real answer here. An agent with nothing
 * stood over it is the ordinary case, so the way back to it is the first row
 * of the menu rather than a cleared setting found somewhere else — and the
 * trigger only lights while something is set.
 *
 * The surface is `menu`'s and the catalogue is `lib/instructions`; what this
 * file adds is the part neither has an opinion about: that a row carries the
 * line on how its prompt changes the answer, and that the trigger wears the
 * name of the one in force.
 */

type PromptMenuContextValue = {
  value: string
  setValue: (id: string) => void
  instructions: Instruction[]
  categories: InstructionCategory[]
}

const PromptMenuContext = React.createContext<
  PromptMenuContextValue | undefined
>(undefined)

function usePromptMenuContext(part: string) {
  const context = React.useContext(PromptMenuContext)
  if (!context) {
    throw new Error(`${part} must be used within a PromptMenu.`)
  }
  return context
}

type PromptMenuProps = Omit<React.ComponentProps<typeof Menu>, "children"> & {
  /**
   * The chosen prompt's id — or an empty string for none — for a menu whose
   * state is held outside it.
   */
  value?: string
  /**
   * Where an uncontrolled menu starts. Nothing, deliberately: a prompt is a
   * thing chosen, and a menu that silently stood the agent under one would be
   * making the decision it exists to ask about.
   */
  defaultValue?: string
  onValueChange?: (id: string) => void
  /** The catalogue to offer. Defaults to every prompt `lib/instructions` names. */
  instructions?: Instruction[]
  /** The headings to stand them under. Defaults to the catalogue's own. */
  categories?: InstructionCategory[]
  children?: React.ReactNode
}

function PromptMenu({
  value: valueProp,
  defaultValue,
  onValueChange,
  instructions = defaultInstructions,
  categories = defaultCategories,
  children,
  ...props
}: PromptMenuProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? ""
  )
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue

  const setValue = React.useCallback(
    (id: string) => {
      if (!isControlled) setUncontrolledValue(id)
      onValueChange?.(id)
    },
    [isControlled, onValueChange]
  )

  const context = React.useMemo(
    () => ({ value, setValue, instructions, categories }),
    [value, setValue, instructions, categories]
  )

  return (
    <PromptMenuContext.Provider value={context}>
      <Menu data-slot="prompt-menu" {...props}>
        {children}
      </Menu>
    </PromptMenuContext.Provider>
  )
}

/**
 * The prompt in force, as the thing that opens the list — or the word
 * "Prompt" and an unlit control while there is none. Ghost and small like the
 * pickers it sits beside, for the same reason theirs are: this sits next to
 * the field, and a control with a border competes with the field for the
 * attention that belongs to the writing.
 *
 * It lights while anything is set, the way the tool picker's does while any
 * tool is on: a run under a prompt answers differently, and that should be
 * visible without the menu being opened.
 *
 * `render` is passed straight through, so a composer with a control of its
 * own keeps it and only borrows the behaviour.
 */
function PromptMenuTrigger({
  className,
  children,
  showIcon = true,
  ...props
}: React.ComponentProps<typeof MenuTrigger> & { showIcon?: boolean }) {
  const { value, instructions } = usePromptMenuContext("PromptMenuTrigger")
  const chosen = findInstruction(value, instructions)

  return (
    <MenuTrigger
      data-slot="prompt-menu-trigger"
      aria-label={chosen ? `Prompt: ${chosen.name}` : "Choose a prompt"}
      render={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          data-active={chosen ? true : undefined}
          className={cn(
            // `w-fit` because a Button is `width: auto` and a menu put in a
            // column would otherwise be stretched the width of the column.
            "w-fit gap-1.5 font-medium text-muted-foreground hover:text-foreground",
            // Lit while a prompt is set — the name says which, and this says
            // at a glance that the answer is not none.
            "data-active:bg-foreground/[0.06] data-active:text-foreground dark:data-active:bg-foreground/[0.09]",
            className
          )}
        />
      }
      {...props}
    >
      {children ?? (
        <>
          {showIcon ? (
            <HugeiconsIcon
              aria-hidden
              icon={chosen?.icon ?? QuillWrite01Icon}
              strokeWidth={1.75}
              className="size-3.5 opacity-70"
            />
          ) : null}
          {chosen?.name ?? "Prompt"}
          <HugeiconsIcon
            aria-hidden
            icon={ArrowDown01Icon}
            strokeWidth={1.75}
            className="size-3 opacity-60"
          />
        </>
      )}
    </MenuTrigger>
  )
}

/**
 * One prompt: its glyph, its name, and the line on how the answer changes
 * under it. The line wraps rather than truncating — most of these names are
 * one vague word until the sentence under them says what it means here.
 */
function PromptMenuItem({
  instruction,
  className,
  ...props
}: Omit<React.ComponentProps<typeof MenuRadioItem>, "value"> & {
  instruction: Instruction
}) {
  return (
    <MenuRadioItem
      data-slot="prompt-menu-item"
      value={instruction.id}
      // One prompt is in force at a time, so taking one is the end of the
      // menu's business. Base UI holds a radio row's menu open by default,
      // which is right for a checkbox and wrong for this.
      closeOnClick
      className={cn("items-start gap-2.5 px-2 py-1.5", className)}
      {...props}
    >
      <HugeiconsIcon
        aria-hidden
        icon={instruction.icon}
        strokeWidth={1.75}
        className="mt-px size-4 shrink-0 text-muted-foreground/80"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-foreground">{instruction.name}</span>
        <span className="text-[11px] leading-4 font-normal text-balance text-muted-foreground/80">
          {instruction.description}
        </span>
      </span>
    </MenuRadioItem>
  )
}

/**
 * The way back to nothing, kept as a row where the choices are rather than a
 * cleared setting found later — because none is a real choice here: the agent
 * as it comes. The dashed circle is the mark for a state with nothing in it,
 * and the row keeps the muted tone the others reserve for their sentences.
 */
function PromptMenuNoneItem({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof MenuRadioItem>, "value">) {
  return (
    <MenuRadioItem
      data-slot="prompt-menu-none-item"
      value=""
      closeOnClick
      className={cn("gap-2.5 px-2 py-1.5", className)}
      {...props}
    >
      <HugeiconsIcon
        aria-hidden
        icon={CircleDashedIcon}
        strokeWidth={1.75}
        className="size-4 shrink-0 text-muted-foreground/60"
      />
      {children ?? <span className="truncate">None</span>}
    </MenuRadioItem>
  )
}

/**
 * The list: none first, then each prompt stood under the group it belongs to.
 * Written out of the catalogue rather than by hand, since a menu that has to
 * be edited every time a prompt is added is a menu that goes stale — and a
 * category with nothing under it is dropped by `instructionsByCategory`, so a
 * filtered list leaves no empty headings behind.
 */
function PromptMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  const { value, setValue, instructions, categories } =
    usePromptMenuContext("PromptMenuContent")
  const groups = instructionsByCategory(instructions, categories)

  return (
    <MenuContent
      data-slot="prompt-menu-content"
      // Wider than a menu of words needs to be, because these rows are not
      // words: each carries the sentence that is the only thing telling one
      // prompt from the next.
      className={cn("w-72 max-w-[calc(100vw-2rem)]", className)}
      {...props}
    >
      {children ?? (
        <MenuRadioGroup
          value={value}
          onValueChange={(next) => setValue(String(next))}
        >
          <PromptMenuNoneItem />
          <MenuSeparator />
          {groups.map(({ category, instructions: grouped }) => (
            <MenuGroup key={category.id}>
              <MenuGroupLabel className="flex items-center gap-1.5">
                <HugeiconsIcon
                  aria-hidden
                  icon={category.icon}
                  strokeWidth={2}
                  className="size-3"
                />
                {category.name}
              </MenuGroupLabel>
              {grouped.map((instruction) => (
                <PromptMenuItem
                  key={instruction.id}
                  instruction={instruction}
                />
              ))}
            </MenuGroup>
          ))}
        </MenuRadioGroup>
      )}
    </MenuContent>
  )
}

export {
  PromptMenu,
  PromptMenuContent,
  PromptMenuItem,
  PromptMenuNoneItem,
  PromptMenuTrigger,
}
export type { PromptMenuProps }
