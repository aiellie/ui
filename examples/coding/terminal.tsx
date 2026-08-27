"use client"

import * as React from "react"

import {
  CodeBlockActions,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/aiellie-ui/code/code-block"
import {
  Terminal,
  TerminalBody,
  TerminalCommand,
  TerminalOutput,
  TerminalStatus,
} from "@/components/aiellie-ui/code/terminal"

const BUILD = "pnpm registry:build"

export function TerminalDemo() {
  return (
    <Terminal>
      <CodeBlockHeader>
        <CodeBlockTitle>zsh</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy code={BUILD} tooltip="Copy command" />
        </CodeBlockActions>
      </CodeBlockHeader>
      <TerminalBody>
        <TerminalCommand>{BUILD}</TerminalCommand>
        <TerminalOutput tone="muted">- Building code-block…</TerminalOutput>
        <TerminalOutput tone="muted">- Building code-diff…</TerminalOutput>
        <TerminalOutput tone="muted">- Building terminal…</TerminalOutput>
        <TerminalOutput tone="success">✔ Building registry.</TerminalOutput>
        <TerminalStatus code={0} />
      </TerminalBody>
    </Terminal>
  )
}

/** The case the reader has to do something about, which is why it has a tone. */
export function TerminalFailedDemo() {
  return (
    <Terminal>
      <CodeBlockHeader>
        <CodeBlockTitle>zsh</CodeBlockTitle>
      </CodeBlockHeader>
      <TerminalBody>
        <TerminalCommand>pnpm typecheck</TerminalCommand>
        <TerminalOutput tone="error">
          components/ui/bubble.tsx:42:7 - error TS2322: Type &apos;string&apos;
          is not assignable to type &apos;Variant&apos;.
        </TerminalOutput>
        <TerminalOutput tone="muted">
          Found 1 error in components/ui/bubble.tsx
        </TerminalOutput>
        <TerminalStatus code={2} />
      </TerminalBody>
    </Terminal>
  )
}

const LINES: { text: string; tone?: "muted" | "success" }[] = [
  { text: "· Compiled successfully", tone: "muted" },
  { text: "· Collecting page data", tone: "muted" },
  { text: "· Generating static pages (18/18)", tone: "muted" },
  { text: "✔ Done in 4.2s", tone: "success" },
]

/**
 * A run still going: the caret holds the end of the command while its output
 * arrives a line at a time, and the status only appears once there is one.
 */
export function TerminalRunningDemo() {
  const [shown, setShown] = React.useState(0)
  const done = shown >= LINES.length

  React.useEffect(() => {
    if (done) return
    const id = setTimeout(() => setShown((value) => value + 1), 700)
    return () => clearTimeout(id)
  }, [done, shown])

  return (
    <Terminal>
      <CodeBlockHeader>
        <CodeBlockTitle>zsh</CodeBlockTitle>
      </CodeBlockHeader>
      {/* The finished run's height is reserved from the first frame, so lines
          landing do not push the block out under a card that centres it. */}
      <TerminalBody className="min-h-[132px]">
        <TerminalCommand running={!done}>pnpm build</TerminalCommand>
        {LINES.slice(0, shown).map((line) => (
          <TerminalOutput
            key={line.text}
            tone={line.tone}
            className="animate-in duration-300 fill-mode-both fade-in motion-reduce:animate-none"
          >
            {line.text}
          </TerminalOutput>
        ))}
        {done && <TerminalStatus code={0} />}
      </TerminalBody>
    </Terminal>
  )
}
