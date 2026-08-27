"use client"

import * as React from "react"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockBody,
  CodeBlockCopy,
  CodeBlockDownload,
  CodeBlockHeader,
} from "@/components/aiellie-ui/code/code-block"
import {
  CodeTabs,
  CodeTabsList,
  CodeTabsPanel,
  CodeTabsTab,
} from "@/components/aiellie-ui/code/code-tabs"

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
 * The value is held here rather than inside the tabs, because the copy action
 * in the same header has to be handed the file that is actually showing —
 * picking a file and changing what copy copies are one event.
 */
function useFile() {
  const [name, setName] = React.useState(FILES[0].name)
  const file = FILES.find((entry) => entry.name === name) ?? FILES[0]

  return { name, setName, file }
}

export function CodeTabsDemo() {
  const [open, setOpen] = React.useState(FILES.map((file) => file.name))
  const [name, setName] = React.useState(FILES[0].name)

  const shown = FILES.filter((file) => open.includes(file.name))
  const file = shown.find((entry) => entry.name === name) ?? shown[0]

  const close = (closing: string) => {
    const left = open.filter((entry) => entry !== closing)
    setOpen(left)
    /* Closing the file that was showing has to hand the selection somewhere,
       or the strip is left pointing at a panel that is no longer mounted. */
    if (closing === name && left.length) setName(left[0])
  }

  if (!file) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(FILES.map((entry) => entry.name))
          setName(FILES[0].name)
        }}
        className="rounded-full border border-dashed border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors duration-150 hover:text-foreground motion-reduce:transition-none"
      >
        All closed — reopen
      </button>
    )
  }

  return (
    <CodeTabs
      value={file.name}
      onValueChange={(value) => setName(value as string)}
    >
      <CodeBlock>
        <CodeBlockHeader className="py-1.5">
          <CodeTabsList>
            {shown.map((entry) => (
              <CodeTabsTab
                key={entry.name}
                value={entry.name}
                onClose={() => close(entry.name)}
              >
                {entry.name}
              </CodeTabsTab>
            ))}
          </CodeTabsList>
          <CodeBlockActions>
            <CodeBlockCopy code={file.code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        {shown.map((entry) => (
          <CodeTabsPanel key={entry.name} value={entry.name}>
            <CodeBlockBody code={entry.code} />
          </CodeTabsPanel>
        ))}
      </CodeBlock>
    </CodeTabs>
  )
}

/**
 * The strip with nothing on it but names. `icon={null}` is the escape for a
 * card where every file is the same language and the badges would say the
 * same thing five times.
 */
export function CodeTabsBareDemo() {
  const { name, setName, file } = useFile()

  return (
    <CodeTabs value={name} onValueChange={(value) => setName(value as string)}>
      <CodeBlock>
        <CodeBlockHeader className="py-1.5">
          <CodeTabsList>
            {FILES.map((entry) => (
              <CodeTabsTab key={entry.name} value={entry.name} icon={null}>
                {entry.name}
              </CodeTabsTab>
            ))}
          </CodeTabsList>
          <CodeBlockActions>
            <CodeBlockCopy code={file.code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        {FILES.map((entry) => (
          <CodeTabsPanel key={entry.name} value={entry.name}>
            <CodeBlockBody code={entry.code} />
          </CodeTabsPanel>
        ))}
      </CodeBlock>
    </CodeTabs>
  )
}

/**
 * The interface set instead of the brand one, for a header that would rather
 * its badges went quiet with the rest of the text than announce a language.
 */
export function CodeTabsMonoDemo() {
  const { name, setName, file } = useFile()
  const shown = FILES.slice(0, 2)

  return (
    <CodeTabs value={name} onValueChange={(value) => setName(value as string)}>
      <CodeBlock>
        <CodeBlockHeader className="py-1.5">
          <CodeTabsList>
            {shown.map((entry) => (
              <CodeTabsTab key={entry.name} value={entry.name} icon="mono">
                {entry.name}
              </CodeTabsTab>
            ))}
          </CodeTabsList>
          <CodeBlockActions>
            <CodeBlockCopy code={file.code} />
            <CodeBlockDownload code={file.code} filename={file.name} />
          </CodeBlockActions>
        </CodeBlockHeader>
        {shown.map((entry) => (
          <CodeTabsPanel key={entry.name} value={entry.name}>
            <CodeBlockBody code={entry.code} lineNumbers />
          </CodeTabsPanel>
        ))}
      </CodeBlock>
    </CodeTabs>
  )
}
