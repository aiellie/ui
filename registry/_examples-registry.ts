import type { Registry } from "shadcn/schema"

/**
 * Registry item definitions for the elements, used to build registry.json
 * (https://ui.shadcn.com/docs/registry/getting-started).
 *
 * Local item names in registryDependencies ("colors", "code-snippet") resolve
 * against this registry once it is published; the build step maps them to
 * `<homepage>/r/<name>.json` URLs.
 *
 * This list is also the grids, in this order, with `categories` deciding which
 * page each item lands on: "tokens" puts it on `/tokens`, anything else — or
 * nothing at all — leaves it on `/elements`. `meta.variants` names the
 * demo exports behind each tab; `registry/_demos.ts` holds the components
 * themselves, since a function can't be serialized into registry.json. A demo
 * whose tabs are generated from data has no export names to list, so it carries
 * no `meta.variants` and `_demos.ts` supplies the variants instead.
 */
export const examples: Registry["items"] = [
  {
    name: "colors-demo",
    type: "registry:example",
    title: "Colors",
    description:
      "Every colour token the elements draw from, a group at a time, each swatch over a dotted backdrop so a translucent token reads as translucent rather than as an empty box.",
    registryDependencies: ["colors", "demos-switcher", "utils"],
    files: [
      {
        path: "examples/tokens/colors-demos.tsx",
        type: "registry:example",
        target: "examples/tokens/colors-demos.tsx",
      },
    ],
    categories: ["colors"],
    meta: {
      wide: false,
    },
  },
  {
    name: "fonts-demo",
    type: "registry:example",
    title: "Fonts",
    description:
      "The two families the elements are set in, the weights they are used at, and the type scale they step through — each shown at the size it is actually rendered.",
    registryDependencies: ["fonts", "utils"],
    files: [
      {
        path: "examples/tokens/fonts-demos.tsx",
        type: "registry:example",
        target: "examples/tokens/fonts-demos.tsx",
      },
    ],
    categories: ["typography"],
    meta: {
      variants: [
        { name: "Families", demo: "FamiliesDemo" },
        { name: "Scale", demo: "ScaleDemo" },
        { name: "Weights", demo: "WeightsDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "code-snippet-demo",
    type: "registry:example",
    title: "Code Snippet",
    description:
      "A code snippet with tabs for the package manager running it — npx, pnpm dlx, bunx, or yarn dlx — or under tabs of your own, or under none at all, coloured like code on request, with a copy action handed exactly the line on screen.",
    registryDependencies: ["code-snippet"],
    files: [
      {
        path: "examples/code/code-snippet.tsx",
        type: "registry:example",
        target: "examples/code/code-snippet.tsx",
      },
    ],
    categories: ["coding"],
    meta: {
      variants: [
        { name: "Command", demo: "CodeSnippetDemo" },
        { name: "Several", demo: "InstallCommandSeveralDemo" },
        { name: "No tabs", demo: "InstallCommandBareDemo" },
        { name: "Custom tabs", demo: "InstallCommandTabsDemo" },
        { name: "Highlighted", demo: "InstallCommandHighlightedDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "bubble-demo",
    type: "registry:example",
    title: "Bubble",
    description: "A bubble is a container for a message.",
    registryDependencies: ["bubble"],
    files: [
      {
        path: "examples/messages/bubble.tsx",
        type: "registry:example",
        target: "examples/messages/bubble.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "Default", demo: "BubbleDemo" },
        { name: "Variants", demo: "BubbleVariantsDemo" },
        { name: "Reactions", demo: "BubbleReactionsDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "message-demo",
    type: "registry:example",
    title: "Message",
    description:
      "The frame around a bubble — who said it, when, and which side it belongs on — including the ghost case where the frame gets out of the way of the prose.",
    registryDependencies: ["message", "bubble"],
    files: [
      {
        path: "examples/messages/message.tsx",
        type: "registry:example",
        target: "examples/messages/message.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "Default", demo: "MessageDemo" },
        { name: "Header and footer", demo: "MessageMetaDemo" },
        { name: "Ghost", demo: "MessageGhostDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "message-scroller-demo",
    type: "registry:example",
    title: "Message Scroller",
    description:
      "A thread that holds the newest message in view until you scroll away from it, appends without yanking the viewport, and can be driven from outside by the hook.",
    registryDependencies: [
      "message-scroller",
      "message",
      "bubble",
      "button",
      "utils",
    ],
    files: [
      {
        path: "examples/messages/message-scroller.tsx",
        type: "registry:example",
        target: "examples/messages/message-scroller.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "Anchoring turns", demo: "MessageScrollerAnchoringDemo" },
        { name: "Group chat", demo: "MessageScrollerGroupChatDemo" },
        { name: "Keeping context", demo: "MessageScrollerContextDemo" },
        { name: "Live edge", demo: "MessageScrollerLiveEdgeDemo" },
        { name: "Saved threads", demo: "MessageScrollerSavedThreadDemo" },
        { name: "Earlier messages", demo: "MessageScrollerHistoryDemo" },
        { name: "Animated", demo: "MessageScrollerAnimatedDemo" },
        { name: "Jumping", demo: "MessageScrollerJumpDemo" },
        { name: "Reader position", demo: "MessageScrollerPositionDemo" },
        { name: "Scroll state", demo: "MessageScrollerScrollStateDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "suggestions-demo",
    type: "registry:example",
    title: "Suggestions",
    description:
      "Prompts offered as dashed bubbles and tinted once picked — as a run of pills, as a list, or picked to be sent.",
    registryDependencies: ["suggestions", "bubble"],
    files: [
      {
        path: "examples/messages/suggestions.tsx",
        type: "registry:example",
        target: "examples/messages/suggestions.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "Pills", demo: "SuggestionsDemo" },
        { name: "List", demo: "SuggestionsListDemo" },
        { name: "Sending", demo: "SuggestionsControlledDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "reactions-demo",
    type: "registry:example",
    title: "Reactions",
    description:
      "A counted row under a message, the picker and the tally wired together as two halves of one thing, and both sides of a thread including the row with nothing on it yet.",
    registryDependencies: ["reactions", "message-context-menu", "bubble"],
    files: [
      {
        path: "examples/messages/reactions.tsx",
        type: "registry:example",
        target: "examples/messages/reactions.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "Default", demo: "ReactionsDemo" },
        { name: "With the picker", demo: "ReactionsWithPickerDemo" },
        { name: "In a thread", demo: "ReactionsThreadDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "quoted-message-demo",
    type: "registry:example",
    title: "Quoted Message",
    description:
      "A reply carrying what it replies to, the quote as a way back to the original, and the quote waiting above something not sent yet.",
    registryDependencies: ["quoted-message", "bubble"],
    files: [
      {
        path: "examples/messages/quoted-message.tsx",
        type: "registry:example",
        target: "examples/messages/quoted-message.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "In a reply", demo: "QuotedMessageDemo" },
        { name: "Jumping back", demo: "QuotedMessageJumpDemo" },
        { name: "Before sending", demo: "QuotedMessagePendingDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "response-demo",
    type: "registry:example",
    title: "Response",
    description:
      "An answer set as prose — lists, a quote, links and inline code — with a code block that names its language and copies itself, and a table that scrolls rather than pushing the thread sideways.",
    registryDependencies: ["response", "bubble"],
    files: [
      {
        path: "examples/messages/response.tsx",
        type: "registry:example",
        target: "examples/messages/response.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "Prose", demo: "ResponseDemo" },
        { name: "Code", demo: "ResponseCodeDemo" },
        { name: "Table", demo: "ResponseTableDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "message-status-demo",
    type: "registry:example",
    title: "Message Status",
    description:
      "A message travelling from sending to read beside its timestamp, every state at rest, and the failed one offering the retry.",
    registryDependencies: ["message-status", "timestamps", "bubble"],
    files: [
      {
        path: "examples/messages/message-status.tsx",
        type: "registry:example",
        target: "examples/messages/message-status.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "Travelling", demo: "MessageStatusDemo" },
        { name: "States", demo: "MessageStatusStatesDemo" },
        { name: "Failed", demo: "MessageStatusFailedDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "streaming-text-demo",
    type: "registry:example",
    title: "Streaming Text",
    description:
      "An answer typed out from a string in hand, the same words arriving as tokens instead, and the typing bubble handing over to the stream at the first of them.",
    registryDependencies: ["streaming-text", "typing-indicator", "bubble"],
    files: [
      {
        path: "examples/messages/streaming-text.tsx",
        type: "registry:example",
        target: "examples/messages/streaming-text.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "Typed out", demo: "StreamingTextDemo" },
        { name: "Tokens", demo: "StreamingTextTokensDemo" },
        { name: "From typing", demo: "StreamingTextWithTypingDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "typing-indicator-demo",
    type: "registry:example",
    title: "Typing Indicator",
    description:
      "The stand-in for an answer still being written — a bubble holding its place, the dots alone, a line saying who is typing, or the caret a streamed answer starts at.",
    registryDependencies: ["typing-indicator", "bubble", "message"],
    files: [
      {
        path: "examples/messages/typing-indicator.tsx",
        type: "registry:example",
        target: "examples/messages/typing-indicator.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "Default", demo: "TypingIndicatorDemo" },
        { name: "Kinds", demo: "TypingIndicatorVariantsDemo" },
        { name: "In a thread", demo: "TypingIndicatorFlowDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "message-highlight-toolbar-demo",
    type: "registry:example",
    title: "Message Highlight Toolbar",
    description:
      "Select any of the text in a message for the pill: reply, explain, edit, and a menu for filing it as a note, a memory or a snippet.",
    registryDependencies: ["message-highlight-toolbar", "bubble"],
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "examples/messages/message-highlight-toolbar.tsx",
        type: "registry:example",
        target: "examples/messages/message-highlight-toolbar.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "One message", demo: "MessageHighlightToolbarDemo" },
        { name: "Whole thread", demo: "MessageHighlightToolbarThreadDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "message-context-menu-demo",
    type: "registry:example",
    title: "Message Context Menu",
    description:
      "A thread where every message answers a right click with its reactions and its actions, and wears the reaction it was given.",
    registryDependencies: ["message-context-menu", "menu", "bubble"],
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "examples/messages/message-context-menu.tsx",
        type: "registry:example",
        target: "examples/messages/message-context-menu.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "Default", demo: "MessageContextMenuDemo" },
        { name: "Reactions only", demo: "MessageContextMenuReactionsDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "timestamps-demo",
    type: "registry:example",
    title: "Timestamps",
    description:
      "Stamps under the bubbles they belong to and ruled across the thread between days, in every phrasing the formatter has.",
    registryDependencies: ["timestamps", "bubble"],
    files: [
      {
        path: "examples/messages/timestamps.tsx",
        type: "registry:example",
        target: "examples/messages/timestamps.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "In a thread", demo: "TimestampsDemo" },
        { name: "Beside", demo: "TimestampsAsideDemo" },
        { name: "Variants", demo: "TimestampsVariantsDemo" },
        { name: "Relative", demo: "TimestampsRelativeDemo" },
      ],
      wide: false,
    },
  },
  {
    name: "message-actions-demo",
    type: "registry:example",
    title: "Message Actions",
    description:
      "Copy, rate and retry under their tooltips, the rest behind a menu, and the row appearing only for the message under the pointer.",
    registryDependencies: ["message-actions", "bubble"],
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "examples/messages/message-actions.tsx",
        type: "registry:example",
        target: "examples/messages/message-actions.tsx",
      },
    ],
    categories: ["messages"],
    meta: {
      variants: [
        { name: "Default", demo: "MessageActionsDemo" },
        { name: "On hover", demo: "MessageActionsOnHoverDemo" },
      ],
      wide: false,
    },
  },
]
