"use client"

import * as React from "react"

import { originOf, type Source } from "@/components/aiellie-ui/sources"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface CitationProps extends Omit<
  React.ComponentProps<"a">,
  "children"
> {
  source: Source
  /** Its place in the list under the answer, which is what the chip shows. */
  index: number
}

/**
 * A numbered mark in the prose, pointing at one of the sources listed under
 * the answer — the `sources` element is the list it points at, and the number
 * here is the number there.
 *
 * Small, and the number rather than the name: a citation interrupts a
 * sentence, and a sentence with three domain names dropped into it is no
 * longer a sentence. The name is a hover away and a click away, which is
 * where it belongs.
 *
 * A real link, so the usual things work on it — a middle click, a long press,
 * a copied address — none of which survive a div with a handler.
 */
export function Citation({
  source,
  index,
  className,
  ...props
}: CitationProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <a
              data-slot="citation"
              href={source.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Source ${index}: ${source.title}`}
              className={cn(
                "mx-0.5 inline-flex h-4 min-w-4 -translate-y-px cursor-pointer items-center justify-center rounded-full bg-foreground/[0.08] px-1 align-middle text-[10px] font-medium text-muted-foreground tabular-nums no-underline transition-colors duration-150 hover:bg-foreground/[0.14] hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/50 motion-reduce:transition-none dark:bg-foreground/[0.12] dark:hover:bg-foreground/[0.2]",
                className
              )}
              {...props}
            >
              {index}
            </a>
          }
        />
        <TooltipContent side="top" className="max-w-xs flex-col items-start">
          <span className="font-medium">{source.title}</span>
          <span className="opacity-70">{originOf(source)}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
