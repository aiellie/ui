"use client"

import * as React from "react"
import {
  ArrowReloadHorizontalIcon,
  ScrollHorizontalIcon,
  TextWrapIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { mono } from "@/components/aiellie-ui/actions"
import {
  CodeBlock,
  CodeBlockAction,
  CodeBlockActions,
  CodeBlockBody,
  CodeBlockCopy,
  CodeBlockDownload,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/aiellie-ui/code/code-block"
import { cn } from "@/lib/utils"

/** A module-scope clock, which is the thing the block is arguing for. */
const CLOCK = `import { useSyncExternalStore } from "react"

const listeners = new Set<() => void>()
let now = Date.now()

setInterval(() => {
  now = Date.now()
  listeners.forEach((notify) => notify())
}, 1000)`

/** Numbered because the prose around it would be pointing at lines 3 to 5. */
const SCANNER = `export function tokenize(code: string) {
  const lines: Token[][] = [[]]
  for (const match of code.matchAll(TOKEN)) {
    // A multi-line match is split back into rows here.
    push(match[0], kindOf(match))
  }

  return lines
}`

/** Python, so the comment and the keyword set are exercised somewhere else. */
const SUMMARISE = `def summarise(rows, limit=5):
    # The first few rows, and a count of what was left behind.
    head = rows[:limit]
    rest = len(rows) - len(head)

    if rest > 0:
        return head, f"and {rest} more"
    return head, None`

/** One line far longer than the card, which is the case `wrap` is for. */
const LONG = `const description =
  "A block of code as a thing on the page rather than a thing inside prose: named, copyable, and able to still be arriving."

export const meta = { title: "Code Block", description }`

const STREAMED = `export async function* stream(response: Response) {
  const reader = response.body.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) return
    yield decoder.decode(value, { stream: true })
  }
}`

export function CodeBlockDemo() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>use-tick.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy code={CLOCK} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockBody code={CLOCK} />
    </CodeBlock>
  )
}

/**
 * Numbers earn their column when something outside the block refers to them,
 * and the marked rows are that reference made visible.
 */
export function CodeBlockNumberedDemo() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>highlight.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy code={SCANNER} />
          <CodeBlockDownload code={SCANNER} filename="highlight.ts" />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockBody code={SCANNER} lineNumbers highlightLines={[3, 4, 5]} />
    </CodeBlock>
  )
}

/**
 * The badge in the language's own colours rather than the interface's. Worth it
 * where the file's identity is the point; noise where the header is one of
 * several and they are all the same language.
 */
export function CodeBlockBrandDemo() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle icon="brand">use-tick.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy code={CLOCK} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockBody code={CLOCK} />
    </CodeBlock>
  )
}

/** The palette for a block set among prose the three hues would speak over. */
export function CodeBlockMonoDemo() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>summarise.py</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy code={SUMMARISE} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockBody code={SUMMARISE} palette="mono" />
    </CodeBlock>
  )
}

/**
 * A custom action, which is what `CodeBlockAction` is the seam for — here a
 * toggle, so it carries `aria-pressed` rather than the tick a one-shot gets.
 *
 * The two states are two glyphs rather than one glyph in two weights: a line
 * that folds, or a line that runs off the end and is scrolled to. Colour
 * would have made this the one control in the row that means something by
 * being brighter, which is a rule the rest of the header does not follow.
 */
export function CodeBlockWrapDemo() {
  const [wrap, setWrap] = React.useState(true)

  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>meta.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockAction
            tooltip={wrap ? "Stop wrapping" : "Wrap lines"}
            aria-pressed={wrap}
            onClick={() => setWrap((value) => !value)}
          >
            <HugeiconsIcon
              icon={wrap ? TextWrapIcon : ScrollHorizontalIcon}
              strokeWidth={2}
            />
          </CodeBlockAction>
          <CodeBlockCopy code={LONG} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockBody code={LONG} wrap={wrap} />
    </CodeBlock>
  )
}

/**
 * The code arriving a character at a time. Mounted fresh on each run rather
 * than reset in an effect, so the count starts where a first render would put
 * it and nothing re-renders to correct itself.
 */
function StreamedBody({ code, speed = 12 }: { code: string; speed?: number }) {
  const [length, setLength] = React.useState(0)
  const done = length >= code.length

  React.useEffect(() => {
    if (done) return
    const id = setInterval(
      () => setLength((value) => Math.min(value + 1, code.length)),
      speed
    )
    return () => clearInterval(id)
  }, [code.length, done, speed])

  return (
    <CodeBlockBody
      code={code.slice(0, length)}
      streaming={!done}
      /* The block would otherwise grow a row at a time under a card that
         centres it, moving every line already written. The height the finished
         code takes is reserved from the first frame instead. */
      className="min-h-[194px]"
    />
  )
}

export function CodeBlockStreamingDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>stream.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockAction
            tooltip="Replay"
            onClick={() => setRun((value) => value + 1)}
          >
            <HugeiconsIcon icon={ArrowReloadHorizontalIcon} strokeWidth={2} />
          </CodeBlockAction>
          <CodeBlockCopy code={STREAMED} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <StreamedBody key={run} code={STREAMED} />
    </CodeBlock>
  )
}

/** Files that differ by more than their contents, so the badge moves with them. */
const FILES = [
  {
    name: "copy.ts",
    code: `export async function copy(value: string) {
  if (!navigator.clipboard) return false

  await navigator.clipboard.writeText(value)
  return true
}`,
  },
  {
    name: "copy.css",
    code: `[data-slot="code-block-action"] {
  color: color-mix(in oklch, currentColor 45%, transparent);
  transition: color 150ms;
}

[data-slot="code-block-action"]:hover {
  color: currentColor;
}`,
  },
  {
    name: "read.ts",
    code: `export async function read() {
  // Reading asks for a permission that writing does not.
  const state = await navigator.permissions.query({
    name: "clipboard-read",
  })

  return state.granted ? navigator.clipboard.readText() : null
}`,
  },
]

/**
 * The header taking file tabs instead of a name — the case a `header` override
 * prop existed to cover, and the reason the header is a part.
 */
export function CodeBlockTabsDemo() {
  const [active, setActive] = React.useState(0)
  const file = FILES[active]

  return (
    <CodeBlock>
      <CodeBlockHeader className="py-1.5">
        {/* The actions do not shrink, so the strip has to: more files than the
            block is wide scrolls the tabs rather than pushing the copy off the
            end. `py-1 -my-1` buys back the room a scroller clips on the other
            axis, which is where the pills' focus ring lives. */}
        <div
          role="tablist"
          className="-my-1 -ms-1 flex min-w-0 items-center gap-0.5 overflow-x-auto py-1"
        >
          {FILES.map((entry, at) => {
            const selected = at === active

            return (
              <button
                key={entry.name}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(at)}
                className={cn(
                  mono,
                  "shrink-0 cursor-pointer rounded-full px-2 py-1 transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 active:scale-[0.94] motion-reduce:transition-none",
                  selected
                    ? "bg-foreground/[0.06] text-foreground/90 dark:bg-foreground/[0.09]"
                    : "text-foreground/35 hover:text-foreground/70"
                )}
              >
                {entry.name}
              </button>
            )
          })}
        </div>
        <CodeBlockActions>
          <CodeBlockCopy code={file.code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      {/* Keyed by file, so switching tabs reads as the new code arriving
          rather than as the old code changing under the same rows. */}
      <CodeBlockBody key={file.name} code={file.code} />
    </CodeBlock>
  )
}
