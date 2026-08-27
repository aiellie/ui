"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"

export interface QuotedMessageProps extends useRender.ComponentProps<"div"> {
  /** Who is being quoted. Omit for a quote of the reader's own message. */
  author?: React.ReactNode
  /** Offered where the quote can be called off — a composer, mainly. */
  onDismiss?: () => void
  /** How many lines of the original to keep before it is cut. */
  lines?: 1 | 2 | 3
}

/**
 * The message a reply is about, shown above the reply itself.
 *
 * It is an excerpt on purpose: a quote that repeats the whole of a long message
 * makes the thread read twice. The rule on the start edge is what says this is
 * borrowed text rather than the beginning of the answer.
 *
 * Pass `render={<button type="button" />}` where the quote should jump to the
 * original — which is what a reader expects of it, and costs nothing to wire.
 */
export function QuotedMessage({
  author,
  onDismiss,
  lines = 2,
  className,
  children,
  render,
  ...props
}: QuotedMessageProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          // Colours are taken from the text it sits on rather than from the
          // page: a quote goes inside whatever bubble is replying, and a fixed
          // light panel disappears the moment that bubble is a filled one.
          "group/quote flex w-full min-w-0 items-start gap-2 rounded-lg border-s-2 border-current/40 bg-current/[0.08] px-2.5 py-1.5 text-start text-xs",
          // Only when it is one: a plain div should not answer the pointer as
          // though it were going somewhere.
          "[&:is(button,a)]:cursor-pointer [&:is(button,a)]:transition-colors [&:is(button,a)]:outline-none [&:is(button,a):focus-visible]:ring-1 [&:is(button,a):focus-visible]:ring-ring/50 [&:is(button,a):hover]:bg-foreground/[0.07] dark:[&:is(button,a):hover]:bg-foreground/[0.09]",
          "motion-reduce:transition-none",
          className
        ),
        children: (
          <>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              {author ? (
                <span
                  data-slot="quoted-message-author"
                  className="font-medium opacity-90"
                >
                  {author}
                </span>
              ) : null}
              <span
                data-slot="quoted-message-excerpt"
                className={cn(
                  "min-w-0 overflow-hidden opacity-70",
                  lines === 1 && "line-clamp-1",
                  lines === 2 && "line-clamp-2",
                  lines === 3 && "line-clamp-3"
                )}
              >
                {children}
              </span>
            </span>

            {onDismiss ? (
              <button
                type="button"
                aria-label="Remove quote"
                onClick={(event) => {
                  // The quote itself may be a link to the original; dismissing
                  // it is not a request to go there.
                  event.stopPropagation()
                  onDismiss()
                }}
                className="-me-1 flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-md opacity-60 transition-[opacity,background-color] duration-150 outline-none hover:bg-current/[0.12] hover:opacity-100 focus-visible:ring-1 focus-visible:ring-current/40 motion-reduce:transition-none"
              >
                {/* Drawn rather than imported: a cross is not worth a dependency. */}
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="size-3"
                >
                  <path d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5" />
                </svg>
              </button>
            ) : null}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: "quoted-message",
    },
  })
}
