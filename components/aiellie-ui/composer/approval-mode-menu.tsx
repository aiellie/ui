"use client"

import * as React from "react"
import {
  AiMagicIcon,
  PencilEdit02Icon,
  SquareUnlock01Icon,
  TaskDaily01Icon,
  Touch01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/aiellie-ui/menu"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { cn } from "@/lib/utils"

/**
 * How much rope the agent is given — the third of the decisions a composer
 * asks before a message is sent, after which model is answering and which
 * tools it may reach for. Unlike those two it is not about capability but
 * about consent: the same run, under a different mode, either stops at every
 * step or stops at none.
 *
 * Radios rather than the tool picker's checkboxes, and that is most of the
 * difference between them: a set of tools is built by turning things on and
 * off, a mode is one choice out of five, so the menu shuts on a press
 * (`closeOnClick`, which Base UI leaves off by default) rather than staying
 * open to be worked.
 *
 * Every row carries its sentence rather than keeping it behind a hover the way
 * the model picker does. Five rows can afford the room, and the cost of
 * guessing wrong here is not a worse answer but an action nobody agreed to —
 * "Accept edits" and "Full access" are indistinguishable to anyone reading two
 * words, and the sentence is the whole of what tells them apart.
 *
 * The surface is `menu`'s, whole. What this file adds is the catalogue, the
 * sentence on each row, and the one thing a menu has no opinion about: that
 * the mode which asks for nothing is drawn as the danger it is, on the row and
 * on the trigger both, so a composer left in it says so without being opened.
 */

interface ApprovalMode {
  /**
   * What the mode is stored and sent as — the value a session carries, so a
   * transcript can be read straight against this list.
   */
  id: string
  /** The same thing written the way it is spoken, for a row and a trigger. */
  name: string
  /** One line, in the present tense, on what running under it means. */
  description: string
  icon: IconSvgElement
  /**
   * Marks the mode that asks for nothing. Drawn in the destructive tone
   * wherever it turns up, which is the only reason the flag exists — a mode
   * that hands over the filesystem should not look like a preference.
   */
  destructive?: boolean
}

/**
 * In the order they were asked for, which is also roughly the order they are
 * reached for: the two everyday ones first, the two narrower ones after, and
 * the one that gives everything away last, where a separator keeps it from
 * being clicked on the way past.
 */
const approvalModes: ApprovalMode[] = [
  {
    id: "auto",
    name: "Auto",
    description:
      "Decides for itself, and stops to ask only when an action looks risky.",
    icon: AiMagicIcon,
  },
  {
    id: "manual",
    name: "Manual",
    description: "Asks before every action, one at a time.",
    icon: Touch01Icon,
  },
  {
    id: "accept-edits",
    name: "Accept edits",
    description:
      "Writes files without asking. Everything else still stops for a yes.",
    icon: PencilEdit02Icon,
  },
  {
    id: "plan",
    name: "Plan",
    description:
      "Reads and proposes, changing nothing until the plan is agreed.",
    icon: TaskDaily01Icon,
  },
  {
    id: "full-access",
    name: "Full access",
    description:
      "Never asks. Every command and every write goes through unattended.",
    icon: SquareUnlock01Icon,
    destructive: true,
  },
]

/**
 * The mode an id names, or nothing. A session outlives the catalogue that was
 * current when it started, so a mode that has since been renamed or taken away
 * has to come back empty rather than throw.
 */
function findApprovalMode(id: string, list: ApprovalMode[] = approvalModes) {
  return list.find((mode) => mode.id === id)
}

type ApprovalModeMenuContextValue = {
  value: string
  setValue: (id: string) => void
  modes: ApprovalMode[]
}

const ApprovalModeMenuContext = React.createContext<
  ApprovalModeMenuContextValue | undefined
>(undefined)

function useApprovalModeMenuContext(part: string) {
  const context = React.useContext(ApprovalModeMenuContext)
  if (!context) {
    throw new Error(`${part} must be used within an ApprovalModeMenu.`)
  }
  return context
}

type ApprovalModeMenuProps = Omit<
  React.ComponentProps<typeof Menu>,
  "children"
> & {
  /** The chosen mode's id, for a menu whose state is held outside it. */
  value?: string
  /**
   * Where an uncontrolled menu starts. The first mode on offer otherwise —
   * never the last, which is why `full-access` is at the end of the catalogue
   * and not the top of it.
   */
  defaultValue?: string
  onValueChange?: (id: string) => void
  /** The modes to offer. Defaults to all five. */
  modes?: ApprovalMode[]
  children?: React.ReactNode
}

function ApprovalModeMenu({
  value: valueProp,
  defaultValue,
  onValueChange,
  modes = approvalModes,
  children,
  ...props
}: ApprovalModeMenuProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? modes[0]?.id ?? ""
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
    () => ({ value, setValue, modes }),
    [value, setValue, modes]
  )

  return (
    <ApprovalModeMenuContext.Provider value={context}>
      <Menu data-slot="approval-mode-menu" {...props}>
        {children}
      </Menu>
    </ApprovalModeMenuContext.Provider>
  )
}

