"use client"

import * as React from "react"

import {
  ToolCall,
  ToolCallCode,
  ToolCallName,
  ToolCallPanel,
  ToolCallSection,
  ToolCallSummary,
  ToolCallTrigger,
  type ToolCallStatus,
} from "@/components/aiellie-ui/tool-call"

const ARGS = `{
  "pattern": "data-slot",
  "path": "components/",
  "limit": 20
}`

const RESULT = `components/ui/bubble.tsx:14
components/ui/marker.tsx:9
components/aiellie-ui/menu.tsx:37`

export function ToolCallDemo() {
  return (
    <ToolCall status="done" defaultOpen className="max-w-sm">
      <ToolCallTrigger>
        <ToolCallName>search_files</ToolCallName>
        <ToolCallSummary>3 matches</ToolCallSummary>
      </ToolCallTrigger>
      <ToolCallPanel>
        <ToolCallSection label="Arguments">
          <ToolCallCode>{ARGS}</ToolCallCode>
        </ToolCallSection>
        <ToolCallSection label="Result">
          <ToolCallCode>{RESULT}</ToolCallCode>
        </ToolCallSection>
      </ToolCallPanel>
    </ToolCall>
  )
}

const RUN: { status: ToolCallStatus; name: string; summary: string }[] = [
  { status: "done", name: "read_file", summary: "84 lines" },
  { status: "running", name: "search_files", summary: "searching" },
  { status: "pending", name: "write_file", summary: "queued" },
]

/**
 * A run of calls, which is how they actually appear. Collapsed: the summary is
 * the whole point of the row, and unfolding three sets of arguments buries the
 * answer they were called in service of.
 */
export function ToolCallRunDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      {RUN.map((call) => (
        <ToolCall key={call.name} status={call.status}>
          <ToolCallTrigger>
            <ToolCallName>{call.name}</ToolCallName>
            <ToolCallSummary>{call.summary}</ToolCallSummary>
          </ToolCallTrigger>
          <ToolCallPanel>
            <ToolCallSection label="Arguments">
              <ToolCallCode>{ARGS}</ToolCallCode>
            </ToolCallSection>
          </ToolCallPanel>
        </ToolCall>
      ))}
    </div>
  )
}

/** The one state that asks something of the reader rather than reporting. */
export function ToolCallFailedDemo() {
  return (
    <ToolCall status="error" defaultOpen className="max-w-sm">
      <ToolCallTrigger>
        <ToolCallName>write_file</ToolCallName>
        <ToolCallSummary>permission denied</ToolCallSummary>
      </ToolCallTrigger>
      <ToolCallPanel>
        <ToolCallSection label="Error">
          <ToolCallCode className="text-red-600 dark:text-red-400">
            {`EACCES: permission denied,
open '/etc/hosts'`}
          </ToolCallCode>
        </ToolCallSection>
      </ToolCallPanel>
    </ToolCall>
  )
}

/**
 * Opening and closing under the caller's hand, for a transcript that unfolds
 * the call it has just finished and folds the one before it away.
 */
export function ToolCallControlledDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <ToolCall
      status="done"
      open={open}
      onOpenChange={setOpen}
      className="max-w-sm"
    >
      <ToolCallTrigger>
        <ToolCallName>list_directory</ToolCallName>
        <ToolCallSummary>{open ? "showing" : "12 entries"}</ToolCallSummary>
      </ToolCallTrigger>
      <ToolCallPanel>
        <ToolCallSection label="Result">
          <ToolCallCode>
            {`components/\nexamples/\nhooks/\nlib/\nregistry/`}
          </ToolCallCode>
        </ToolCallSection>
      </ToolCallPanel>
    </ToolCall>
  )
}
