import type { Registry } from "shadcn/schema"

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
  {
    name: "use-audio-level",
    type: "registry:hook",
    title: "Use Audio Level",
    description:
      "The microphone as one number: how loud the room is right now, 0 to 1, smoothed to move like motion — with a start that can name a device and a stop that genuinely lets the microphone go.",
    files: [
      {
        path: "hooks/use-audio-level.ts",
        type: "registry:hook",
        target: "hooks/use-audio-level.ts",
      },
    ],
  },
]
