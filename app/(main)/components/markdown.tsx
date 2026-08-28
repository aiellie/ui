"use client"

import * as React from "react"
import { CheckmarkSquare02Icon, SquareIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Response,
  ResponseCodeBlock,
  ResponseTable,
} from "@/components/aiellie-ui/response"
import { cn } from "@/lib/utils"

/**
 * Enough markdown for this repository's own documents, rendered into
 * `Response`, and enough of a search to find a rule in them.
 *
 * `Response` is deliberately not a parser — it styles whatever elements a
 * renderer emits and stays out of the argument about which renderer that is.
 * This is that argument settled for one caller. The files it reads are ours,
 * written in a dialect we control, so a scanner over the constructs they
 * actually use beats adding a CommonMark implementation to the bundle to
 * render forty kilobytes of prose. Anything it does not recognise falls
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
/* Letters as well as digits, because a sub-list under a numbered step is
   lettered in `TODO.md` and would otherwise be run together into one
   paragraph. */
const ORDERED = /^(\d+|[a-z])[.)]\s+(.*)$/
const TASK = /^\[([ xX])\]\s+(.*)$/
const DIVIDER = /^\|[\s:|-]+\|\s*$/

/* One pass of alternation, code first so a `**` or `_` inside a span stays
   literal: the scan takes the earliest match of any branch, and a span's
   opening backtick always precedes the punctuation it is protecting.
   Emphasis is `_…_` alone — `*…*` would collide with the star that turns up in
   globs and file names, and neither document spends it on emphasis. The bare
   URL comes last so a markdown link, whose bracket opens earlier, wins. */
const INLINE =
  /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)|_([^_]+)_|(https?:\/\/[^\s<>]+)/g

/* Sentence-ending punctuation swept up by the URL branch, which cannot tell a
   full stop after a link from one inside it. */
const URL_TAIL = /[.,;:!?)\]]+$/

type HeadingTag = `h${1 | 2 | 3 | 4 | 5 | 6}`

interface Options {
  /** Lower-cased needle, or "" when nothing is being searched for. */
  query: string
  /**
   * Whether a list may drop the items that do not match. Only the outermost
   * pass filters — inside an item the query is still marked, but nothing more
   * is taken away, or a step would lose the code block explaining it.
   */
  filter: boolean
}

/**
 * A top-level block, kept with the source it was built from so the search can
 * decide about it without re-parsing, and with its heading rank so a section
 * can be held together.
 */
interface Block {
  node: React.ReactNode
  source: string
  /** 1–6 for a heading, 0 for everything else. */
  level: number
}

interface ListItem {
  /** The item's own lines, dedented to its content column. */
  lines: string[]
  /** The column that content starts at, used to dedent what follows it. */
  indent: number
  /** The ordinal the source gave it, so a filtered list still numbers truly. */
  value?: number
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

function contains(text: string, query: string) {
  return query !== "" && text.toLowerCase().includes(query)
}

/**
 * A run of text with every occurrence of the query wrapped. Returns the string
 * untouched when there is nothing to mark, so the common case adds no elements
 * to the tree at all.
 */
function withMarks(text: string, query: string, key: string): React.ReactNode {
  if (query === "") return text

  const haystack = text.toLowerCase()
  const nodes: React.ReactNode[] = []
  let from = 0
  let found = 0

  for (
    let at = haystack.indexOf(query);
    at !== -1;
    at = haystack.indexOf(query, from)
  ) {
    if (at > from) nodes.push(text.slice(from, at))
    nodes.push(
      <mark key={`${key}-k${found}`}>{text.slice(at, at + query.length)}</mark>
    )
    from = at + query.length
    found += 1
  }

  if (found === 0) return text
  if (from < text.length) nodes.push(text.slice(from))
  return nodes
}

function renderInline(
  text: string,
  key: string,
  { query }: Options
): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let cursor = 0
  let index = 0

