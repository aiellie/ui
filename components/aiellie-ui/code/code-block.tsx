"use client"

import * as React from "react"
import {
  ArrowRight01Icon,
  Copy01Icon,
  Download01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  codeScroll,
  codeSurface,
  ghostButton,
  iconSwap,
  iconSwapIn,
  iconSwapOut,
  mono,
  paper,
} from "@/components/aiellie-ui/actions"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { codeIconFrom, type CodeIconSet } from "@/components/icons/code-icons"
import { TOKEN_PALETTES, tokenize, type TokenPalette } from "@/lib/highlight"
import { cn } from "@/lib/utils"

/**
 * A block of code as a thing on the page rather than a thing inside prose:
 * named, copyable, numbered where the numbers are being referred to, and able
 * to be still arriving.
 *
 * Parts rather than props, because a header is a place and not a choice. What
 * sits on the left of one differs by more than a flag — a filename here, a
 * strip of file tabs there, a branch and a commit somewhere else — and a
 * component that took `filename`, `icon` and a `header` override to cover that
 * has admitted the override was the real API. `CodeBlockBody` keeps the props,
 * since every one of them names a choice about how the code reads.
 *
 * Deliberately not a highlighter: `lib/highlight` scans, this lays out. The
 * diff and the tabbed card want the same tokens down different rows.
 */
