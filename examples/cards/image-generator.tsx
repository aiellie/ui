"use client"

import * as React from "react"
import {
  AiImageIcon,
  Cancel01Icon,
  Download01Icon,
  Image01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { type AddAction } from "@/components/aiellie-ui/composer/add-menu"
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@/components/aiellie-ui/composer/empty-state"
import {
  RatioMenu,
  RatioMenuContent,
  RatioMenuTrigger,
} from "@/components/aiellie-ui/composer/ratio-menu"
import {
  GeneratorCard,
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
import { cn } from "@/lib/utils"

/**
 * Where the reader's key lives. One storage key across every generator block,
 * so pasting it into one card arms them all.
 */
const GEMINI_KEY = "aiellie:gemini-key"

const painter = {
  name: "Painter",
  avatar: avatarFor("painter"),
  icon: AiImageIcon,
}

/** The frame each ratio takes — arbitrary values where the media element's
 * three named aspects do not reach. */
const RATIO_FRAMES: Record<string, string> = {
  "1:1": "aspect-square",
  "3:2": "aspect-[3/2]",
  "16:9": "aspect-video",
  "3:4": "aspect-[3/4]",
  "9:16": "aspect-[9/16]",
}

interface Run {
  id: number
  prompt: string
  status: "making" | "done" | "failed"
  ratio: string
  src?: string
  /** Painted by the sample service rather than a model — and it says so. */
  sample?: boolean
  /** The run this one took as its starting point. */
  referenceId?: number
  error?: string
}

/**
 * The image generator, whole: a block, not a gallery of states.
 *
 * It opens on its own explanation, takes prompts through the same composer a
 * chat uses — the plus holds the reference, the row under the field holds the
 * frame — and lives its states instead of exhibiting them: the empty state
 * until the first ask, the shimmer while a run goes, the picture when it
 * lands, the apology when it does not.
 *
 * Without a key the card paints an abstract from the sample service and wears
 * a "Sample" badge; with a Gemini key in the settings the same prompt runs on
 * the real model, from this browser, and nowhere else.
 */
export function ImageGeneratorDemo() {
  const [key] = useStoredKey(GEMINI_KEY)
  const [runs, setRuns] = React.useState<Run[]>([])
  const [ratio, setRatio] = React.useState("1:1")
  const [referenceId, setReferenceId] = React.useState<number>()
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

  const lastDone = [...runs].reverse().find((run) => run.status === "done")

  /* The plus holds the one thing an image run can be handed besides words:
     what to start from. Reported like any other entry; the block keeps the
     choice and pins it under the thread until it is used or dismissed. */
  const addActions: AddAction[] = [
    {
      id: "reference-last",
      group: "Reference",
      label: "Start from the last result",
      icon: Image01Icon,
      disabled: !lastDone,
      description: lastDone ? undefined : "Nothing has been made yet.",
    },
  ]

  const make = async (prompt: string) => {
    const id = (ids.current += 1)
    const controller = new AbortController()
    aborts.current.set(id, controller)
    const reference = referenceId
    setReferenceId(undefined)
    setRuns((list) => [
      ...list,
      {
        id,
        prompt,
        status: "making",
        ratio,
        sample: !key,
        referenceId: reference,
      },
    ])

    try {
      if (key) {
        const image = await generateImageWithGemini({
          apiKey: key,
          prompt,
          aspectRatio: ratio,
          signal: controller.signal,
        })
        patch(id, { status: "done", src: image.src })
      } else {
        /* The wait is part of the block: a sample that lands instantly skips
           the state the card exists to design for. */
        await new Promise((resolve, reject) => {
          const timer = setTimeout(resolve, 2_000 + Math.random() * 1_500)
          controller.signal.addEventListener("abort", () => {
            clearTimeout(timer)
            reject(new Error("Stopped"))
          })
        })
        patch(id, {
          status: "done",
          /* A reference seeds the sample near its source, so "start from the
             last result" visibly rhymes with it rather than being a claim. */
          src: sampleImageFor(prompt, (reference ?? 0) * 100 + id),
        })
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
      addActions={addActions}
      onAdd={(action) => {
        if (action.id === "reference-last" && lastDone) {
          setReferenceId(lastDone.id)
        }
      }}
      toolbar={
        <RatioMenu value={ratio} onValueChange={setRatio}>
          <RatioMenuTrigger showLabel />
          <RatioMenuContent side="top" />
        </RatioMenu>
      }
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
        <EmptyState size="sm" className="m-auto">
          <EmptyStateMedia>
            <HugeiconsIcon icon={AiImageIcon} />
          </EmptyStateMedia>
          <EmptyStateTitle>Ask for a picture</EmptyStateTitle>
          <EmptyStateDescription>
            The frame is set under the field, a reference lives behind the plus,
            and your own key goes in the settings — without one, the Painter
            does abstracts.
          </EmptyStateDescription>
        </EmptyState>
      ) : (
        runs.map((run) => (
          <GeneratorRun key={run.id} prompt={run.prompt}>
            {run.referenceId ? (
              <p className="text-[11px] text-muted-foreground">
                Starting from run {run.referenceId}
              </p>
            ) : null}
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
                busy={run.status === "making"}
                className={cn("max-w-64", RATIO_FRAMES[run.ratio])}
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

      {/* The chosen reference, pinned where the next run will start — dashed,
          because it is an offer not yet taken. */}
      {referenceId ? (
        <button
          type="button"
          onClick={() => setReferenceId(undefined)}
          className="flex w-fit items-center gap-1.5 rounded-full border border-dashed border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none"
        >
          Next run starts from run {referenceId}
          <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
        </button>
      ) : null}
    </GeneratorCard>
  )
}