  /* `matchAll` clones the regex rather than advancing the shared `lastIndex`,
     which is the only safe way to reuse a module-level global pattern. */
  for (const match of text.matchAll(INLINE)) {
    const at = match.index ?? 0
    if (at > cursor) {
      nodes.push(withMarks(text.slice(cursor, at), query, `${key}-t${index}`))
    }

    const [whole, code, strong, label, href, emphasis, bare] = match
    const id = `${key}-i${index}`
    const inner = (value: string) =>
      renderInline(value, id, { query, filter: false })

    /* Everything but a code span is scanned again for what it contains: a
       bold lead-in naming the command it is about (`**`pnpm build`**`) is the
       common shape in both documents, and rendering it flat would leave the
       backticks on the page. A span's own content is literal by definition and
       is the one branch that does not recurse — which is also what stops the
       recursion, since each pass strips the delimiter it matched. */
    if (code !== undefined) {
      nodes.push(<code key={id}>{withMarks(code, query, id)}</code>)
    } else if (strong !== undefined) {
      nodes.push(<strong key={id}>{inner(strong)}</strong>)
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
          {inner(label)}
        </a>
      )
    } else if (emphasis !== undefined) {
      nodes.push(<em key={id}>{inner(emphasis)}</em>)
    } else if (bare !== undefined) {
      const tail = URL_TAIL.exec(bare)?.[0] ?? ""
      const url = tail ? bare.slice(0, -tail.length) : bare
      nodes.push(
        <a key={id} href={url} target="_blank" rel="noreferrer">
          {withMarks(url, query, id)}
        </a>
      )
      if (tail) nodes.push(withMarks(tail, query, `${id}-tail`))
    }

    cursor = at + whole.length
    index += 1
  }

  if (cursor < text.length) {
    nodes.push(withMarks(text.slice(cursor), query, `${key}-t${index}`))
  }
  return nodes
}

/**
 * Lines to blocks. Recursive, because a list item is a document of its own —
 * the numbered steps in `CLAUDE.md` carry paragraphs and fenced code, and only
 * a second pass over the item's dedented lines gets those out.
 */
