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
  MessageInputSubmit,
  type MessageInputFieldProps,
  type MessageInputProps,
  type MessageInputSubmitProps,
} from "@/components/aiellie-ui/composer/message-input"
import { cn } from "@/lib/utils"

/**
 * The whole of what a message is written in: the field with its send, the
 * names an at sign can reach, and a row underneath for what the message is
 * being sent with.
 *
 * The row is under the input, not in it. A control sat inside the field is
 * competing with the text for the same line — it shrinks as the message grows,
 * and every control added takes another inch off the writing. Stood on its own
 * row below, it keeps its label at any width and there is somewhere to put the
 * next one — tools, effort, approval — without the field paying for it.
 *
 * The parts are `message-input`'s and `mentions`', arranged. Nothing here
 * re-implements them: this is the shape they take together.
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

/** The message being written and the send that takes it: one row, one form. */
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
      className={cn("h-9 rounded-xl", className)}
    />
  )
}

/** The send, sized to stand level with the field it sits beside. */
export function ComposerSubmit({
  className,
  ...props
}: MessageInputSubmitProps) {
  return <MessageInputSubmit className={cn("size-9", className)} {...props} />
}

/**
 * The row under the input. What the message is being sent with goes here —
 * which model is answering, and whatever else the composer grows — outside the
 * field rather than inside it, so the writing keeps the whole line.
 */
export function ComposerToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-toolbar"
      role="toolbar"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}
