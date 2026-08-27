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
    name: "reactions",
    type: "registry:ui",
    title: "Reactions",
    description:
      "What a message has collected, counted: a row of tallies where the reader's own is a state of the count rather than a mark of its own, each a real toggle that gives the reaction back when pressed again.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/aiellie-ui/reactions.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/reactions.tsx",
      },
    ],
  },
  {
    name: "quoted-message",
    type: "registry:ui",
    title: "Quoted Message",
    description:
      "The message a reply is about, kept to an excerpt above the reply itself — a rule on the start edge to say the words are borrowed, a way back to the original, and a way to call the quote off before it is sent.",
    registryDependencies: ["utils"],
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "components/aiellie-ui/quoted-message.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/quoted-message.tsx",
      },
    ],
  },
  {
    name: "response",
    type: "registry:ui",
    title: "Response",
    description:
      "The body of an answer rather than the bubble around it — headings, lists, quotes, links and tables set to read as prose, with code blocks that carry their language and a copy of exactly what is on screen.",
    registryDependencies: [
      "actions",
      "highlight",
      "use-copy-to-clipboard",
      "utils",
    ],
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "components/aiellie-ui/response.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/response.tsx",
      },
    ],
  },
  {
    name: "message-status",
    type: "registry:ui",
    title: "Message Status",
    description:
      "How far a message has got — waiting, gone, arrived, seen, or not sent — as a mark small enough to sit beside a timestamp, with the retry offered on the one state that asks something of the reader.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/aiellie-ui/message-status.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/message-status.tsx",
      },
    ],
  },
  {
    name: "streaming-text",
    type: "registry:ui",
    title: "Streaming Text",
    description:
      "Text that arrives a piece at a time — from a model streaming tokens or typed out from a string already in hand — each piece fading in as it lands, with a caret holding the place the next one will take.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/aiellie-ui/streaming-text.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/streaming-text.tsx",
      },
    ],
  },
  {
    name: "typing-indicator",
    type: "registry:ui",
    title: "Typing Indicator",
    description:
      "The bubble that stands in for a message not written yet — dots waving in the place the answer will take, announced as words rather than read out as punctuation.",
    registryDependencies: ["bubble", "utils"],
    files: [
      {
        path: "components/aiellie-ui/typing-indicator.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/typing-indicator.tsx",
      },
    ],
  },
  {
    name: "message-highlight-toolbar",
    type: "registry:ui",
    title: "Message Highlight Toolbar",
    description:
      "A pill that appears over selected text in a message — reply to it, have it explained, edit it, or file it away — reading the selection out of context so an action can be dropped in without the toolbar knowing what it does.",
    registryDependencies: ["actions", "menu", "tooltip", "utils"],
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "components/aiellie-ui/message-highlight-toolbar.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/message-highlight-toolbar.tsx",
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
