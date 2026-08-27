import type { ComponentType } from "react"
import {
  BubbleChatSparkIcon,
  CursorMagicSelection02Icon,
  Comment01Icon,
  Clock01Icon,
  MessageMultiple01Icon,
  MessageSquareDotIcon,
  ScrollVerticalIcon,
  PaintBoardIcon,
  SourceCodeIcon,
  TextFontIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import type { RegistryItem } from "shadcn/schema"

import type { DemoVariant } from "@/components/aiellie-ui/demos-switcher"
import * as codeSnippetDemos from "@/examples/code/code-snippet"
import * as bubbleDemos from "@/examples/messages/bubble"
import * as messageDemos from "@/examples/messages/message"
import * as messageActionsDemos from "@/examples/messages/message-actions"
import * as messageContextMenuDemos from "@/examples/messages/message-context-menu"
import * as messageScrollerDemos from "@/examples/messages/message-scroller"
import * as suggestionsDemos from "@/examples/messages/suggestions"
import * as timestampsDemos from "@/examples/messages/timestamps"
import * as fontsDemos from "@/examples/tokens/fonts-demos"
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
  "message-actions-demo": {
    icon: Comment01Icon,
    components: { ...messageActionsDemos },
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
 * Tokens have a page of their own, so the elements grid is everything else.
 * Which page an example lands on is decided by the `categories` on its registry
 * item and nowhere else — a new demo needs no change on either page, and one
 * with no category is an element, which is the useful default. The only thing
 * to keep in step is the set below: a token category named in
 * `lib/categories.ts` but missing here quietly shows up under /elements.
 */
const tokenCategories = new Set(["colors", "typography"])

function isToken(example: Example) {
  return example.categories.some((slug) => tokenCategories.has(slug))
}

const tokenExamples = examplesWithDemos.filter(isToken)
const elementExamples = examplesWithDemos.filter((example) => !isToken(example))

export { examplesWithDemos, tokenExamples, elementExamples }
export type { Example }
