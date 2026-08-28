import { readFileSync } from "node:fs"
import { join } from "node:path"

import type { RuleDoc } from "./rules"

/**
 * The documents the rules panel shows, read from the repository root.
 *
 * Server-only, and deliberately not memoised at module scope: in development
 * that would pin the first read for the life of the process, so editing
 * `CLAUDE.md` would leave the panel showing yesterday's rules until the server
 * restarted. In a production build the pages under this layout are prerendered,
 * so the read happens once at build time regardless and the text is baked into
 * the output — nothing reaches the file system at request time.
 */
const documents = [
  { name: "claude", file: "CLAUDE.md" },
  { name: "design", file: "DESIGN.md" },
]

/**
 * Drop the document's own `# title` line. The panel names each document on its
 * tab, and a heading repeating that name immediately under it reads as a
 * mistake rather than as a title.
 */
function withoutTitle(source: string) {
  return source.replace(/^#\s+.*\n+/, "")
}

function getRuleDocs(): RuleDoc[] {
  return documents.map(({ name, file }) => ({
    name,
    // The file's own name, because that is what a reader would go looking for
    // on disk once they have found the rule they came for.
    title: file,
    source: withoutTitle(
      readFileSync(
        // The tracer cannot see through `process.cwd()` and answers by tracing
        // the entire project into the bundle, which is a great deal of the
        // repository to carry for two files. `outputFileTracingIncludes` in
        // `next.config.ts` names them instead, so the trace stays exact.
        join(/* turbopackIgnore: true */ process.cwd(), file),
        "utf8"
      )
    ).trimEnd(),
  }))
}

export { getRuleDocs }
