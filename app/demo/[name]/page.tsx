import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { examples } from "@/registry/_examples-registry"

import { DemoStage } from "./components/demo-stage"

/**
 * The slug is the registry item's name minus its `-demo` suffix, which is what
 * `fullscreenHrefFor` in `registry/_demos.ts` links to. It is matched against
 * the plain registry here rather than `examplesWithDemos`, since that list
 * carries the demo components with it and this half of the route only needs the
 * names and the titles.
 */
function itemFor(slug: string) {
  return examples.find((item) => item.name.replace(/-demo$/, "") === slug)
}

type PageProps = { params: Promise<{ name: string }> }

export function generateStaticParams() {
  return examples.map((item) => ({ name: item.name.replace(/-demo$/, "") }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const item = itemFor((await params).name)
  if (!item) return {}

  return { title: item.title, description: item.description }
}

/**
 * Outside the `(main)` group on purpose: fullscreen means the demo and its
 * toolbar, with no site header over them.
 */
export default async function Page({ params }: PageProps) {
  const { name } = await params
  if (!itemFor(name)) notFound()

  return <DemoStage slug={name} />
}
