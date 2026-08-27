import type { Registry } from "shadcn/schema";

/**
 * Registry item definitions for lib utilities, used to build registry.json
 * (https://ui.shadcn.com/docs/registry/getting-started).
 */
export const lib: Registry["items"] = [
  {
    name: "utils",
    type: "registry:lib",
    title: "Utils",
    description:
      "Utility functions for the elements.",
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
        target: "lib/utils.ts",
      },
    ],
  },
  {
    name: "highlight",
    type: "registry:lib",
    title: "Highlight",
    description:
      "The scanner and palette every code element shares: a one-pass tokenizer, the colour each token kind takes, and the badge that names a file's language.",
    files: [
      {
        path: "lib/highlight.ts",
        type: "registry:lib",
        target: "lib/highlight.ts",
      },
    ],
  },
];
