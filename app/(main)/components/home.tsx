"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight01Icon, Github01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  CodeSnippet,
  type PackageManager,
} from "@/components/aiellie-ui/code/code-snippet"
import { Button } from "@/components/ui/button"
import { AgentCardDemo } from "@/examples/cards/agent"
import { ChatCardDemo } from "@/examples/cards/chat-card"
import { ImageGeneratorDemo } from "@/examples/cards/image-generator"

/**
 * The front door, and the argument in one screen: say what the registry is in
 * a line, then let three of its cards do the talking — a chat arriving, a
 * generator waiting to be asked, an agent stopping to ask permission. Live
 * cards rather than screenshots, because "every state is designed" is a
 * claim screenshots cannot make.
 *
 * A client file for the same reason `elements-browser.tsx` is one: the cards
 * are components, and a resolved component cannot cross the server boundary.
 */

const INSTALL = "shadcn@latest add https://ui.aiellie.dev/r/chat-card.json"

function InstallLine() {
  const [copied, setCopied] = React.useState(false)
  const [manager, setManager] = React.useState<PackageManager>("npm")

  React.useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(id)
  }, [copied])

  return (
    <CodeSnippet
      command={INSTALL}
      manager={manager}
      onManagerChange={setManager}
      copied={copied}
      onCopy={() => setCopied(true)}
      className="w-full max-w-xl"
    />
  )
}

export function Home() {
  return (
    <div className="flex flex-col gap-14 px-6 pt-16 pb-24 md:pt-24">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-start gap-5">
        {/* The name, not the mechanism: what kind of registry this is can be
            read off the install line two inches down. */}
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          aiellie ui
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          The elements an AI chat is made of.
        </h1>
        <p className="max-w-xl text-base text-pretty text-muted-foreground">
          Messages, composers, code, tool calls, agents — built on Base UI for
          React 19, every state designed, and each one installable on its own as
          source you keep.
        </p>

        <InstallLine />

        <div className="flex items-center gap-2">
          {/* `nativeButton={false}` because these really are links wearing the
              button's clothes — Base UI otherwise expects a <button> and says
              so, loudly, in the console. */}
          <Button nativeButton={false} render={<Link href="/elements" />}>
            Browse the elements
            <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <a
                href="https://github.com/aiellie/ui"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <HugeiconsIcon icon={Github01Icon} data-icon="inline-start" />
            GitHub
          </Button>
        </div>
      </section>

      {/* The proof. Three cards, live: try the composer, answer the agent's
          question, ask the Painter for something. */}
      <section
        aria-label="Live examples"
        className="mx-auto grid w-full max-w-6xl items-start justify-items-center gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <ChatCardDemo />
        <ImageGeneratorDemo />
        <div className="md:col-span-2 xl:col-span-1 xl:justify-self-center">
          <AgentCardDemo />
        </div>
      </section>

      <p className="mx-auto text-xs text-muted-foreground">
        40 elements · MIT · generated docs on every card ·{" "}
        <Link
          href="/elements"
          className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground motion-reduce:transition-none"
        >
          see all of them
        </Link>
      </p>
    </div>
  )
}
