import type { ComponentType } from "react"
import {
  AtIcon,
  AiBrain01Icon,
  Link02Icon,
  ChatBotIcon,
  AiChat02Icon,
  Home01Icon,
  SlashIcon,
  BubblesIcon,
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
  SwipeDown01Icon,
  MessageSquareDotIcon,
  BubbleChatTemporaryIcon,
  SourceCodeIcon,
  FileCodeIcon,
  GitCompareIcon,
  Folder01Icon,
  ComputerTerminal01Icon,
  MagicWand01Icon,
  Message01Icon,
  CodeSquareIcon,
  Tag01Icon,
  AiSwapIcon,
  Wrench01Icon,
  ShieldKeyIcon,
  SignalFull01Icon,
  QuillWrite01Icon,
  AddCircleIcon,
  LayoutBottomIcon,
  Attachment01Icon,
  AiImageIcon,
  AiVideo01Icon,
  AiSearch02Icon,
  Image01Icon,
  Album02Icon,
  Exchange01Icon,
  AspectRatioIcon,
  RippleIcon,
  AudioWave01Icon,
  PlayIcon,
  Mic01Icon,
  SubtitleIcon,
  PaintBoardIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import type { RegistryItem } from "shadcn/schema"

import type { DemoVariant } from "@/components/aiellie-ui/demos-switcher"
import { fullscreenHrefFor, hrefFor, slugFor } from "@/registry/_paths"
import * as codeAnnotationDemos from "@/examples/coding/code-annotation"
import * as composerDemos from "@/examples/composer/composer"
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
import * as chatCardDemos from "@/examples/cards/chat-card"
import * as chatDemos from "@/examples/cards/chat"
import * as imageGeneratorDemos from "@/examples/cards/image-generator"
import * as videoGeneratorDemos from "@/examples/cards/video-generator"
import * as agentCardDemos from "@/examples/cards/agent"
import * as messageActionsDemos from "@/examples/messages/message-actions"
import * as emptyStateDemos from "@/examples/composer/empty-state"
import * as attachmentsDemos from "@/examples/composer/attachments"
import * as mentionsDemos from "@/examples/composer/mentions"
import * as slashMenuDemos from "@/examples/composer/slash-menu"
import * as messageInputDemos from "@/examples/composer/message-input"
import * as modelPickerDemos from "@/examples/composer/model-picker"
import * as toolPickerDemos from "@/examples/composer/tool-picker"
import * as approvalModeMenuDemos from "@/examples/composer/approval-mode-menu"
import * as effortMenuDemos from "@/examples/composer/effort-menu"
import * as promptMenuDemos from "@/examples/composer/prompt-menu"
import * as addMenuDemos from "@/examples/composer/add-menu"
import * as messageContextMenuDemos from "@/examples/messages/message-context-menu"
import * as messageHighlightToolbarDemos from "@/examples/messages/message-highlight-toolbar"
import * as messageStatusDemos from "@/examples/messages/message-status"
import * as quotedMessageDemos from "@/examples/messages/quoted-message"
import * as reactionsDemos from "@/examples/messages/reactions"
import * as inlineCitationDemos from "@/examples/messages/inline-citation"
import * as sourcesDemos from "@/examples/messages/sources"
import * as mediaDemos from "@/examples/media/media"
import * as mediaGalleryDemos from "@/examples/media/media-gallery"
import * as imageCompareDemos from "@/examples/media/image-compare"
import * as ratioMenuDemos from "@/examples/composer/ratio-menu"
import * as orbDemos from "@/examples/audio/orb"
import * as waveformDemos from "@/examples/audio/waveform"
import * as audioPlayerDemos from "@/examples/audio/audio-player"
import * as micMenuDemos from "@/examples/audio/mic-menu"
import * as transcriptDemos from "@/examples/audio/transcript"
import * as meshGradientDemos from "@/examples/media/mesh-gradient"
import * as reasoningDemos from "@/examples/messages/reasoning"
import * as responseDemos from "@/examples/messages/response"
import * as streamingTextDemos from "@/examples/messages/streaming-text"
import * as typingIndicatorDemos from "@/examples/messages/typing-indicator"
import * as messageScrollerDemos from "@/examples/messages/message-scroller"
import * as suggestionsDemos from "@/examples/messages/suggestions"
import * as timestampsDemos from "@/examples/messages/timestamps"

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
    icon: BubblesIcon,
    components: { ...bubbleDemos },
  },
  "message-demo": {
    icon: MessageSquareDotIcon,
    components: { ...messageDemos },
  },
  "message-scroller-demo": {
    icon: SwipeDown01Icon,
    components: { ...messageScrollerDemos },
  },
  "suggestions-demo": {
    icon: BubbleChatTemporaryIcon,
    components: { ...suggestionsDemos },
  },
  "empty-state-demo": {
    icon: Home01Icon,
    components: { ...emptyStateDemos },
  },
  "attachments-demo": {
    icon: Attachment01Icon,
    components: { ...attachmentsDemos },
  },
  "mentions-demo": {
    icon: AtIcon,
    components: { ...mentionsDemos },
  },
  "slash-menu-demo": {
    icon: SlashIcon,
    components: { ...slashMenuDemos },
  },
  "composer-demo": {
    icon: LayoutBottomIcon,
    components: { ...composerDemos },
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
  "prompt-menu-demo": {
    icon: QuillWrite01Icon,
    components: { ...promptMenuDemos },
  },
  "add-menu-demo": {
    icon: AddCircleIcon,
    components: { ...addMenuDemos },
  },
  "chat-card-demo": {
    icon: ChatBotIcon,
    components: { ...chatCardDemos },
  },
  "chat-demo": {
    icon: AiChat02Icon,
    components: { ...chatDemos },
  },
  "image-generator-demo": {
    icon: AiImageIcon,
    components: { ...imageGeneratorDemos },
  },
  "video-generator-demo": {
    icon: AiVideo01Icon,
    components: { ...videoGeneratorDemos },
  },
  "agent-card-demo": {
    icon: AiSearch02Icon,
    components: { ...agentCardDemos },
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
  "reasoning-demo": {
    icon: AiBrain01Icon,
    components: { ...reasoningDemos },
  },
  "inline-citation-demo": {
    icon: Tag01Icon,
    components: { ...inlineCitationDemos },
  },
  "sources-demo": {
    icon: Link02Icon,
    components: { ...sourcesDemos },
  },
  "media-demo": {
    icon: Image01Icon,
    components: { ...mediaDemos },
  },
  "media-gallery-demo": {
    icon: Album02Icon,
    components: { ...mediaGalleryDemos },
  },
  "image-compare-demo": {
    icon: Exchange01Icon,
    components: { ...imageCompareDemos },
  },
  "ratio-menu-demo": {
    icon: AspectRatioIcon,
    components: { ...ratioMenuDemos },
  },
  "orb-demo": {
    icon: RippleIcon,
    components: { ...orbDemos },
  },
  "waveform-demo": {
    icon: AudioWave01Icon,
    components: { ...waveformDemos },
  },
  "audio-player-demo": {
    icon: PlayIcon,
    components: { ...audioPlayerDemos },
  },
  "mic-menu-demo": {
    icon: Mic01Icon,
    components: { ...micMenuDemos },
  },
  "transcript-demo": {
    icon: SubtitleIcon,
    components: { ...transcriptDemos },
  },
  "mesh-gradient-demo": {
    icon: PaintBoardIcon,
    components: { ...meshGradientDemos },
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
  fullscreenHref: string
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
      fullscreenHref: fullscreenHrefFor(item.name),
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

export { examplesWithDemos, slugFor }
export type { Example }