function CodeBlock({ className, ...props }: React.ComponentProps<"figure">) {
  return (
    <figure
      data-slot="code-block"
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
 * A `figcaption`, so what names the code is attached to the code rather than
 * merely sitting above it. Anything can go in it; the actions take the far end
 * for themselves.
 *
 * Whatever goes at the start has to be able to shrink — `min-w-0` and a
 * `truncate` or a scroller of its own, as `CodeBlockTitle` does. The actions
 * do not shrink, so a start that refuses to gets its own way and pushes them
 * off the block, where the rounded corners clip them out of existence.
 */
function CodeBlockHeader({
  className,
  ...props
}: React.ComponentProps<"figcaption">) {
  return (
    <figcaption
      data-slot="code-block-header"
      className={cn(
        "flex items-center gap-1.5 border-b border-border/60 px-3.5 py-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * What the block is called, with the badge for it, derived from the name —
 * `use-tick.ts` and `typescript` land on the same glyph without the caller
 * saying which of the two it passed.
 *
 * `icon` takes a set name to derive from (`"mono"` by default, `"brand"` for
 * the language's own colours), an icon of your own, or `null` for a header
 * carrying its own.
 */
function CodeBlockTitle({
  icon,
  children,
  className,
  ...props
}: React.ComponentProps<"span"> & {
  icon?: React.ReactNode | CodeIconSet
}) {
  const badge = codeIconFrom(icon, children, "mono")

  return (
    <span
      data-slot="code-block-title"
      className={cn(
        mono,
        // Sized from the row, so a header can be written as an icon and a
        // word with neither wrapped in anything — and an explicit size still
        // wins.
        "flex min-w-0 items-center gap-1.5 text-foreground/40 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      {badge}
      <span className="truncate">{children}</span>
    </span>
  )
}

/**
 * The controls at the end of the header. They stay put rather than appearing
 * on hover: a code block is as often read on a touch screen as pointed at, and
 * there is nothing under them for the revealing to protect.
 */
function CodeBlockActions({
  "aria-label": ariaLabel = "Code actions",
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <TooltipProvider>
      <div
        data-slot="code-block-actions"
        role="toolbar"
        aria-label={ariaLabel}
        className={cn("ms-auto flex shrink-0 items-center", className)}
        {...props}
      />
    </TooltipProvider>
  )
}

/**
 * A tooltip is wired up as `aria-describedby`, not a name — so an icon-only
 * control still needs a label. Borrow the tooltip when it is plain text.
 */
function labelFrom(tooltip: React.ReactNode, ariaLabel?: string) {
  return ariaLabel ?? (typeof tooltip === "string" ? tooltip : undefined)
}

export interface CodeBlockActionProps extends Omit<
  React.ComponentProps<"button">,
  "children"
> {
  children: React.ReactNode
  tooltip?: React.ReactNode
  /** What the tooltip and the name become once the action has landed. */
  doneTooltip?: React.ReactNode
  done?: boolean
  /** Shown in place of `children` while `done`; a tick unless something says it better. */
  doneChildren?: React.ReactNode
}

/**
 * One action in the header, and the seam for any that this file does not
 * ship — a re-run, a jump to the file, an "open in" — so a hand-rolled one
 * matches without copying the class string out.
 *
 * The two icons are stacked in a single grid cell so the tick swaps in place:
 * a button that re-measures mid-press moves the buttons beside it, under the
 * pointer that is still on the one being pressed.
 */
function CodeBlockAction({
  children,
  tooltip,
  doneTooltip,
  done = false,
  doneChildren,
  className,
  "aria-label": ariaLabel,
  ...props
}: CodeBlockActionProps) {
  /* One `showing` for the tooltip and the name both, or a screen reader is
     told the copy is still on offer while the tooltip says it has happened. */
  const showing = done ? (doneTooltip ?? tooltip) : tooltip

  const action = (
    <button
      type="button"
      data-slot="code-block-action"
      data-done={done || undefined}
      aria-label={labelFrom(showing, ariaLabel)}
      className={cn(
        ghostButton,
        "grid size-6 cursor-pointer place-items-center [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(iconSwap, done ? iconSwapOut : iconSwapIn)}
      >
        {children}
      </span>
      <span
        aria-hidden
        className={cn(iconSwap, done ? iconSwapIn : iconSwapOut)}
      >
        {doneChildren ?? <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />}
      </span>
    </button>
  )

  if (tooltip == null) return action

  return (
    <Tooltip>
      {/* The trigger renders *as* the button — Base UI would otherwise put a
          button of its own around it and nest the two. */}
      <TooltipTrigger render={action} />
      <TooltipContent>{showing}</TooltipContent>
    </Tooltip>
  )
}

/**
 * True for a moment after something happened, then not: the same shape
 * `useCopyToClipboard` keeps, for the actions that have no promise to await.
 * A count rather than a flag, so acting again while the tick is up restarts
 * the deadline instead of letting the first one cut the second short.
 */
function useMoment(timeout = 2000) {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (count === 0) return
    const id = setTimeout(() => setCount(0), timeout)
    return () => clearTimeout(id)
  }, [count, timeout])

  return [count > 0, () => setCount((value) => value + 1)] as const
}

/**
 * Copies exactly what is on screen, and says so for two seconds. The state is
 * held here rather than handed up: whether a copy has just happened is nobody
 * else's business, and a caller made to store it would only hand it straight
 * back. `onCopy` is there for the ones with something to add — a toast, a
 * count — not for the tick.
 */
function CodeBlockCopy({
  code,
  tooltip = "Copy",
  doneTooltip = "Copied",
  onCopy,
  children,
  ...props
}: Omit<
  CodeBlockActionProps,
  "children" | "done" | "doneChildren" | "onCopy"
> & {
  code: string
  children?: React.ReactNode
  onCopy?: () => void
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    timeout: 2000,
    onCopy,
  })

  return (
    <CodeBlockAction
      tooltip={tooltip}
      doneTooltip={doneTooltip}
      done={isCopied}
      onClick={() => copyToClipboard(code)}
      {...props}
    >
      {children ?? <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />}
    </CodeBlockAction>
  )
}

/**
 * Saves the code as a file. It does the saving itself rather than reporting a
 * press for the caller to act on — a control that looks like a download and
 * does nothing until wired up is a worse default than one that works.
 *
 * A Blob and an object URL rather than a `data:` URI, which a long file would
 * outgrow, and the URL is released once the browser has taken it so the page
 * is not left holding a copy of every file it has offered.
 */
function CodeBlockDownload({
  code,
  filename = "snippet.txt",
  type = "text/plain;charset=utf-8",
  tooltip = "Download",
  doneTooltip = "Downloaded",
  onDownload,
  children,
  ...props
}: Omit<CodeBlockActionProps, "children" | "done" | "doneChildren" | "type"> & {
  code: string
  filename?: string
  /** The MIME type the file is saved as. */
  type?: string
  children?: React.ReactNode
  onDownload?: () => void
}) {
  const [downloaded, markDownloaded] = useMoment()

  const download = () => {
    const url = URL.createObjectURL(new Blob([code], { type }))
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    /* Revoking in the same tick cancels the download in some browsers before
       it has read the blob, so the release waits for the next one. */
    setTimeout(() => URL.revokeObjectURL(url), 0)
    markDownloaded()
    onDownload?.()
  }

  return (
    <CodeBlockAction
      tooltip={tooltip}
      doneTooltip={doneTooltip}
      done={downloaded}
      onClick={download}
      {...props}
    >
      {children ?? <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />}
    </CodeBlockAction>
  )
}

/** Where the next token will land, while the code is still arriving. */
function CodeBlockCaret() {
  return (
    <span
      aria-hidden
      data-slot="code-block-caret"
      /* Drawn rather than a character, so it holds the line's height without
         occupying a column that a copied selection would pick up. */
      className="ms-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.2em] animate-pulse rounded-full bg-primary motion-reduce:animate-none"
    />
  )
}

export interface CodeBlockBodyProps extends Omit<
  React.ComponentProps<"pre">,
  "children"
> {
  code: string
  /**
   * Which palette the tokens take. `mono` keeps every distinction the colour
   * one makes and spends weight on them instead — for a block set among prose,
   * or a page the three hues would speak over.
   */
  palette?: TokenPalette
  lineNumbers?: boolean
  /** 1-based lines to mark, for pointing at the part being talked about. */
  highlightLines?: readonly number[]
  /**
   * Notes to drop in under a 1-based line, keyed by it. A tint says which line
   * is being talked about; this says what is being said, and says it where the
   * reader already is rather than in prose below that has to name the line
   * again. `code-annotation` is what goes in here.
   */
  annotations?: Readonly<Record<number, React.ReactNode>>
  /**
   * Lines whose note is already showing. The rest are a click on the marker
   * away — a block that unfolded every note it had would be mostly notes, and
   * the code is what the reader came for.
   */
  defaultOpenAnnotations?: readonly number[]
  /** Wraps long lines instead of scrolling them, for a narrow column. */
  wrap?: boolean
  /** Blinks a caret after the last line while the code is still arriving. */
  streaming?: boolean
}

/**
 * The code itself. `codeScroll` goes on the `pre` and `codeSurface` on the
 * `code` inside it, wrapping every row as one block: `min-width: 100%` in a
 * scroll container resolves against the visible width, not the scrollable one,
 * so sizing each row would end a marked line's tint at the fold.
 *
 * A block tall enough to need it takes a height and a second axis from the
 * caller — `className="max-h-64 overflow-y-auto"` — rather than a `maxLines`
 * prop that would have to decide what a line is worth.
 */
function CodeBlockBody({
  code,
  palette = "color",
  lineNumbers = false,
  highlightLines,
  annotations,
  defaultOpenAnnotations,
  wrap = false,
  streaming = false,
  className,
  ...props
}: CodeBlockBodyProps) {
  const lines = React.useMemo(() => {
    const rows = tokenize(code)
    /* Code that ends in a newline tokenizes to a trailing empty row, which
       would read as a blank line nobody wrote. */
    if (rows.length > 1 && rows[rows.length - 1].length === 0) rows.pop()
    return rows
  }, [code])

  /* `highlightLines` is nearly always a fresh literal, so without this the set
     is rebuilt on every render for a lookup that runs once per line. */
  const marked = React.useMemo(() => new Set(highlightLines), [highlightLines])

  const colors = TOKEN_PALETTES[palette]

  /* Which notes are showing. Held here rather than by the caller: whether a
     reader has unfolded a remark is nobody else's business, and a caller made
     to store it would only hand it straight back. */
  const [openNotes, setOpenNotes] = React.useState<ReadonlySet<number>>(
    () => new Set(defaultOpenAnnotations)
  )
  const toggleNote = (line: number) =>
    setOpenNotes((previous) => {
      const next = new Set(previous)
      if (!next.delete(line)) next.add(line)
      return next
    })

  /* One id per block, suffixed by line, so a marker's `aria-controls` reaches
     its own note and not the same-numbered line of another block. */
  const noteId = React.useId()
  const hasAnnotations =
    annotations != null && Object.keys(annotations).length > 0

  /* Room for the widest number the block will reach, so the gutter does not
     widen at line 100 and shove every line of code sideways. */
  const gutter = `${String(lines.length).length + 1}ch`

  return (
    <pre
      data-slot="code-block-body"
      /* The one part of this element that does not mirror. Code is not prose:
         under an inherited `rtl` the bidi algorithm reorders its brackets and
         punctuation, and `}, 1000)` comes out as `(1000 ,{` — wrong in a way
         that is hard to even see. So the code region is `ltr` throughout,
         gutter included, and the header above it mirrors as interface should.
         Set `dir` yourself for the rare block that really is right-to-left. */
      dir="ltr"
      /* A region that scrolls has to be reachable by the keyboard, or its far
         end exists for a pointer only. Wrapping takes the scroll away, and the
         tab stop should go with it rather than becoming a stop that does
         nothing. */
      tabIndex={wrap ? undefined : 0}
      aria-busy={streaming || undefined}
      className={cn(
        !wrap && codeScroll,
        /* A container, so an annotation inside can be sized against what is
           actually visible. Everything in here is laid out at the width of the
           widest line, which is the wrong width for a sentence — and `%` would
           resolve against exactly that. `cqi` resolves against this box. */
        "@container py-3 outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-inset",
        className
      )}
      {...props}
    >
      <code
        className={cn(
          !wrap && codeSurface,
          "block font-mono text-[12.5px] leading-[1.7]"
        )}
      >
        {lines.map((tokens, index) => {
          const number = index + 1
          const highlighted = marked.has(number)
          const note = annotations?.[number]
          const open = openNotes.has(number)

          /* The row's tint is translucent, which the stuck gutter's fill
             cannot be — so its fill is that tint already mixed into the
             surface under it, rather than a second layer stacked on top. */
          const fill = highlighted
            ? "bg-[color-mix(in_oklch,var(--primary)_7%,var(--background))] dark:bg-[color-mix(in_oklch,var(--primary)_12%,var(--popover))]"
            : "bg-background dark:bg-popover"

          const line = (
            /* min-h keeps a blank line the height of a full one without
               giving it a character to carry, which a copied selection would
               pick up.

               Rows are keyed by index deliberately: a line that arrives is the
               only one that mounts, so it is the only one that fades in and
               the rows above it hold still. */
            <span
              key={index}
              data-slot="code-block-line"
              data-highlighted={highlighted || undefined}
              data-annotated={note ? true : undefined}
              className={cn(
                "flex min-h-[1.7em] animate-in pe-3.5 duration-300 fill-mode-both fade-in motion-reduce:animate-none",
                /* A stuck gutter carries the start inset itself, or it parks
                   flush against the block's edge the moment the row scrolls
                   out from under it. With no gutter, the row keeps it. */
                !lineNumbers && !hasAnnotations && "ps-3.5",
                /* Derived from the one token rather than picked, so a consumer
                   who changes `--primary` gets a mark that still belongs to
                   the rest of their interface. The dark step is heavier: the
                   same alpha over a dark surface lifts it far less. */
                highlighted && "bg-primary/[0.07] dark:bg-primary/[0.12]"
              )}
            >
              {(lineNumbers || hasAnnotations) && (
                /* Marker and numbers in one stuck element rather than two: two
                   siblings both pinned to `start-0` would sit on top of each
                   other, and the fill has to be unbroken across the pair or
                   the code shows through the seam between them. */
                <span
                  className={cn(
                    "sticky start-0 z-10 flex shrink-0 items-start gap-1.5 ps-2.5 pe-3.5 select-none",
                    fill
                  )}
                >
                  {hasAnnotations &&
                    (note ? (
                      <button
                        type="button"
                        data-slot="code-block-annotation-marker"
                        aria-expanded={open}
                        /* Only while it exists: the note mounts on opening,
                           and `aria-controls` pointing at nothing is worse
                           than not pointing. `aria-expanded` carries the
                           state either way. */
                        aria-controls={open ? `${noteId}-${number}` : undefined}
                        aria-label={
                          open
                            ? `Hide note on line ${number}`
                            : `Show note on line ${number}`
                        }
                        onClick={() => toggleNote(number)}
                        className="grid h-[1.7em] w-3.5 shrink-0 cursor-pointer place-items-center rounded-sm text-foreground/30 transition-colors duration-150 outline-none hover:text-foreground/70 focus-visible:ring-1 focus-visible:ring-foreground/20 motion-reduce:transition-none"
                      >
                        <HugeiconsIcon
                          aria-hidden
                          icon={ArrowRight01Icon}
                          strokeWidth={2.5}
                          className={cn(
                            "size-3 transition-transform duration-150 motion-reduce:transition-none",
                            /* The flip has to come before the rotation, or an
                               open marker points up in an RTL layout. */
                            "rtl:-scale-x-100",
                            open && "rotate-90"
                          )}
                        />
                      </button>
                    ) : (
                      /* An unannotated line still holds the column, so the
                         numbers beside it do not step in and out as the eye
                         travels down the block. */
                      <span aria-hidden className="w-3.5 shrink-0" />
                    ))}
                  {lineNumbers && (
                    <span
                      aria-hidden
                      style={{ minInlineSize: gutter }}
                      /* `select-none` above is the whole difference between a
                         gutter and a column of text: nothing in here joins a
                         copied selection. */
                      className={cn(
                        "text-end tabular-nums",
                        highlighted ? "text-primary/70" : "text-foreground/25"
                      )}
                    >
                      {number}
                    </span>
                  )}
                </span>
              )}
              <span
                className={
                  wrap
                    ? "min-w-0 flex-1 break-words whitespace-pre-wrap"
                    : "whitespace-pre"
                }
              >
                {tokens.map((token, at) => (
                  <span key={at} className={colors[token.kind]}>
                    {token.text}
                  </span>
                ))}
                {streaming && index === lines.length - 1 && <CodeBlockCaret />}
              </span>
            </span>
          )

          /* Closed notes are not rendered rather than hidden: `hidden` sets
             `display: none` from the UA sheet, which the `block` below would
             win against, and mounting on open is what gives the note its
             entry animation. */
          if (!note || !open) return line

          /* `codeSurface` sizes the rows to the widest line, so a note left to
             fill its parent would be as wide as the longest line in the block
             and mostly off screen. It takes its own width instead, and sticks
             to the start edge so scrolling to the end of a long line does not
             leave the note behind. */
          return (
            <React.Fragment key={index}>
              {line}
              <span
                id={`${noteId}-${number}`}
                data-slot="code-block-annotation"
                data-line={number}
                className="sticky start-0 block w-fit max-w-[100cqi] animate-in px-3.5 py-1.5 duration-150 fade-in slide-in-from-top-1 motion-reduce:animate-none"
              >
                {note}
              </span>
            </React.Fragment>
          )
        })}
      </code>
    </pre>
  )
}

export {
  CodeBlock,
  CodeBlockAction,
  CodeBlockActions,
  CodeBlockBody,
  CodeBlockCaret,
  CodeBlockCopy,
  CodeBlockDownload,
  CodeBlockHeader,
  CodeBlockTitle,
}
