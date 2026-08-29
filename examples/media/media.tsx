"use client"

import * as React from "react"

import {
  MediaBadge,
  MediaFrame,
  MediaImage,
} from "@/components/aiellie-ui/media"
import { sampleImageFor } from "@/lib/avatars"

/**
 * The frame in its three moments: waiting with nothing, waiting over a
 * picture still arriving, and settled with the badge saying what the picture
 * is. Together, because the point of the frame is that nothing around it
 * moves as one moment becomes the next.
 */
export function MediaDemo() {
  return (
    <div className="grid w-full max-w-lg grid-cols-3 items-start gap-3">
      <MediaFrame busy aspect="square" />
      <MediaFrame aspect="square">
        <MediaImage
          src={sampleImageFor("a marble made of dusk")}
          alt="A sample abstract"
        />
      </MediaFrame>
      <MediaFrame aspect="square">
        <MediaBadge>Sample</MediaBadge>
        <MediaImage
          src={sampleImageFor("a marble made of noon")}
          alt="A sample abstract, badged"
        />
      </MediaFrame>
    </div>
  )
}

/** The shapes a generation is asked into, holding their room while empty. */
export function MediaAspectsDemo() {
  return (
    <div className="flex w-full max-w-lg items-start gap-3">
      <MediaFrame busy aspect="square" className="flex-1" />
      <MediaFrame busy aspect="video" className="flex-2" />
      <MediaFrame busy aspect="portrait" className="flex-1" />
    </div>
  )
}
