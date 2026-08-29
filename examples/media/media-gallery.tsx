"use client"

import * as React from "react"

import {
  MediaGallery,
  MediaGalleryItem,
} from "@/components/aiellie-ui/media-gallery"
import { MediaFrame, MediaImage } from "@/components/aiellie-ui/media"
import { sampleImageFor } from "@/lib/avatars"

const PROMPT = "a lighthouse in a violet storm"

/**
 * Four variations, one chosen. The choice lives out here because picking a
 * variation is usually the same event as doing something with it — which the
 * caption underneath stands in for.
 */
export function MediaGalleryDemo() {
  const [selected, setSelected] = React.useState(0)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <MediaGallery columns={2}>
        {[0, 1, 2, 3].map((variation) => (
          <MediaGalleryItem
            key={variation}
            selected={selected === variation}
            onClick={() => setSelected(variation)}
            aria-label={`Variation ${variation + 1}`}
          >
            <MediaFrame aspect="square" className="rounded-none">
              <MediaImage
                src={sampleImageFor(PROMPT, variation + 1)}
                alt={`Variation ${variation + 1} of: ${PROMPT}`}
              />
            </MediaFrame>
          </MediaGalleryItem>
        ))}
      </MediaGallery>
      <p className="text-[11px] text-muted-foreground">
        Variation {selected + 1} will be upscaled.
      </p>
    </div>
  )
}

/** A filmstrip: the same pick, laid out for a row of takes. */
export function MediaGalleryStripDemo() {
  const [selected, setSelected] = React.useState(1)

  return (
    <MediaGallery columns={4} className="max-w-md">
      {[0, 1, 2, 3].map((take) => (
        <MediaGalleryItem
          key={take}
          selected={selected === take}
          onClick={() => setSelected(take)}
          aria-label={`Take ${take + 1}`}
        >
          <MediaFrame aspect="portrait" className="rounded-none">
            <MediaImage
              src={sampleImageFor("takes of a dusk marble", take + 10)}
              alt={`Take ${take + 1}`}
            />
          </MediaFrame>
        </MediaGalleryItem>
      ))}
    </MediaGallery>
  )
}
