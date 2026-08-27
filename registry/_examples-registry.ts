import type { Registry } from "shadcn/schema"

/**
 * Registry item definitions for the elements, used to build registry.json
 * (https://ui.shadcn.com/docs/registry/getting-started).
 *
 * Local item names in registryDependencies ("colors", "code-snippet") resolve
 * against this registry once it is published; the build step maps them to
 * `<homepage>/r/<name>.json` URLs.
 *
 * This list is also the grids, in this order, with `categories` deciding which
 * page each item lands on: "tokens" puts it on `/tokens`, anything else — or
 * nothing at all — leaves it on `/elements`. `meta.variants` names the
 * demo exports behind each tab; `registry/_demos.ts` holds the components
 * themselves, since a function can't be serialized into registry.json. A demo
 * whose tabs are generated from data has no export names to list, so it carries
 * no `meta.variants` and `_demos.ts` supplies the variants instead.
 */
export const examples: Registry["items"] = [
  {
    name: "colors-demo",
    type: "registry:example",
    title: "Colors",
    description:
      "Every colour token the elements draw from, a group at a time, each swatch over a dotted backdrop so a translucent token reads as translucent rather than as an empty box.",
    registryDependencies: ["colors", "demos-switcher", "utils"],
    files: [
      {
        path: "examples/tokens/colors-demos.tsx",
        type: "registry:example",
        target: "examples/tokens/colors-demos.tsx",
      },
    ],
    categories: ["tokens"],
    meta: {
      wide: false,
    },
  },
  {
    name: "fonts-demo",
    type: "registry:example",
    title: "Fonts",
    description:
      "The two families the elements are set in, the weights they are used at, and the type scale they step through — each shown at the size it is actually rendered.",
    registryDependencies: ["fonts", "utils"],
    files: [
      {
        path: "examples/tokens/fonts-demos.tsx",
        type: "registry:example",
        target: "examples/tokens/fonts-demos.tsx",
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
  {
    name: "bubble-demo",
    type: "registry:example",
    title: "Bubble",
    description: "A bubble is a container for a message.",
    registryDependencies: ["bubble"],
    files: [
      {
        path: "examples/messages/bubble.tsx",
        type: "registry:example",
        target: "examples/messages/bubble.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "Default", demo: "BubbleDemo" },
        { name: "Variants", demo: "BubbleVariantsDemo" },
        { name: "Reactions", demo: "BubbleReactionsDemo" },
      ],
      wide: false,
    },
  },
]
