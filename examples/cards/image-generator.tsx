"use client"

import * as React from "react"
import { AiImageIcon, Download01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  GeneratorCard,
  GeneratorEmpty,
  GeneratorRun,
} from "@/components/aiellie-ui/generator-card"
import { KeyField, useStoredKey } from "@/components/aiellie-ui/key-field"
import {
  MediaBadge,
  MediaFrame,
  MediaImage,
} from "@/components/aiellie-ui/media"
import {
  MessageAction,
  MessageActions,
} from "@/components/aiellie-ui/message-actions"
import { avatarFor, sampleImageFor } from "@/lib/avatars"
import { generateImageWithGemini, IMAGE_MODEL } from "@/lib/generation"

/**
 * Where the reader's key lives. One storage key across every generator demo,
 * so pasting it into one card arms them all.
 */
const GEMINI_KEY = "aiellie:gemini-key"

const painter = {
  name: "Painter",
  avatar: avatarFor("painter"),
  icon: AiImageIcon,
}

interface Run {
  id: number
  prompt: string
  status: "making" | "done" | "failed"
  src?: string
  /** Painted by the sample service rather than a model — and it says so. */
  sample?: boolean
  error?: string
}

/**
 * A generator anyone can try, and a real one for anyone with a key.
 *
 * Without a key the card paints an abstract from the sample service, waits a
 * believable moment, and wears a "Sample" badge — so the interaction can be
 * felt (typed into, waited on, given something back) with no credential and
 * no cost. With a Gemini key in the settings, the same prompt goes to
 * `gemini-2.5-flash-image` from this browser, and nowhere else.
 */
export function ImageGeneratorDemo() {
  const [key] = useStoredKey(GEMINI_KEY)
  const [runs, setRuns] = React.useState<Run[]>([])
  const ids = React.useRef(0)
  const aborts = React.useRef(new Map<number, AbortController>())

  /* Every timer and in-flight call dies with the card: a demo scrolled off
     the page must not keep painting into a thread nobody can see. */
  React.useEffect(() => {
    const running = aborts.current
    return () => running.forEach((controller) => controller.abort())
  }, [])

  const patch = (id: number, changes: Partial<Run>) =>
    setRuns((list) =>
      list.map((run) => (run.id === id ? { ...run, ...changes } : run))
    )

  const make = async (prompt: string) => {
    const id = (ids.current += 1)
    const controller = new AbortController()
    aborts.current.set(id, controller)
    setRuns((list) => [...list, { id, prompt, status: "making", sample: !key }])

    try {
      if (key) {
        const image = await generateImageWithGemini({
          apiKey: key,
          prompt,
          signal: controller.signal,
        })
        patch(id, { status: "done", src: image.src })
      } else {
        /* The wait is part of the demo: a sample that lands instantly skips
           the state the card exists to design for. */
        await new Promise((resolve, reject) => {
          const timer = setTimeout(resolve, 2_000 + Math.random() * 1_500)
          controller.signal.addEventListener("abort", () => {
            clearTimeout(timer)
            reject(new Error("Stopped"))
          })
        })
        patch(id, { status: "done", src: sampleImageFor(prompt, id) })
      }
    } catch (error) {
      if (controller.signal.aborted) {
        setRuns((list) => list.filter((run) => run.id !== id))
      } else {
        patch(id, {
          status: "failed",
          error: error instanceof Error ? error.message : "The run went wrong.",
        })
      }
    } finally {
      aborts.current.delete(id)
    }
  }

  const busy = runs.some((run) => run.status === "making")

  return (
    <GeneratorCard
      persona={painter}
      busy={busy}
      onPrompt={make}
      onStop={() => aborts.current.forEach((controller) => controller.abort())}
      placeholder="Describe a picture…"
      settings={
        <div className="flex flex-col gap-2">
          <KeyField
            storageKey={GEMINI_KEY}
            label="Gemini API key"
            hint="Kept in this browser's storage and sent only to Google. Without one, the card paints samples."
          />
          <p className="text-[11px] text-muted-foreground">
            With a key, prompts run on{" "}
            <code className="font-mono">{IMAGE_MODEL}</code>.
          </p>
        </div>
      }
    >
      {runs.length === 0 ? (
        <GeneratorEmpty>
          Ask for anything. No key? The Painter does abstracts.
        </GeneratorEmpty>
      ) : (
        runs.map((run) => (
          <GeneratorRun key={run.id} prompt={run.prompt}>
            {run.status === "failed" ? (
              <p className="text-xs text-destructive">
                {run.error ?? "The run went wrong."}{" "}
                <button
                  type="button"
                  className="underline underline-offset-2"
                  onClick={() => {
                    setRuns((list) => list.filter((r) => r.id !== run.id))
                    void make(run.prompt)
                  }}
                >
                  Try again
                </button>
              </p>
            ) : (
              <MediaFrame
                aspect="square"
                busy={run.status === "making"}
                className="max-w-64"
              >
                {run.sample && run.status === "done" ? (
                  <MediaBadge>Sample</MediaBadge>
                ) : null}
                {run.src ? (
                  <MediaImage src={run.src} alt={`Generated: ${run.prompt}`} />
                ) : null}
              </MediaFrame>
            )}
            {run.status === "done" && run.src ? (
              <MessageActions aria-label="Image actions">
                <MessageAction
                  tooltip="Download"
                  onClick={() => {
                    const anchor = document.createElement("a")
                    anchor.href = run.src as string
                    anchor.download = `${run.prompt.slice(0, 40)}.png`
                    anchor.click()
                  }}
                >
                  <HugeiconsIcon icon={Download01Icon} />
                </MessageAction>
              </MessageActions>
            ) : null}
          </GeneratorRun>
        ))
      )}
    </GeneratorCard>
  )
}

/**
 * The three shapes a run can be in, side by side and standing still — the
 * states are the design surface, and a page should be able to read them
 * without catching a live one at the right moment.
 */
export function ImageGeneratorStatesDemo() {
  return (
    <GeneratorCard persona={painter} busy placeholder="Describe a picture…">
      <GeneratorRun prompt="A marble made of dusk">
        <MediaFrame aspect="square" className="max-w-64">
          <MediaBadge>Sample</MediaBadge>
          <MediaImage
            src={sampleImageFor("a marble made of dusk")}
            alt="Generated: a marble made of dusk"
          />
        </MediaFrame>
      </GeneratorRun>
      <GeneratorRun prompt="The same, but at noon">
        <MediaFrame aspect="square" busy className="max-w-64" />
      </GeneratorRun>
      <GeneratorRun prompt="Now as an oil painting">
        <p className="text-xs text-destructive">
          The provider refused the prompt.{" "}
          <button type="button" className="underline underline-offset-2">
            Try again
          </button>
        </p>
      </GeneratorRun>
    </GeneratorCard>
  )
}
