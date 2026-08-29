"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import {
  AiBrain01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Loading03Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { collapsePanel } from "@/components/aiellie-ui/actions"
import { cn } from "@/lib/utils"

/**
 * The work behind an answer, folded away — and inside the fold, the shape the
 * work actually had.
 *
 * Thinking is not a paragraph. A run reads three files, tries something,
 * backs out, tries again; the honest transcript of that is a tree — steps,
 * some of which were made of steps — and this element draws the tree at
 * whatever depth the run went to. A flat line of prose is still the simplest
 * case and still works: a bare `ReasoningStep` is a sentence, as before.
 *
 * Three parts carry the structure:
 * - `ReasoningStep` — one row: a glyph, the words, and the small fact worth
 *   pinning to the row's end (a count, a duration).
 * - `ReasoningBranch` — a step that was made of steps. Its trigger is a row
 *   like any other; its panel is another level of the same things, indented
 *   by one rule. Branches nest in branches without anything counting levels.
 * - `ReasoningTrigger` — the line over the whole of it, keeping the clock.
 */

type ReasoningContextValue = {
  thinking: boolean
  seconds: number
}

const ReasoningContext = React.createContext<ReasoningContextValue>({
  thinking: false,
  seconds: 0,
})

/**
 * How long it has been going, in whole seconds. A clock rather than a duration
 * prop, since the caller knows when thinking began and ended and would
 * otherwise have to keep a timer of its own to say so.
 *
 * Measured against the moment the run started rather than counted up tick by
 * tick: a background tab throttles timers, and a count of ticks would come back
 * from one insisting the model thought for nine seconds when it thought for
 * forty.
 */
function useElapsed(thinking: boolean) {
  const [elapsed, setElapsed] = React.useState(0)

  React.useEffect(() => {
    if (!thinking) return undefined

    const started = Date.now()
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - started) / 1000)),
      250
    )

    return () => clearInterval(id)
  }, [thinking])

  return elapsed
}

export interface ReasoningProps extends Omit<Collapsible.Root.Props, "render"> {
  /** Whether the thinking is still going. */
  thinking?: boolean
  /**
   * How long it took, when the caller already knows — a transcript being
   * replayed rather than a run being watched.
   */
  duration?: number
}

/**
 * The root, folded away. Open while it is happening and closed once it is
 * done, unless the reader says otherwise: watching it think is worth
 * something, and a finished answer with its whole reasoning still unfolded
 * above it buries the part that was asked for. A reader who opens or closes
 * it takes that decision off the component for the rest of the run.
 */
export function Reasoning({
  thinking = false,
  duration,
  open: openProp,
  defaultOpen,
  onOpenChange,
  className,
  ...props
}: ReasoningProps) {
  const [choice, setChoice] = React.useState<boolean | null>(null)
  const elapsed = useElapsed(thinking)
  const seconds = duration ?? elapsed

  // Derived rather than pushed into state by an effect: the panel follows the
  // run until somebody disagrees with it, and the disagreement is what is kept.
  const open = openProp ?? choice ?? defaultOpen ?? thinking

  const context = React.useMemo(
    () => ({ thinking, seconds }),
    [thinking, seconds]
  )

  return (
    <ReasoningContext.Provider value={context}>
      <Collapsible.Root
        data-slot="reasoning"
        data-thinking={thinking || undefined}
        open={open}
        onOpenChange={(next, details) => {
          setChoice(next)
          onOpenChange?.(next, details)
        }}
        className={cn("w-full max-w-lg", className)}
        {...props}
      />
    </ReasoningContext.Provider>
  )
}

/**
 * The line that says what is happening and opens the rest. Quiet by design —
 * it is a note about the answer rather than part of it, so it takes no border,
 * no fill and the smallest type in the message.
 */
