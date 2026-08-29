"use client"

import * as React from "react"
import { MeshGradient } from "@paper-design/shaders-react"

import { cn } from "@/lib/utils"

/**
 * Moving colour to stand things on: the house indigo, folding over itself.
 *
 * A backdrop, not a picture — the defaults keep to one hue family so glass
 * surfaces sitting on it stay legible, and the motion sits at a walking
 * pace because a background that demands watching has changed jobs. The
 * children render above the shader, so the same component is the panel on
 * its own and the wash behind a whole card.
 */

/** One family, four weights — the site's own primary and its tints, so the
 * gradient reads as the brand breathing rather than as a screensaver. */
const BRAND_COLORS = ["#4f46e5", "#818cf8", "#c7d2fe", "#e0e7ff"]

export interface MeshGradientBackgroundProps extends React.ComponentProps<"div"> {
  colors?: string[]
  /** Walking pace by default. 0 stands still. */
  speed?: number
  distortion?: number
  swirl?: number
}

export function MeshGradientBackground({
  colors = BRAND_COLORS,
  speed = 0.5,
  distortion = 0.8,
  swirl = 0.6,
  className,
  children,
  ...props
}: MeshGradientBackgroundProps) {
  /* One `prefers-reduced-motion` read, kept live: a shader animating at any
     speed is motion, and the CSS escape hatches cannot reach a WebGL clock. */
  const still = React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)")
      query.addEventListener("change", onChange)
      return () => query.removeEventListener("change", onChange)
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  )

  return (
    <div
      data-slot="mesh-gradient"
      className={cn(
        "relative h-64 w-full overflow-hidden rounded-2xl border border-border/60",
        className
      )}
      {...props}
    >
      <MeshGradient
        className="absolute inset-0 size-full"
        colors={colors}
        distortion={distortion}
        swirl={swirl}
        speed={still ? 0 : speed}
      />
      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : null}
    </div>
  )
}
