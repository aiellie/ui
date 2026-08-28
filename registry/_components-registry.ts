import type { Registry } from "shadcn/schema"

/**
 * Registry item definitions for the elements, used to build registry.json
 * (https://ui.shadcn.com/docs/registry/getting-started).
 *
 * Local item names in registryDependencies ("utils", "tooltip") resolve
 * against this registry once it is published; the build step maps them to
 * `<homepage>/r/<name>.json` URLs.
 */
export const components: Registry["items"] = [
  {
    name: "actions",
    type: "registry:component",
    title: "Actions",
    description:
      "The class strings every element shares — surfaces, pressable buttons, the icon and label swaps — kept in one place so a card and a toolbar agree on what a press looks like.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/aiellie-ui/actions.tsx",
        type: "registry:component",
        target: "components/aiellie-ui/actions.tsx",
      },
    ],
  },
  {
    name: "floating-toolbar",
    type: "registry:component",
    title: "Floating Toolbar",
    description:
      "A pill of controls that hovers over what it acts on: buttons, tabs and separators, each with a tooltip, all sharing the same press and focus treatment.",
    dependencies: ["@base-ui/react"],
    registryDependencies: ["actions", "tooltip", "utils"],
    files: [
      {
        path: "components/aiellie-ui/floating-toolbar.tsx",
        type: "registry:component",
        target: "components/aiellie-ui/floating-toolbar.tsx",
      },
    ],
  },
  {
    name: "demo-card",
    type: "registry:component",
    title: "Demo Card",
    description:
      "The frame an example is shown in: a stage that takes the height it is given, for whatever is being demonstrated.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/aiellie-ui/demo-card.tsx",
        type: "registry:component",
        target: "components/aiellie-ui/demo-card.tsx",
      },
    ],
  },
  {
    name: "demo-toolbar",
    type: "registry:component",
    title: "Demo Toolbar",
    description:
      "The floating toolbar an example carries: a tab per variant, the line that installs it, and the way back, out to the source, or into fullscreen.",
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    registryDependencies: [
      "actions",
      "floating-toolbar",
      "use-copy-to-clipboard",
      "utils",
    ],
    files: [
      {
        path: "components/aiellie-ui/demo-toolbar.tsx",
        type: "registry:component",
        target: "components/aiellie-ui/demo-toolbar.tsx",
      },
    ],
  },
  {
    name: "demos-switcher",
    type: "registry:component",
    title: "Demos Switcher",
    description:
      "Holds a list of variants and shows one, with the toolbar that picks between them — the piece that turns a set of demos into a single card.",
    registryDependencies: ["demo-toolbar", "utils"],
    files: [
      {
        path: "components/aiellie-ui/demos-switcher.tsx",
        type: "registry:component",
        target: "components/aiellie-ui/demos-switcher.tsx",
      },
    ],
  },
]
