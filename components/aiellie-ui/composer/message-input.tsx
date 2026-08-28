"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { SentIcon, StopIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ChatStatus } from "ai"

import {
  iconSwap,
  iconSwapIn,
  iconSwapOut,
} from "@/components/aiellie-ui/actions"
import {
  TooltipIconButton,
  type TooltipIconButtonProps,
} from "@/components/aiellie-ui/tooltip-icon-button"
import { cn } from "@/lib/utils"

const MessageInputContext = React.createContext<
  | {
      value: string
      setValue: (value: string) => void
    }
  | undefined
>(undefined)

const useMessageInputContext = () => {
  const context = React.useContext(MessageInputContext)
  if (!context) {
    throw new Error(
      "MessageInput components must be used within a MessageInput provider"
    )
  }
  return context
}

export type MessageInputProps = Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "defaultValue"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSubmit?: (message: string, event: React.FormEvent<HTMLFormElement>) => void
}

export const MessageInput = ({
  className,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  children,
  ...props
}: MessageInputProps) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next)
      }
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = value.trim()
    if (!message) {
      return
    }
    onSubmit?.(message, event)
    setValue("")
  }

  const contextValue = React.useMemo(
    () => ({ value, setValue }),
    [value, setValue]
  )

  return (
    <MessageInputContext.Provider value={contextValue}>
      <form
        data-slot="message-input"
        className={cn("flex w-full items-center gap-2", className)}
        onSubmit={handleSubmit}
        {...props}
      >
        {children}
      </form>
    </MessageInputContext.Provider>
  )
}

/**
 * Exported so a composer that outgrows a single line can dress a textarea to
 * match rather than guessing at these values.
 */
export const messageInputField =
  "h-8 w-full min-w-0 flex-1 rounded-lg border border-input bg-transparent px-2.5 py-0.5 text-base outline-none transition-[background-color,border-color] duration-150 placeholder:text-sm placeholder:text-muted-foreground focus-visible:border-ring disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 motion-reduce:transition-none md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"

export type MessageInputFieldProps = Omit<
  InputPrimitive.Props,
  "value" | "defaultValue" | "onValueChange" | "className"
> & {
  className?: string
}

export const MessageInputField = ({
  className,
  placeholder = "Send a message…",
  ...props
}: MessageInputFieldProps) => {
  const { value, setValue } = useMessageInputContext()

  return (
    <InputPrimitive
      data-slot="message-input-field"
      className={cn(messageInputField, className)}
      placeholder={placeholder}
      value={value}
      onValueChange={setValue}
      {...props}
    />
  )
}

/**
 * One shape for both things the control can be. The fill is what changes —
 * ink when there is something to do, the quietest field grey when there is
 * not — so the button reads as waking up under the first keystroke rather
 * than appearing from nowhere.
 */
export const messageInputSubmit =
  "relative grid size-8 shrink-0 place-items-center rounded-full p-0 outline-none transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.96] disabled:opacity-100 motion-reduce:transition-none"

export type MessageInputSubmitProps = Omit<
  TooltipIconButtonProps,
  "tooltip" | "type" | "className"
> & {
  className?: string
  tooltip?: string
  stopTooltip?: string
  status?: ChatStatus
  onStop?: () => void
}

export const MessageInputSubmit = ({
  className,
  children,
  disabled,
  tooltip = "Send message",
  stopTooltip = "Stop answering",
  status,
  onStop,
  onClick,
  ...props
}: MessageInputSubmitProps) => {
  const { value } = useMessageInputContext()
  const generating = status === "submitted" || status === "streaming"
  const isEmpty = value.trim().length === 0
  // Nothing to send is the send control dimmed, not a different control in its
  // place: a button that does one thing empty and another thing written is a
  // button the reader has to check before pressing.
  const isDisabled = disabled ?? (isEmpty && !generating)
  const label = generating ? stopTooltip : tooltip

  const handleClick = React.useCallback<
    NonNullable<MessageInputSubmitProps["onClick"]>
  >(
    (event) => {
      // Stopping is not submitting — the type below says so, so there is no
      // default to prevent here, only the caller's own handler to hold back.
      if (generating) {
        onStop?.()
        return
      }
      onClick?.(event)
    },
    [generating, onStop, onClick]
  )

  return (
    <TooltipIconButton
      data-slot="message-input-submit"
      data-mode={generating ? "stop" : "send"}
      type={generating ? "button" : "submit"}
      tooltip={label}
      side="top"
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(
        messageInputSubmit,
        isDisabled
          ? "bg-foreground/[0.04] text-foreground/40 dark:bg-foreground/[0.06]"
          : "bg-foreground text-background hover:bg-foreground/90",
        className
      )}
      {...props}
    >
      {/* The answer being written, said as an aura rather than a
          spinner: the control is still a stop, and a glyph that turned
          would be arguing with the square about what the button does.
          Mounted throughout and faded in, so nothing arrives at the
          moment the icons are already swapping. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-1 rounded-full bg-foreground/15 transition-opacity duration-300 motion-reduce:transition-none",
          generating
            ? "animate-pulse opacity-100 motion-reduce:animate-none"
            : "opacity-0"
        )}
      />
      {children ?? (
        <>
          <HugeiconsIcon
            icon={SentIcon}
            className={cn(
              iconSwap,
              "size-4",
              generating ? iconSwapOut : iconSwapIn
            )}
          />
          {/* Filled rather than outlined, and a shade smaller for it: a
              stop is a solid block everywhere else it appears. */}
          <HugeiconsIcon
            icon={StopIcon}
            className={cn(
              iconSwap,
              "size-3.5 fill-current",
              generating ? iconSwapIn : iconSwapOut
            )}
          />
        </>
      )}
    </TooltipIconButton>
  )
}
