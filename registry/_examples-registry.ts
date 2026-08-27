import type { Registry } from "shadcn/schema"

/**
 * Registry item definitions for the elements, used to build registry.json
 * (https://ui.shadcn.com/docs/registry/getting-started).
 *
 * Local item names in registryDependencies ("surface-tokens", "range") resolve
 * against this registry once it is published; the build step maps them to
 * `<homepage>/r/<name>.json` URLs.
 *
 * This list is also the elements grid, in this order. `meta.variants` names the
 * demo exports behind each tab; `registry/_demos.ts` holds the components
 * themselves, since a function can't be serialized into registry.json.
 */
export const examples: Registry["items"] = [
  {
    name: "code-snippet-demo",
    type: "registry:example",
    title: "Code Snippet",
    description:
      "A code snippet with tabs for the package manager running it — npx, pnpm dlx, bunx, or yarn dlx — or under tabs of your own, or under none at all, coloured like code on request, with a copy action handed exactly the line on screen.",
    registryDependencies: ["code-snippet"],
    files: [
      {
        path: "examples/code/code-snippet.tsx",
        type: "registry:example",
        target: "examples/code/code-snippet.tsx",
      },
    ],
    categories: ["coding"],
    meta: {
      variants: [
        { name: "Command", demo: "CodeSnippetDemo" },
        { name: "Several", demo: "InstallCommandSeveralDemo" },
        { name: "No tabs", demo: "InstallCommandBareDemo" },
        { name: "Custom tabs", demo: "InstallCommandTabsDemo" },
        { name: "Highlighted", demo: "InstallCommandHighlightedDemo" },
      ],
      wide: false,
    },
  },
]
