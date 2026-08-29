"use client"

import * as React from "react"

import {
  SourceItem,
  Sources,
  SourcesContent,
  SourcesTrigger,
  type Source,
} from "@/components/aiellie-ui/sources"

const sources: Source[] = [
  {
    id: "notes",
    title: "Rollout notes — week of the 12th",
    url: "https://example.com/notes/rollout",
    snippet:
      "Ship dark on Tuesday, staff first, everyone once the migration lands.",
  },
  {
    id: "thread",
    title: "#launch — Marta on holding the date",
    url: "https://example.com/threads/launch",
    origin: "Slack",
    snippet: "I'd rather hold it than turn it on over a half-finished index.",
  },
  {
    id: "flags",
    title: "flags.rollout in production",
    url: "https://example.com/flags/rollout",
    origin: "Dashboard",
  },
]

/** Folded and counted, the way it sits under an answer. */
export function SourcesDemo() {
  return (
    <Sources className="w-full max-w-sm">
      <SourcesTrigger count={sources.length} />
      <SourcesContent>
        {sources.map((source, index) => (
          <SourceItem key={source.id} source={source} index={index + 1} />
        ))}
      </SourcesContent>
    </Sources>
  )
}

/** The list open, for an answer that is mostly its sources. */
export function SourcesOpenDemo() {
  return (
    <Sources defaultOpen className="w-full max-w-sm">
      <SourcesTrigger count={sources.length} />
      <SourcesContent>
        {sources.map((source, index) => (
          <SourceItem key={source.id} source={source} index={index + 1} />
        ))}
      </SourcesContent>
    </Sources>
  )
}
