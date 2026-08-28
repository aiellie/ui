"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import { ArrowDown01Icon, AiBrain01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { collapsePanel } from "@/components/aiellie-ui/actions"
import { cn } from "@/lib/utils"

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
 * The thinking behind an answer, folded away.
 *
 * Open while it is happening and closed once it is done, unless the reader says
 * otherwise: watching it think is worth something, and a finished answer with
 * its whole reasoning still unfolded above it buries the part that was asked
 * for. A reader who opens or closes it takes that decision off the component
 * for the rest of the run.
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
 * The thinking itself, set apart by a rule down the start edge rather than a
 * box: it is an aside to the answer, and a panel would give it the weight of
 * another message.
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
      <div className="ms-1.5 mt-1 border-s border-border ps-3 text-xs leading-relaxed text-muted-foreground">
        {children}
      </div>
    </Collapsible.Panel>
  )
}

/**
 * One step of it. Steps are what reasoning actually looks like when it is
 * streamed — a line at a time, each a small conclusion — and spacing them says
 * so without numbering anything.
 */
export function ReasoningStep({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="reasoning-step"
      className={cn(
        "not-first:mt-2",
        "animate-in duration-300 fill-mode-both fade-in motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}
