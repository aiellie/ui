"use client"

import * as React from "react"

import { Citation } from "@/components/aiellie-ui/inline-citation"
import { Response } from "@/components/aiellie-ui/response"
import { type Source } from "@/components/aiellie-ui/sources"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

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

/** The marks in the prose — hover one for the source, click it to go there. */
export function InlineCitationDemo() {
  return (
    <BubbleGroup className="w-full max-w-sm">
      <Bubble variant="ghost">
        <BubbleContent>
          <Response>
            {/* The marks sit tight against the word they follow: a newline
                before one in the source becomes a space in the sentence, and
                a citation floating off its own clause reads as a footnote to
                the full stop instead. */}
            <p>
              It shipped behind a flag on Tuesday and is on for staff only
              <Citation source={sources[0]} index={1} />. Marta asked for it to
              be held until the migration lands
              <Citation source={sources[1]} index={2} />, which is why{" "}
              <code>flags.rollout</code> still reads <code>staff</code> in
              production
              <Citation source={sources[2]} index={3} />.
            </p>
          </Response>
        </BubbleContent>
      </Bubble>
    </BubbleGroup>
  )
}
