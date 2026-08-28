"use client"

import * as React from "react"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockBody,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/aiellie-ui/code/code-block"
import {
  FileTree,
  FileTreeNodes,
  type FileNode,
} from "@/components/aiellie-ui/code/file-tree"

const TREE: FileNode[] = [
  {
    name: "components",
    defaultOpen: true,
    children: [
      {
        name: "code",
        defaultOpen: true,
        children: [
          { name: "code-block.tsx", status: "modified" },
          { name: "code-diff.tsx", status: "added" },
          { name: "code-snippet.tsx" },
        ],
      },
      { name: "ui", children: [{ name: "tooltip.tsx" }] },
    ],
  },
  { name: "lib", children: [{ name: "highlight.ts", status: "modified" }] },
  { name: "legacy.ts", status: "removed" },
]

export function FileTreeDemo() {
  return (
    <FileTree className="max-w-xs">
      <FileTreeNodes nodes={TREE} />
    </FileTree>
  )
}

const SOURCE: Record<string, string> = {
  "code-block.tsx": `export function CodeBlock(props: Props) {
  return <figure data-slot="code-block" {...props} />
}`,
  "code-diff.tsx": `export function parseDiff(diff: string) {
  const rows: DiffRow[] = []
  return rows
}`,
  "code-snippet.tsx": `export function resolveCommand(pm, command) {
  return \`\${RUNNERS[pm]} \${command}\`
}`,
  "tooltip.tsx": `function Tooltip(props: Root.Props) {
  return <Root data-slot="tooltip" {...props} />
}`,
  "highlight.ts": `export function tokenize(code: string) {
  return code.split("\\n").map(scan)
}`,
  "legacy.ts": `// Nothing imports this any more.`,
}

/**
 * The tree driving a block, which is the shape it usually turns up in. Which
 * file is chosen is held here rather than inside the tree: choosing one is the
 * same event as showing it, so a tree keeping the choice privately would only
 * hand it straight back.
 */
export function FileTreeSelectionDemo() {
  const [selected, setSelected] = React.useState("code-diff.tsx")
  const code = SOURCE[selected] ?? ""

  return (
    <div className="flex w-full max-w-2xl items-start gap-3">
      <FileTree className="w-56 shrink-0">
        <FileTreeNodes
          nodes={TREE}
          selected={selected}
          onSelect={setSelected}
        />
      </FileTree>
      <CodeBlock className="min-w-0 flex-1">
        <CodeBlockHeader>
          <CodeBlockTitle>{selected}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopy code={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        {/* Keyed by file, so a switch reads as the new code arriving rather
            than as the old code changing under the same rows. */}
        <CodeBlockBody key={selected} code={code} />
      </CodeBlock>
    </div>
  )
}

/**
 * Nothing marked, for a tree showing a project rather than a change — and the
 * brand badges, which earn their colour in a tree of mixed languages.
 */
export function FileTreePlainDemo() {
  const plain: FileNode[] = [
    {
      name: "app",
      defaultOpen: true,
      children: [
        { name: "layout.tsx" },
        { name: "page.tsx" },
        { name: "globals.css" },
      ],
    },
    { name: "registry", children: [{ name: "_demos.ts" }] },
    { name: "package.json" },
  ]

  return (
    <FileTree className="max-w-xs">
      <FileTreeNodes nodes={plain} icons="brand" />
    </FileTree>
  )
}
