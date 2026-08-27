import type { Registry } from "shadcn/schema"

/**
 * Registry item definitions for the primitives under `components/ui`, used to
 * build registry.json (https://ui.shadcn.com/docs/registry/getting-started).
 *
 * These are the pieces the elements are assembled from rather than elements in
 * their own right — thin wrappers over Base UI, or a single styled span.
 */
export const ui: Registry["items"] = [
  {
    name: "kbd",
    type: "registry:ui",
    title: "Kbd",
    description:
      "A key as it is printed on a keyboard, sized to sit inline in a sentence without pushing the line height around.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/ui/kbd.tsx",
        type: "registry:ui",
        target: "components/ui/kbd.tsx",
      },
    ],
  },
  {
    name: "tooltip",
    type: "registry:ui",
    title: "Tooltip",
    description:
      "Base UI's tooltip with the elements' surface on it: a provider, a trigger, and a panel that keeps to the side it was given.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/ui/tooltip.tsx",
        type: "registry:ui",
        target: "components/ui/tooltip.tsx",
      },
    ],
  },
  {
    name: "bubble",
    type: "registry:ui",
    title: "Bubble",
    description: "A bubble is a container for a message.",
    registryDependencies: ["utils"],
    dependencies: ["@base-ui/react", "class-variance-authority"],
    files: [
      {
        path: "components/ui/bubble.tsx",
        type: "registry:ui",
        target: "components/ui/bubble.tsx",
      },
    ],
  },
  {
    name: "button",
    type: "registry:ui",
    title: "Button",
    description:
      "Base UI's button in the elements' sizes and emphases, including the square icon sizes the toolbars and the scroller sit on.",
    registryDependencies: ["utils"],
    dependencies: ["@base-ui/react", "class-variance-authority"],
    files: [
      {
        path: "components/ui/button.tsx",
        type: "registry:ui",
        target: "components/ui/button.tsx",
      },
    ],
  },
  {
    name: "message",
    type: "registry:ui",
    title: "Message",
    description:
      "The frame a message sits in — avatar, header, body and footer — laid out from either side, with the avatar lifting itself to stay level with the bubble when a footer is present.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/ui/message.tsx",
        type: "registry:ui",
        target: "components/ui/message.tsx",
      },
    ],
  },
  {
    name: "message-scroller",
    type: "registry:ui",
    title: "Message Scroller",
    description:
      "A conversation viewport that stays pinned to the newest message while you are at the bottom and lets go the moment you scroll up, with a button that carries you back down.",
    registryDependencies: ["utils", "button"],
    dependencies: [
      "@shadcn/react",
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
    ],
    files: [
      {
        path: "components/ui/message-scroller.tsx",
        type: "registry:ui",
        target: "components/ui/message-scroller.tsx",
      },
    ],
  },
]
