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
    name: "colors-demo",
    type: "registry:example",
    title: "Colors",
    description:
      "Semantic tokens from globals.css. Every swatch follows the active theme.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "examples/tokens/colors-demos.tsx",
        type: "registry:example",
        target: "examples/tokens/colors-demos.tsx",
      },
      {
        path: "lib/colors.ts",
        type: "registry:lib",
        target: "lib/colors.ts",
      },
    ],
    categories: ["tokens"],
    meta: {
      // No `variants`: the tabs follow `colorGroups`, so there are no export
      // names to list — `_demos.ts` hands over the generated list instead.
      wide: false,
    },
  },
  {
    name: "fonts-demo",
    type: "registry:example",
    title: "Fonts",
    description:
      "Geist for the interface, JetBrains Mono for code. Sizes and weights follow the Tailwind scale.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "examples/tokens/fonts-demos.tsx",
        type: "registry:example",
        target: "examples/tokens/fonts-demos.tsx",
      },
      {
        path: "lib/fonts.ts",
        type: "registry:lib",
        target: "lib/fonts.ts",
      },
    ],
    categories: ["tokens"],
    meta: {
      variants: [
        { name: "Families", demo: "FamiliesDemo" },
        { name: "Scale", demo: "ScaleDemo" },
        { name: "Weights", demo: "WeightsDemo" },
      ],
      wide: false,
    },
  },
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
