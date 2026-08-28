"use client"

import * as React from "react"
import {
  ArrowRight01Icon,
  Folder01Icon,
  Folder02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { mono, paper } from "@/components/aiellie-ui/actions"
import { CodeIcon, type CodeIconSet } from "@/components/icons/code-icons"
import { cn } from "@/lib/utils"

export type FileStatus = "added" | "modified" | "removed"

export interface FileNode {
  name: string
  /** Present on a folder, absent on a file — including an empty folder. */
  children?: FileNode[]
  status?: FileStatus
  /** Folders start closed unless this says otherwise. */
  defaultOpen?: boolean
}

/**
 * The shape of a change before any of its diffs: which files a tool touched,
 * and where they sit relative to each other. A list of paths says the same
 * thing and says it worse — six paths sharing a prefix make the reader do the
 * nesting in their head.
 */
function FileTree({
  className,
  "aria-label": ariaLabel = "Files",
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-tree"
      role="tree"
      aria-label={ariaLabel}
      className={cn(
        paper,
        mono,
        "w-full max-w-lg overflow-hidden overflow-y-auto rounded-2xl py-2",
        className
      )}
      {...props}
    />
  )
}

const STATUS_MARKS: Record<FileStatus, string> = {
  added: "+",
  modified: "•",
  removed: "−",
}

/* The same emerald and red a diff is read in, so a file marked added in the
   tree and the rows added inside it agree about what green means. Modified has
   no counterpart there and takes the foreground, since "changed somehow" is
   not news of the same kind. */
const STATUS_TONES: Record<FileStatus, string> = {
  added: "text-emerald-600 dark:text-emerald-400",
  modified: "text-foreground/40",
  removed: "text-red-600 dark:text-red-400",
}

const STATUS_LABELS: Record<FileStatus, string> = {
  added: "added",
  modified: "modified",
  removed: "removed",
}

/** Turns to point at what it opens. */
function Twisty({ open }: { open: boolean }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={ArrowRight01Icon}
      strokeWidth={2}
      className={cn(
        "size-3 shrink-0 text-foreground/30 transition-transform duration-150 motion-reduce:transition-none",
        /* The only glyph here that points sideways, so it is the only one that
           has to turn round in an RTL layout — and the rotation has to come
           after the flip, or an open folder's twisty points up. */
        "rtl:-scale-x-100",
        open && "rotate-90"
      )}
    />
  )
}

function NodeGlyph({
  folder,
  open,
  name,
  icons,
}: {
  folder: boolean
  open: boolean
  name: string
  icons: CodeIconSet
}) {
  if (folder) {
    return (
      <HugeiconsIcon
        aria-hidden
        icon={open ? Folder02Icon : Folder01Icon}
        strokeWidth={1.5}
        className="size-3.5 shrink-0 text-foreground/35"
      />
    )
  }

  /* A file wears whatever its name says it is. The folder keeps the muted
     interface colour either way — a tree of coloured folders would drown the
     files it is there to show. */
  return (
    <CodeIcon
      name={name}
      set={icons}
      className={cn("size-3.5", icons === "mono" && "text-foreground/35")}
    />
  )
}

export const fileTreeRow =
  "flex w-full cursor-pointer items-center gap-1.5 py-1 pe-3 text-start outline-none transition-colors duration-150 hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.04] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-foreground/20 motion-reduce:transition-none dark:hover:bg-foreground/[0.06]"

interface Row {
  node: FileNode
  path: string
  depth: number
  folder: boolean
  open: boolean
  parent?: string
}

/**
 * The rows that are actually on screen, in the order the arrow keys walk them.
 * Flattening rather than nesting the DOM is what makes that walk one array
 * lookup instead of a tree traversal; the nesting the flattening throws away is
 * put back with `aria-level`, which is exactly what it is for.
 */
function flatten(
  nodes: readonly FileNode[],
  open: ReadonlySet<string>,
  depth = 0,
  prefix = ""
): Row[] {
  return nodes.flatMap((node) => {
    const path = prefix ? `${prefix}/${node.name}` : node.name
    const folder = node.children !== undefined
    const isOpen = folder && open.has(path)
    const row: Row = { node, path, depth, folder, open: isOpen, parent: prefix }

    return isOpen
      ? [row, ...flatten(node.children ?? [], open, depth + 1, path)]
      : [row]
  })
}

/** Which folders `defaultOpen` asks for, as paths, before anyone has clicked. */
function seedOpen(nodes: readonly FileNode[], prefix = ""): string[] {
  return nodes.flatMap((node) => {
    if (node.children === undefined) return []
    const path = prefix ? `${prefix}/${node.name}` : node.name
    return [
      ...(node.defaultOpen ? [path] : []),
      ...seedOpen(node.children, path),
    ]
  })
}

export interface FileTreeNodesProps {
  nodes: readonly FileNode[]
  /** Which file is being shown, when the tree is driving something. */
  selected?: string
  onSelect?: (name: string) => void
  /**
   * Which set the file badges come from. `brand` puts each language in its own
   * colours, which is worth it in a tree of a mixed project and noise in a
   * tree of one language.
   */
  icons?: CodeIconSet
}