function scanBlocks(lines: string[], key: string, options: Options): Block[] {
  const blocks: Block[] = []
  const { query, filter } = options
  let i = 0

  /* Records a block against the lines it consumed, so `keepMatches` can search
     what a block was written from rather than the tree it became. */
  const push = (node: React.ReactNode, from: number, level = 0) => {
    blocks.push({ node, source: lines.slice(from, i).join("\n"), level })
  }

  while (i < lines.length) {
    const raw = lines[i]
    const trimmed = raw.trim()

    if (trimmed === "") {
      i += 1
      continue
    }

    const id = `${key}-${i}`
    const opened = i

    /* An HTML comment is a note to whoever edits the file, not to whoever
       reads it. The reader strips these before they get here; the branch is
       for whatever document is added next. An unclosed one runs to the end,
       which is what a real parser does with it too. */
    if (trimmed.startsWith("<!--")) {
      while (i < lines.length && !lines[i].includes("-->")) i += 1
      i += 1
      continue
    }

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
      push(
        <ResponseCodeBlock
          key={id}
          code={body.join("\n")}
          language={fence[1] || "text"}
        />,
        opened
      )
      continue
    }

    const heading = HEADING.exec(trimmed)
    if (heading) {
      const level = heading[1].length
      const Tag = `h${level}` as HeadingTag
      i += 1
      push(
        <Tag key={id}>{renderInline(heading[2], id, options)}</Tag>,
        opened,
        level
      )
      continue
    }

    if (RULE.test(trimmed)) {
      i += 1
      push(<hr key={id} />, opened)
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
      push(
        <blockquote key={id}>
          {scanBlocks(body, id, { query, filter: false }).map(
            (block) => block.node
          )}
        </blockquote>,
        opened
      )
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

      push(
        <ResponseTable key={id}>
          <table>
            <thead>
              <tr>
                {head.map((cell, column) => (
                  <th key={column}>
                    {renderInline(cell, `${id}-h${column}`, options)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, column) => (
                    <td key={column}>
                      {renderInline(cell, `${id}-${index}-${column}`, options)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ResponseTable>,
        opened
      )
      continue
    }

    const opener = ORDERED.exec(trimmed)
    const bullet = opener ? null : BULLET.exec(trimmed)
    if (opener || bullet) {
      const marker = opener ? ORDERED : BULLET
      /* A lettered run and a numbered one are different lists even at the same
         column, so a sub-list cannot absorb the steps that follow it. */
      const lettered = opener ? /^[a-z]$/.test(opener[1]) : false
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
          const found = marker.exec(text)
          if (!found) break
          if (opener && /^[a-z]$/.test(found[1]) !== lettered) break

          const content = found[2]
          const task = TASK.exec(content)
          if (task) tasks = true
          items.push({
            lines: [task ? task[2] : content],
            indent: column + (text.length - content.length),
            value: opener
              ? lettered
                ? found[1].charCodeAt(0) - 96
                : Number(found[1])
              : undefined,
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

      /* A search narrows a list to the items that answer it. `TODO.md` is one
         list of thirty-four things, and showing all of them because one
         matched is the same as showing none. Each item keeps the ordinal the
         source gave it, so what is left still numbers the way the file does
         and a result can be quoted back by its number. */
      const matching = items.filter((item) =>
        contains(item.lines.join("\n"), query)
      )
      const shown = filter && matching.length > 0 ? matching : items

      const List = opener ? "ol" : "ul"
      push(
        <List
          key={id}
          type={lettered ? "a" : undefined}
          className={cn(
            /* Both marked important, and for the same reason: `Response`
               styles its lists through a descendant selector, which outranks a
               plain class on the list itself. Without it a checklist grows a
               second bullet beside the box it already draws, and a lettered
               sub-list comes back numbered — `type="a"` loses to any
               list-style declared in CSS. */
            tasks && "list-none! ps-0",
            lettered && "list-[lower-alpha]!"
          )}
        >
          {shown.map((item, index) => {
            const body = scanBlocks(item.lines, `${id}-${index}`, {
              query,
              filter: false,
            }).map((block) => block.node)

            /* `Response` spaces its own children and stops there, so an item
               holding more than a sentence has to space its blocks itself. */
            if (item.done === undefined) {
              return (
                <li key={index} value={item.value} className="[&>*+*]:mt-3">
                  {body}
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
                <div className="min-w-0 [&>*+*]:mt-3">{body}</div>
              </li>
            )
          })}
        </List>,
        opened
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
        text.startsWith("<!--") ||
        text.startsWith("|")
      ) {
        break
      }
      body.push(text)
      i += 1
    }
    push(<p key={id}>{renderInline(body.join(" "), id, options)}</p>, opened)
  }

  return blocks
}

/**
 * The blocks a search leaves standing.
 *
 * Two rules, and both exist so a result is never a fragment with nothing
 * saying where it came from: a heading that matches carries its whole section,
 * and a block that matches carries the headings standing over it. What comes
 * back is a shortened document rather than a list of hits, which is the only
 * form in which a rule can be read against the rules around it.
 */
function keepMatches(blocks: Block[], query: string): Block[] {
  if (query === "") return blocks

  const hit = blocks.map((block) => contains(block.source, query))
  const kept = new Array<boolean>(blocks.length).fill(false)

  blocks.forEach((block, n) => {
    if (!hit[n]) return
    kept[n] = true

    if (block.level > 0) {
      for (let m = n + 1; m < blocks.length; m += 1) {
        const next = blocks[m]
        if (next.level > 0 && next.level <= block.level) break
        kept[m] = true
      }
      return
    }

    let rank = 7
    for (let m = n - 1; m >= 0 && rank > 1; m -= 1) {
      const above = blocks[m]
      if (above.level > 0 && above.level < rank) {
        kept[m] = true
        rank = above.level
      }
    }
  })

  return blocks.filter((_, n) => kept[n])
}

/**
 * How many times the query appears in a document, for the count beside a tab.
 * Counted over the source rather than the rendering, so a match inside a code
 * block — where the tokenizer owns the spans and a mark cannot be threaded
 * through — is still reported to whoever is looking for it.
 */
function countMatches(source: string, query: string) {
  const needle = query.trim().toLowerCase()
  if (needle === "") return 0

  const haystack = source.toLowerCase()
  let found = 0
  for (
    let at = haystack.indexOf(needle);
    at !== -1;
    at = haystack.indexOf(needle, at + needle.length)
  ) {
    found += 1
  }
  return found
}

/**
 * A markdown document as `Response` prose, narrowed to `query` when there is
 * one. The parse is memoised because a keystroke in the search field re-renders
 * the panel, and re-scanning forty kilobytes for a document nobody is looking
 * at is work for nothing.
 */
function Markdown({
  source,
  query = "",
  ...props
}: Omit<React.ComponentProps<typeof Response>, "children"> & {
  source: string
  query?: string
}) {
  const content = React.useMemo(() => {
    const needle = query.trim().toLowerCase()
    const blocks = scanBlocks(source.split("\n"), "md", {
      query: needle,
      filter: true,
    })
    return keepMatches(blocks, needle).map((block) => block.node)
  }, [source, query])

  return (
    <Response data-slot="markdown" {...props}>
      {content}
    </Response>
  )
}

export { Markdown, countMatches }
