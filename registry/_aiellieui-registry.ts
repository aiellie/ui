import type { Registry } from "shadcn/schema"

/**
 * Registry item definitions for the elements, used to build registry.json
 * (https://ui.shadcn.com/docs/registry/getting-started).
 *
 * Local item names in registryDependencies ("actions", "highlight") resolve
 * against this registry once it is published; the build step maps them to
 * `<homepage>/r/<name>.json` URLs.
 */
export const aiellieui: Registry["items"] = [
  {
    name: "code-snippet",
    type: "registry:ui",
    title: "Code Snippet",
    description:
      "The line that installs a thing, under tabs for the package manager running it — npx, pnpm dlx, bunx, or yarn dlx — or under tabs of your own, or under none at all, coloured like code on request, with a copy action handed exactly the line on screen.",
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    registryDependencies: ["actions", "highlight", "utils"],
    files: [
      {
        path: "components/aiellie-ui/code/code-snippet.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/code/code-snippet.tsx",
      },
    ],
  },
  {
    name: "suggestions",
    type: "registry:ui",
    title: "Suggestions",
    description:
      "A row of prompts the reader can act on rather than read: each one a bubble drawn as a dashed outline while it is still an offer, tinted once it is picked, with the row holding the selection for one or for several.",
    registryDependencies: ["bubble", "utils"],
    files: [
      {
        path: "components/aiellie-ui/suggestions.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/suggestions.tsx",
      },
    ],
  },
  {
    name: "timestamps",
    type: "registry:ui",
    title: "Timestamps",
    description:
      "When a message was sent, phrased the way a reader would say it — just now, half four, Tuesday — inline under a bubble or ruled across the thread as the divider a new day starts with, and kept honest on an interval.",
    registryDependencies: ["marker", "utils"],
    files: [
      {
        path: "components/aiellie-ui/timestamps.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/timestamps.tsx",
      },
    ],
  },
  {
    name: "menu",
    type: "registry:ui",
    title: "Menu",
    description:
      "Base UI's menu with this registry's surface on it — a glass popup, rows that take an icon and a word, ticked rows, groups, rules, shortcuts and submenus — so anything that needs a menu styles none of it again.",
    registryDependencies: ["actions", "utils"],
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "components/aiellie-ui/menu.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/menu.tsx",
      },
    ],
  },
  {
    name: "message-context-menu",
    type: "registry:ui",
    title: "Message Context Menu",
    description:
      "The menu a message answers a right click — or a long press — with: the reactions that can be put on it across the top, and everything that can be done to it under them.",
    registryDependencies: ["menu", "utils"],
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "components/aiellie-ui/message-context-menu.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/message-context-menu.tsx",
      },
    ],
  },
  {
    name: "message-actions",
    type: "registry:ui",
    title: "Message Actions",
    description:
      "The controls that belong to one message — copy, rate, retry — each an icon under a tooltip, with everything rarer folded into a menu at the end of the row, and the whole row held back until the message is hovered.",
    registryDependencies: ["actions", "menu", "tooltip", "utils"],
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "components/aiellie-ui/message-actions.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/message-actions.tsx",
      },
    ],
  },
]
