"use client"

import * as React from "react"

import { Attachment, Attachments } from "@/components/aiellie-ui/attachments"
import {
  AddMenu,
  AddMenuContent,
  AddMenuTrigger,
  type AddAction,
} from "@/components/aiellie-ui/composer/add-menu"
import {
  MessageInput,
  MessageInputField,
  MessageInputLine,
  messageInputStack,
  MessageInputSubmit,
} from "@/components/aiellie-ui/composer/message-input"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"

interface DemoFile {
  id: string
  name: string
  size: number
  src?: string
}

/**
 * Kept short and kept here, as the other composer demos do. The long PDF name
 * is the point of one of them: it is what shows the cut falling on the stem
 * and the extension surviving it.
 */
const files: DemoFile[] = [
  { id: "brief", name: "rollout-brief-final-v3.pdf", size: 2_340_000 },
  { id: "hook", name: "use-attachments.ts", size: 4_812 },
  { id: "forecast", name: "q3-forecast.xlsx", size: 118_400 },
  {
    id: "shot",
    name: "empty-state.png",
    size: 486_000,
    src: "/placeholder.png",
  },
  { id: "tokens", name: "design-tokens.zip", size: 1_100_000 },
]

/** The set, minus whatever has been taken off, with the ways back on. */
function useRemovable(ids: readonly string[]) {
  const [kept, setKept] = React.useState<readonly string[]>(ids)

  return {
    files: files.filter((file) => kept.includes(file.id)),
    add: (id: string) =>
      setKept((current) => (current.includes(id) ? current : [...current, id])),
    remove: (id: string) =>
      setKept((current) => current.filter((k) => k !== id)),
    reset: () => setKept(ids),
    empty: kept.length === 0,
  }
}

/**
 * The row on its own: a mixed set of files, each one able to be taken back off.
 *
 * The badges are worth watching as the set changes — the `.ts` wears the same
 * mark it would wear in a code block header, because it is the code catalogue
 * answering, while the PDF and the archive are the attachment's own.
 */
export function AttachmentsDemo() {
  const {
    files: kept,
    remove,
    reset,
    empty,
  } = useRemovable(["brief", "hook", "forecast", "shot", "tokens"])

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <Attachments>
        {kept.map((file) => (
          <Attachment
            key={file.id}
            name={file.name}
            size={file.size}
            src={file.src}
            onRemove={() => remove(file.id)}
          />
        ))}
      </Attachments>

      {empty ? (
        <Button variant="outline" size="sm" onClick={reset}>
          Attach them again
        </Button>
      ) : null}
    </div>
  )
}

/** The set as the plus offers it: one row per file, and nothing else. */
const attachable: AddAction[] = [
  {
    id: "files",
    group: "Attach",
    label: "Recent files",
    items: files.map((file) => ({ id: file.id, label: file.name })),
  },
]

/**
 * Where they actually live: above the box, outside it, with the writing left
 * the whole of its own line and the toolbar below untouched. The composer
 * grows a row taller and the box stays exactly the box it was.
 */
export function AttachmentsComposerDemo() {
  const { files: kept, add, remove, empty } = useRemovable(["brief", "shot"])
  const [value, setValue] = React.useState("")

  return (
    <TooltipProvider>
      <MessageInput
        className={messageInputStack}
        value={value}
        onValueChange={setValue}
        onSubmit={() => setValue("")}
      >
        {empty ? null : (
          <Attachments>
            {kept.map((file) => (
              <Attachment
                key={file.id}
                name={file.name}
                size={file.size}
                src={file.src}
                onRemove={() => remove(file.id)}
              />
            ))}
          </Attachments>
        )}

        <MessageInputLine>
          <AddMenu actions={attachable} onSelect={(action) => add(action.id)}>
            <AddMenuTrigger />
            <AddMenuContent side="top" />
          </AddMenu>
          <MessageInputField placeholder="Ask about the rollout…" />
          <MessageInputSubmit />
        </MessageInputLine>
      </MessageInput>
    </TooltipProvider>
  )
}

/** A climb from nothing to done, restarted whenever the retry is pressed. */
function useClimb(step: number, failAt?: number) {
  const [progress, setProgress] = React.useState(0)
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    if (failed || progress >= 1) return undefined

    const timer = setTimeout(() => {
      const next = progress + step
      if (failAt !== undefined && next >= failAt) setFailed(true)
      else setProgress(Math.min(1, next))
    }, 500)

    return () => clearTimeout(timer)
  }, [progress, step, failAt, failed])

  return {
    progress,
    failed,
    retry: () => {
      setProgress(0)
      setFailed(false)
    },
  }
}

/**
 * The three things an upload can be doing, side by side.
 *
 * The middle one has no number against it on purpose: plenty of hosts stream a
 * file without ever saying how much of it has landed, and a chip that invented
 * a percentage for that would be lying. It says an upload is happening and
 * stops there.
 */
export function AttachmentsUploadingDemo() {
  const climbing = useClimb(0.18)
  const failing = useClimb(0.25, 0.55)

  return (
    <Attachments>
      <Attachment
        name="rollout-brief-final-v3.pdf"
        size={2_340_000}
        status={climbing.progress >= 1 ? "ready" : "uploading"}
        progress={climbing.progress >= 1 ? undefined : climbing.progress}
        onRemove={() => climbing.retry()}
      />

      <Attachment
        name="session-recording.mp4"
        size={48_200_000}
        status="uploading"
      />

      <Attachment
        name="q3-forecast.xlsx"
        size={118_400}
        status={failing.failed ? "error" : "uploading"}
        progress={failing.failed ? undefined : failing.progress}
        meta={failing.failed ? "Too large — 25 MB limit" : undefined}
        onRetry={failing.retry}
      />
    </Attachments>
  )
}

/**
 * The square form, for a set that is mostly pictures. The thumbnail is what a
 * reader is scanning here, so it takes the whole tile and the name goes over
 * it — and the one file that has no picture keeps its badge instead rather than
 * leaving a hole in the row.
 */
export function AttachmentsTilesDemo() {
  const climbing = useClimb(0.2)
  const [opened, setOpened] = React.useState<string | null>(null)

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <Attachments>
        <Attachment
          variant="tile"
          name="empty-state.png"
          size={486_000}
          src="/placeholder.png"
          meta="1600 × 900"
          onOpen={() => setOpened("empty-state.png")}
          onRemove={() => undefined}
        />
        <Attachment
          variant="tile"
          name="composer-dark.png"
          size={512_000}
          src="/placeholder.png"
          meta="1600 × 900"
          onOpen={() => setOpened("composer-dark.png")}
          onRemove={() => undefined}
        />
        <Attachment
          variant="tile"
          name="rollout-brief.pdf"
          size={2_340_000}
          onOpen={() => setOpened("rollout-brief.pdf")}
          onRemove={() => undefined}
        />
        <Attachment
          variant="tile"
          name="tool-call.png"
          size={704_000}
          src="/placeholder.png"
          status={climbing.progress >= 1 ? "ready" : "uploading"}
          progress={climbing.progress >= 1 ? undefined : climbing.progress}
          meta={climbing.progress >= 1 ? "1600 × 900" : undefined}
        />
      </Attachments>

      {/* Standing in for whatever a real one would open — a lightbox, a new
          tab, a pane. What is worth seeing here is that the tile answers a
          click anywhere on it *except* the cross, which is its own control
          sitting over the one underneath. */}
      <p className="text-[11px] text-muted-foreground">
        {opened ? `Opened ${opened}.` : "Pick a tile to open it."}
      </p>
    </div>
  )
}
