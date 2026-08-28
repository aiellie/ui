"use client"

import * as React from "react"
import { Wrench01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuTrigger,
} from "@/components/aiellie-ui/menu"
import {
  TooltipIconButton,
  type TooltipIconButtonProps,
} from "@/components/aiellie-ui/tooltip-icon-button"
import type { Tool } from "@/lib/tools"
import { tools as defaultTools, toolsByCategory } from "@/lib/tools"
import { cn } from "@/lib/utils"

/**
 * Which tools the answer may reach for — the control that sits in a composer
 * beside the model, because the two are the same kind of decision: what this
 * message is being sent *with*, made per message rather than once in settings.
 *
 * Checkboxes rather than the model picker's radios, and that is the whole of
 * the difference between them. A model is one choice out of many; tools are a
 * set, and a set is built by turning things on and off — so the menu stays open
 * while it is worked, which is `menu`'s default for a checkbox row and the
 * reason this is written on those rather than on items with state bolted on.
 *
 * The surface is `menu`'s, whole, and the glyphs are the catalogue's. What this
 * file adds is the part a menu has no opinion about: that the rows come from
 * `lib/tools`, that a row says what its tool does, and that the ones that are
 * on stand beside the trigger in the colours the catalogue gives them — so what
 * a message is being sent with is read off the composer rather than counted
 * inside a menu nobody has open.
 */

type ToolPickerContextValue = {
  value: string[]
  toggle: (id: string, on: boolean) => void
  tools: Tool[]
}

const ToolPickerContext = React.createContext<
  ToolPickerContextValue | undefined
>(undefined)

function useToolPickerContext(part: string) {
  const context = React.useContext(ToolPickerContext)
  if (!context) {
    throw new Error(`${part} must be used within a ToolPicker.`)
  }
  return context
}

type ToolPickerProps = Omit<React.ComponentProps<typeof Menu>, "children"> & {
  /** The ids that are on, for a picker whose state is held outside it. */
  value?: string[]
  /**
   * Where an uncontrolled picker starts. Nothing, deliberately: a picker that
   * silently switched everything on would be making the decision it exists to
   * ask about. A composer that wants the other default says so —
   * `defaultValue={tools.map((tool) => tool.id)}`.
   */
  defaultValue?: string[]
  onValueChange?: (ids: string[]) => void
  /** The catalogue to offer. Defaults to every tool `lib/tools` names. */
  tools?: Tool[]
  children?: React.ReactNode
}

function ToolPicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  tools = defaultTools,
  children,
  ...props
}: ToolPickerProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(
    defaultValue ?? []
  )
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue

  /**
   * Turning one on or off, and handing back the whole set in the catalogue's
   * order rather than the order it was clicked in. Two people who end up with
   * the same tools on should end up with the same array — otherwise anything
   * downstream comparing or storing it sees a change where there is none.
   */
  const toggle = React.useCallback(
    (id: string, on: boolean) => {
      const next = new Set(value)
      if (on) next.add(id)
      else next.delete(id)

      const ordered = tools
        .filter((tool) => next.has(tool.id))
        .map((tool) => tool.id)

      if (!isControlled) setUncontrolledValue(ordered)
      onValueChange?.(ordered)
    },
    [value, tools, isControlled, onValueChange]
  )

  const context = React.useMemo(
    () => ({ value, toggle, tools }),
    [value, toggle, tools]
  )

  return (
    <ToolPickerContext.Provider value={context}>
      <Menu data-slot="tool-picker" {...props}>
        {children}
      </Menu>
    </ToolPickerContext.Provider>
  )
}

/**
 * The thing that opens the list: a wrench, and nothing else. It used to carry
 * the count of what was on, which is the one question `ToolPickerActive`
 * answers better — a `3` says how many and never which, and three glyphs say
 * both — so the trigger is left as the way in and the row beside it is what a
 * composer is read from.
 *
 * `TooltipIconButton` is the control, as it is on the two menus next door:
 * ghost, square, and carrying its name on a hover, so a composer row of glyphs
 * still says what each one opens without taking a word's width to do it.
 *
 * `render` is passed straight through, so a composer with a control of its own
 * keeps it and only borrows the behaviour.
 */
function ToolPickerTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuTrigger>) {
  return (
    <MenuTrigger
      data-slot="tool-picker-trigger"
      aria-label="Tools"
      render={
        <TooltipIconButton
          type="button"
          tooltip="Tools"
          side="top"
          className={cn(
            "size-7 rounded-full text-muted-foreground hover:text-foreground",
            className
          )}
        />
      }
      {...props}
    >
      {children ?? (
        <HugeiconsIcon
          aria-hidden
          icon={Wrench01Icon}
          strokeWidth={1.75}
          className="size-3.5"
        />
      )}
    </MenuTrigger>
  )
}

type ToolPickerActiveToolProps = Omit<TooltipIconButtonProps, "tooltip"> & {
  tool: Tool
  /** Overrides the tool's name on the hover. */
  tooltip?: string
}

