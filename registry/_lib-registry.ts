import type { Registry } from "shadcn/schema"

/**
 * Registry item definitions for lib utilities, used to build registry.json
 * (https://ui.shadcn.com/docs/registry/getting-started).
 */
export const lib: Registry["items"] = [
  {
    name: "utils",
    type: "registry:lib",
    title: "Utils",
    description: "Utility functions for the elements.",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },
  {
    name: "code-icons",
    type: "registry:lib",
    title: "Code Icons",
    description:
      "The badge a file or a language wears, in two sets — the interface one drawn in currentColor from Hugeicons, and the brand one in each language's own colours — behind one lookup keyed by extension and by language name alike.",
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "lib/code-icons.tsx",
        type: "registry:lib",
        target: "lib/code-icons.tsx",
      },
    ],
  },
  {
    name: "highlight",
    type: "registry:lib",
    title: "Highlight",
    description:
      "The scanner and palette every code element shares: a one-pass tokenizer and the colour each token kind takes, with no dependency of its own — the language badge is `code-icons`.",
    files: [
      {
        path: "lib/highlight.ts",
        type: "registry:lib",
        target: "lib/highlight.ts",
      },
    ],
  },
  {
    name: "colors",
    type: "registry:lib",
    title: "Colors",
    description:
      "Every colour token the elements draw from, grouped the way they are meant to be read, each one carrying the CSS variable behind it and the class that paints with it.",
    files: [
      {
        path: "lib/colors.ts",
        type: "registry:lib",
        target: "lib/colors.ts",
      },
    ],
  },
  {
    name: "fonts",
    type: "registry:lib",
    title: "Fonts",
    description:
      "The two families the elements are set in, loaded and bound to their CSS variables, alongside the weights and the type scale they are used at.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "lib/fonts.ts",
        type: "registry:lib",
        target: "lib/fonts.ts",
      },
    ],
  },
]
