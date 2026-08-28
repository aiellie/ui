"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

export interface ChatAvatarProps extends React.ComponentProps<"div"> {
  /**
   * Hold the cluster at the top of the thread with the glass behind it. Off,
   * it is an ordinary centred cluster in the flow — which is what an opening
   * screen wants, where there is nothing yet to float over.
   */
  floating?: boolean
}

/**
 * Whose thread this is, said at the top of the thread rather than in a bar
 * across it.
 *
 * The cluster is the first thing inside the scrolling thread and sticks there
 * once the thread moves under it, so messages pass behind the glass and thin
 * out rather than stopping at a border. That is the whole of what makes it
 * read as floating: the messages go somewhere, and what they go behind is
 * plainly the same surface they are on.
 *
 * It wants to be the first child of `ChatCardThread` — it bleeds sideways by
 * that thread's own padding so the glass reaches the card's edges rather than
 * ending in a stripe short of them.
 *
 * A card wearing this has no `ChatCardHeader`, since this is the header. Say so
 * with `grid-rows-[1fr_auto]` on the `ChatCard`: its rows are header, thread,
 * foot in that order, and a card given only two of them otherwise hands the
 * thread the header's row and leaves the spare height under the composer.
 */
export function ChatAvatar({
  floating = true,
  className,
  children,
  ...props
}: ChatAvatarProps) {
  return (
    <div
      data-slot="chat-avatar"
      data-floating={floating || undefined}
      className={cn(
        "flex shrink-0 flex-col items-center gap-1.5 pb-2",
        // z-10 is what puts the messages behind it, and the stacking context
        // it opens is what keeps the glass below from escaping the cluster.
        floating ? "sticky top-0 z-10" : "relative",
        className
      )}
      {...props}
    >
      {floating ? (
        /* Its own layer rather than a background on the cluster, because the
           mask that dissolves the foot of the glass would otherwise take the
           name with it. -z-10 holds it behind the cluster's own content and,
           since the cluster is a stacking context, no further back than that.

           The fade is measured from the foot rather than as a share of the
           height: the glass is as tall as whatever is in it, and a proportional
           fade moves up into the name the moment the cluster is a short one —
           a stack of small portraits rather than a single large one.

           Dark lifts the fill off `background` rather than taking it straight,
           since the card is not on `background` there — it sits on a tint over
           it, and glass darker than what it is lying on reads as a band across
           the top rather than as the same surface. The lift is mixed from
           `foreground` rather than from `input` because `input` is itself
           translucent, and mixing it in thins the glass instead of colouring
           it: the fill has to stay opaque enough to bury a message. */
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-3 -top-3 -bottom-4 -z-10 bg-background/85 mask-b-from-[calc(100%-1.5rem)] backdrop-blur-xl dark:bg-[color-mix(in_oklch,var(--background),var(--foreground)_4%)]/90"
        />
      ) : null}
      {children}
    </div>
  )
}

export interface ChatAvatarImageProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  src?: string
  /**
   * Left empty by default: the name is directly underneath, and a picture that
   * reads out the same name is the same thing said twice.
   */
  alt?: string
  /** Initials, a glyph — whatever stands in when there is no picture. */
  fallback?: React.ReactNode
}

/**
 * The portrait. Sized by `--chat-avatar-size` rather than a class, so a stack
 * can shrink the ones inside it without reaching into their styling.
 */
