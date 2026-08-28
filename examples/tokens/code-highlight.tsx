import {
  DIFF_MARK,
  DIFF_ROW,
  TOKEN_PALETTES,
  tokenize,
  tokenizeCommand,
  type Token,
  type TokenKind,
} from "@/lib/highlight"
import { cn } from "@/lib/utils"

// `pb-14` keeps the last row clear of the floating toolbar.
const demoShell =
  "flex h-full min-h-0 w-full flex-col gap-3 overflow-y-auto pb-14"

/**
 * One specimen per kind, each a single token of it — a call site is written
 * `tokenize` and not `tokenize(code)`, because these rows paint the whole
 * string in one colour and a bracket dragged in with it would be showing the
 * wrong hue for the wrong thing.
 *
 * Ordered as `TokenKind` declares them rather than by hue, so the row a reader
 * lands on is the one the source names next.
 */
const specimens: { kind: TokenKind; sample: string }[] = [
  { kind: "comment", sample: "// what it is for" },
  { kind: "string", sample: `"a literal"` },
  { kind: "number", sample: "0.6875" },
  { kind: "function", sample: "tokenize" },
  { kind: "keyword", sample: "export" },
  { kind: "punctuation", sample: "{ } ( ) => ;" },
  { kind: "plain", sample: "palette" },
]

/**
 * Enough of a file to exercise the scanner rather than illustrate it: a
 * comment, a default argument, a bare number, a three-clause `for`, a template
 * string with a hole in it, and the blank lines that prove rows survive the
 * split.
 */
const sample = `// The scanner is one pass, not a parser.
export function greet(name = "world") {
  const times = 3

  for (let i = 0; i < times; i++) {
    console.log(\`hello, \${name}\`)
  }

  return null
}`

/**
 * The lines a card's toolbar hands out, which is where `tokenizeCommand` earns
 * its own pass: a bare path, a full URL and a pinned version each read as the
 * literal they are, and the flag reads as a flag.
 */
const commands = [
  "npx shadcn@latest add https://ui.aiellie.dev/r/code-block.json",
  "pnpm dlx shadcn@latest add ./r/highlight.json",
  "npm install -D tailwindcss@4",
]

/** A hunk with both marks in it, and context either side to tint against. */
const hunk: { kind: "add" | "remove" | "context"; text: string }[] = [
  { kind: "context", text: "export const TOKEN_COLORS = {" },
  { kind: "remove", text: `  comment: "text-emerald-600",` },
  { kind: "add", text: `  comment: "text-foreground/40 italic",` },
  { kind: "context", text: "}" },
]

function Line({
  tokens,
  colors,
}: {
  tokens: Token[]
  colors: Record<TokenKind, string>
}) {
  return (
    <>
      {tokens.map((token, at) => (
        <span key={at} className={colors[token.kind]}>
          {token.text}
        </span>
      ))}
    </>
  )
}

/** The panel every code sample on this card sits in, so they read as one set. */
const panel =
  "shrink-0 overflow-x-auto rounded-lg border bg-card p-3 font-mono text-[12px] leading-[1.7]"

function Ramp({ colors }: { colors: Record<TokenKind, string> }) {
  return (
    <div className="flex min-w-0 shrink-0 flex-col">
      {specimens.map(({ kind, sample }) => (
        <div
          key={kind}
          className="flex min-w-0 shrink-0 flex-col gap-0.5 border-b py-2 last:border-b-0"
        >
          <div className="flex items-baseline justify-between gap-3">
            <code
              className={cn(
                "min-w-0 truncate font-mono text-[13px]",
                colors[kind]
              )}
            >
              {sample}
            </code>
            <span className="shrink-0 text-[0.6875rem] text-muted-foreground">
              {kind}
            </span>
          </div>
          {/* The class is this page's `cssVar`: what a swatch is worth to a
              reader is the thing they can paste. */}
          <span className="truncate font-mono text-[0.6875rem] text-muted-foreground">
            {colors[kind]}
          </span>
        </div>
      ))}
    </div>
  )
}

function Sample({ colors }: { colors: Record<TokenKind, string> }) {
  const lines = tokenize(sample)

  return (
    <pre className={panel}>
      <code>
        {lines.map((tokens, index) => (
          // A blank line still holds its row open, which is what a non-breaking
          // space is for — an empty div would collapse to nothing.
          <div key={index}>
            {tokens.length ? <Line tokens={tokens} colors={colors} /> : " "}
          </div>
        ))}
      </code>
    </pre>
  )
}

