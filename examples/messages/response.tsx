"use client"

import {
  Response,
  ResponseCodeBlock,
  ResponseTable,
} from "@/components/aiellie-ui/response"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

const sample = `export function useNow(live: boolean) {
  // One clock per interval, shared by every stamp reading it.
  const clock = clockFor(live ? 60_000 : 0)
  return useSyncExternalStore(clock.subscribe, clock.getSnapshot)
}`

export function ResponseDemo() {
  return (
    <BubbleGroup className="w-full max-w-sm">
      <Bubble align="end">
        <BubbleContent>How does the rollout work?</BubbleContent>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent>
          <Response>
            <p>
              It ships dark on Tuesday and goes on for staff first. Three things
              have to be true before the flag turns on:
            </p>
            <ul>
              <li>The migration has landed and been verified.</li>
              <li>
                <strong>Marta</strong> has signed off on the copy.
              </li>
              <li>
                <code>flags.rollout</code> reads <code>staff</code> in
                production.
              </li>
            </ul>
            <blockquote>
              If any of the three is still open on Monday, it waits a week.
            </blockquote>
            <p>
              The <a href="#">rollout note</a> has the full order of operations.
            </p>
          </Response>
        </BubbleContent>
      </Bubble>
    </BubbleGroup>
  )
}

export function ResponseCodeDemo() {
  return (
    <Bubble variant="ghost" className="w-full max-w-sm">
      <BubbleContent>
        <Response>
          <h2>Reading the clock</h2>
          <p>
            The stamps share one clock so they cannot disagree about what
            &ldquo;now&rdquo; is:
          </p>
          <ResponseCodeBlock
            code={sample}
            language="typescript"
            filename="use-now.ts"
          />
          <p>
            Subscribing is what takes the first reading from the reader&rsquo;s
            own clock rather than the server&rsquo;s.
          </p>
        </Response>
      </BubbleContent>
    </Bubble>
  )
}

export function ResponseTableDemo() {
  return (
    <Bubble variant="ghost" className="w-full max-w-sm">
      <BubbleContent>
        <Response>
          <h2>Where each state shows</h2>
          <ResponseTable>
            <table>
              <thead>
                <tr>
                  <th>State</th>
                  <th>Shown as</th>
                  <th>Announced</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sending</td>
                  <td>Pulsing clock</td>
                  <td>Sending</td>
                </tr>
                <tr>
                  <td>Delivered</td>
                  <td>Double tick</td>
                  <td>Delivered</td>
                </tr>
                <tr>
                  <td>Read</td>
                  <td>Double tick, tinted</td>
                  <td>Read</td>
                </tr>
              </tbody>
            </table>
          </ResponseTable>
        </Response>
      </BubbleContent>
    </Bubble>
  )
}
