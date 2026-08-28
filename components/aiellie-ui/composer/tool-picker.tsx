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
import { Button } from "@/components/ui/button"
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
 * `lib/tools`, that a row says what its tool does, and that the trigger carries
 * the count so the answer to "how many are on?" does not require opening it.
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
 * The thing that opens the list: a wrench, and the count once there is one to
 * show. Ghost and small for the same reason the model picker's is — this sits
 * beside the field, and a control with a border competes with the field for the
 * attention that belongs to the writing.
 *
 * It squares up to an icon button while nothing is on and widens for the count
 * rather than holding a slot open for it, because a `0` sitting there says the
 * same thing as an unlit button while taking a number to read.
 *
 * `render` is passed straight through, so a composer with a control of its own
 * keeps it and only borrows the behaviour.
 */
function ToolPickerTrigger({
  className,
  children,
  showCount = true,
  ...props
}: React.ComponentProps<typeof MenuTrigger> & { showCount?: boolean }) {
  const { value } = useToolPickerContext("ToolPickerTrigger")
  const count = value.length
  const withCount = showCount && count > 0

  return (
    <MenuTrigger
      data-slot="tool-picker-trigger"
      aria-label={count ? `Tools, ${count} on` : "Tools"}
      render={
        <Button
          type="button"
          variant="ghost"
          size={withCount ? "sm" : "icon-sm"}
          data-active={count > 0 || undefined}
          className={cn(
            // `w-fit` because a Button is `width: auto` and a picker put in a
            // column would otherwise be stretched the width of the column.
            "w-fit gap-1.5 rounded-full font-medium text-muted-foreground hover:text-foreground",
            // Lit while anything is on — the count says how many, and this says
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
          <HugeiconsIcon
            aria-hidden
            icon={Wrench01Icon}
            strokeWidth={1.75}
            className="size-3.5"
          />
          {withCount ? <span className="tabular-nums">{count}</span> : null}
        </>
      )}
    </MenuTrigger>
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

export { ToolPicker, ToolPickerContent, ToolPickerItem, ToolPickerTrigger }
export type { ToolPickerProps }
