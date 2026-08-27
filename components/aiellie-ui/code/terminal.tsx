"use client"

import * as React from "react"

import { codeScroll, mono, paper } from "@/components/aiellie-ui/actions"
import { TOKEN_COLORS, tokenizeCommand } from "@/lib/highlight"
import { cn } from "@/lib/utils"

/**
 * A run rather than an install line: what was typed, what came back, and how
 * it ended. `code-snippet` is the other half of this — one line, offered to be
 * copied, which has not happened yet. This one has.
 *
 * The colouring is `tokenizeCommand`, the same pass the snippet uses, so a
 * command reads the same whether it is being offered or being reported.
 */
function Terminal({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal"
      className={cn(
        paper,
        "w-full max-w-lg overflow-hidden rounded-2xl",
        className
      )}
      {...props}
    />
  )
}

/**
 * The transcript. A `div` of rows and not a `pre`: output lines wrap, since a
 * message from a compiler is prose and cutting it off at the fold would hide
 * the half that says what to do about it. Commands keep their own whitespace.
 */
function TerminalBody({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal-body"
      dir="ltr"
      tabIndex={0}
      className={cn(
        codeScroll,
        "py-3 font-mono text-[12.5px] leading-[1.7] outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-inset",
        className
      )}
      {...props}
    >
      {/* Deliberately *not* `codeSurface`. A code block sizes its rows to the
          widest one so a tinted row's background reaches the fold; no row here
          is tinted, and that width would instead resolve `whitespace-pre-wrap`
          against the longest line in the transcript — so output would never
          wrap, and a compiler's message would be cut off exactly where it
          starts saying what to do about it. The rows take the visible width and
          a long command scrolls on its own. */}
      <div className="flex w-full flex-col">{children}</div>
    </div>
  )
}

/** Blinks where the next character would land, while a command is running. */
function TerminalCaret() {
  return (
    <span
      aria-hidden
      data-slot="terminal-caret"
      className="ms-1 inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] animate-pulse rounded-[1px] bg-foreground/50 motion-reduce:animate-none"
    />
  )
}

/**
 * A line that was typed. The prompt is its own element and `select-none`, so
 * dragging across a transcript and copying it gives back commands you can run
 * rather than commands with a `$` welded to the front.
 */
function TerminalCommand({
  prompt = "$",
  running = false,
  children,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  prompt?: React.ReactNode
  /** Holds a caret at the end of the line while the command is still going. */
  running?: boolean
  children: string
}) {
  const tokens = React.useMemo(() => tokenizeCommand(children), [children])

  return (
    <div
      data-slot="terminal-command"
      data-running={running || undefined}
      aria-busy={running || undefined}
      className={cn("flex px-3.5", className)}
      {...props}
    >
      <span
        aria-hidden
        className="me-2 shrink-0 text-foreground/25 select-none"
      >
        {prompt}
      </span>
      <span className="whitespace-pre">
        {tokens.map((token, index) => (
          <span key={index} className={TOKEN_COLORS[token.kind]}>
            {token.text}
          </span>
        ))}
        {running && <TerminalCaret />}
      </span>
    </div>
  )
}

/**
 * What came back. Four tones and not four components, because they are one
 * kind of thing said four ways — and a caller mapping a stream of lines to
 * rows wants to pick the tone with an expression, not with a switch that
 * chooses a component.
 */
export type TerminalTone = "default" | "muted" | "success" | "error"

const TONES: Record<TerminalTone, string> = {
  default: "text-foreground/75",
  muted: "text-foreground/40",
  /* The same pair a diff is read in, so a passing run and an added line agree
     about what green means. */
  success: "text-emerald-600 dark:text-emerald-400",
  error: "text-red-600 dark:text-red-400",
}

function TerminalOutput({
  tone = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & { tone?: TerminalTone }) {
  return (
    <div
      data-slot="terminal-output"
      data-tone={tone}
      className={cn(
        "px-3.5 break-words whitespace-pre-wrap",
        TONES[tone],
        className
      )}
      {...props}
    />
  )
}

/**
 * How the run ended, set apart from the output above it by a rule rather than
 * by a colour of its own — a zero exit is not news, and a non-zero one already
 * has the error tone to carry it.
 */
function TerminalStatus({
  code,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { code?: number }) {
  const failed = code != null && code !== 0

  return (
    <div
      data-slot="terminal-status"
      data-failed={failed || undefined}
      role="status"
      className={cn(
        mono,
        "mt-2 flex items-center gap-1.5 border-t border-border/60 px-3.5 pt-2",
        failed ? TONES.error : "text-foreground/35",
        className
      )}
      {...props}
    >
      {children ??
        (code === 0 ? "Exited cleanly" : `Exited with code ${code}`)}
    </div>
  )
}

export {
  Terminal,
  TerminalBody,
  TerminalCaret,
  TerminalCommand,
  TerminalOutput,
  TerminalStatus,
}
