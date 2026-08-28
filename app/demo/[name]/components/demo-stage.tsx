"use client"

import { notFound } from "next/navigation"

import { DemosSwitcher } from "@/components/aiellie-ui/demos-switcher"
import { sectionFor } from "@/lib/categories"
import { examplesWithDemos, slugFor } from "@/registry/_demos"

/**
 * One example with the whole viewport to itself, which the toolbar's fullscreen
 * button opens. The list is pulled in here rather than handed down by the page
 * for the reason `design-browser.tsx` gives: a variant carries its demo
 * *component*, and a function can't cross into a client component — so the page
 * passes the slug and this side resolves it.
 *
 * `relative` because `DemosSwitcher` deliberately isn't: its toolbar anchors to
 * whatever box the demo is standing in, which on a card is the preview frame
 * and here is the page.
 */
function DemoStage({ slug }: { slug: string }) {
  const example = examplesWithDemos.find((item) => slugFor(item.name) === slug)

  /* Registered, built, and installable, but with no demo behind it — the same
     state `_demos.ts` drops from the grid. There is nothing to give the screen
     to, so this is a 404 rather than an empty page. */
  if (!example) notFound()

  /* Leaving fullscreen should land on the page the card came from, and the
     example's own categories are what put it there — so the way back is
     derived rather than named, and a demo that changes section takes its exit
     with it. */
  const back =
    sectionFor(example.categories) === "tokens" ? "/design" : "/elements"

  return (
    <main className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-dotted p-6 md:p-10">
      <DemosSwitcher
        variants={example.variants}
        installCommand={example.installCommand}
        demoInstallCommand={example.demoInstallCommand}
        title={example.title}
        fullscreen
        fullscreenHref={back}
      />
    </main>
  )
}

export { DemoStage }
