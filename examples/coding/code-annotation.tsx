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
import { CodeAnnotation } from "@/components/aiellie-ui/code/code-annotation"

const CODE = `export function useTick(interval = 1000) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    setNow(Date.now())
  }, [interval])

  return now
}`

/**
 * Closed, which is how a note arrives: the marker in the gutter says a line has
 * something to say about it, and the reader decides whether to hear it.
 */
export function CodeAnnotationDemo() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>use-tick.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy code={CODE} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockBody
        code={CODE}
        lineNumbers
        highlightLines={[5]}
        annotations={{
          5: (
            <CodeAnnotation tone="warning">
              A <code>setState</code> in an effect is a second render pass you
              did not need. Read the clock in a store instead.
            </CodeAnnotation>
          ),
        }}
      />
    </CodeBlock>
  )
}

/**
 * Both open from the start, since the point of this one is to compare the
 * tones — a card the reader has to click twice before it shows what it is for
 * is a card that shows nothing.
 */
export function CodeAnnotationTonesDemo() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>use-tick.ts</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockBody
        code={CODE}
        lineNumbers
        highlightLines={[2, 5]}
        defaultOpenAnnotations={[2, 5]}
        annotations={{
          2: (
            <CodeAnnotation>
              <code>Date.now()</code> in render is a render that cannot be
              repeated.
            </CodeAnnotation>
          ),
          5: (
            <CodeAnnotation tone="error">
              This never ticks: the effect runs once and nothing schedules the
              next one.
            </CodeAnnotation>
          ),
        }}
      />
    </CodeBlock>
  )
}

/**
 * A note the reader can be done with. Held here rather than inside the note,
 * since what a dismissal means — gone for this session, gone for good, filed
 * somewhere — is the caller's to decide.
 */
export function CodeAnnotationDismissDemo() {
  const [shown, setShown] = React.useState(true)

  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>use-tick.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy code={CODE} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockBody
        code={CODE}
        lineNumbers
        highlightLines={shown ? [5] : undefined}
        defaultOpenAnnotations={[5]}
        annotations={
          shown
            ? {
                5: (
                  <CodeAnnotation onDismiss={() => setShown(false)}>
                    Reading the clock through <code>useSyncExternalStore</code>{" "}
                    keeps every stamp on screen agreeing about now.
                  </CodeAnnotation>
                ),
              }
            : undefined
        }
      />
    </CodeBlock>
  )
}
