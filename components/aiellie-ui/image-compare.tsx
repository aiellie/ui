"use client"

import * as React from "react"

import { field } from "@/components/aiellie-ui/actions"
import { cn } from "@/lib/utils"

/**
 * Two versions of one picture under a divider the reader drags.
 *
 * The question a re-generation raises — what did the new prompt actually
 * change — is not answered by two pictures side by side, because the eye
 * cannot hold one while reading the other. It is answered by one picture
 * that becomes the other under the pointer, which is what this is.
 *
 * The whole surface is driven by a real `<input type="range">` laid over it:
 * dragging anywhere moves the divider, arrow keys move it from the keyboard,
 * and a screen reader gets a slider with a name and a percentage instead of
 * silence. A hand-rolled drag would need every one of those bolted back on.
 */

type ImageCompareContextValue = {
  /** Where the divider stands, 0–100 from the start edge. */
  position: number
}

const ImageCompareContext = React.createContext<ImageCompareContextValue>({
  position: 50,
})

export interface ImageCompareProps extends React.ComponentProps<"div"> {
  position?: number
  defaultPosition?: number
  onPositionChange?: (position: number) => void
  /** The frame's shape, since the pictures fill whatever they are given. */
  aspect?: "square" | "video" | "portrait"
  /** What the slider is called to assistive tech. */
  label?: string
}

const ASPECTS = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
} as const

export function ImageCompare({
  position: positionProp,
  defaultPosition = 50,
  onPositionChange,
  aspect = "square",
  label = "Compare versions",
  className,
  children,
  ...props
}: ImageCompareProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultPosition)
  const position = positionProp ?? uncontrolled

  const context = React.useMemo(() => ({ position }), [position])

  return (
    <ImageCompareContext.Provider value={context}>
      {/* `dir="ltr"` for the reason the code blocks give: the content has no
          reading direction — a photograph reads the same both ways — and the
          clip-path under the divider only speaks physical sides. Pinning the
          whole stack keeps the slider, the divider and the clip agreeing in
          an RTL page without mirroring anybody's picture. */}
      <div
        data-slot="image-compare"
        dir="ltr"
        className={cn(
          field,
          "group/compare relative w-full overflow-hidden rounded-xl",
          ASPECTS[aspect],
          className
        )}
        {...props}
      >
        {children}

        {/* The divider: a hairline the handle rides, drawn after the images
            so it sits over both. Purely presentational — the range under it
            is the control. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/60 bg-background shadow-sm transition-transform duration-150 group-focus-within/compare:scale-110 motion-reduce:transition-none" />
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          aria-label={label}
          onChange={(event) => {
            const next = Number(event.target.value)
            if (positionProp === undefined) setUncontrolled(next)
            onPositionChange?.(next)
          }}
          /* Invisible but everywhere: the track is the whole picture, so a
             press lands where it lands and the thumb comes to it. */
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 outline-none"
        />
      </div>
    </ImageCompareContext.Provider>
  )
}

export interface ImageCompareImageProps extends React.ComponentProps<"img"> {
  alt: string
}

/** The earlier version, underneath, whole. */
export function ImageCompareBefore({
  alt,
  className,
  ...props
}: ImageCompareImageProps) {
  return (
    // A plain img rather than next/image: this file is copied into projects
    // that are not necessarily Next ones.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-slot="image-compare-before"
      alt={alt}
      draggable={false}
      className={cn(
        "absolute inset-0 size-full object-cover select-none",
        className
      )}
      {...props}
    />
  )
}

/**
 * The later version, on top, clipped at the divider — clipped rather than
 * resized, so the two stay pixel-aligned and the divider reveals instead of
 * squashing.
 */
export function ImageCompareAfter({
  alt,
  className,
  ...props
}: ImageCompareImageProps) {
  const { position } = React.useContext(ImageCompareContext)

  return (
    // eslint-disable-next-line @next/next/no-img-element -- as above.
    <img
      data-slot="image-compare-after"
      alt={alt}
      draggable={false}
      /* The left inset is the divider: everything right of it is the later
         version, which keeps the After label's corner honest and means
         dragging the handle right reveals more of what it used to be. */
      style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      className={cn(
        "absolute inset-0 size-full object-cover select-none",
        className
      )}
      {...props}
    />
  )
}

/**
 * The word pinned to each half — "Before" at the start, "After" at the end —
 * in the corner its half keeps whatever the divider does.
 */
export function ImageCompareLabel({
  side = "start",
  className,
  ...props
}: React.ComponentProps<"span"> & { side?: "start" | "end" }) {
  return (
    <span
      data-slot="image-compare-label"
      data-side={side}
      className={cn(
        "pointer-events-none absolute top-2 z-10 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium text-foreground/80 backdrop-blur-sm",
        side === "start" ? "start-2" : "end-2",
        className
      )}
      {...props}
    />
  )
}
