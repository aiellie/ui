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
    name: "code-block",
    type: "registry:ui",
    title: "Code Block",
    description:
      "A block of code as a thing on the page rather than a thing inside prose — named by its file, copied or saved exactly as it stands, numbered where the numbers are being referred to, marked on the lines being talked about, and able to still be arriving.",
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    registryDependencies: [
      "actions",
      "code-icons",
      "highlight",
      "tooltip",
      "use-copy-to-clipboard",
      "utils",
    ],
    files: [
      {
        path: "components/aiellie-ui/code/code-block.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/code/code-block.tsx",
      },
    ],
  },
  {
    name: "code-diff",
    type: "registry:ui",
    title: "Code Diff",
    description:
      "What changed, from the unified diff the tool that changed it wrote — tinted by row and marked in the gutter, with the code inside still coloured as code, read as one sequence or with before and after side by side.",
    registryDependencies: ["actions", "code-block", "highlight", "utils"],
    files: [
      {
        path: "components/aiellie-ui/code/code-diff.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/code/code-diff.tsx",
      },
    ],
  },
  {
    name: "code-tabs",
    type: "registry:ui",
    title: "Code Tabs",
    description:
      "Several files in one block: a strip of names for a code block's header that scrolls rather than shoving the actions off the end, with the arrow keys, Home and End a tab strip is expected to answer.",
    dependencies: [
      "@base-ui/react",
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
    ],
    registryDependencies: [
      "actions",
      "code-block",
      "code-icons",
      "highlight",
      "utils",
    ],
    files: [
      {
        path: "components/aiellie-ui/code/code-tabs.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/code/code-tabs.tsx",
      },
    ],
  },
  {
    name: "terminal",
    type: "registry:ui",
    title: "Terminal",
    description:
      "A run rather than a line to run: what was typed, coloured the way the snippet colours it, what came back in the tone it came back in, and how it ended — with the prompt kept out of anything you copy.",
    registryDependencies: ["actions", "highlight", "utils"],
    files: [
      {
        path: "components/aiellie-ui/code/terminal.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/code/terminal.tsx",
      },
    ],
  },
  {
    name: "tool-call",
    type: "registry:ui",
    title: "Tool Call",
    description:
      "A tool being called and what it gave back, folded away behind the one line worth reading without opening it — queued, awaiting approval, turning, finished or failed, with approve and deny standing where the run stopped, and the arguments and result each under their own heading.",
    dependencies: [
      "@base-ui/react",
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
    ],
    registryDependencies: ["actions", "button", "utils"],
    files: [
      {
        path: "components/aiellie-ui/tool-call.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/tool-call.tsx",
      },
    ],
  },
  {
    name: "file-tree",
    type: "registry:ui",
    title: "File Tree",
    description:
      "Which files a change touched and where they sit relative to each other, as a real tree the arrow keys walk — folders that open, marks for added, modified and removed, and one file chosen to be shown.",
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    registryDependencies: ["actions", "code-icons", "utils"],
    files: [
      {
        path: "components/aiellie-ui/code/file-tree.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/code/file-tree.tsx",
      },
    ],
  },
  {
    name: "code-annotation",
    type: "registry:ui",
    title: "Code Annotation",
    description:
      "A note pinned under the line it is about rather than in prose below that has to name the line again — as a remark, a warning or an error, set in the interface face because a sentence about code is not code.",
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    registryDependencies: ["actions", "utils"],
    files: [
      {
        path: "components/aiellie-ui/code/code-annotation.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/code/code-annotation.tsx",
      },
    ],
  },
  {
    name: "inline-code",
    type: "registry:ui",
    title: "Inline Code",
    description:
      "A symbol named in a sentence — sized in em so it comes out a shade smaller than whatever is around it, kept from breaking across a line, and able to copy itself or to lead somewhere.",
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    registryDependencies: ["use-copy-to-clipboard", "utils"],
    files: [
      {
        path: "components/aiellie-ui/code/inline-code.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/code/inline-code.tsx",
      },
    ],
  },
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
    dependencies: [
      "@base-ui/react",
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
    ],
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
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
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
    dependencies: [
      "@base-ui/react",
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
    ],
    files: [
      {
        path: "components/aiellie-ui/quoted-message.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/quoted-message.tsx",
      },
    ],
  },
  {
    name: "attachments",
    type: "registry:ui",
    title: "Attachments",
    description:
      "The files a message carries — picked in the composer and still hanging off it once it is sent: the badge the code parts would give the same file, the size the way a file manager writes one, the name cut on its stem so the extension survives, an upload that reports itself, and the way back off.",
    registryDependencies: ["actions", "code-icons", "utils"],
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "components/aiellie-ui/attachments.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/attachments.tsx",
      },
    ],
  },
  {
    name: "reasoning",
    type: "registry:ui",
    title: "Reasoning",
    description:
      "The work behind an answer as the tree it actually was: steps with glyphs, statuses and the fact worth pinning to each, and steps made of steps folding level by level — open while it runs, counting the seconds, and closed once it is done.",
    registryDependencies: ["actions", "utils"],
    dependencies: [
      "@base-ui/react",
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
    ],
    files: [
      {
        path: "components/aiellie-ui/reasoning.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/reasoning.tsx",
      },
    ],
  },
  {
    name: "sources",
    type: "registry:ui",
    title: "Sources",
    description:
      "What the answer was drawn from, folded under it and counted on the trigger — each source a numbered row with its title, the line the answer took from it, and where it came from.",
    registryDependencies: ["actions", "utils"],
    dependencies: [
      "@base-ui/react",
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
    ],
    files: [
      {
        path: "components/aiellie-ui/sources.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/sources.tsx",
      },
    ],
  },
  {
    name: "inline-citation",
    type: "registry:ui",
    title: "Inline Citation",
    description:
      "A numbered mark in the prose, pointing at the sources listed under the answer — the number in the sentence, the name a hover away, and a real link underneath so a middle click still works.",
    registryDependencies: ["sources", "tooltip", "utils"],
    files: [
      {
        path: "components/aiellie-ui/inline-citation.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/inline-citation.tsx",
      },
    ],
  },
  {
    name: "media-gallery",
    type: "registry:ui",
    title: "Media Gallery",
    description:
      "A run's variations side by side, one of them chosen: every tile a real button, the chosen one wearing the ring, and the choice living with whoever is about to do something with it.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/aiellie-ui/media-gallery.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/media-gallery.tsx",
      },
    ],
  },
  {
    name: "image-compare",
    type: "registry:ui",
    title: "Image Compare",
    description:
      "Two versions of one picture under a divider the reader drags — driven by a real range input, so the keyboard moves it and a screen reader gets a slider rather than silence.",
    registryDependencies: ["actions", "utils"],
    files: [
      {
        path: "components/aiellie-ui/image-compare.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/image-compare.tsx",
      },
    ],
  },
  {
    name: "ratio-menu",
    type: "registry:ui",
    title: "Ratio Menu",
    description:
      "The frame a generation is asked to fill, chosen from the composer's toolbar — the trigger wears the chosen proportions as an empty frame, and the rows name them the way a person would.",
    registryDependencies: ["menu", "tooltip-icon-button", "utils"],
    files: [
      {
        path: "components/aiellie-ui/composer/ratio-menu.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/composer/ratio-menu.tsx",
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
      "code-icons",
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
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
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
    name: "composer",
    type: "registry:ui",
    title: "Composer",
    description:
      "The whole of what a message is written in, in the three courses every composer here stands by: the files it carries above the box, the plus and the field inside it, and what the message is being sent with on a row below it — outside the box, so the writing keeps its own line and the box keeps its height.",
    registryDependencies: ["mentions", "message-input", "utils"],
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "components/aiellie-ui/composer/composer.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/composer/composer.tsx",
      },
    ],
  },
  {
    name: "mentions",
    type: "registry:ui",
    title: "Mentions",
    description:
      "The menu an at sign opens: the people and agents a message can name, filtered as it is typed, moved through with the arrows and taken with Enter — leaving Enter to send the message when the menu is not open.",
    registryDependencies: ["actions", "utils"],
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "components/aiellie-ui/composer/mentions.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/composer/mentions.tsx",
      },
    ],
  },
  {
    name: "slash-menu",
    type: "registry:ui",
    title: "Slash Menu",
    description:
      "The menu a slash opens at the head of the field: the commands a composer can run, filtered as the name is typed and taken with Enter — the ones that want nothing else running on the spot and emptying the field, the ones that want an argument written in and left waiting for it.",
    registryDependencies: ["actions", "utils"],
    files: [
      {
        path: "components/aiellie-ui/composer/slash-menu.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/composer/slash-menu.tsx",
      },
    ],
  },
  {
    name: "chat-card",
    type: "registry:ui",
    title: "Chat Card",
    description:
      "A chat, framed: a top that stays — a floating avatar by default, a bar where a card wants one — a middle that scrolls and follows the newest message until the reader scrolls up, and a foot for the composer that does not move when the thread grows.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/aiellie-ui/chat-card.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/chat-card.tsx",
      },
    ],
  },
  {
    name: "chat",
    type: "registry:ui",
    title: "Chat",
    description:
      "A whole agentic chat, assembled: the frame, a thread that follows the answer without dragging a reader back, one turn drawn from what an answer is made of — the thinking, the tool calls, the words, the sources — and the composer under it carrying files, a plus, a send and everything the message is being sent with.",
    registryDependencies: [
      "add-menu",
      "attachments",
      "bubble",
      "chat-card",
      "sources",
      "message",
      "message-actions",
      "message-input",
      "message-scroller",
      "message-status",
      "reasoning",
      "response",
      "streaming-text",
      "timestamps",
      "tool-call",
      "use-copy-to-clipboard",
      "utils",
    ],
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react", "ai"],
    files: [
      {
        path: "components/aiellie-ui/chat.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/chat.tsx",
      },
    ],
  },
  {
    name: "chat-avatar",
    type: "registry:ui",
    title: "Chat Avatar",
    description:
      "Whose thread this is, said at the top of the thread rather than in a bar across it: a portrait and a name that hold their place while the messages scroll behind the glass and thin out under it — one face, or a group's overlapped, with the controls that share the bar kept off the centre line.",
    registryDependencies: ["utils"],
    dependencies: [
      "@base-ui/react",
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
    ],
    files: [
      {
        path: "components/aiellie-ui/chat-avatar.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/chat-avatar.tsx",
      },
    ],
  },
  {
    name: "media",
    type: "registry:ui",
    title: "Media",
    description:
      "The frame a generated picture or clip arrives in: it holds its aspect for the whole wait, shimmers until the pixels land, and lets them fade in over the placeholder rather than mounting on top of it — with a corner badge for the word the result needs to carry.",
    registryDependencies: ["actions", "utils"],
    files: [
      {
        path: "components/aiellie-ui/media.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/media.tsx",
      },
    ],
  },
  {
    name: "key-field",
    type: "registry:ui",
    title: "Key Field",
    description:
      "A credential of the reader's own, kept in the reader's own browser: a masked field that saves to localStorage as it is typed, a reveal for a screen nobody else is watching, and a line under it saying where the key goes — because a secret box should answer that.",
    registryDependencies: ["tooltip-icon-button", "input", "utils"],
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "components/aiellie-ui/key-field.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/key-field.tsx",
      },
    ],
  },
  {
    name: "generator-card",
    type: "registry:ui",
    title: "Generator Card",
    description:
      "A generator framed as the chat it really is: a persona floating at the top, prompts going down the thread and what they made coming back up it, a settings popover for the key, and a send that turns into a stop while a run is going.",
    registryDependencies: [
      "add-menu",
      "chat-avatar",
      "chat-card",
      "message-input",
      "menu",
      "tooltip-icon-button",
      "bubble",
      "utils",
    ],
    dependencies: [
      "@base-ui/react",
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
      "ai",
    ],
    files: [
      {
        path: "components/aiellie-ui/generator-card.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/generator-card.tsx",
      },
    ],
  },
  {
    name: "agent-card",
    type: "registry:ui",
    title: "Agent Card",
    description:
      "An agent at work on a card: the persona floating at the top, the run coming down the thread in the chat's own parts, and a state chip that answers the only question a glance is asking — does it need me — with the same amber an awaiting tool call wears.",
    registryDependencies: ["chat", "chat-avatar", "chat-card", "utils"],
    dependencies: ["@hugeicons/react"],
    files: [
      {
        path: "components/aiellie-ui/agent-card.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/agent-card.tsx",
      },
    ],
  },
  {
    name: "empty-state",
    type: "registry:ui",
    title: "Empty State",
    description:
      "What a screen says while there is nothing on it yet: a mark, a line to open with and a line under it, centred in whatever room they are given.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/aiellie-ui/composer/empty-state.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/composer/empty-state.tsx",
      },
    ],
  },
  {
    name: "message-input",
    type: "registry:ui",
    title: "Message Input",
    description:
      "The field a message is written in, with one control at the end of it: send once there is something to send, and stop while an answer is coming back.",
    registryDependencies: ["actions", "tooltip-icon-button", "utils"],
    dependencies: [
      "@base-ui/react",
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
      "ai",
    ],
    files: [
      {
        path: "components/aiellie-ui/composer/message-input.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/composer/message-input.tsx",
      },
    ],
  },
  {
    name: "model-picker",
    type: "registry:ui",
    title: "Model Picker",
    description:
      "Which model is answering, and the choosing of another one — the catalogue stood under the house each model comes from, searchable, each row carrying its model's mark and the marks for what it can do, with what it is for and how much it holds a hover away, and the ones above the plan shown locked rather than left out.",
    registryDependencies: [
      "menu",
      "model-icons",
      "models",
      "tooltip",
      "tooltip-icon-button",
      "utils",
    ],
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "components/aiellie-ui/composer/model-picker.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/composer/model-picker.tsx",
      },
    ],
  },
  {
    name: "tool-picker",
    type: "registry:ui",
    title: "Tool Picker",
    description:
      "Which tools the answer may reach for, chosen from the composer — the catalogue stood under the group each tool belongs to, every row saying what a call to it does, and the ones that are on stood beside the wrench in the colour each is drawn in, pressed to take one back off.",
    registryDependencies: ["menu", "tools", "tooltip-icon-button", "utils"],
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "components/aiellie-ui/composer/tool-picker.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/composer/tool-picker.tsx",
      },
    ],
  },
  {
    name: "approval-mode-menu",
    type: "registry:ui",
    title: "Approval Mode Menu",
    description:
      "How much rope the agent is given, chosen from the composer — auto, manual, accept edits, plan and full access, each row carrying the line on what running under it means, and the one that never stops to ask set apart and drawn as the danger it is, on the row and on the icon that opens it both.",
    registryDependencies: ["menu", "tooltip-icon-button", "utils"],
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "components/aiellie-ui/composer/approval-mode-menu.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/composer/approval-mode-menu.tsx",
      },
    ],
  },
  {
    name: "effort-menu",
    type: "registry:ui",
    title: "Effort Menu",
    description:
      "How hard the model is asked to think, set from the composer — a ladder of six named rungs on a slider rather than a list of rows, because low and ultra are the two ends of one thing and not two options, and a trigger of bars that fill to the rung so a composer says how hard it is thinking without being opened.",
    registryDependencies: ["menu", "tooltip-icon-button", "utils"],
    dependencies: ["@base-ui/react"],
    files: [
      {
        path: "components/aiellie-ui/composer/effort-menu.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/composer/effort-menu.tsx",
      },
    ],
  },
  {
    name: "prompt-menu",
    type: "registry:ui",
    title: "Prompt Menu",
    description:
      "Which prompt the agent is stood under, chosen from the composer — the catalogue stood under the group each prompt belongs to, every row carrying the line on how it changes the answer, the way back to none kept as the first row, and the trigger wearing the name of the one in force.",
    registryDependencies: ["button", "instructions", "menu", "utils"],
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "components/aiellie-ui/composer/prompt-menu.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/composer/prompt-menu.tsx",
      },
    ],
  },
  {
    name: "add-menu",
    type: "registry:ui",
    title: "Add Menu",
    description:
      "The plus on a composer, and everything a message can carry that is not typed — a tree rather than a list, so the connector, the folder inside it and the file inside that are rows in the same menu at whatever depth the catalogue puts them, and a choice made four levels down comes back as one entry rather than a path.",
    registryDependencies: ["menu", "tooltip-icon-button", "utils"],
    dependencies: ["@hugeicons/core-free-icons", "@hugeicons/react"],
    files: [
      {
        path: "components/aiellie-ui/composer/add-menu.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/composer/add-menu.tsx",
      },
    ],
  },
  {
    name: "tooltip-icon-button",
    type: "registry:ui",
    title: "Tooltip Icon Button",
    description:
      "An icon button that carries its name on a tooltip, so a composer row of glyphs still says what each one does without taking a word's width to do it.",
    registryDependencies: ["button", "tooltip", "utils"],
    dependencies: ["radix-ui"],
    files: [
      {
        path: "components/aiellie-ui/tooltip-icon-button.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/tooltip-icon-button.tsx",
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