/**
 * The mode in force, as the glyph that opens the list. `TooltipIconButton`
 * is the control: ghost, square, and carrying the name on a hover, so a
 * composer row of glyphs still says which mode is on without taking a word's
 * width to do it.
 *
 * It turns destructive along with the mode. That is the point of the trigger
 * rather than a nicety: a composer sat in full access looks exactly like one
 * sat in manual until something has already run, and the row that said so is
 * behind a menu nobody has open.
 *
 * `render` is passed straight through, so a composer with a control of its own
 * keeps it and only borrows the behaviour.
 */
function ApprovalModeMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuTrigger>) {
  const { value, modes } = useApprovalModeMenuContext("ApprovalModeMenuTrigger")
  const mode = findApprovalMode(value, modes)
  const name = mode?.name ?? "Approval mode"

  return (
    <MenuTrigger
      data-slot="approval-mode-menu-trigger"
      aria-label={
        mode ? `Approval mode: ${mode.name}` : "Choose an approval mode"
      }
      render={
        <TooltipIconButton
          type="button"
          tooltip={name}
          side="top"
          data-destructive={mode?.destructive || undefined}
          className={cn(
            "size-7 border text-muted-foreground hover:text-foreground",
            // Two conditions to the ghost variant's one, so these win on
            // specificity without either being written `!important`.
            "data-destructive:text-destructive data-destructive:hover:bg-destructive/10 data-destructive:hover:text-destructive data-destructive:aria-expanded:bg-destructive/10 data-destructive:aria-expanded:text-destructive dark:data-destructive:hover:bg-destructive/20 dark:data-destructive:aria-expanded:bg-destructive/20",
            className
          )}
        />
      }
      {...props}
    >
      {children ??
        (mode ? (
          <HugeiconsIcon
            aria-hidden
            icon={mode.icon}
            strokeWidth={1.75}
            className="size-3.5 opacity-70"
          />
        ) : null)}
    </MenuTrigger>
  )
}

/**
 * One mode: its glyph, its name, and the line on what running under it means.
 * The sentence wraps rather than truncating — a mode clipped at "Writes files
 * without asking…" has had the half that mattered taken off it.
 */
function ApprovalModeMenuItem({
  mode,
  className,
  ...props
}: Omit<React.ComponentProps<typeof MenuRadioItem>, "value"> & {
  mode: ApprovalMode
}) {
  return (
    <MenuRadioItem
      data-slot="approval-mode-menu-item"
      data-destructive={mode.destructive || undefined}
      value={mode.id}
      // A mode is one choice out of five, so taking one is the end of the
      // menu's business. Base UI holds a radio row's menu open by default,
      // which is right for a checkbox and wrong for this.
      closeOnClick
      className={cn(
        "items-start gap-2.5 px-2 py-1.5",
        mode.destructive &&
          // The same tones `menu`'s destructive item carries, put back by hand
          // because a radio row has no `variant` to inherit them from. The
          // dark tint is the heavier one: the alpha that reads as a warning
          // over a light surface barely registers over a dark one, and over
          // glass there is a translucent popup fill in the way as well.
          "text-destructive data-highlighted:bg-destructive/5 data-highlighted:text-destructive dark:data-highlighted:bg-destructive/15",
        className
      )}
      {...props}
    >
      <HugeiconsIcon
        aria-hidden
        icon={mode.icon}
        strokeWidth={1.75}
        className={cn(
          "mt-px size-4 shrink-0",
          mode.destructive ? "text-destructive/80" : "text-muted-foreground/80"
        )}
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            "truncate",
            mode.destructive ? "text-destructive" : "text-foreground"
          )}
        >
          {mode.name}
        </span>
        <span
          className={cn(
            "text-[11px] leading-4 font-normal text-balance",
            mode.destructive
              ? "text-destructive/70"
              : "text-muted-foreground/80"
          )}
        >
          {mode.description}
        </span>
      </span>
    </MenuRadioItem>
  )
}

/**
 * The list, written from the catalogue rather than by hand so a mode added
 * later is one entry and not an edit here as well.
 *
 * The separator is placed by rule instead of being hard-coded at the fourth
 * row: whatever the catalogue holds, the run of ordinary modes is set apart
 * from the first destructive one, so the row that hands everything over is
 * never the one under the pointer on the way past.
 */
function ApprovalModeMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  const { value, setValue, modes } = useApprovalModeMenuContext(
    "ApprovalModeMenuContent"
  )

  return (
    <MenuContent
      data-slot="approval-mode-menu-content"
      // Wider than a menu of words needs to be, because these rows are not
      // words: each carries the sentence that is the only thing telling one
      // mode from the next.
      className={cn("w-full max-w-[calc(100vw-2rem)]", className)}
      {...props}
    >
      {children ?? (
        <MenuRadioGroup
          value={value}
          onValueChange={(next) => setValue(String(next))}
        >
          {modes.map((mode, index) => (
            <React.Fragment key={mode.id}>
              {index > 0 &&
              mode.destructive &&
              !modes[index - 1].destructive ? (
                <MenuSeparator />
              ) : null}
              <ApprovalModeMenuItem mode={mode} />
            </React.Fragment>
          ))}
        </MenuRadioGroup>
      )}
    </MenuContent>
  )
}

export {
  ApprovalModeMenu,
  ApprovalModeMenuContent,
  ApprovalModeMenuItem,
  ApprovalModeMenuTrigger,
  approvalModes,
  findApprovalMode,
}
export type { ApprovalMode, ApprovalModeMenuProps }
