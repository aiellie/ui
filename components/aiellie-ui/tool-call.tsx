"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import {
  ArrowRight01Icon,
  Cancel01Icon,
  CircleIcon,
  Loading03Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  codeScroll,
  codeSurface,
  collapsePanel,
  mono,
  paper,
} from "@/components/aiellie-ui/actions"
import { cn } from "@/lib/utils"

export type ToolCallStatus = "pending" | "running" | "done" | "error"

/**
 * What each state is called when it is read out. Overridable, since a project
 * with its own word for a tool — a step, an action, a skill — wants the status
 * to say that word too.
 */
const defaultLabels: Record<ToolCallStatus, string> = {
  pending: "Queued",
  running: "Running",
  done: "Finished",
  error: "Failed",
}

const STATUS_ICONS: Record<ToolCallStatus, IconSvgElement> = {
  pending: CircleIcon,
  running: Loading03Icon,
  done: Tick02Icon,
  error: Cancel01Icon,
}

function StatusMark({ status }: { status: ToolCallStatus }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={STATUS_ICONS[status]}
      strokeWidth={2}
      className={cn(
        "size-3.5",
        /* The one state that is still happening says so by moving. */
        status === "running" && "animate-spin motion-reduce:animate-none"
      )}
    />
  )
}

/** Turns to point at the panel it opens; vertical, so RTL leaves it alone. */
function Chevron() {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={ArrowRight01Icon}
      strokeWidth={2}
      /* Keyed off the root's `data-open` rather than the trigger's
         `data-panel-open`: the group is the root, and the two attributes are
         not the same one under different names. */
      className="size-3.5 shrink-0 text-foreground/30 transition-transform duration-200 group-data-open/tool-call:rotate-90 motion-reduce:transition-none"
    />
  )
}

const StatusContext = React.createContext<ToolCallStatus>("done")

export interface ToolCallProps extends Collapsible.Root.Props {
  status?: ToolCallStatus
}

/**
 * A tool being called, and what it gave back. Collapsed by default: a
 * transcript is a conversation with a tool run inside it, and unfolding every
 * argument and every result by default buries the conversation in its own
 * plumbing. The header is enough to know whether it is worth opening.
 *
 * `status` rides on context rather than being passed down part by part,
 * because it is the one thing three different parts each need and nothing
 * between them would otherwise carry.
 */
function ToolCall({
  status = "done",
  className,
  ...props
}: ToolCallProps) {
  return (
    <StatusContext.Provider value={status}>
      <Collapsible.Root
        data-slot="tool-call"
        data-status={status}
        /* Announced once it settles, never interrupted for: a tool finishing
           is worth knowing and is not worth cutting a sentence in half. */
        aria-busy={status === "running" || undefined}
        className={cn(
          paper,
          "group/tool-call w-full max-w-lg overflow-hidden rounded-2xl",
          className
        )}
        {...props}
      />
    </StatusContext.Provider>
  )
}

/**
 * The row that opens it. A real `<button>` underneath by way of Base UI's
 * trigger, so the whole row answers Space and Enter rather than only the
 * chevron at the end of it.
 */
function ToolCallTrigger({
  children,
  labels,
  className,
  ...props
}: Collapsible.Trigger.Props & {
  labels?: Partial<Record<ToolCallStatus, string>>
}) {
  const status = React.useContext(StatusContext)
  const label = labels?.[status] ?? defaultLabels[status]

  return (
    <Collapsible.Trigger
      data-slot="tool-call-trigger"
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 px-3.5 py-2.5 text-start outline-none transition-colors duration-150 hover:bg-foreground/[0.02] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-foreground/20 motion-reduce:transition-none dark:hover:bg-foreground/[0.03]",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "shrink-0",
          status === "error" && "text-destructive",
          status === "done" && "text-emerald-600 dark:text-emerald-400",
          status === "running" && "text-foreground/60",
          status === "pending" && "text-foreground/25"
        )}
      >
        <StatusMark status={status} />
        {/* The mark is the only thing carrying the state visually, so the word
            for it goes to a screen reader rather than being left implied by a
            shape. */}
        <span className="sr-only">{label}</span>
      </span>
      {children}
      <Chevron />
    </Collapsible.Trigger>
  )
}

/** What was called. The one part of the row set in the code face. */
function ToolCallName({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tool-call-name"
      className={cn(
        mono,
        "min-w-0 truncate text-[12px] text-foreground/90",
        className
      )}
      {...props}
    />
  )
}

/**
 * The one line worth reading without opening it — "3 matches", "wrote 84
 * lines". Takes the end of the row, so a run of calls has its summaries down
 * one edge where they can be compared.
 */
function ToolCallSummary({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tool-call-summary"
      className={cn(
        mono,
        "ms-auto shrink-0 truncate text-foreground/35",
        className
      )}
      {...props}
    />
  )
}

/**
 * `collapsePanel` animates the height Base UI measures for it, so the panel
 * opens to whatever it actually contains rather than to a number this file
 * would have to guess and keep true.
 */
function ToolCallPanel({ className, ...props }: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="tool-call-panel"
      className={cn(collapsePanel, className)}
      {...props}
    />
  )
}

/**
 * One labelled part of the panel — what went in, what came out. The label is a
 * real heading for its region, so a screen reader moving through a long panel
 * is told which half it has reached.
 */
function ToolCallSection({
  label,
  children,
  className,
  ...props
}: Omit<React.ComponentProps<"section">, "children"> & {
  label: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section
      data-slot="tool-call-section"
      /* Every section takes a rule, the first one included: it is what closes
         the trigger row off from the panel, and without it the row and the
         first section read as one block that happens to have a heading in the
         middle. */
      className={cn(
        "border-t border-border/60 px-3.5 py-2.5",
        className
      )}
      {...props}
    >
      <h4 className={cn(mono, "mb-1.5 text-foreground/35 uppercase")}>
        {label}
      </h4>
      {children}
    </section>
  )
}

/**
 * A block of whatever the tool was handed or gave back, kept to its own
 * whitespace and scrolling rather than wrapping — an argument object folded
 * across three lines stops looking like an object.
 *
 * Not tokenized: arguments and results arrive as JSON, as text, as a table of
 * matches, and colouring them all as one language would be wrong more often
 * than right. Put a `CodeBlockBody` in here where the content really is code.
 */
function ToolCallCode({
  children,
  className,
  ...props
}: React.ComponentProps<"pre">) {
  return (
    <pre
      data-slot="tool-call-code"
      dir="ltr"
      tabIndex={0}
      className={cn(
        codeScroll,
        "font-mono text-[12px] leading-[1.6] text-foreground/70 outline-none focus-visible:ring-1 focus-visible:ring-foreground/20",
        className
      )}
      {...props}
    >
      <code className={cn(codeSurface, "block")}>{children}</code>
    </pre>
  )
}

export {
  ToolCall,
  ToolCallCode,
  ToolCallName,
  ToolCallPanel,
  ToolCallSection,
  ToolCallSummary,
  ToolCallTrigger,
}
