import type { ComponentType } from "react"
import {
  PaintBoardIcon,
  SourceCodeIcon,
  TextFontIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import type { RegistryItem } from "shadcn/schema"

import type { DemoVariant } from "@/components/aiellie-ui/demos-switcher"
import * as codeSnippetDemos from "@/examples/code/code-snippet"
import * as fontsDemos from "@/examples/tokens/fonts-demos"
import { colorsVariants } from "@/examples/tokens/colors-demos"

import { examples } from "./_examples-registry"

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
}

/** A registry example resolved into everything a card needs to render it. */
type Example = {
  name: string
  href: string
  title: string
  description: string
  icon: IconSvgElement
  variants: DemoVariant[]
  wide: boolean
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
 * Every example that has something to show, in registry order — the grid reads
 * this and nothing else. An item with no entry in `exampleDemos`, or whose
 * named exports have all gone missing, is dropped rather than rendered empty.
 */
const examplesWithDemos: Example[] = examples.flatMap((item) => {
  const demos = exampleDemos[item.name]
  if (!demos) return []

  const variants = demos.variants ?? namedVariants(item.meta, demos.components)
  if (!variants.length) return []

  return [
    {
      name: item.name,
      href: hrefFor(item.name),
      title: item.title ?? item.name,
      description: item.description ?? "",
      icon: demos.icon,
      variants,
      wide: Boolean(item.meta?.wide),
    },
  ]
})

export { examplesWithDemos }
export type { Example }
