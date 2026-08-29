"use client"

import * as React from "react"
import {
  ArrowReloadHorizontalIcon,
  Bookmark02Icon,
  Copy01Icon,
  Flag02Icon,
  MoreHorizontalIcon,
  Share08Icon,
  ThumbsDownIcon,
  ThumbsUpDownIcon,
  ThumbsUpIcon,
  Tick02Icon,
  TrashIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  MessageAction,
  MessageActions,
  MessageActionsMenu,
  MessageActionsMenuContent,
  MessageActionsMenuItem,
  MessageActionsMenuSeparator,
  MessageActionsMenuTrigger,
} from "@/components/aiellie-ui/message-actions"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

const answer =
  "Three people debated the rollout date and settled on shipping behind a flag next Tuesday."

type Rating = "up" | "down" | null

/**
 * One control for both verdicts. Rating an answer is rare enough not to earn
 * two permanent buttons in every row, and the menu is where the pair goes
 * without either of them losing its label.
 */
function RatingMenu({
  rating,
  onRating,
}: {
  rating: Rating
  onRating: (rating: Rating) => void
}) {
  return (
    <MessageActionsMenu>
      <MessageActionsMenuTrigger
        tooltip="Rate this answer"
        // Once a verdict is in, the control carries it: the pair of thumbs is
        // an invitation, and a single thumb is an answer already given.
        className={rating ? "text-foreground" : undefined}
      >
        <HugeiconsIcon
          icon={
            rating === "up"
              ? ThumbsUpIcon
              : rating === "down"
                ? ThumbsDownIcon
                : ThumbsUpDownIcon
          }
        />
      </MessageActionsMenuTrigger>
      <MessageActionsMenuContent align="start">
        <MessageActionsMenuItem
          onClick={() => onRating(rating === "up" ? null : "up")}
        >
          <HugeiconsIcon icon={ThumbsUpIcon} />
          Like
          {rating === "up" ? (
            <HugeiconsIcon icon={Tick02Icon} className="ms-auto" />
          ) : null}
        </MessageActionsMenuItem>
        <MessageActionsMenuItem
          onClick={() => onRating(rating === "down" ? null : "down")}
        >
          <HugeiconsIcon icon={ThumbsDownIcon} />
          Dislike
          {rating === "down" ? (
            <HugeiconsIcon icon={Tick02Icon} className="ms-auto" />
          ) : null}
        </MessageActionsMenuItem>
      </MessageActionsMenuContent>
    </MessageActionsMenu>
  )
}

function MoreMenu() {
  return (
    <MessageActionsMenu>
      <MessageActionsMenuTrigger>
        <HugeiconsIcon icon={MoreHorizontalIcon} />
      </MessageActionsMenuTrigger>
      <MessageActionsMenuContent>
        <MessageActionsMenuItem>
          <HugeiconsIcon icon={Share08Icon} />
          Share
        </MessageActionsMenuItem>
        <MessageActionsMenuItem>
          <HugeiconsIcon icon={Bookmark02Icon} />
          Save to notes
        </MessageActionsMenuItem>
        <MessageActionsMenuItem>
          <HugeiconsIcon icon={Flag02Icon} />
          Report a problem
        </MessageActionsMenuItem>
        <MessageActionsMenuSeparator />
        <MessageActionsMenuItem variant="destructive">
          <HugeiconsIcon icon={TrashIcon} />
          Delete
        </MessageActionsMenuItem>
      </MessageActionsMenuContent>
    </MessageActionsMenu>
  )
}

/**
 * A copy that says so. The tick holds for a couple of seconds and then the
 * control goes back to offering the thing it offers, since a button stuck on
 * "copied" stops being a button.
 */
function CopyAction() {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return undefined
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])

  return (
    <MessageAction
      tooltip={copied ? "Copied" : "Copy"}
      active={copied}
      onClick={() => {
        void navigator.clipboard?.writeText(answer)
        setCopied(true)
      }}
    >
      <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} />
    </MessageAction>
  )
}

/** The icon turns for as long as the answer is being fetched again. */
function RetryAction() {
  const [retrying, setRetrying] = React.useState(false)

  React.useEffect(() => {
    if (!retrying) return undefined
    const id = setTimeout(() => setRetrying(false), 1600)
    return () => clearTimeout(id)
  }, [retrying])

  return (
    <MessageAction
      tooltip={retrying ? "Trying again" : "Try again"}
      busy={retrying}
      onClick={() => setRetrying(true)}
    >
      <HugeiconsIcon icon={ArrowReloadHorizontalIcon} />
    </MessageAction>
  )
}

export function MessageActionsDemo() {
  const [rating, setRating] = React.useState<Rating>(null)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <BubbleGroup>
        <Bubble variant="muted">
          <BubbleContent>{answer}</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <MessageActions className="ps-1">
        <CopyAction />
        <RatingMenu rating={rating} onRating={setRating} />
        <RetryAction />
        <MoreMenu />
      </MessageActions>
    </div>
  )
}

/**
 * The row held back until the message is hovered, which is how a thread of them
 * stays readable. `group/message` is what it hovers against.
 */
/* Each message owns its rating — one state shared across the map would show
   every message wearing whichever thumb was given last. */
function HoverMessage({ text }: { text: string }) {
  const [rating, setRating] = React.useState<Rating>(null)

  return (
    <div className="group/message flex flex-col gap-1">
      <BubbleGroup>
        <Bubble variant="muted">
          <BubbleContent>{text}</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <MessageActions showOnHover className="ps-1">
        <CopyAction />
        <RatingMenu rating={rating} onRating={setRating} />
        <RetryAction />
        <MoreMenu />
      </MessageActions>
    </div>
  )
}

export function MessageActionsOnHoverDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {[answer, "Shipping is behind a flag until Tuesday."].map((text) => (
        <HoverMessage key={text} text={text} />
      ))}
    </div>
  )
}
