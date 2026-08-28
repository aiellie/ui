import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { examples } from "@/registry/_examples-registry"
import { slugFor } from "@/registry/_paths"

import { ElementCard } from "../components/elements-browser"

/** The slug is the registry item's name minus its `-demo` suffix. */
function itemFor(slug: string) {
  return examples.find((item) => slugFor(item.name) === slug)
}

type PageProps = { params: Promise<{ name: string }> }

export function generateStaticParams() {
  return examples.map((item) => ({ name: slugFor(item.name) }))
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
