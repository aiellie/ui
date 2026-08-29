"use client"

import * as React from "react"

import {
  Transcript,
  TranscriptSegment,
} from "@/components/aiellie-ui/audio/transcript"

/**
 * A call being written down as it happens. Each line arrives as a shimmering
 * guess that grows word by word, then settles into ink when the recogniser
 * commits — which is the state a transcriber lives in and the one this
 * element exists to draw. Loops.
 */

const SCRIPT: { speaker: string; text: string }[] = [
  { speaker: "Marta", text: "Did the flag land in the end?" },
  { speaker: "You", text: "Last night, behind rollout dot tuesday." },
  { speaker: "Marta", text: "Staff first, or everyone at once?" },
  { speaker: "You", text: "Staff first — everyone on Thursday." },
  { speaker: "Marta", text: "Good, I'll warn support this afternoon." },
]

/** Beats per line: its word count while interim, plus one settled beat. */
const BEATS = SCRIPT.map((line) => line.text.split(" ").length + 1)
const TOTAL = BEATS.reduce((sum, beats) => sum + beats, 0) + 4

export function TranscriptDemo() {
  const [beat, setBeat] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => setBeat((b) => (b + 1) % TOTAL), 380)
    return () => clearInterval(id)
  }, [])

  /* Walk the script with what is left of the clock: everything before the
     cursor is settled, the line under it shows only the words that have
     arrived, everything after does not exist yet. */
  let remaining = beat
  const lines: {
    speaker: string
    text: string
    interim: boolean
  }[] = []
  for (let i = 0; i < SCRIPT.length; i++) {
    const line = SCRIPT[i]
    const words = line.text.split(" ")
    if (remaining >= BEATS[i]) {
      lines.push({ speaker: line.speaker, text: line.text, interim: false })
      remaining -= BEATS[i]
      continue
    }
    if (remaining > 0) {
      lines.push({
        speaker: line.speaker,
        text: words.slice(0, remaining).join(" "),
        interim: true,
      })
    }
    break
  }

  return (
    <div className="w-full max-w-sm">
      <Transcript>
        {lines.map((line, index) => (
          <TranscriptSegment
            key={index}
            speaker={line.speaker}
            interim={line.interim}
          >
            {line.text}
          </TranscriptSegment>
        ))}
      </Transcript>
    </div>
  )
}

/** The two states side by side and standing still, for reading the design
 * rather than catching it. */
export function TranscriptStatesDemo() {
  return (
    <div className="w-full max-w-sm">
      <Transcript>
        <TranscriptSegment speaker="Marta">
          Did the flag land in the end?
        </TranscriptSegment>
        <TranscriptSegment speaker="You">
          Last night, behind rollout dot tuesday.
        </TranscriptSegment>
        <TranscriptSegment speaker="Marta" interim>
          Staff first, or every
        </TranscriptSegment>
      </Transcript>
    </div>
  )
}
