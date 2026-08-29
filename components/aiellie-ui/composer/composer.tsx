"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"

import {
  Mentions,
  MentionsEmpty,
  MentionsGroupLabel,
  MentionsItem,
  useMentions,
  type MentionItem,
  type MentionsController,
} from "@/components/aiellie-ui/composer/mentions"
import {
  MessageInput,
  MessageInputField,
  MessageInputLine,
  messageInputStack,
  MessageInputSubmit,
  MessageInputToolbar,
  type MessageInputFieldProps,
  type MessageInputProps,
  type MessageInputSubmitProps,
} from "@/components/aiellie-ui/composer/message-input"
import { cn } from "@/lib/utils"

/**
 * The whole of what a message is written in: `message-input`'s three courses —
 * the files above the line, the add and the send either side of the field on
 * it, and what the message is being sent with underneath — with the names an
 * at sign can reach wired into the field.
 *
 * That arrangement is not defined here. It is `message-input`'s, so a composer
 * hand-wired from that element alone stands in the same shape as this one; the
 * parts below are those parts under the names a composer calls them by, plus
 * the two things this file adds — the mention menu the field answers to, and
 * the text held here so the menu can rewrite it.
 */
type ComposerContextValue = {
  value: string
  setValue: (value: string) => void
  onSubmit?: MessageInputProps["onSubmit"]
  mentions: MentionsController | null
}

const ComposerContext = React.createContext<ComposerContextValue | undefined>(
  undefined
)

function useComposerContext() {
  const context = React.useContext(ComposerContext)
  if (!context) {
    throw new Error("Composer parts must be used within a Composer")
  }
  return context
}

/** The matches in the order the list gave them, under the headings they carry. */
function groupsOf(matches: readonly MentionItem[]) {
  const groups = new Map<string, MentionItem[]>()
  for (const match of matches) {
    const key = match.group ?? ""
    const existing = groups.get(key)
    if (existing) existing.push(match)
    else groups.set(key, [match])
  }
  return [...groups]
}

export type ComposerProps = Omit<
  React.ComponentProps<"div">,
  "onSubmit" | "defaultValue"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSubmit?: (message: string, event: React.FormEvent<HTMLFormElement>) => void
  /** The people and agents an at sign can name. Left out, the field is plain. */
  mentions?: readonly MentionItem[]
  /** Which side the menu opens on. Above, for a composer at the foot of a thread. */
  mentionsSide?: "top" | "bottom"
  /** Shown when the at sign has matched nobody. */
  mentionsEmpty?: React.ReactNode
}

export function Composer({
  className,
  children,
  mentions: items,
  mentionsSide = "top",
  mentionsEmpty = "Nobody by that name.",
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  ...props
}: ComposerProps) {
  // The text is held here rather than left to `MessageInput` to hold: taking a
  // name rewrites what has been typed, and the menu cannot rewrite a value it
  // is not holding. The input below is handed it back through the context.
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const mentions = useMentions({
    value,
    onValueChange: setValue,
    items: items ?? [],
  })

  // Null rather than the controller when no list was given. The hook runs
  // either way — hooks do — but a field handing its keys to a menu with
  // nothing in it is a field that swallows Escape for no reason.
  const context = React.useMemo(
    () => ({ value, setValue, onSubmit, mentions: items ? mentions : null }),
    [value, setValue, onSubmit, items, mentions]
  )

  return (
    <ComposerContext.Provider value={context}>
      <div
        data-slot="composer"
        className={cn("flex w-full flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>

      {items ? (
        <Mentions controller={mentions} side={mentionsSide}>
          {mentions.matches.length ? (
            groupsOf(mentions.matches).map(([group, rows]) => (
              <React.Fragment key={group}>
                {group ? (
                  <MentionsGroupLabel>{group}</MentionsGroupLabel>
                ) : null}
                {rows.map((item) => (
                  <MentionsItem
                    key={item.id}
                    item={item}
                    controller={mentions}
                  />
                ))}
              </React.Fragment>
            ))
          ) : (
            <MentionsEmpty>{mentionsEmpty}</MentionsEmpty>
          )}
        </Mentions>
      ) : null}
    </ComposerContext.Provider>
  )
}

/**
 * The form, stacked into the three courses and drawing nothing itself: the
 * only edge in a composer is the field's own.
 */
export function ComposerInput({
  className,
  ...props
}: Omit<
  MessageInputProps,
  "value" | "defaultValue" | "onValueChange" | "onSubmit"
>) {
  const { value, setValue, onSubmit } = useComposerContext()

  return (
    <MessageInput
      data-slot="composer-input"
      value={value}
      onValueChange={setValue}
      onSubmit={onSubmit}
      className={cn(messageInputStack, className)}
      {...props}
    />
  )
}

/** The line, under the name a composer calls it by. */
export function ComposerLine({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <MessageInputLine
      data-slot="composer-line"
      className={className}
      {...props}
    />
  )
}

export type ComposerFieldProps = Omit<MessageInputFieldProps, "style"> & {
  // Base UI lets `style` be a function of the field's state; merging props is
  // the one place that cannot be honoured, so this part takes the object.
  style?: React.CSSProperties
}

/**
 * The field, wired to the mention menu when there is one.
 *
 * `mergeProps` rather than a spread: the menu's keys and the caller's both
 * have to run, and the caller's runs first — a composer that wants Enter for
 * something of its own can take it, and everything it does not take still
 * reaches the menu.
 */
export function ComposerField({ className, ...props }: ComposerFieldProps) {
  const { mentions } = useComposerContext()

  return (
    <MessageInputField
      data-slot="composer-field"
      {...mergeProps<"input">(mentions?.fieldProps, props)}
      className={className}
    />
  )
}

/**
 * The send, at the right-hand end of the line rather than on the row below:
 * sending is an act on this message, not a setting for it, so it stands beside
 * the field it is sending — opposite the control that adds to it.
 */
export function ComposerSubmit(props: MessageInputSubmitProps) {
  return <MessageInputSubmit data-slot="composer-submit" {...props} />
}

/** The row underneath, under the name a composer calls it by. */
export function ComposerToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <MessageInputToolbar
      data-slot="composer-toolbar"
      className={className}
      {...props}
    />
  )
}
