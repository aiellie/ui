"use client"

import * as React from "react"
import { CheckmarkSquare02Icon, SquareIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Response,
  ResponseCodeBlock,
  ResponseTable,
} from "@/components/aiellie-ui/response"

/**
 * Enough markdown for this repository's own documents, rendered into
 * `Response`.
 *
 * `Response` is deliberately not a parser — it styles whatever elements a
 * renderer emits and stays out of the argument about which renderer that is.
 * This is that argument settled for one caller. The files it reads are ours,
 * written in a dialect we control, so a scanner over the constructs they
 * actually use beats adding a CommonMark implementation to the bundle to
 * render fifteen kilobytes of prose. Anything it does not recognise falls
 * through as a paragraph rather than disappearing, so an unsupported construct
 * costs its formatting and not its content.
 */

/* Block openers, in the order the scanner tries them. `RULE` is tested before
   the bullet so a `---` divider is not read as an empty list item, and the
   table before the paragraph fallback so a row of pipes is not swallowed as
   prose. None carry the global flag: `test` would then be stateful across
   calls and skip every other match. */
const HEADING = /^(#{1,6})\s+(.*)$/
const FENCE = /^```(\S*)\s*$/
const RULE = /^(?:-{3,}|_{3,}|\*{3,})\s*$/
const QUOTE = /^>\s?(.*)$/
const BULLET = /^([-*+])\s+(.*)$/
const ORDERED = /^(\d+)[.)]\s+(.*)$/
const TASK = /^\[([ xX])\]\s+(.*)$/
const DIVIDER = /^\|[\s:|-]+\|\s*$/

/* One pass of alternation, code first so a `**` or `_` inside a span stays
   literal: the scan takes the earliest match of any branch, and a span's
   opening backtick always precedes the punctuation it is protecting.
   Emphasis is `_…_` alone — `*…*` would collide with the star that turns up in
   globs and file names, and neither document spends it on emphasis. */
const INLINE = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)|_([^_]+)_/g

type HeadingTag = `h${1 | 2 | 3 | 4 | 5 | 6}`

interface ListItem {
  /** The item's own lines, dedented to its content column. */
  lines: string[]
  /** The column that content starts at, used to dedent what follows it. */
  indent: number
  /** Set only for a task item, so a plain bullet keeps its marker. */
  done?: boolean
}

function indentOf(line: string) {
  return line.length - line.trimStart().length
}

/** Whether a link leaves the site, and so should not replace the page. */
function isExternal(href: string) {
  return !href.startsWith("/") && !href.startsWith("#")
}

function renderInline(text: string, key: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let cursor = 0
  let index = 0

  /* `matchAll` clones the regex rather than advancing the shared `lastIndex`,
     which is the only safe way to reuse a module-level global pattern. */
  for (const match of text.matchAll(INLINE)) {
    const at = match.index ?? 0
    if (at > cursor) nodes.push(text.slice(cursor, at))

    const [whole, code, strong, label, href, emphasis] = match
    const id = `${key}-i${index}`

    /* Everything but a code span is scanned again for what it contains: a
       bold lead-in naming the command it is about (`**`pnpm build`**`) is the
       common shape in both documents, and rendering it flat would leave the
       backticks on the page. A span's own content is literal by definition and
       is the one branch that does not recurse — which is also what stops the
       recursion, since each pass strips the delimiter it matched. */
    if (code !== undefined) {
      nodes.push(<code key={id}>{code}</code>)
    } else if (strong !== undefined) {
      nodes.push(<strong key={id}>{renderInline(strong, id)}</strong>)
    } else if (label !== undefined) {
      const external = isExternal(href)
      nodes.push(
        <a
          key={id}
          href={href}
          // The panel is a dialog over the site, so a link that navigated in
          // place would take the reader's position in the document with it.
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          {renderInline(label, id)}
        </a>
      )
    } else if (emphasis !== undefined) {
      nodes.push(<em key={id}>{renderInline(emphasis, id)}</em>)
    }

    cursor = at + whole.length
    index += 1
  }

  if (cursor < text.length) nodes.push(text.slice(cursor))
  return nodes
}

/**
 * Lines to elements. Recursive, because a list item is a document of its own —
 * the numbered steps in `CLAUDE.md` carry paragraphs and fenced code, and only
 * a second pass over the item's dedented lines gets those out.
 */
function renderBlocks(lines: string[], key: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const raw = lines[i]
    const trimmed = raw.trim()

    if (trimmed === "") {
      i += 1
      continue
    }

    const id = `${key}-${i}`

    const fence = FENCE.exec(trimmed)
    if (fence) {
      /* The fence's own column is the code's zero. A block nested in a list
         item arrives indented to that item's content, and every row of it with
         it — dedenting by the opening column keeps the code's own indentation
         intact while removing the item's. */
      const column = indentOf(raw)
      const body: string[] = []
      i += 1
      while (i < lines.length && !FENCE.test(lines[i].trim())) {
        body.push(lines[i].slice(Math.min(indentOf(lines[i]), column)))
        i += 1
      }
      i += 1
      nodes.push(
        <ResponseCodeBlock
          key={id}
          code={body.join("\n")}
          language={fence[1] || "text"}
        />
      )
      continue
    }

    const heading = HEADING.exec(trimmed)
    if (heading) {
      const Tag = `h${heading[1].length}` as HeadingTag
      nodes.push(<Tag key={id}>{renderInline(heading[2], id)}</Tag>)
      i += 1
      continue
    }

    if (RULE.test(trimmed)) {
      nodes.push(<hr key={id} />)
      i += 1
      continue
    }

    if (QUOTE.test(trimmed)) {
      const body: string[] = []
      while (i < lines.length) {
        const quote = QUOTE.exec(lines[i].trim())
        if (!quote) break
        body.push(quote[1])
        i += 1
      }
      nodes.push(<blockquote key={id}>{renderBlocks(body, id)}</blockquote>)
      continue
    }

    /* A row of pipes is only a table when the row under it is the divider —
       otherwise it is a sentence that happens to start with one. */
    if (
      trimmed.startsWith("|") &&
      i + 1 < lines.length &&
      DIVIDER.test(lines[i + 1].trim())
    ) {
      const cells = (row: string) =>
        row
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((cell) => cell.trim())

      const head = cells(trimmed)
      i += 2
      const body: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        body.push(cells(lines[i]))
        i += 1
      }

      nodes.push(
        <ResponseTable key={id}>
          <table>
            <thead>
              <tr>
                {head.map((cell, column) => (
                  <th key={column}>{renderInline(cell, `${id}-h${column}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, column) => (
                    <td key={column}>
                      {renderInline(cell, `${id}-${index}-${column}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ResponseTable>
      )
      continue
    }

    const ordered = ORDERED.exec(trimmed)
    const bullet = ordered ? null : BULLET.exec(trimmed)
    if (ordered || bullet) {
      const marker = ordered ? ORDERED : BULLET
      const column = indentOf(raw)
      const items: ListItem[] = []
      let tasks = false

      while (i < lines.length) {
        const line = lines[i]
        const text = line.trim()

        if (text === "") {
          /* A blank line ends the list only when what follows is neither
             another item nor something indented under the last one. That is
             the whole difference between a paragraph after the list and a
             second paragraph inside its final item — and between a code block
             belonging to a step and one that has left it. */
          let ahead = i + 1
          while (ahead < lines.length && lines[ahead].trim() === "") ahead += 1
          if (ahead >= lines.length) break

          const next = lines[ahead]
          const continues =
            indentOf(next) > column ||
            (indentOf(next) === column && marker.test(next.trim()))
          if (!continues) break

          /* Kept line for line rather than collapsed: the blank rows inside a
             fenced block are part of the code. */
          items[items.length - 1]?.lines.push("")
          i += 1
          continue
        }

        const at = indentOf(line)

        if (at === column) {
          const opener = marker.exec(text)
          if (!opener) break
          const content = opener[2]
          const task = TASK.exec(content)
          if (task) tasks = true
          items.push({
            lines: [task ? task[2] : content],
            indent: column + (text.length - content.length),
            done: task ? task[1].toLowerCase() === "x" : undefined,
          })
          i += 1
          continue
        }

        const last = items[items.length - 1]
        if (at > column && last) {
          last.lines.push(line.slice(Math.min(at, last.indent)))
          i += 1
          continue
        }

        break
      }

      const List = ordered ? "ol" : "ul"
      nodes.push(
        <List
          key={id}
          // A checklist supplies its own boxes, so the list marker beside them
          // would be a second bullet for the same item.
          className={tasks ? "list-none ps-0" : undefined}
        >
          {items.map((item, index) => {
            const blocks = renderBlocks(item.lines, `${id}-${index}`)

            /* `Response` spaces its own children and stops there, so an item
               holding more than a sentence has to space its blocks itself. */
            if (item.done === undefined) {
              return (
                <li key={index} className="[&>*+*]:mt-3">
                  {blocks}
                </li>
              )
            }

            return (
              <li key={index} className="flex items-start gap-2">
                <HugeiconsIcon
                  icon={item.done ? CheckmarkSquare02Icon : SquareIcon}
                  strokeWidth={1.75}
                  className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                {/* The box is the only thing carrying the state, and it is a
                    glyph — so the state is said as well as drawn. */}
                <span className="sr-only">
                  {item.done ? "Done: " : "To do: "}
                </span>
                <div className="min-w-0 [&>*+*]:mt-3">{blocks}</div>
              </li>
            )
          })}
        </List>
      )
      continue
    }

    /* Everything else is prose. The documents are hard-wrapped, so the rows of
       a paragraph are joined back into one line before the inline scan — a
       span or a bold run split across a line break would otherwise not match. */
    const body = [trimmed]
    i += 1
    while (i < lines.length) {
      const text = lines[i].trim()
      if (
        text === "" ||
        HEADING.test(text) ||
        FENCE.test(text) ||
        RULE.test(text) ||
        QUOTE.test(text) ||
        BULLET.test(text) ||
        ORDERED.test(text) ||
        text.startsWith("|")
      ) {
        break
      }
      body.push(text)
      i += 1
    }
    nodes.push(<p key={id}>{renderInline(body.join(" "), id)}</p>)
  }

  return nodes
}

/**
 * A markdown document as `Response` prose. The parse is memoised because the
 * source is a file that does not change while the panel is open, and re-running
 * the scanner on every keystroke that reaches an ancestor would be work for
 * nothing.
 */
function Markdown({
  source,
  ...props
}: Omit<React.ComponentProps<typeof Response>, "children"> & {
  source: string
}) {
  const content = React.useMemo(
    () => renderBlocks(source.split("\n"), "md"),
    [source]
  )

  return (
    <Response data-slot="markdown" {...props}>
      {content}
    </Response>
  )
}

export { Markdown }