export function ReasoningTrigger({
  children,
  className,
  ...props
}: Collapsible.Trigger.Props) {
  const { thinking, seconds } = React.useContext(ReasoningContext)

  return (
    <Collapsible.Trigger
      data-slot="reasoning-trigger"
      className={cn(
        "group/reasoning flex w-fit cursor-pointer items-center gap-1.5 rounded-lg py-1 pe-2 text-xs text-muted-foreground transition-colors duration-150 outline-none hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/50 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <HugeiconsIcon
        icon={AiBrain01Icon}
        className={cn(
          "size-3.5 shrink-0",
          // The pulse is the whole of the running state: a spinner beside a
          // word that already says "thinking" is saying it twice.
          thinking && "animate-pulse motion-reduce:animate-none"
        )}
      />
      <span>
        {children ??
          (thinking
            ? seconds > 0
              ? `Thinking for ${seconds}s`
              : "Thinking"
            : seconds > 0
              ? `Thought for ${seconds}s`
              : "Thought about it")}
      </span>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        className="size-3.5 shrink-0 transition-transform duration-200 group-data-[panel-open]/reasoning:rotate-180 motion-reduce:transition-none"
      />
    </Collapsible.Trigger>
  )
}

/**
 * The work itself, set apart by a rule down the start edge rather than a box:
 * it is an aside to the answer, and a panel would give it the weight of
 * another message. Branches repeat the same rule one level in, so depth is
 * read off the rules the way a thread's replies are.
 */
export function ReasoningContent({
  className,
  children,
  ...props
}: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="reasoning-content"
      className={cn(collapsePanel, className)}
      {...props}
    >
      <div className="ms-1.5 mt-1 flex flex-col border-s border-border ps-3 text-xs leading-relaxed text-muted-foreground">
        {children}
      </div>
    </Collapsible.Panel>
  )
}

export type ReasoningStepStatus = "pending" | "running" | "done" | "error"

/** The mark a status wears when the step has no glyph of its own. */
const STATUS_ICONS: Record<ReasoningStepStatus, IconSvgElement> = {
  pending: ArrowRight01Icon,
  running: Loading03Icon,
  done: Tick02Icon,
  error: Cancel01Icon,
}

const STATUS_TONES: Record<ReasoningStepStatus, string> = {
  pending: "text-foreground/30",
  running: "text-foreground/60",
  done: "text-emerald-600 dark:text-emerald-400",
  error: "text-destructive",
}

export interface ReasoningStepProps extends React.ComponentProps<"div"> {
  /** The glyph for what the step did — a browser, a pen, a file. */
  icon?: IconSvgElement
  /**
   * How the step stands. It recolours the glyph and, when there is no glyph,
   * supplies one — a spinner while running is the only mark that moves.
   */
  status?: ReasoningStepStatus
  /**
   * The small fact pinned to the row's end — "42s", "12 files". Set apart in
   * tabular figures so a column of them lines up.
   */
  detail?: React.ReactNode
}

/**
 * One step. A bare one — no glyph, no status — is a sentence, exactly as this
 * element began; given a glyph it becomes a row in a work log, and the two
 * kinds sit in the same list without either looking like a visitor.
 */
export function ReasoningStep({
  icon,
  status,
  detail,
  className,
  children,
  ...props
}: ReasoningStepProps) {
  const mark = icon ?? (status ? STATUS_ICONS[status] : undefined)

  return (
    <div
      data-slot="reasoning-step"
      data-status={status}
      className={cn(
        "flex items-start gap-2 not-first:mt-2",
        "animate-in duration-300 fill-mode-both fade-in motion-reduce:animate-none",
        className
      )}
      {...props}
    >
      {mark ? (
        <span
          className={cn(
            "mt-0.5 shrink-0",
            status ? STATUS_TONES[status] : "text-foreground/50"
          )}
        >
          <HugeiconsIcon
            aria-hidden
            icon={mark}
            strokeWidth={1.75}
            className={cn(
              "size-3.5",
              status === "running" && "animate-spin motion-reduce:animate-none"
            )}
          />
          {status ? <span className="sr-only">{status}</span> : null}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">{children}</span>
      {detail != null ? (
        <span className="ms-auto shrink-0 ps-2 text-[11px] text-foreground/40 tabular-nums">
          {detail}
        </span>
      ) : null}
    </div>
  )
}

/**
 * A step that was made of steps.
 *
 * Its own collapsible, so a run four levels deep folds level by level rather
 * than all at once — the reader opens exactly the part of the work they are
 * asking about. Open by default while its status is `running`, for the same
 * reason the root is: the step being watched is the one still going.
 */
export function ReasoningBranch({
  status,
  defaultOpen,
  className,
  ...props
}: Collapsible.Root.Props & { status?: ReasoningStepStatus }) {
  return (
    <Collapsible.Root
      data-slot="reasoning-branch"
      data-status={status}
      defaultOpen={defaultOpen ?? status === "running"}
      className={cn("not-first:mt-2", className)}
      {...props}
    />
  )
}

export interface ReasoningBranchTriggerProps extends Collapsible.Trigger.Props {
  icon?: IconSvgElement
  status?: ReasoningStepStatus
  detail?: React.ReactNode
}

/**
 * The branch's own row. It reads like any step — glyph, words, the fact at
 * the end — with the chevron saying it opens; the whole row is the button, so
 * a pointer never has to find the chevron itself.
 */
export function ReasoningBranchTrigger({
  icon,
  status,
  detail,
  className,
  children,
  ...props
}: ReasoningBranchTriggerProps) {
  const mark = icon ?? (status ? STATUS_ICONS[status] : undefined)

  return (
    <Collapsible.Trigger
      data-slot="reasoning-branch-trigger"
      className={cn(
        "group/branch flex w-full cursor-pointer items-start gap-2 rounded-md text-start transition-colors duration-150 outline-none hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/50 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      {mark ? (
        <span
          className={cn(
            "mt-0.5 shrink-0",
            status ? STATUS_TONES[status] : "text-foreground/50"
          )}
        >
          <HugeiconsIcon
            aria-hidden
            icon={mark}
            strokeWidth={1.75}
            className={cn(
              "size-3.5",
              status === "running" && "animate-spin motion-reduce:animate-none"
            )}
          />
          {status ? <span className="sr-only">{status}</span> : null}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">{children}</span>
      {detail != null ? (
        <span className="shrink-0 ps-2 text-[11px] text-foreground/40 tabular-nums">
          {detail}
        </span>
      ) : null}
      <HugeiconsIcon
        aria-hidden
        icon={ArrowDown01Icon}
        className="mt-0.5 size-3.5 shrink-0 text-foreground/30 transition-transform duration-200 group-data-[panel-open]/branch:rotate-180 motion-reduce:transition-none"
      />
    </Collapsible.Trigger>
  )
}

/**
 * The steps the branch was made of, one rule further in — the same rule the
 * root drew, because a level is a level wherever it starts.
 */
export function ReasoningBranchContent({
  className,
  children,
  ...props
}: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="reasoning-branch-content"
      className={cn(collapsePanel, className)}
      {...props}
    >
      <div className="ms-1.5 mt-2 flex flex-col border-s border-border ps-3">
        {children}
      </div>
    </Collapsible.Panel>
  )
}
