import type { Registry } from "shadcn/schema"

/**
 * Registry item definitions for the elements, used to build registry.json
 * (https://ui.shadcn.com/docs/registry/getting-started).
 *
 * Local item names in registryDependencies ("actions", "highlight") resolve
 * against this registry once it is published; the build step maps them to
 * `<homepage>/r/<name>.json` URLs.
 */
export const aiellieui: Registry["items"] = [
  {
    name: "code-snippet",
    type: "registry:ui",
    title: "Code Snippet",
    description:
      "The line that installs a thing, under tabs for the package manager running it — npx, pnpm dlx, bunx, or yarn dlx — or under tabs of your own, or under none at all, coloured like code on request, with a copy action handed exactly the line on screen.",
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    registryDependencies: ["actions", "highlight", "utils"],
    files: [
      {
        path: "components/aiellie-ui/code/code-snippet.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/code/code-snippet.tsx",
      },
    ],
  },
  {
    name: "suggestions",
    type: "registry:ui",
    title: "Suggestions",
    description:
      "A row of prompts the reader can act on rather than read: each one a bubble drawn as a dashed outline while it is still an offer, tinted once it is picked, with the row holding the selection for one or for several.",
    registryDependencies: ["bubble", "utils"],
    files: [
      {
        path: "components/aiellie-ui/suggestions.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/suggestions.tsx",
      },
    ],
  },
]
