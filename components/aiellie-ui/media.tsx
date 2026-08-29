"use client"

import * as React from "react"

import { field } from "@/components/aiellie-ui/actions"
import { cn } from "@/lib/utils"

/**
 * The frame a generated picture or clip arrives in.
 *
 * Generation is the one kind of content that is *expected* late: the frame
 * exists for the whole wait, holds its aspect so nothing under it moves when
 * the pixels land, and shimmers until they do. The shimmer is a layer under
 * the media rather than a state swapped out for it, so arrival is a fade
 * over the placeholder instead of a mount — the same rule the hover rows
 * follow: reveal by opacity, never by mounting.
 */

const LoadedContext = React.createContext<{
  loaded: boolean
  onLoaded: () => void
}>({ loaded: true, onLoaded: () => {} })

type MediaAspect = "square" | "video" | "portrait"

const ASPECTS: Record<MediaAspect, string> = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
}

export interface MediaFrameProps extends React.ComponentProps<"div"> {
  aspect?: MediaAspect
  /**
   * Nothing to show yet — the run is still going. The frame shimmers on its
   * own; without this it shimmers only until the media inside it loads.
   */
  busy?: boolean
}

export function MediaFrame({
  aspect = "square",
  busy = false,
  className,
  children,
  ...props
}: MediaFrameProps) {
  const [loaded, setLoaded] = React.useState(false)
  const onLoaded = React.useCallback(() => setLoaded(true), [])
  const context = React.useMemo(
    () => ({ loaded, onLoaded }),
    [loaded, onLoaded]
  )

  return (
    <LoadedContext.Provider value={context}>
      <div
        data-slot="media-frame"
        data-busy={busy || undefined}
        className={cn(
          field,
          "relative w-full overflow-hidden rounded-xl",
          ASPECTS[aspect],
          className
        )}
        {...props}
      >
        {/* The wait, drawn: tw-shimmer's background variant over the field
            surface. Hidden once something is on top of it rather than kept
            running under an opaque picture forever — and `motion-reduce`
            leaves the plain surface, which already says "not yet" by being
            empty. */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 transition-opacity duration-300 shimmer-bg motion-reduce:animate-none motion-reduce:transition-none",
            !busy && loaded && "opacity-0"
          )}
        />
        {children}
      </div>
    </LoadedContext.Provider>
  )
}

export interface MediaImageProps extends React.ComponentProps<"img"> {
  /** Required, not defaulted: a generated picture has no filename to lean on,
   * so the prompt that made it is the only honest description there is. */
  alt: string
}

export function MediaImage({ alt, className, ...props }: MediaImageProps) {
  const { loaded, onLoaded } = React.useContext(LoadedContext)

  return (
    // Plain img rather than next/image: this file is copied into projects
    // that are not necessarily Next ones, and the src is a data URL or a
    // provider's signed URL as often as it is anything optimisable.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-slot="media-image"
      alt={alt}
      onLoad={onLoaded}
      className={cn(
        "absolute inset-0 size-full object-cover transition-opacity duration-300 motion-reduce:transition-none",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
      {...props}
    />
  )
}

export interface MediaVideoProps extends React.ComponentProps<"video"> {
  /** What the clip shows, for anyone who cannot watch it. */
  label: string
}

export function MediaVideo({
  label,
  className,
  children,
  ...props
}: MediaVideoProps) {
  const { loaded, onLoaded } = React.useContext(LoadedContext)

  return (
    <video
      data-slot="media-video"
      aria-label={label}
      controls
      playsInline
      onLoadedData={onLoaded}
      className={cn(
        "absolute inset-0 size-full object-cover transition-opacity duration-300 motion-reduce:transition-none",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </video>
  )
}

/**
 * A word pinned to the frame's corner — "Sample", a duration, a size. Glass,
 * because it sits on a picture whose colours nobody chose in advance.
 */
export function MediaBadge({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="media-badge"
      className={cn(
        "absolute end-2 top-2 z-10 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium text-foreground/80 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}
