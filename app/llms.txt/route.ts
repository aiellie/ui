import { registry } from "@/registry/_registry"

/**
 * The answer is a pure function of sources compiled into the bundle, so it is
 * rendered once at build time and served as a file. That is also why the items
 * come from the TypeScript registry rather than `registry.json` off disk: the
 * JSON is generated from these very sources, so importing them is the same
 * truth without asking the deployment to trace and ship a file the route would
 * then read at runtime.
 */
export const dynamic = "force-static"

const base = "https://ui.aiellie.dev"

/**
 * The registry, restated for a reader that will never load the pages: plain
 * markdown naming every item, what it is, and the URL the shadcn CLI installs
 * it from. An agent that has only this file can still install anything here.
 */
export function GET() {
  const lines = [
    "# aiellie ui",
    "",
    "Elements for AI chat interfaces — installable one at a time.",
    "",
    "Install any item with the shadcn CLI:",
    "",
    "    npx shadcn@latest add https://ui.aiellie.dev/r/<name>.json",
    "",
    "## Items",
    "",
    ...registry.items.map(
      (item) =>
        `- ${item.name}: ${item.description ?? item.title ?? item.name} — ${base}/r/${item.name}.json`
    ),
    "",
  ]

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
