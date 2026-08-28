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
 *
 * The build warns that it cannot follow a `process.cwd()` join and so traces
 * the whole repository into its file list. The two ways out are both worse
 * than the warning: `new URL(…, import.meta.url)` is read as an asset
 * reference and would publish these files at a public path, and the scoped
 * form the warning asks for wants them under a subfolder they do not live in.
 * `outputFileTracingIncludes` in `next.config.ts` names them explicitly, and
 * since every route here is prerendered there is no function for the wider
 * trace to weigh down.
 */
const documents = [
  { name: "claude", file: "CLAUDE.md" },
  { name: "design", file: "DESIGN.md" },
  { name: "todo", file: "TODO.md" },
]

/**
 * An HTML comment is a note to whoever edits the file, not to whoever reads
 * it — `TODO.md` opens with a marker of exactly that kind. Taken out here
 * rather than in the renderer so the search counts and the rendering agree:
 * a hit in a comment would otherwise be reported on a tab that then had
 * nothing to show for it.
 */
function withoutComments(source: string) {
  return source.replace(/<!--[\s\S]*?-->\n?/g, "")
}

/**
 * Drop the document's own title, but only when the title is the document —
 * `# CLAUDE.md` under a tab reading CLAUDE.md is a mistake, while `TODO.md`
 * opens on a heading that is a warning and has to stay. Matching the heading
 * against the file name is what tells the two apart.
 */
function withoutTitle(source: string, file: string) {
  return source.replace(/^#\s+(.*)\n+/, (whole, title: string) =>
    title.trim().toLowerCase() === file.toLowerCase() ? "" : whole
  )
}

function getRuleDocs(): RuleDoc[] {
  return documents.map(({ name, file }) => ({
    name,
    // The file's own name, because that is what a reader would go looking for
    // on disk once they have found the rule they came for.
    title: file,
    source: withoutTitle(
      withoutComments(readFileSync(join(process.cwd(), file), "utf8")),
      file
    ).trimEnd(),
  }))
}

export { getRuleDocs }
