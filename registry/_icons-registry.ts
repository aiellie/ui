import type { Registry } from "shadcn/schema"

/**
 * Registry item definitions for the icon lookups — the file, language and
 * model marks — used to build registry.json
 * (https://ui.shadcn.com/docs/registry/getting-started).
 */
export const icons: Registry["items"] = [
  {
    name: "code-icons",
    type: "registry:component",
    title: "Code Icons",
    description:
      "The badge a file or a language wears, in two sets — the interface one drawn in currentColor from Hugeicons, and the brand one in each language's own colours — behind one lookup keyed by extension and by language name alike.",
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/icons/code-icons.tsx",
        type: "registry:component",
        target: "components/icons/code-icons.tsx",
      },
    ],
  },
  {
    name: "model-icons",
    type: "registry:component",
    title: "Model Icons",
    description:
      "The mark a provider, a model or a capability wears — Hugeicons' brand set behind one lookup keyed by provider id and by model family, so a name like `claude-opus-5` finds Claude's mark and an unknown one still finds a glyph.",
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    registryDependencies: ["models", "utils"],
    files: [
      {
        path: "components/icons/model-icons.tsx",
        type: "registry:component",
        target: "components/icons/model-icons.tsx",
      },
    ],
  },
]
