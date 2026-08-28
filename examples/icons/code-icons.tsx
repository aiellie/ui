"use client"

import { CodeIcon, type CodeIconSet } from "@/components/icons/code-icons"

/**
 * The same names down both tabs, because the difference between the sets is
 * the point: `mono` takes the ink around it, `brand` arrives in each
 * language's own colours. The last two rows land on languages the brand set
 * does not carry, to show the fall-through rather than describe it.
 */
const files = [
  "main.ts",
  "app.tsx",
  "index.js",
  "scan.py",
  "server.go",
  "lib.rs",
  "deploy.sh",
  "globals.css",
  "package.json",
  "README.md",
  ".gitignore",
  ".env",
  "query.sql",
  "Main.java",
]

function IconGrid({ set }: { set: CodeIconSet }) {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-2 self-start">
      {files.map((name) => (
        <div
          key={name}
          className="flex min-w-0 items-center gap-2.5 rounded-lg border px-3 py-2"
        >
          <CodeIcon name={name} set={set} className="size-4 text-foreground" />
          <span className="truncate font-mono text-xs text-muted-foreground">
            {name}
          </span>
        </div>
      ))}
    </div>
  )
}

export function CodeIconsDemo() {
  return <IconGrid set="mono" />
}

export function CodeIconsBrandDemo() {
  return <IconGrid set="brand" />
}
