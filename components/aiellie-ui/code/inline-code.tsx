"use client"

import * as React from "react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

/** The chip itself, and the seam for anything hand-rolling one to match. */
export const inlineCodeChip =
  "rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] whitespace-nowrap dark:bg-foreground/[0.09]"

/**
 * A symbol named in a sentence: `useTick`, `--primary`, `pnpm dlx`. `response`
 * already styles the code inside prose it is handed, so this is for the cases
 * that styling cannot reach — a symbol that can be copied, and one that leads
 * somewhere.
 *
 * Sized in `em` rather than a fixed step, so a chip in a heading and a chip in
 * a caption each come out a shade smaller than the words around them instead
 * of both landing on the body size.
 *
 * `whitespace-nowrap` because a symbol broken across a line break stops being
 * a symbol you can search for.
 */
function InlineCode({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="inline-code"
      className={cn(inlineCodeChip, "text-foreground/85", className)}
      {...props}
    />
  )
}

function CopyMark({ copied }: { copied: boolean }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={copied ? Tick02Icon : Copy01Icon}
      strokeWidth={2}
      className="size-[1em] shrink-0 opacity-40 transition-opacity duration-150 group-hover/inline-code:opacity-90 group-focus-visible/inline-code:opacity-90 motion-reduce:transition-none"
    />
  )
}

/**
 * The same chip, which copies itself. A `<button>` underneath, because
 * pressing it does something — and the whole chip is the control rather than a
 * glyph beside it, since a symbol short enough to be inline is shorter than
 * the target a separate button would need.
 *
 * `copy` is there for the chip that shows a short form of something longer —
 * `--primary` on screen, the whole custom property on the clipboard.
 */
function InlineCodeCopy({
  copy,
  children,
  className,
  onCopy,
  ...props
}: Omit<React.ComponentProps<"button">, "onCopy"> & {
  /** What lands on the clipboard, when that is not what is on screen. */
  copy?: string
  onCopy?: () => void
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    timeout: 2000,
    onCopy,
  })

  const value =
    copy ?? (typeof children === "string" ? children : String(children ?? ""))

  return (
    <button
      type="button"
      data-slot="inline-code-copy"
      data-copied={isCopied || undefined}
      /* The chip already reads as the symbol, so the name says what pressing
         it does rather than repeating the word underneath it. */
      aria-label={isCopied ? `Copied ${value}` : `Copy ${value}`}
      onClick={() => copyToClipboard(value)}
      className={cn(
        inlineCodeChip,
        "group/inline-code inline-flex cursor-pointer items-center gap-1 align-baseline text-foreground/85 transition-colors duration-150 outline-none hover:bg-foreground/[0.10] focus-visible:ring-1 focus-visible:ring-foreground/20 motion-reduce:transition-none dark:hover:bg-foreground/[0.14]",
        className
      )}
      {...props}
    >
      {children}
      <CopyMark copied={isCopied} />
    </button>
  )
}

/**
 * A symbol that leads somewhere — a definition, a doc page, a line in a file.
 * A real `<a>`, so a modified click opens a tab and the target is there in the
 * status bar before it is clicked.
 */
function InlineCodeLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="inline-code-link"
      className={cn(
        inlineCodeChip,
        "cursor-pointer text-foreground/85 underline decoration-foreground/25 underline-offset-3 transition-colors duration-150 outline-none hover:bg-foreground/[0.10] hover:decoration-foreground/60 focus-visible:ring-1 focus-visible:ring-foreground/20 motion-reduce:transition-none dark:hover:bg-foreground/[0.14]",
        className
      )}
      {...props}
    />
  )
}

export { InlineCode, InlineCodeCopy, InlineCodeLink }
