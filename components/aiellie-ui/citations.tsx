"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import { ArrowDown01Icon, LinkSquare02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { collapsePanel } from "@/components/aiellie-ui/actions"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface Source {
  id: string
  /** What it is called, which is what a reader recognises it by. */
  title: string
  url: string
  /** Where it came from — a domain, a repository, a file path. */
  origin?: string
  /** The line the answer actually took from it. */
  snippet?: string
}

/** The host, for a source that has not been given an origin of its own. */
function originOf(source: Source) {
  if (source.origin) return source.origin
  try {
    return new URL(source.url).hostname.replace(/^www\./, "")
  } catch {
    return source.url
  }
}

export interface CitationProps extends Omit<
  React.ComponentProps<"a">,
  "children"
> {
  source: Source
  /** Its place in the list under the answer, which is what the chip shows. */
  index: number
}

/**
 * A numbered mark in the prose, pointing at one of the sources listed under the
 * answer.
 *
 * Small, and the number rather than the name: a citation interrupts a sentence,
 * and a sentence with three domain names dropped into it is no longer a
 * sentence. The name is a hover away and a click away, which is where it
 * belongs.
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

/**
 * What the answer was drawn from, under it.
 *
 * Folded by default and counted on the trigger: the list is a claim about where
 * the answer came from, and a reader either takes that claim on trust or wants
 * to check it — but they read the answer first either way.
 */
export function Sources({ className, ...props }: Collapsible.Root.Props) {
  return (
    <Collapsible.Root
      data-slot="sources"
      className={cn("w-full max-w-lg", className)}
      {...props}
    />
  )
}

export function SourcesTrigger({
  count,
  children,
  className,
  ...props
}: Collapsible.Trigger.Props & { count?: number }) {
  return (
    <Collapsible.Trigger
      data-slot="sources-trigger"
      className={cn(
        "group/sources flex w-fit cursor-pointer items-center gap-1.5 rounded-lg py-1 pe-2 text-xs text-muted-foreground transition-colors duration-150 outline-none hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/50 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <HugeiconsIcon icon={LinkSquare02Icon} className="size-3.5 shrink-0" />
      <span>
        {children ?? (count === 1 ? "1 source" : `${count ?? 0} sources`)}
      </span>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        className="size-3.5 shrink-0 transition-transform duration-200 group-data-[panel-open]/sources:rotate-180 motion-reduce:transition-none"
      />
    </Collapsible.Trigger>
  )
}

export function SourcesContent({
  className,
  children,
  ...props
}: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="sources-content"
      className={cn(collapsePanel, className)}
      {...props}
    >
      <ol className="mt-1 flex flex-col gap-1">{children}</ol>
    </Collapsible.Panel>
  )
}

/**
 * One source. The number is the same one the prose carries, so a reader who
 * followed a mark down here lands on something they recognise rather than
 * having to match titles.
 */
export function SourceItem({
  source,
  index,
  className,
  ...props
}: Omit<React.ComponentProps<"li">, "children"> & {
  source: Source
  index: number
}) {
  return (
    <li data-slot="source-item" className={cn("min-w-0", className)} {...props}>
      <a
        href={source.url}
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-start gap-2 rounded-lg px-2 py-1.5 no-underline transition-colors duration-150 outline-none hover:bg-foreground/[0.04] focus-visible:ring-1 focus-visible:ring-ring/50 motion-reduce:transition-none dark:hover:bg-foreground/[0.06]"
      >
        <span className="mt-px inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-foreground/[0.08] px-1 text-[10px] font-medium text-muted-foreground tabular-nums dark:bg-foreground/[0.12]">
          {index}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-xs font-medium">{source.title}</span>
          {source.snippet ? (
            <span className="line-clamp-2 text-[11px] text-muted-foreground">
              {source.snippet}
            </span>
          ) : null}
          <span className="truncate text-[11px] text-muted-foreground/70">
            {originOf(source)}
          </span>
        </span>
      </a>
    </li>
  )
}
