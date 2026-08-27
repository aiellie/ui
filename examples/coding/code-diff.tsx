"use client"

import * as React from "react"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/aiellie-ui/code/code-block"
import {
  CodeDiffBody,
  CodeDiffStat,
  diffStat,
  parseDiff,
} from "@/components/aiellie-ui/code/code-diff"

/** As `git diff` writes it, headers and all, since that is what arrives. */
const DIFF = `diff --git a/lib/tick.ts b/lib/tick.ts
index 3f1c0a2..9b2e441 100644
--- a/lib/tick.ts
+++ b/lib/tick.ts
@@ -4,7 +4,8 @@ const listeners = new Set<() => void>()
 export function subscribe(notify: () => void) {
   listeners.add(notify)
-  return () => listeners.delete(notify)
+  start()
+  return () => stop(notify)
 }`

/** A rename and a widening, which is what split view is worth the room for. */
const RENAME = `@@ -1,6 +1,6 @@
-export function fmt(at: number, tz: string) {
-  return new Intl.DateTimeFormat("en-GB", {
-    timeZone: tz,
+export function formatStamp(at: number, zone: string) {
+  return new Intl.DateTimeFormat(locale, {
+    timeZone: zone,
     timeStyle: "short",
   }).format(at)
 }`

export function CodeDiffDemo() {
  const stat = React.useMemo(() => diffStat(parseDiff(DIFF)), [])

  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>lib/tick.ts</CodeBlockTitle>
        <CodeDiffStat {...stat} />
        <CodeBlockActions>
          <CodeBlockCopy code={DIFF} tooltip="Copy diff" />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeDiffBody diff={DIFF} />
    </CodeBlock>
  )
}

/** Without the numbers, for a diff quoted in a sentence rather than reviewed. */
export function CodeDiffBareDemo() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>lib/tick.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy code={DIFF} tooltip="Copy diff" />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeDiffBody diff={DIFF} lineNumbers={false} />
    </CodeBlock>
  )
}

/**
 * Before and after side by side, which answers "what did this used to say"
 * without counting rows — and needs the width, which is why the card is wide.
 */
export function CodeDiffSplitDemo() {
  const stat = React.useMemo(() => diffStat(parseDiff(RENAME)), [])

  return (
    <CodeBlock className="max-w-3xl">
      <CodeBlockHeader>
        <CodeBlockTitle>lib/stamp.ts</CodeBlockTitle>
        <CodeDiffStat {...stat} />
        <CodeBlockActions>
          <CodeBlockCopy code={RENAME} tooltip="Copy diff" />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeDiffBody diff={RENAME} view="split" />
    </CodeBlock>
  )
}

/** The palette for a diff set among prose the three hues would speak over. */
export function CodeDiffMonoDemo() {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>lib/tick.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy code={DIFF} tooltip="Copy diff" />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeDiffBody diff={DIFF} palette="mono" />
    </CodeBlock>
  )
}
