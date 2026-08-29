"use client"

import * as React from "react"
import { AiVideo01Icon } from "@hugeicons/core-free-icons"

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
  MediaVideo,
} from "@/components/aiellie-ui/media"
import { avatarFor, sampleImageFor } from "@/lib/avatars"
import { generateVideoWithGemini, VIDEO_MODEL } from "@/lib/generation"

/** The same storage key the image card uses: one paste arms every card. */
const GEMINI_KEY = "aiellie:gemini-key"

const director = {
  name: "Director",
  avatar: avatarFor("director"),
  icon: AiVideo01Icon,
}

interface Run {
  id: number
  prompt: string
  status: "making" | "done" | "failed"
  src?: string
  sample?: boolean
  error?: string
  /** How long the run has been going — video is minutes, and a wait with no
   * number on it reads as a hang. */
  elapsed?: number
}

/**
 * A run of frames standing in for footage. The sample service cannot film
 * anything, so sample mode is honest about what it is: a storyboard, four
 * stills from the same prompt shown in turn. The frames swap without a fade
 * for anyone who asked for less motion — a slideshow is a clock, not an
 * ornament.
 */
function SampleStoryboard({ prompt, seed }: { prompt: string; seed: number }) {
  const frames = [0, 1, 2, 3].map((frame) =>
    sampleImageFor(prompt, seed * 10 + frame)
  )
  const [frame, setFrame] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % frames.length), 2000)
    return () => clearInterval(id)
  }, [frames.length])

  return (
    <>
      {frames.map((src, index) => (
        <MediaImage
          key={src}
          src={src}
          alt={index === 0 ? `Sample storyboard: ${prompt}` : ""}
          aria-hidden={index !== 0 || undefined}
          className={
            index === frame
              ? "opacity-100 transition-opacity duration-700 motion-reduce:transition-none"
              : "opacity-0 transition-opacity duration-700 motion-reduce:transition-none"
          }
        />
      ))}
    </>
  )
}

const seconds = (ms: number) => `${Math.round(ms / 1000)}s`

export function VideoGeneratorDemo() {
  const [key] = useStoredKey(GEMINI_KEY)
  const [runs, setRuns] = React.useState<Run[]>([])
  const ids = React.useRef(0)
  const aborts = React.useRef(new Map<number, AbortController>())

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
    setRuns((list) => [
      ...list,
      { id, prompt, status: "making", sample: !key, elapsed: 0 },
    ])

    try {
      if (key) {
        const video = await generateVideoWithGemini({
          apiKey: key,
          prompt,
          signal: controller.signal,
          onPoll: (elapsed) => patch(id, { elapsed }),
        })
        patch(id, { status: "done", src: video.src })
      } else {
        /* A shorter wait than the real thing, but not none: the elapsed
           readout is a state worth seeing too. Counted rather than stamped —
           a second per tick is exactly true enough for a readout in whole
           seconds, and it keeps the clock out of the component. */
        let elapsed = 0
        const ticker = setInterval(() => {
          elapsed += 1_000
          patch(id, { elapsed })
        }, 1000)
        try {
          await new Promise((resolve, reject) => {
            const timer = setTimeout(resolve, 4_000 + Math.random() * 2_000)
            controller.signal.addEventListener("abort", () => {
              clearTimeout(timer)
              reject(new Error("Stopped"))
            })
          })
        } finally {
          clearInterval(ticker)
        }
        patch(id, { status: "done" })
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
      persona={director}
      busy={busy}
      onPrompt={make}
      onStop={() => aborts.current.forEach((controller) => controller.abort())}
      placeholder="Describe a shot…"
      className="max-w-md"
      settings={
        <div className="flex flex-col gap-2">
          <KeyField
            storageKey={GEMINI_KEY}
            label="Gemini API key"
            hint="Kept in this browser's storage and sent only to Google. Without one, the Director storyboards."
          />
          <p className="text-[11px] text-muted-foreground">
            With a key, prompts run on{" "}
            <code className="font-mono">{VIDEO_MODEL}</code> — a real render
            takes a minute or two.
          </p>
        </div>
      }
    >
      {runs.length === 0 ? (
        <GeneratorEmpty>
          Describe a shot. No key? The Director storyboards it instead.
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
              <MediaFrame aspect="video" busy={run.status === "making"}>
                {run.status === "done" && run.sample ? (
                  <>
                    <MediaBadge>Sample storyboard</MediaBadge>
                    <SampleStoryboard prompt={run.prompt} seed={run.id} />
                  </>
                ) : null}
                {run.status === "done" && !run.sample && run.src ? (
                  <MediaVideo
                    src={run.src}
                    label={`Generated: ${run.prompt}`}
                  />
                ) : null}
              </MediaFrame>
            )}
            {run.status === "making" ? (
              <p className="text-[11px] text-muted-foreground tabular-nums">
                Rendering — {seconds(run.elapsed ?? 0)}
              </p>
            ) : null}
          </GeneratorRun>
        ))
      )}
    </GeneratorCard>
  )
}
