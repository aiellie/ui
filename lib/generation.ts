import { createGoogleGenerativeAI } from "@ai-sdk/google"
import {
  experimental_getVideoStatus,
  experimental_startVideo,
  generateImage,
} from "ai"

/**
 * Generation, from the browser, on the reader's own key.
 *
 * These run client-side on purpose: the demos are bring-your-own-key, and the
 * strongest promise a page can make about somebody else's credential is that
 * it never sees it — the key goes from their storage to Google and nowhere
 * else, which only holds if no server of ours is in the path. The AI SDK's
 * calls are plain `fetch` underneath, and Gemini's API answers browsers, so
 * nothing here needs a backend to stand behind it.
 *
 * Everything takes an `AbortSignal`, because a generator whose stop button
 * does not actually stop anything is a spinner with a decoration.
 */

export interface GeneratedMedia {
  /** An object URL — hand it straight to `src`. It lives until the page does;
   * a session's worth of generations is well inside what a tab can hold. */
  src: string
  mediaType: string
}

function toObjectUrl(bytes: Uint8Array, mediaType: string) {
  return URL.createObjectURL(new Blob([bytes as BlobPart], { type: mediaType }))
}

export const IMAGE_MODEL = "gemini-2.5-flash-image"

export async function generateImageWithGemini({
  apiKey,
  prompt,
  aspectRatio,
  signal,
}: {
  apiKey: string
  prompt: string
  /** `w:h`, as the ratio menu speaks it. */
  aspectRatio?: string
  signal?: AbortSignal
}): Promise<GeneratedMedia> {
  const google = createGoogleGenerativeAI({ apiKey })
  const result = await generateImage({
    model: google.image(IMAGE_MODEL),
    prompt,
    aspectRatio: aspectRatio as `${number}:${number}` | undefined,
    abortSignal: signal,
  })

  return {
    src: toObjectUrl(result.image.uint8Array, result.image.mediaType),
    mediaType: result.image.mediaType,
  }
}

export const VIDEO_MODEL = "veo-3.1-fast-generate-preview"

/** How long between asks. Veo runs take a minute or two; asking any faster
 * than this spends quota to learn nothing. */
const POLL_MS = 5_000

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = setTimeout(resolve, ms)
    signal?.addEventListener("abort", () => {
      clearTimeout(id)
      reject(
        signal.reason instanceof Error ? signal.reason : new Error("Stopped")
      )
    })
  })
}

export async function generateVideoWithGemini({
  apiKey,
  prompt,
  aspectRatio,
  signal,
  onPoll,
}: {
  apiKey: string
  prompt: string
  /** `w:h`, as the ratio menu speaks it. */
  aspectRatio?: string
  signal?: AbortSignal
  /** Fired on every ask, so a card can say the wait is being spent, not hung. */
  onPoll?: (elapsedMs: number) => void
}): Promise<GeneratedMedia> {
  const google = createGoogleGenerativeAI({ apiKey })
  const model = google.video(VIDEO_MODEL)

  /* Start-then-poll rather than one long await: video is minutes, not
     seconds, and the operation handle means a stop between polls costs
     nothing more than not asking again. */
  const { operation } = await experimental_startVideo({
    model,
    prompt,
    aspectRatio: aspectRatio as `${number}:${number}` | undefined,
    abortSignal: signal,
  })

  const startedAt = Date.now()
  for (;;) {
    await wait(POLL_MS, signal)
    onPoll?.(Date.now() - startedAt)

    const status = await experimental_getVideoStatus(model, {
      operation,
      abortSignal: signal,
    })

    if (status.status === "pending") continue
    if (status.status !== "completed") {
      throw new Error("The provider reported the run failed.")
    }

    const video = status.videos[0]
    if (!video) throw new Error("The run completed with nothing in it.")

    if (video.type === "base64") {
      const bytes = Uint8Array.from(atob(video.data), (c) => c.charCodeAt(0))
      return {
        src: toObjectUrl(bytes, video.mediaType),
        mediaType: video.mediaType,
      }
    }
    if (video.type === "url") {
      /* Gemini's file URLs are authorised by the key, and a <video> element
         cannot send headers — the query form is the one way a plain src can
         carry it. The fetch-and-rewrap keeps the key out of the DOM. */
      const url = video.url.includes("generativelanguage.googleapis.com")
        ? `${video.url}${video.url.includes("?") ? "&" : "?"}key=${apiKey}`
        : video.url
      const response = await fetch(url, { signal })
      if (!response.ok) {
        throw new Error(
          `Fetching the finished video failed (${response.status}).`
        )
      }
      const blob = await response.blob()
      return {
        src: URL.createObjectURL(blob),
        mediaType: video.mediaType || blob.type,
      }
    }
    // A binary payload: the remaining shape of VideoModelV4VideoData.
    return {
      src: toObjectUrl(video.data, video.mediaType),
      mediaType: video.mediaType,
    }
  }
}
