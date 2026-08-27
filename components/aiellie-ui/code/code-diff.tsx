"use client"

import * as React from "react"

import { codeScroll, codeSurface, mono } from "@/components/aiellie-ui/actions"
import {
  DIFF_MARK,
  DIFF_ROW,
  TOKEN_PALETTES,
  tokenize,
  type TokenPalette,
} from "@/lib/highlight"
import { cn } from "@/lib/utils"

export type DiffKind = "add" | "remove" | "context" | "hunk"

export interface DiffRow {
  kind: DiffKind
  text: string
  /** Where the row sits in the original file; absent on an added row. */
  before?: number
  /** Where it sits in the new one; absent on a removed row. */
  after?: number
}

/**
 * A unified diff, as `git diff` writes it and as a model answers with it, into
 * rows that can be laid out.
 *
 * Taking the diff rather than a before and an after is the whole design
 * decision here: computing one would mean shipping a diff algorithm, and the
 * caller nearly always has the diff already — it is what the tool that made
 * the change handed them. Exported so a caller holding rows of their own can
 * skip the parse.
 *
 * File headers are dropped: which file this is belongs in the title above,
 * where it can be read, rather than in the body where it would be the first
 * two lines of every diff.
 */
export function parseDiff(diff: string): DiffRow[] {
  const rows: DiffRow[] = []
  let before = 0
  let after = 0

  for (const line of diff.split("\n")) {
    const hunk = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line)

    if (hunk) {
      before = Number(hunk[1])
      after = Number(hunk[2])
      rows.push({ kind: "hunk", text: line })
      continue
    }

    /* `\ No newline at end of file` is a note about the diff, not a line of
       the file, and counting it would put every later number out by one. */
    if (/^(diff |index |--- |\+\+\+ |\\)/.test(line)) continue

    if (line.startsWith("+")) {
      rows.push({ kind: "add", text: line.slice(1), after: after++ })
    } else if (line.startsWith("-")) {
      rows.push({ kind: "remove", text: line.slice(1), before: before++ })
    } else {
      rows.push({
        kind: "context",
        text: line.replace(/^ /, ""),
        before: before++,
        after: after++,
      })
    }
  }

  /* A diff ends in a newline, which splits to a trailing empty row that would
     read as a blank line of context nobody added. */
  const last = rows[rows.length - 1]
  if (last?.kind === "context" && last.text === "") rows.pop()

  return rows
}

export interface DiffPair {
  left?: DiffRow
  right?: DiffRow
}

/**
 * Rows into the two columns a split view puts them in. A run of removals and
 * the run of additions that replaced it are zipped, so the line that changed
 * sits opposite what it changed from; where one run is longer the other column
 * is simply empty. Context appears in both.
 */
export function pairRows(rows: readonly DiffRow[]): DiffPair[] {
  const pairs: DiffPair[] = []
  let removed: DiffRow[] = []
  let added: DiffRow[] = []

  const flush = () => {
    const length = Math.max(removed.length, added.length)
    for (let index = 0; index < length; index += 1) {
      pairs.push({ left: removed[index], right: added[index] })
    }
    removed = []
    added = []
  }

  for (const row of rows) {
    if (row.kind === "remove") removed.push(row)
    else if (row.kind === "add") added.push(row)
    else {
      flush()
      pairs.push({ left: row, right: row })
    }
  }

  flush()
  return pairs
}

/** What the diff comes to, as a header carries it: `+12 −4`. */
export function CodeDiffStat({
  added,
  removed,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  added: number
  removed: number
}) {
  return (
    <span
      data-slot="code-diff-stat"
      /* Read as one phrase rather than as two numbers a screen reader would
         have to make sense of from the marks alone. */
      aria-label={`${added} added, ${removed} removed`}
      className={cn(mono, "flex shrink-0 items-center gap-1.5", className)}
      {...props}
    >
      <span aria-hidden className={DIFF_MARK.add}>
        +{added}
      </span>
      {/* A minus sign, not a hyphen: it is standing beside a plus. */}
      <span aria-hidden className={DIFF_MARK.remove}>
        −{removed}
      </span>
    </span>
  )
}

/** The totals a `CodeDiffStat` wants, without counting the rows by hand. */
export function diffStat(rows: readonly DiffRow[]) {
  return {
    added: rows.filter((row) => row.kind === "add").length,
    removed: rows.filter((row) => row.kind === "remove").length,
  }
}

const MARKS: Record<DiffKind, string> = {
  add: "+",
  remove: "−",
  context: " ",
  hunk: " ",
}

type Tokenized = DiffRow & { tokens: ReturnType<typeof tokenize>[number] }

/**
 * One row's code, coloured as code. A changed line is still code, and which
 * kind of change it is comes from the tint behind it rather than from taking
 * the colouring away.
 */
function DiffCode({
  row,
  colors,
}: {
  row: Tokenized
  colors: Record<string, string>
}) {
  if (row.kind === "hunk") {
    return <span className="text-foreground/35">{row.text}</span>
  }

  return (
    <>
      {row.tokens.map((token, index) => (
        <span key={index} className={colors[token.kind]}>
          {token.text}
        </span>
      ))}
    </>
  )
}

