"use client"

import * as React from "react"
import {
  AlertCircleIcon,
  Cancel01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { ghostButton } from "@/components/aiellie-ui/actions"
import { cn } from "@/lib/utils"

export type CodeAnnotationTone = "note" | "warning" | "error"

const TONE_ICONS: Record<CodeAnnotationTone, IconSvgElement> = {
  note: InformationCircleIcon,
  warning: AlertCircleIcon,
  error: AlertCircleIcon,
}

/* Blue rather than `--primary` for the plain note. A remark about a line is
   not a brand moment, and tying it to the brand hue means a project that
   sets `--primary` to red or amber gets notes that read as warnings. Blue is
   the informational hue everywhere else and is not spoken for in the token
   set; the other two borrow the hues a diff already reads in. */
const TONES: Record<CodeAnnotationTone, string> = {
  note: "border-blue-500/25 bg-blue-500/[0.06] text-foreground/70 dark:bg-blue-400/[0.10]",
  warning:
    "border-amber-500/25 bg-amber-500/[0.07] text-foreground/70 dark:bg-amber-400/[0.10]",
  error:
    "border-red-500/25 bg-red-500/[0.06] text-foreground/70 dark:bg-red-400/[0.10]",
}

const MARK_TONES: Record<CodeAnnotationTone, string> = {
  note: "text-blue-600 dark:text-blue-400",
  warning: "text-amber-600 dark:text-amber-400",
  error: "text-red-600 dark:text-red-400",
}

export interface CodeAnnotationProps extends Omit<
  React.ComponentProps<"aside">,
  "children"
> {
  tone?: CodeAnnotationTone
  children: React.ReactNode
  /** Offered when the note is something the reader can be done with. */
  onDismiss?: () => void
  dismissLabel?: string
}

/**
 * A note pinned under the line it is about. `highlightLines` says which line
 * is being talked about; this says what is being said, and says it where the
 * reader already is — prose underneath would have to name the line again, and
 * the reader would have to count back up to it.
 *
 * An `aside`, because that is what it is: related to the code around it, and
 * not part of it. A screen reader reading the block straight through gets the
 * code as the author wrote it, and the note as the aside it is.
 *
 * Set in the interface face rather than the code one — a sentence about the
 * code is not code, and setting it in mono is the commonest way this pattern
 * goes wrong.
 */
export function CodeAnnotation({
  tone = "note",
  children,
  onDismiss,
  dismissLabel = "Dismiss note",
  className,
  ...props
}: CodeAnnotationProps) {
  return (
    <aside
      data-slot="code-annotation"
      data-tone={tone}
      className={cn(
        "flex max-w-sm items-start gap-2 rounded-xl border px-2.5 py-1.5 font-sans text-[12px] leading-relaxed text-pretty",
        TONES[tone],
        className
      )}
      {...props}
    >
      <HugeiconsIcon
        aria-hidden
        icon={TONE_ICONS[tone]}
        strokeWidth={2}
        className={cn("mt-px size-3.5 shrink-0", MARK_TONES[tone])}
      />
      <span className="min-w-0 flex-1">{children}</span>
      {onDismiss && (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className={cn(ghostButton, "-me-1 size-5 shrink-0")}
        >
          <HugeiconsIcon
            aria-hidden
            icon={Cancel01Icon}
            strokeWidth={2}
            className="size-3"
          />
        </button>
      )}
    </aside>
  )
}
