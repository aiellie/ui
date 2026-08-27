import type { Registry } from "shadcn/schema";

/**
 * Registry item definitions for hooks, used to build registry.json
 * (https://ui.shadcn.com/docs/registry/getting-started).
 */
export const hooks: Registry["items"] = [
  {
    name: "use-copy-to-clipboard",
    type: "registry:hook",
    title: "useCopyToClipboard",
    description:
      "Writes text to the clipboard and reports it for a moment after, so a button can swap to a tick without keeping a timer of its own.",
    files: [
      {
        path: "hooks/use-copy-to-clipboard.ts",
        type: "registry:hook",
        target: "hooks/use-copy-to-clipboard.ts",
      },
    ],
  },
];
