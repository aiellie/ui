"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

import {
  codeScroll,
  codeSurface,
  ghostButton,
} from "@/components/aiellie-ui/actions"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { codeIconFrom, type CodeIconSet } from "@/lib/code-icons"
import { TOKEN_PALETTES, tokenize } from "@/lib/highlight"
import { cn } from "@/lib/utils"

/**
 * The body of an answer, as opposed to the bubble around it: headings, lists,
 * quotes, tables and links, set to read as prose rather than as interface.
 *
 * Deliberately not a markdown parser. An answer arrives as markdown, HTML or
 * JSX depending on what is rendering it, and every project already has an
 * opinion about which — so this styles the elements those produce and stays out
 * of the parsing argument. Pipe your renderer's output in as children.
 *
 * The one thing that cannot be left to CSS is a code block, which needs a copy
 * action and a scroll region of its own: `ResponseCodeBlock` below.
 */
function Response({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="response"
      className={cn(
        "text-sm leading-relaxed text-pretty text-foreground",
        // Rhythm between blocks rather than margins on each element, so a
        // renderer that emits an unexpected tag still spaces correctly.
        "[&>*+*]:mt-4",
        "[&_h1]:text-base [&_h1]:font-medium [&_h2]:text-[0.95rem] [&_h2]:font-medium [&_h3]:text-sm [&_h3]:font-medium",
        "[&_h1+*]:mt-2 [&_h2+*]:mt-2 [&_h3+*]:mt-2 [&>h1]:mt-6 [&>h2]:mt-6 [&>h3]:mt-5",
        "[&_li]:mt-1.5 [&_li]:ps-1 [&_li::marker]:text-muted-foreground [&_ol]:list-decimal [&_ol]:ps-5 [&_ul]:list-disc [&_ul]:ps-5",
        "[&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-3 hover:[&_a]:decoration-foreground",
        "[&_strong]:font-medium",
        "[&_blockquote]:border-s-2 [&_blockquote]:border-border [&_blockquote]:ps-3 [&_blockquote]:text-muted-foreground",
        "[&_hr]:border-border",
        // Inline code only: the code inside a block is coloured token by token
        // and must not wear the chip as well.
        "[&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:bg-foreground/[0.06] [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.85em]",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:text-start",
        "[&_th]:border-b [&_th]:border-border [&_th]:pb-2 [&_th]:text-start [&_th]:font-medium",
        "[&_td]:border-b [&_td]:border-border/60 [&_td]:py-2 [&_td]:align-top",
        // Columns need the gap between them, not around them: an end padding
        // on everything but the last cell keeps the table flush to its box.
        "[&_td:not(:last-child)]:pe-4 [&_th:not(:last-child)]:pe-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * A table wide enough to overflow scrolls inside its own box. Without it the
 * page scrolls sideways instead, which moves everything else on it.
 */
function ResponseTable({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="response-table"
      className={cn("overflow-x-auto", className)}
      {...props}
    />
  )
}

/**
 * A block of code in an answer: the language it is in, a copy of exactly what
 * is on screen, and the code itself in a scroll region of its own.
 *
 * `codeSurface` wraps every row as one block rather than sizing each row, since
 * `min-width: 100%` inside a scroll container resolves against the visible
 * width — per-row backgrounds would end at the fold.
 */
function ResponseCodeBlock({
  code,
  language,
  filename,
  icon,
  className,
  ...props
}: Omit<React.ComponentProps<"figure">, "children"> & {
  code: string
  language?: string
  filename?: string
  /** A set to derive the badge from, an icon of your own, or `null` for none. */
  icon?: React.ReactNode | CodeIconSet
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const lines = React.useMemo(() => tokenize(code), [code])
  const palette = TOKEN_PALETTES.color
  const name = filename ?? language

  return (
    <figure
      data-slot="response-code-block"
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-foreground/[0.03] dark:bg-foreground/[0.05]",
        className
      )}
      {...props}
    >
      <figcaption className="flex items-center gap-2 border-b border-border/60 px-3 py-1.5 text-[11px] text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5">
        {codeIconFrom(icon, name, language ? "mono" : undefined)}
        <span className="min-w-0 truncate font-mono">{name}</span>
        <button
          type="button"
          onClick={() => copyToClipboard(code)}
          aria-label={isCopied ? "Copied" : "Copy code"}
          className={cn(ghostButton, "ms-auto size-6 rounded-md")}
        >
          <HugeiconsIcon
            icon={isCopied ? Tick02Icon : Copy01Icon}
            className="size-3.5"
          />
        </button>
      </figcaption>
      <div className={cn(codeScroll, "p-3")}>
        <pre className={cn(codeSurface, "font-mono text-xs leading-relaxed")}>
          <code>
            {lines.map((tokens, line) => (
              <span key={line} className="block">
                {tokens.map((token, index) => (
                  <span key={index} className={palette[token.kind]}>
                    {token.text}
                  </span>
                ))}
                {tokens.length === 0 ? "\n" : null}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </figure>
  )
}

export { Response, ResponseCodeBlock, ResponseTable }
