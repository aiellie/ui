"use client"

import * as React from "react"
import {
  BubbleChatIcon,
  Cancel01Icon,
  Clock01Icon,
  File01Icon,
  Folder01Icon,
  GoogleDriveIcon,
  Image01Icon,
  Link02Icon,
  LinkSquare02Icon,
  Note01Icon,
  UserCircle02Icon,
} from "@hugeicons/core-free-icons"

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
  MessageInputToolbar,
} from "@/components/aiellie-ui/composer/message-input"
import {
  ModelPicker,
  ModelPickerContent,
  ModelPickerTrigger,
} from "@/components/aiellie-ui/composer/model-picker"
import { Attachment, Attachments } from "@/components/aiellie-ui/attachments"
import { TooltipProvider } from "@/components/ui/tooltip"

/**
 * The plus on its own, with everything it offers behind it — four levels deep
 * under the connectors, and a choice made at the bottom of that reported back
 * as one entry rather than as a path.
 */
export function AddMenuDemo() {
  const [added, setAdded] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <AddMenu onSelect={(action) => setAdded(action.label)}>
        <AddMenuTrigger />
        <AddMenuContent />
      </AddMenu>
      <p className="ps-1 text-xs text-muted-foreground">
        {added ? `Added ${added}.` : "Open it and walk down to a file."}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------------- *
 * The composer's own
 * ------------------------------------------------------------------------- */

interface DemoFile {
  id: string
  name: string
  size: number
}

const driveFiles: DemoFile[] = [
  { id: "roadmap", name: "Roadmap.pdf", size: 2_413_000 },
  { id: "budget", name: "Budget.xlsx", size: 184_000 },
  { id: "kickoff", name: "Kickoff.docx", size: 62_000 },
]

const screenshots: DemoFile[] = [
  { id: "dashboard", name: "Dashboard.png", size: 840_000 },
  { id: "empty-state", name: "Empty state.png", size: 310_000 },
]

const filesById = new Map(
  [...driveFiles, ...screenshots].map((file) => [file.id, file] as const)
)

/** A file as a row: the name is the label, and the id is what comes back. */
const fileRow = (file: DemoFile): AddAction => ({
  id: file.id,
  label: file.name,
  icon: File01Icon,
})

/**
 * A catalogue of this composer's own, standing where the default one would.
 * Every leaf under the first two headings is a real file, which is what lets
 * the demo below turn a choice into a chip.
 */
const composerActions: AddAction[] = [
  {
    id: "drive",
    group: "Attach",
    label: "Google Drive",
    icon: GoogleDriveIcon,
    items: [
      {
        id: "drive-recent",
        label: "Recent",
        icon: Clock01Icon,
        items: driveFiles.map(fileRow),
      },
      { id: "drive-browse", label: "Browse Drive…", icon: Folder01Icon },
    ],
  },
  {
    id: "photos",
    group: "Attach",
    label: "Screenshots",
    icon: Image01Icon,
    items: screenshots.map(fileRow),
  },
  {
    id: "link",
    group: "Context",
    label: "Paste a link",
    icon: Link02Icon,
    shortcut: "⌘L",
  },
]

/**
 * Where it belongs: the first thing on the row a composer keeps for what a
 * message is being sent with, before the model and the send.
 *
 * The chips are `attachments`', not this element's, and that division is the
 * point — the menu's job ends the moment something has been chosen, and what a
 * message is carrying is drawn above the field where it can be taken off
 * again, not inside a menu nobody has open.
 */
export function AddMenuComposerDemo() {
  const [attached, setAttached] = React.useState<DemoFile[]>([])
  const [model, setModel] = React.useState("claude-opus-5")
  const [sent, setSent] = React.useState<string | null>(null)

  const add = (action: AddAction) => {
    const file = filesById.get(action.id)
    // "Browse Drive…" and the link row open something a demo has not got.
    if (!file) return
    setAttached((list) =>
      list.some((item) => item.id === file.id) ? list : [...list, file]
    )
  }

  return (
    <TooltipProvider>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <MessageInput
          className={messageInputStack}
          onSubmit={(message) => setSent(message)}
        >
          {attached.length ? (
            <Attachments>
              {attached.map((file) => (
                <Attachment
                  key={file.id}
                  name={file.name}
                  size={file.size}
                  onRemove={() =>
                    setAttached((list) =>
                      list.filter((item) => item.id !== file.id)
                    )
                  }
                />
              ))}
            </Attachments>
          ) : null}

          <MessageInputLine>
            <AddMenu actions={composerActions} onSelect={add}>
              <AddMenuTrigger />
              <AddMenuContent side="top" />
            </AddMenu>
            <MessageInputField placeholder="Say something…" />
            <MessageInputSubmit />
          </MessageInputLine>

          <MessageInputToolbar>
            <ModelPicker value={model} onValueChange={setModel}>
              <ModelPickerTrigger showIcon={false} />
              <ModelPickerContent side="top" />
            </ModelPicker>
          </MessageInputToolbar>
        </MessageInput>
        <p className="ps-1 text-xs text-muted-foreground">
          {sent
            ? `Sent with ${attached.length} file${attached.length === 1 ? "" : "s"}.`
            : "The plus walks down to a file; the chips are where it lands."}
        </p>
      </div>
    </TooltipProvider>
  )
}

/* ------------------------------------------------------------------------- *
 * Somewhere else entirely
 * ------------------------------------------------------------------------- */

/**
 * A support inbox's plus rather than a chat composer's — the same element with
 * nothing of the composer left in it, to show that the tree is the whole of
 * what this thing is.
 *
 * It also carries the rows the default catalogue has no use for: a run that
 * stands apart under a rule instead of a heading, a row that is a real link,
 * and one drawn as the ending it is.
 */
const inboxActions: AddAction[] = [
  {
    id: "reply",
    group: "Answer",
    label: "Saved reply",
    icon: BubbleChatIcon,
    items: [
      { id: "reply-refund", label: "Refund policy", shortcut: "1" },
      { id: "reply-shipping", label: "Where is my order", shortcut: "2" },
      { id: "reply-cancel", label: "Cancelling a plan", shortcut: "3" },
    ],
  },
  {
    id: "article",
    group: "Answer",
    label: "Help article",
    icon: Note01Icon,
    items: [
      { id: "article-billing", label: "Billing and invoices" },
      { id: "article-seats", label: "Adding a seat" },
    ],
  },
  {
    id: "assign",
    group: "Route",
    label: "Assign to",
    icon: UserCircle02Icon,
    items: [
      { id: "assign-mara", group: "On shift", label: "Mara" },
      { id: "assign-jonah", group: "On shift", label: "Jonah" },
      { id: "assign-billing", group: "Teams", label: "Billing" },
      { id: "assign-trust", group: "Teams", label: "Trust and safety" },
      { id: "assign-nobody", label: "Leave unassigned" },
    ],
  },
  {
    id: "snooze",
    group: "Route",
    label: "Snooze",
    icon: Clock01Icon,
    items: [
      { id: "snooze-hour", label: "An hour" },
      { id: "snooze-tomorrow", label: "Tomorrow morning" },
      { id: "snooze-reply", label: "Until they reply" },
    ],
  },
  {
    id: "playbook",
    label: "The playbook…",
    icon: LinkSquare02Icon,
    href: "#",
  },
  {
    id: "close",
    label: "Close the thread",
    icon: Cancel01Icon,
    variant: "destructive",
    shortcut: "⌘⌫",
  },
]

export function AddMenuOwnDemo() {
  const [chosen, setChosen] = React.useState<AddAction | null>(null)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <AddMenu actions={inboxActions} onSelect={setChosen}>
        <AddMenuTrigger />
        <AddMenuContent />
      </AddMenu>
      <p
        className={
          chosen?.variant === "destructive"
            ? "ps-1 text-xs text-destructive"
            : "ps-1 text-xs text-muted-foreground"
        }
      >
        {chosen
          ? `${chosen.label} — reported as ${chosen.id}, whatever level it sat on.`
          : "The same menu, a catalogue that has never met a composer."}
      </p>
    </div>
  )
}
