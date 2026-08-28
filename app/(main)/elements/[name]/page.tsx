import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { sectionFor } from "@/lib/categories"
import { examples } from "@/registry/_examples-registry"
import { slugFor } from "@/registry/_paths"

import { ElementCard } from "../components/elements-browser"

/**
 * The slug is the registry item's name minus its `-demo` suffix, and it has to
 * be one of *this* page's items — a token asked for under `/elements` is a
 * wrong address, not a card to show, or the two pages would each answer for the
 * other's examples.
 */
function itemFor(slug: string) {
  return examples.find(
    (item) =>
      slugFor(item.name) === slug &&
      sectionFor(item.categories ?? []) !== "tokens"
  )
}

type PageProps = { params: Promise<{ name: string }> }

export function generateStaticParams() {
  return examples
    .filter((item) => sectionFor(item.categories ?? []) !== "tokens")
    .map((item) => ({ name: slugFor(item.name) }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const item = itemFor((await params).name)
  if (!item) return {}

  return { title: item.title, description: item.description }
}

export default async function Page({ params }: PageProps) {
  const { name } = await params
  if (!itemFor(name)) notFound()

  return <ElementCard slug={name} />
}
