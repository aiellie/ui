"use client"

import { useState } from "react"
import { notFound } from "next/navigation"

import { DemoToolbar } from "@/components/aiellie-ui/demo-toolbar"
import { DemosSwitcher } from "@/components/aiellie-ui/demos-switcher"
import { examplesWithDemos, slugFor } from "@/registry/_demos"
import { basePath } from "@/registry/_paths"

/**
 * One example with the whole viewport to itself, which the toolbar's fullscreen
 * button opens. The list is pulled in here rather than handed down by the page
 * for the reason `elements-browser.tsx` gives: a variant carries its demo
 * *component*, and a function can't cross into a client component — so the page
 * passes the slug and this side resolves it.
 *
 * The same header the card carries, at the top of the window rather than the
 * top of a frame: fullscreen takes the border away, not the controls.
 */
function DemoStage({ slug }: { slug: string }) {
  const example = examplesWithDemos.find((item) => slugFor(item.name) === slug)
  const [active, setActive] = useState(0)

  /* Registered, built, and installable, but with no demo behind it — the same
     state `_demos.ts` drops from the rail. There is nothing to give the screen
     to, so this is a 404 rather than an empty page. */
  if (!example) notFound()

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden">
      <DemoToolbar
        variants={example.variants.map((variant) => variant.name)}
        active={active}
        onActiveChange={setActive}
        installCommand={example.installCommand}
        demoInstallCommand={example.demoInstallCommand}
        title={example.title}
        fullscreen
        /* The page, not the example's own URL: coming back to the rail with
           the list in front of you is the point of leaving. */
        fullscreenHref={basePath}
      />
      <div className="flex min-h-0 flex-1 items-center justify-center bg-dotted p-6 md:p-10">
        <DemosSwitcher variants={example.variants} active={active} />
      </div>
    </main>
  )
}

export { DemoStage }
