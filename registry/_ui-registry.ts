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
]
