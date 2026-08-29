"use client"

import * as React from "react"

import {
  ImageCompare,
  ImageCompareAfter,
  ImageCompareBefore,
  ImageCompareLabel,
} from "@/components/aiellie-ui/image-compare"
import { sampleImageFor } from "@/lib/avatars"

/**
 * A re-generation against its source: drag the divider, or focus it and use
 * the arrow keys — the whole surface is one real slider.
 */
export function ImageCompareDemo() {
  return (
    <ImageCompare
      aspect="square"
      className="max-w-sm"
      label="Compare the two versions"
    >
      <ImageCompareBefore
        src={sampleImageFor("a marble made of dusk")}
        alt="The first version"
      />
      <ImageCompareAfter
        src={sampleImageFor("a marble made of dusk", 7)}
        alt="The re-generated version"
      />
      <ImageCompareLabel side="start">Before</ImageCompareLabel>
      <ImageCompareLabel side="end">After</ImageCompareLabel>
    </ImageCompare>
  )
}

/** Held by the caller — here parked near the start so the change leads. */
export function ImageCompareControlledDemo() {
  const [position, setPosition] = React.useState(24)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <ImageCompare
        aspect="video"
        position={position}
        onPositionChange={setPosition}
        label="Compare the two crops"
      >
        <ImageCompareBefore
          src={sampleImageFor("a wide marble evening")}
          alt="The first crop"
        />
        <ImageCompareAfter
          src={sampleImageFor("a wide marble evening", 3)}
          alt="The recoloured crop"
        />
      </ImageCompare>
      <p className="text-[11px] text-muted-foreground tabular-nums">
        Divider at {position}%.
      </p>
    </div>
  )
}
