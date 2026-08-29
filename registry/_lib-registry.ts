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
    description:
      "The cn helper every element classes itself with — clsx merged through tailwind-merge, so a caller's className wins the argument.",
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
    name: "avatars",
    type: "registry:lib",
    title: "Avatars",
    description:
      "The portrait service, in one place: a deterministic marbled image for any name — every persona gets a face nobody had to draw — plus the sample-image form the generator demos paint with when there is no key.",
    files: [
      {
        path: "lib/avatars.ts",
        type: "registry:lib",
        target: "lib/avatars.ts",
      },
    ],
  },
  {
    name: "generation",
    type: "registry:lib",
    title: "Generation",
    description:
      "Image and video generation from the browser on the reader's own key — Gemini for pictures, Veo started and then polled for footage — every call abortable, because a stop button that stops nothing is a decoration.",
    dependencies: ["ai", "@ai-sdk/google"],
    files: [
      {
        path: "lib/generation.ts",
        type: "registry:lib",
        target: "lib/generation.ts",
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
    name: "providers",
    type: "registry:lib",
    title: "Providers",
    description:
      "The houses a model can come from — the major labs from models.dev alongside the platforms that serve other people's models — as plain data, with the mark each one wears kept in `model-icons`.",
    files: [
      {
        path: "lib/providers.ts",
        type: "registry:lib",
        target: "lib/providers.ts",
      },
    ],
  },
  {
    name: "models",
    type: "registry:lib",
    title: "Models",
    description:
      "The catalogue a model picker reads — every model on offer with the house it comes from, what it is for, what it can do and how much it holds, alongside the tier order that decides what a plan reaches.",
    registryDependencies: ["providers"],
    files: [
      {
        path: "lib/models.ts",
        type: "registry:lib",
        target: "lib/models.ts",
      },
    ],
  },
  {
    name: "tools",
    type: "registry:lib",
    title: "Tools",
    description:
      "The tools an agent can be handed — a shell, the filesystem, the two ways of finding a file and the two of reaching the web — each with the name it is called by, a line on what a call does, and the glyph it wears.",
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "lib/tools.ts",
        type: "registry:lib",
        target: "lib/tools.ts",
      },
    ],
  },
  {
    name: "instructions",
    type: "registry:lib",
    title: "Instructions",
    description:
      "The prompts an agent can be stood under — each one a name, the line a menu shows on how it changes the answer, and the words themselves that are handed to the model — kept as plain data so setting a prompt is an entry here and not an interface change.",
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "lib/instructions.ts",
        type: "registry:lib",
        target: "lib/instructions.ts",
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