/**
 * One tool that is on, as the glyph it is drawn with and the colour the
 * catalogue gives it. Pressing it takes the tool off: the menu is where a set
 * is built, this row is where it is loosened, and a set that took two clicks
 * and a scroll to loosen would send people back to sending everything.
 *
 * `link` rather than the ghost the trigger and the menus next door wear.
 * Ghost paints its own fill and its own colour over a hover, and a tool that
 * turns grey the moment it is pointed at has lost the one thing this row is
 * for; `link` is the only variant that brings neither, so the tool's colour is
 * the only colour on the button, at rest and under the cursor both — the hover
 * below is that same colour again, deepened, taken from `currentColor` so it
 * holds for a catalogue this file has never seen.
 */
function ToolPickerActiveTool({
  tool,
  tooltip,
  className,
  children,
  onClick,
  ...props
}: ToolPickerActiveToolProps) {
  const { value, toggle } = useToolPickerContext("ToolPickerActiveTool")
  const on = value.includes(tool.id)

  return (
    <TooltipIconButton
      data-slot="tool-picker-active-tool"
      type="button"
      variant="link"
      tooltip={tooltip ?? tool.name}
      side="top"
      // A button only ever drawn while its tool is on has no other way of
      // saying that it is a state and not an action.
      aria-pressed={on}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) toggle(tool.id, !on)
      }}
      className={cn(
        "size-7 rounded-full border hover:bg-current/15 hover:no-underline",
        tool.color,
        className
      )}
      {...props}
    >
      {children ?? (
        <HugeiconsIcon
          aria-hidden
          icon={tool.icon}
          strokeWidth={1.75}
          className="size-3.5"
        />
      )}
    </TooltipIconButton>
  )
}

/**
 * The tools that are on, beside the picker rather than counted inside it, in
 * the catalogue's order so the row does not reshuffle itself as it is worked.
 *
 * Nothing at all while nothing is on — an empty row would hold a gap open for
 * a state that already has a name, which is the unlit wrench next to it.
 */
function ToolPickerActive({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { value, tools } = useToolPickerContext("ToolPickerActive")
  const chosen = tools.filter((tool) => value.includes(tool.id))

  if (!children && !chosen.length) return null

  return (
    <div
      data-slot="tool-picker-active"
      className={cn("flex flex-wrap items-center gap-1", className)}
      {...props}
    >
      {children ??
        chosen.map((tool) => (
          <ToolPickerActiveTool key={tool.id} tool={tool} />
        ))}
    </div>
  )
}

/**
 * One tool. Its glyph, its name, and the line on what a call to it does — the
 * description is the whole point of the row: `glob` and `grep` are a pair of
 * four-letter words to anyone who has not met them, and a list of names alone
 * would be asking the reader to already know the answer.
 */
function ToolPickerItem({
  tool,
  className,
  ...props
}: Omit<React.ComponentProps<typeof MenuCheckboxItem>, "checked"> & {
  tool: Tool
}) {
  const { value, toggle } = useToolPickerContext("ToolPickerItem")

  return (
    <MenuCheckboxItem
      data-slot="tool-picker-item"
      checked={value.includes(tool.id)}
      onCheckedChange={(checked) => toggle(tool.id, checked)}
      className={cn("items-start gap-2.5 px-2 py-1.5", className)}
      {...props}
    >
      <HugeiconsIcon
        aria-hidden
        icon={tool.icon}
        strokeWidth={1.75}
        className="mt-px size-4 shrink-0 text-muted-foreground/80"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-foreground">{tool.name}</span>
        <span className="truncate text-[11px] leading-4 font-normal text-muted-foreground/80">
          {tool.description}
        </span>
      </span>
    </MenuCheckboxItem>
  )
}

/**
 * The list, standing each tool under the group it belongs to. Written from the
 * catalogue rather than by hand, since a picker that has to be edited every
 * time a tool is added is a picker that goes stale — and a category with
 * nothing under it is dropped by `toolsByCategory`, so a filtered list leaves
 * no empty headings behind.
 */
function ToolPickerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  const { tools } = useToolPickerContext("ToolPickerContent")
  const groups = toolsByCategory(tools)

  return (
    <MenuContent
      data-slot="tool-picker-content"
      // Wider than a menu of words needs to be, because these rows are not
      // words: each carries a sentence on what its tool does, and a sentence
      // clipped in half is worse than no sentence at all.
      className={cn("w-88 max-w-[calc(100vw-2rem)]", className)}
      {...props}
    >
      {children ??
        groups.map(({ category, tools: grouped }) => (
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
            {grouped.map((tool) => (
              <ToolPickerItem key={tool.id} tool={tool} />
            ))}
          </MenuGroup>
        ))}
    </MenuContent>
  )
}

export {
  ToolPicker,
  ToolPickerActive,
  ToolPickerActiveTool,
  ToolPickerContent,
  ToolPickerItem,
  ToolPickerTrigger,
}
export type { ToolPickerActiveToolProps, ToolPickerProps }