function PaletteDemo() {
  return (
    <div className={demoShell}>
      <p className="shrink-0 text-xs text-muted-foreground">
        Four hues, each meaning exactly one thing, with comments and punctuation
        left out of the colour so neither speaks over the code.
      </p>
      <Ramp colors={TOKEN_PALETTES.color} />
    </div>
  )
}

function MonoDemo() {
  return (
    <div className={demoShell}>
      <p className="shrink-0 text-xs text-muted-foreground">
        The same distinctions with the hue taken out: every step is the
        foreground at a fraction, so the ramp inverts with the theme on its own.
      </p>
      <Ramp colors={TOKEN_PALETTES.mono} />
    </div>
  )
}

/**
 * Both palettes over the same file, stacked rather than side by side — a ramp
 * is judged on running code, and the question it answers is whether the mono
 * set still separates a keyword from the name beside it once the hue is gone.
 */
function ScannerDemo() {
  return (
    <div className={demoShell}>
      <p className="shrink-0 text-xs text-muted-foreground">
        One pass over the file, the same rows either way — a language name
        labels the code, it does not switch the scanner.
      </p>
      {(
        [
          { name: "Colour", palette: "color" },
          { name: "Mono", palette: "mono" },
        ] as const
      ).map((set) => (
        <div key={set.name} className="flex shrink-0 flex-col gap-1.5">
          <span className="font-mono text-[10px] tracking-[0.08em] text-foreground/30 uppercase">
            {set.name}
          </span>
          <Sample colors={TOKEN_PALETTES[set.palette]} />
        </div>
      ))}
    </div>
  )
}

function CommandDemo() {
  return (
    <div className={demoShell}>
      <p className="shrink-0 text-xs text-muted-foreground">
        A command line is one row and is not a language, so it gets its own
        pass: the program leads, flags take the accent, and URLs and versions
        read as the literals they are.
      </p>
      <div className={cn(panel, "flex flex-col gap-1.5")}>
        {commands.map((command) => (
          <div key={command} className="flex min-w-0 items-baseline gap-2">
            <span aria-hidden className="shrink-0 text-muted-foreground/60">
              $
            </span>
            <pre className="min-w-0 flex-1 overflow-x-auto">
              <code>
                <Line
                  tokens={tokenizeCommand(command)}
                  colors={TOKEN_PALETTES.color}
                />
              </code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}

function DiffDemo() {
  return (
    <div className={demoShell}>
      <p className="shrink-0 text-xs text-muted-foreground">
        The tint goes on the row and the hue on the mark, leaving the code its
        own colouring — a changed line is still code, and a reader has to see
        what kind before they can judge the change.
      </p>
      <pre className={cn(panel, "px-0")}>
        <code>
          {hunk.map((row, index) => {
            const tinted = row.kind !== "context"

            return (
              <div
                key={index}
                className={cn(
                  "flex min-w-0 items-baseline gap-2 px-3",
                  tinted && DIFF_ROW[row.kind as "add" | "remove"]
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "w-2 shrink-0 select-none",
                    tinted
                      ? DIFF_MARK[row.kind as "add" | "remove"]
                      : "text-foreground/20"
                  )}
                >
                  {row.kind === "add" ? "+" : row.kind === "remove" ? "−" : " "}
                </span>
                <span className="min-w-0 flex-1">
                  <Line
                    tokens={tokenize(row.text)[0] ?? []}
                    colors={TOKEN_PALETTES.color}
                  />
                </span>
              </div>
            )
          })}
        </code>
      </pre>
      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.6875rem] text-muted-foreground">
        {(["add", "remove"] as const).map((kind) => (
          <span key={kind} className="flex items-center gap-1.5">
            <span
              className={cn("size-3 rounded-[3px] border", DIFF_ROW[kind])}
            />
            <span className={DIFF_MARK[kind]}>{kind}</span>
            <span className="font-mono">{DIFF_ROW[kind]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// Which tab shows which of these is settled by `meta.variants` on the
// `code-highlight-demo` registry item.
export { PaletteDemo, MonoDemo, ScannerDemo, CommandDemo, DiffDemo }
