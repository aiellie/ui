import type { ComponentType } from "react"
import {
  AtIcon,
  BubbleChatSparkIcon,
  TextIndent01Icon,
  FavouriteIcon,
  QuoteDownIcon,
  ParagraphIcon,
  SentIcon,
  TypeCursorIcon,
  BubbleChatDelayIcon,
  TextSelectionIcon,
  CursorMagicSelection02Icon,
  Comment01Icon,
  Clock01Icon,
  MessageMultiple01Icon,
  MessageSquareDotIcon,
  ScrollVerticalIcon,
  PaintBoardIcon,
  SourceCodeIcon,
  FileCodeIcon,
  GitCompareIcon,
  Folder01Icon,
  ComputerTerminal01Icon,
  MagicWand01Icon,
  Message01Icon,
  CodeSquareIcon,
  Tag01Icon,
  TextFontIcon,
  AiSwapIcon,
  Wrench01Icon,
  ShieldKeyIcon,
  SignalFull01Icon,
  HighlighterIcon,
  ContrastIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import type { RegistryItem } from "shadcn/schema"

import type { DemoVariant } from "@/components/aiellie-ui/demos-switcher"
import * as codeAnnotationDemos from "@/examples/coding/code-annotation"
import * as codeBlockDemos from "@/examples/coding/code-block"
import * as codeDiffDemos from "@/examples/coding/code-diff"
import * as codeTabsDemos from "@/examples/coding/code-tabs"
import * as fileTreeDemos from "@/examples/coding/file-tree"
import * as inlineCodeDemos from "@/examples/coding/inline-code"
import * as terminalDemos from "@/examples/coding/terminal"
import * as toolCallDemos from "@/examples/coding/tool-call"
import * as codeSnippetDemos from "@/examples/coding/code-snippet"
import * as bubbleDemos from "@/examples/messages/bubble"
import * as messageDemos from "@/examples/messages/message"
import * as messageActionsDemos from "@/examples/messages/message-actions"
import * as mentionsDemos from "@/examples/composer/mentions"
import * as messageInputDemos from "@/examples/composer/message-input"
import * as modelPickerDemos from "@/examples/composer/model-picker"
import * as toolPickerDemos from "@/examples/composer/tool-picker"
import * as approvalModeMenuDemos from "@/examples/composer/approval-mode-menu"
import * as effortMenuDemos from "@/examples/composer/effort-menu"
import * as messageContextMenuDemos from "@/examples/messages/message-context-menu"
import * as messageHighlightToolbarDemos from "@/examples/messages/message-highlight-toolbar"
import * as messageStatusDemos from "@/examples/messages/message-status"
import * as quotedMessageDemos from "@/examples/messages/quoted-message"
import * as reactionsDemos from "@/examples/messages/reactions"
import * as responseDemos from "@/examples/messages/response"
import * as streamingTextDemos from "@/examples/messages/streaming-text"
import * as typingIndicatorDemos from "@/examples/messages/typing-indicator"
import * as messageScrollerDemos from "@/examples/messages/message-scroller"
import * as suggestionsDemos from "@/examples/messages/suggestions"
import * as timestampsDemos from "@/examples/messages/timestamps"
import * as codeHighlightDemos from "@/examples/tokens/code-highlight"
import * as fontsDemos from "@/examples/tokens/fonts-demos"
import * as themeDemos from "@/examples/tokens/theme"
import { colorsVariants } from "@/examples/tokens/colors-demos"

import { examples } from "./_examples-registry"
import { registry } from "./_registry"

/**
 * The half of an example that can't be serialized into registry.json: the demo
 * components and the glyph its card carries. Site-side only — the registry.json
 * build reads `_registry.ts`, which never reaches this file.
 *
 * `components` is for the usual case, where `meta.variants` names one export per
 * tab; `variants` is for a demo whose tabs are generated from data, so there are
 * no export names for the registry to list.
 */
type ExampleDemos = {
  icon: IconSvgElement
  components?: Record<string, ComponentType>
  variants?: DemoVariant[]
}

const exampleDemos: Record<string, ExampleDemos> = {
  "colors-demo": { icon: PaintBoardIcon, variants: colorsVariants },
  "fonts-demo": { icon: TextFontIcon, components: { ...fontsDemos } },
  "code-highlight-demo": {
    icon: HighlighterIcon,
    components: { ...codeHighlightDemos },
  },
  "theme-demo": {
    icon: ContrastIcon,
    components: { ...themeDemos },
  },
  "code-block-demo": {
    icon: FileCodeIcon,
    components: { ...codeBlockDemos },
  },
  "code-diff-demo": {
    icon: GitCompareIcon,
    components: { ...codeDiffDemos },
  },
  "code-tabs-demo": {
    icon: CodeSquareIcon,
    components: { ...codeTabsDemos },
  },
  "terminal-demo": {
    icon: ComputerTerminal01Icon,
    components: { ...terminalDemos },
  },
  "tool-call-demo": {
    icon: MagicWand01Icon,
    components: { ...toolCallDemos },
  },
  "file-tree-demo": {
    icon: Folder01Icon,
    components: { ...fileTreeDemos },
  },
  "code-annotation-demo": {
    icon: Message01Icon,
    components: { ...codeAnnotationDemos },
  },
  "inline-code-demo": {
    icon: Tag01Icon,
    components: { ...inlineCodeDemos },
  },
  "code-snippet-demo": {
    icon: SourceCodeIcon,
    components: { ...codeSnippetDemos },
  },
  "bubble-demo": {
    icon: MessageSquareDotIcon,
    components: { ...bubbleDemos },
  },
  "message-demo": {
    icon: MessageMultiple01Icon,
    components: { ...messageDemos },
  },
  "message-scroller-demo": {
    icon: ScrollVerticalIcon,
    components: { ...messageScrollerDemos },
  },
  "suggestions-demo": {
    icon: BubbleChatSparkIcon,
    components: { ...suggestionsDemos },
  },
  "mentions-demo": {
    icon: AtIcon,
    components: { ...mentionsDemos },
  },
  "message-input-demo": {
    icon: TextIndent01Icon,
    components: { ...messageInputDemos },
  },
  "model-picker-demo": {
    icon: AiSwapIcon,
    components: { ...modelPickerDemos },
  },
  "tool-picker-demo": {
    icon: Wrench01Icon,
    components: { ...toolPickerDemos },
  },
  "approval-mode-menu-demo": {
    icon: ShieldKeyIcon,
    components: { ...approvalModeMenuDemos },
  },
  "effort-menu-demo": {
    icon: SignalFull01Icon,
    components: { ...effortMenuDemos },
  },
  "message-actions-demo": {
    icon: Comment01Icon,
    components: { ...messageActionsDemos },
  },
  "reactions-demo": {
    icon: FavouriteIcon,
    components: { ...reactionsDemos },
  },
  "quoted-message-demo": {
    icon: QuoteDownIcon,
    components: { ...quotedMessageDemos },
  },
  "response-demo": {
    icon: ParagraphIcon,
    components: { ...responseDemos },
  },
  "message-status-demo": {
    icon: SentIcon,
    components: { ...messageStatusDemos },
  },
  "streaming-text-demo": {
    icon: TypeCursorIcon,
    components: { ...streamingTextDemos },
  },
  "typing-indicator-demo": {
    icon: BubbleChatDelayIcon,
    components: { ...typingIndicatorDemos },
  },
  "message-highlight-toolbar-demo": {
    icon: TextSelectionIcon,
    components: { ...messageHighlightToolbarDemos },
  },
  "message-context-menu-demo": {
    icon: CursorMagicSelection02Icon,
    components: { ...messageContextMenuDemos },
  },
  "timestamps-demo": {
    icon: Clock01Icon,
    components: { ...timestampsDemos },
  },
}

/** A registry example resolved into everything a card needs to render it. */
type Example = {
  name: string
  href: string
  title: string
  description: string
  icon: IconSvgElement
  categories: string[]
  installCommand: string
  demoInstallCommand: string
  variants: DemoVariant[]
  wide: boolean
}

const homepage = registry.homepage.replace(/\/+$/, "")

/** The line that installs one registry item, as a card's toolbar copies it. */
function installCommandFor(name: string) {
  return `npx shadcn@latest add ${homepage}/r/${name}.json`
}

/**
 * The element a card is showing, which is what its toolbar installs under
 * "Component": a demo's first registry dependency is the thing it demos —
 * `code-snippet-demo` → `code-snippet`. "With demo" installs the item itself,
 * example file and all.
 */
function elementOf(item: RegistryItem) {
  return item.registryDependencies?.[0] ?? item.name
}

/** The name is the item's, minus the suffix: `colors-demo` → `/examples/colors`. */
function hrefFor(name: string) {
  return `/examples/${name.replace(/-demo$/, "")}`
}

/** Tabs in the order `meta.variants` lists them, skipping any missing export. */
function namedVariants(
  meta: RegistryItem["meta"],
  components: Record<string, ComponentType> = {}
): DemoVariant[] {
  const listed = (meta?.variants ?? []) as { name: string; demo: string }[]
  return listed.flatMap((variant) => {
    const demo = components[variant.demo]
    return demo ? [{ name: variant.name, demo }] : []
  })
}

/**
 * Registering an item and building it is only half of an example: without the
 * demos above it has nothing to render, and would otherwise go missing from the
 * grid without saying so. Dev builds say so.
 */
function dropped(name: string, reason: string): [] {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[registry] No card for ${name} — ${reason}.`)
  }
  return []
}

/**
 * Every example that has something to show, in registry order — the grid reads
 * this and nothing else. An item with no entry in `exampleDemos`, or whose
 * named exports have all gone missing, is dropped rather than rendered empty.
 */
const examplesWithDemos: Example[] = examples.flatMap((item) => {
  const demos = exampleDemos[item.name]
  if (!demos) return dropped(item.name, "it has no entry in exampleDemos")

  const variants = demos.variants ?? namedVariants(item.meta, demos.components)
  if (!variants.length) {
    return dropped(item.name, "none of its meta.variants name a real export")
  }

  return [
    {
      name: item.name,
      href: hrefFor(item.name),
      title: item.title ?? item.name,
      description: item.description ?? "",
      icon: demos.icon,
      categories: item.categories ?? [],
      installCommand: installCommandFor(elementOf(item)),
      demoInstallCommand: installCommandFor(item.name),
      variants,
      wide: Boolean(item.meta?.wide),
    },
  ]
})

/**
 * Every example goes to `/design` and the rail there sorts them out, so there
 * is no split to keep in step here: where one lands is decided by the
 * `categories` on its registry item, against the sections `lib/categories.ts`
 * names, and nowhere else.
 */
export { examplesWithDemos }
export type { Example }