/** The number columns and the mark, which are about the diff and not in it. */
function DiffGutter({
  row,
  columns,
  width,
}: {
  row?: DiffRow
  columns: ("before" | "after")[]
  width: string
}) {
  return (
    <>
      {columns.map((column) => (
        <span
          key={column}
          aria-hidden
          style={{ minInlineSize: width }}
          className="shrink-0 pe-2 text-end tabular-nums text-foreground/25 select-none"
        >
          {row?.[column] ?? ""}
        </span>
      ))}
      <span
        aria-hidden
        /* `select-none` on the marks as well as the numbers: a diff copied
           with its pluses still attached is not code you can paste anywhere. */
        className={cn(
          "w-3 shrink-0 select-none",
          row && row.kind !== "context" && row.kind !== "hunk"
            ? DIFF_MARK[row.kind]
            : "text-foreground/20"
        )}
      >
        {row ? MARKS[row.kind] : ""}
      </span>
    </>
  )
}

export interface CodeDiffBodyProps
  extends Omit<React.ComponentProps<"pre">, "children"> {
  /** A unified diff, as `git diff` writes it. */
  diff: string
  /**
   * `unified` reads the change as one sequence, which is how a small edit is
   * described. `split` puts before and after side by side, which needs the
   * width but answers "what did this used to say" without counting rows.
   */
  view?: "unified" | "split"
  palette?: TokenPalette
  lineNumbers?: boolean
}

/**
 * The rows of a diff. Goes inside a `CodeBlock`, so a diff and a plain block
 * carry the same header, the same copy, and the same surface — the only thing
 * that differs between them is what the rows mean.
 */
export function CodeDiffBody({
  diff,
  view = "unified",
  palette = "color",
  lineNumbers = true,
  className,
  ...props
}: CodeDiffBodyProps) {
  const rows = React.useMemo<Tokenized[]>(
    () =>
      parseDiff(diff).map((row) => ({
        ...row,
        /* Per row rather than over the whole diff: a removed line and the line
           that replaced it are not consecutive code, and scanning them as if
           they were would leave a string opened on one and closed on another. */
        tokens: tokenize(row.text)[0] ?? [],
      })),
    [diff]
  )

  const colors = TOKEN_PALETTES[palette]
  const split = view === "split"
  const pairs = React.useMemo(() => (split ? pairRows(rows) : []), [split, rows])

  /* Room for the highest number either side reaches, so the gutter does not
     widen partway down and step every row after it sideways. */
  const width = `${String(
    rows.reduce((most, row) => Math.max(most, row.after ?? 0, row.before ?? 0), 0)
  ).length}ch`

  const rowClass =
    "flex min-h-[1.7em] animate-in px-3 duration-300 fill-mode-both fade-in motion-reduce:animate-none"

  return (
    <pre
      data-slot="code-diff-body"
      data-view={view}
      /* Code, not prose: see `CodeBlockBody`. A diff is worse under `rtl`
         still, since the marks would swap ends with the numbers. */
      dir="ltr"
      tabIndex={0}
      className={cn(
        codeScroll,
        "py-3 outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-inset",
        className
      )}
      {...props}
    >
      <code
        className={cn(
          codeSurface,
          "block font-mono text-[12.5px] leading-[1.7]"
        )}
      >
        {split
          ? pairs.map((pair, index) => {
              const hunk = pair.left?.kind === "hunk"

              /* A hunk header describes both sides, so it spans them rather
                 than being printed twice. */
              if (hunk) {
                return (
                  <span
                    key={index}
                    data-slot="code-diff-row"
                    className={cn(rowClass, "text-foreground/35")}
                  >
                    {pair.left?.text}
                  </span>
                )
              }

              return (
                <span
                  key={index}
                  data-slot="code-diff-row"
                  className="flex min-h-[1.7em] animate-in duration-300 fill-mode-both fade-in motion-reduce:animate-none"
                >
                  {(["left", "right"] as const).map((side) => {
                    const row = pair[side]
                    const tinted =
                      row && (row.kind === "add" || row.kind === "remove")

                    return (
                      <span
                        key={side}
                        data-side={side}
                        data-kind={row?.kind}
                        className={cn(
                          /* Each half takes exactly half the widest row, so
                             the two columns stay aligned no matter which side
                             holds the longer line. */
                          "flex w-1/2 min-w-0 shrink-0 px-3",
                          side === "left" && "border-e border-border/60",
                          tinted && DIFF_ROW[row.kind as "add" | "remove"]
                        )}
                      >
                        {lineNumbers && (
                          <DiffGutter
                            row={row}
                            columns={[side === "left" ? "before" : "after"]}
                            width={width}
                          />
                        )}
                        <span className="min-w-0 whitespace-pre">
                          {row ? (
                            <DiffCode
                              row={row as Tokenized}
                              colors={colors}
                            />
                          ) : null}
                        </span>
                      </span>
                    )
                  })}
                </span>
              )
            })
          : rows.map((row, index) => {
              const tinted = row.kind === "add" || row.kind === "remove"

              return (
                <span
                  key={index}
                  data-slot="code-diff-row"
                  data-kind={row.kind}
                  className={cn(
                    rowClass,
                    tinted && DIFF_ROW[row.kind as "add" | "remove"],
                    row.kind === "hunk" && "bg-foreground/[0.03]"
                  )}
                >
                  {lineNumbers && (
                    <DiffGutter
                      row={row}
                      columns={["before", "after"]}
                      width={width}
                    />
                  )}
                  <span className="whitespace-pre">
                    <DiffCode row={row} colors={colors} />
                  </span>
                </span>
              )
            })}
      </code>
    </pre>
  )
}