/**
 * The rows, and the keyboard behaviour a `role="tree"` promises: arrows walk
 * it, right opens a folder and then steps into it, left closes one and then
 * steps out to its parent, Home and End reach the ends. Only the row that
 * would be focused is in the tab order, so a hundred files cost one tab stop
 * rather than a hundred — which is the whole reason to call this a tree rather
 * than a list of buttons.
 *
 * Whether a folder is open is held here: it is nobody else's business, and a
 * caller made to store it would only hand it straight back. Which file is
 * *chosen* is the caller's, since choosing one is usually the same event as
 * showing it.
 */
function FileTreeNodes({
  nodes,
  selected,
  onSelect,
  icons = "mono",
}: FileTreeNodesProps) {
  const [open, setOpen] = React.useState<ReadonlySet<string>>(
    () => new Set(seedOpen(nodes))
  )
  const rows = React.useMemo(() => flatten(nodes, open), [nodes, open])
  const ref = React.useRef<HTMLDivElement>(null)

  /* The roving tab stop. A path rather than an index, so opening or closing a
     folder above it does not silently move the stop to a different row. */
  const [active, setActive] = React.useState<string | undefined>()
  const current =
    active && rows.some((row) => row.path === active) ? active : rows[0]?.path

  const toggle = (path: string) =>
    setOpen((previous) => {
      const next = new Set(previous)
      if (!next.delete(path)) next.add(path)
      return next
    })

  const focusRow = (path?: string) => {
    if (!path) return
    setActive(path)
    ref.current
      ?.querySelector<HTMLElement>(`[data-path="${CSS.escape(path)}"]`)
      ?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = rows.findIndex((row) => row.path === current)
    if (index === -1) return

    const row = rows[index]
    /* Read from the element rather than from a prop: the direction is the
       document's, and an arrow key means "outwards" or "inwards" rather than
       left or right. */
    const rtl =
      ref.current != null && getComputedStyle(ref.current).direction === "rtl"
    const inwards = rtl ? "ArrowLeft" : "ArrowRight"
    const outwards = rtl ? "ArrowRight" : "ArrowLeft"

    switch (event.key) {
      case "ArrowDown":
        focusRow(rows[index + 1]?.path)
        break
      case "ArrowUp":
        focusRow(rows[index - 1]?.path)
        break
      case "Home":
        focusRow(rows[0]?.path)
        break
      case "End":
        focusRow(rows[rows.length - 1]?.path)
        break
      case inwards:
        if (row.folder && !row.open) toggle(row.path)
        else if (row.folder) focusRow(rows[index + 1]?.path)
        break
      case outwards:
        if (row.folder && row.open) toggle(row.path)
        else if (row.parent) focusRow(row.parent)
        break
      default:
        return
    }

    /* Only once a key was one of ours: an unhandled key still belongs to
       whatever is above this, and Tab most of all. */
    event.preventDefault()
  }

  /* Siblings share a parent, which is what `aria-setsize` and `aria-posinset`
     count within — the flat DOM cannot say it on its own. */
  const siblings = new Map<string, Row[]>()
  for (const row of rows) {
    const group = siblings.get(row.parent ?? "") ?? []
    group.push(row)
    siblings.set(row.parent ?? "", group)
  }

  return (
    <div ref={ref} className="contents" onKeyDown={onKeyDown}>
      {rows.map((row) => {
        const group = siblings.get(row.parent ?? "") ?? []
        const isSelected = !row.folder && selected === row.node.name

        return (
          <button
            key={row.path}
            type="button"
            role="treeitem"
            data-path={row.path}
            data-slot="file-tree-item"
            data-status={row.node.status}
            tabIndex={row.path === current ? 0 : -1}
            aria-level={row.depth + 1}
            aria-setsize={group.length}
            aria-posinset={group.indexOf(row) + 1}
            aria-expanded={row.folder ? row.open : undefined}
            aria-selected={row.folder ? undefined : isSelected}
            /* Depth as padding rather than as nested boxes with their own
               inset: a row's hover and selection then reach the full width of
               the tree, and do not step in a little further at every level. */
            style={{ paddingInlineStart: `${0.75 + row.depth * 0.875}rem` }}
            onFocus={() => setActive(row.path)}
            onClick={() =>
              row.folder ? toggle(row.path) : onSelect?.(row.node.name)
            }
            className={cn(
              fileTreeRow,
              isSelected && "bg-foreground/[0.06] dark:bg-foreground/[0.09]",
              row.node.status === "removed" &&
                "line-through decoration-foreground/25"
            )}
          >
            {row.folder ? (
              <Twisty open={row.open} />
            ) : (
              <span className="size-3 shrink-0" />
            )}
            <NodeGlyph
              folder={row.folder}
              open={row.open}
              name={row.node.name}
              icons={icons}
            />
            <span
              className={cn(
                "min-w-0 truncate",
                isSelected ? "text-foreground/90" : "text-foreground/60"
              )}
            >
              {row.node.name}
            </span>
            {row.node.status && (
              <span
                className={cn(
                  "ms-auto shrink-0 ps-2",
                  STATUS_TONES[row.node.status]
                )}
              >
                <span aria-hidden>{STATUS_MARKS[row.node.status]}</span>
                {/* A single character is not a word, and a reader who cannot
                    see its colour has only the character. */}
                <span className="sr-only">
                  {STATUS_LABELS[row.node.status]}
                </span>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export { FileTree, FileTreeNodes }