export function ChatAvatarImage({
  src,
  alt = "",
  fallback,
  className,
  ...props
}: ChatAvatarImageProps) {
  // Which picture failed rather than whether one did, so a new `src` gets its
  // own chance at it without an effect to reset the flag.
  const [failedSrc, setFailedSrc] = React.useState<string>()
  const failed = src !== undefined && src === failedSrc

  return (
    <div
      data-slot="chat-avatar-image"
      className={cn(
        "relative flex size-[var(--chat-avatar-size,3rem)] shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium text-muted-foreground ring-1 ring-border/40 select-none",
        className
      )}
      {...props}
    >
      {/* The fallback stays under the picture rather than being replaced by
          it: the picture comes off a host this card does not control, and a
          name with a blank disc against it reads worse than one that simply
          never got a photograph. */}
      {fallback}
      {src && !failed ? (
        // A plain img rather than next/image, because this file is copied
        // into projects that are not necessarily Next ones.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailedSrc(src)}
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
    </div>
  )
}

/**
 * A group thread's portraits, overlapped. Smaller than a single one, because
 * three faces at full size stop being a header and start being a row of
 * avatars — and ringed in the card's own colour so the overlap reads as depth
 * rather than as one shape cut out of another.
 */
export function ChatAvatarStack({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-avatar-stack"
      className={cn(
        "flex items-center justify-center [--chat-avatar-size:2.75rem]",
        "[&>*]:-ms-4 [&>*]:ring-2 [&>*]:ring-background [&>*:first-child]:ms-0",
        className
      )}
      {...props}
    />
  )
}

export interface ChatAvatarNameProps extends useRender.ComponentProps<"div"> {
  /** The mark that says the name opens something. */
  chevron?: boolean
  /**
   * A mark before the name. Worth having where the portrait is a picture
   * rather than a face — a product, an agent, a room — since the glyph says
   * what kind of thing it is and the photograph on its own does not.
   */
  icon?: IconSvgElement
}

/**
 * The name under the portrait, as a chip rather than a heading: at this size a
 * bare line of text on glass has nothing holding it to the cluster, and the
 * chip is also the shape a finger is being invited to press.
 *
 * Pass `render={<button type="button" />}` where it opens the contact — which
 * is what the chevron is promising, so turn the chevron off where it does not.
 */
export function ChatAvatarName({
  chevron = true,
  icon,
  className,
  children,
  render,
  ...props
}: ChatAvatarNameProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          // Filled rather than bare text: the glass is only half a background,
          // and a message passing under the name would otherwise read through
          // it. The fill is what keeps the name legible whatever is behind.
          "flex max-w-full min-w-0 items-center gap-0.5 rounded-full bg-muted py-0.5 ps-2.5 pe-1.5 text-xs font-medium",
          // Only when it is one: a plain div should not answer the pointer as
          // though it were going somewhere.
          "[&:is(button,a)]:cursor-pointer [&:is(button,a)]:transition-colors [&:is(button,a)]:outline-none [&:is(button,a):focus-visible]:ring-1 [&:is(button,a):focus-visible]:ring-ring/50 [&:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]",
          "motion-reduce:transition-none",
          className
        ),
        children: (
          <>
            {icon ? (
              <HugeiconsIcon
                aria-hidden
                icon={icon}
                strokeWidth={2}
                className="me-0.5 size-3.5 shrink-0 text-muted-foreground"
              />
            ) : null}
            <span className="truncate">{children}</span>
            {chevron ? (
              <HugeiconsIcon
                aria-hidden
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="size-3.5 shrink-0 text-muted-foreground"
              />
            ) : null}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: "chat-avatar-name",
    },
  })
}

export interface ChatAvatarActionsProps extends React.ComponentProps<"div"> {
  side?: "start" | "end"
}

/**
 * The controls that share the floating bar with the cluster — a new message on
 * one side, a call on the other.
 *
 * Taken out of the flow rather than laid beside the cluster, so the portrait
 * stays on the card's centre line however many buttons either side collects.
 */
export function ChatAvatarActions({
  side = "start",
  className,
  ...props
}: ChatAvatarActionsProps) {
  return (
    <div
      data-slot="chat-avatar-actions"
      data-side={side}
      className={cn(
        "absolute top-0 flex items-center gap-1",
        side === "start" ? "start-0" : "end-0",
        className
      )}
      {...props}
    />
  )
}
