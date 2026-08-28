"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  AudioWave01Icon,
  SentIcon,
  SquareIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ChatStatus } from "ai";
import type { ComponentProps, FormEvent, ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const MessageInputContext = createContext<
  | {
      value: string;
      setValue: (value: string) => void;
    }
  | undefined
>(undefined);

const useMessageInputContext = () => {
  const context = useContext(MessageInputContext);
  if (!context) {
    throw new Error(
      "MessageInput components must be used within a MessageInput provider"
    );
  }
  return context;
};

export type MessageInputProps = Omit<
  ComponentProps<"form">,
  "onSubmit" | "defaultValue"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (message: string, event: FormEvent<HTMLFormElement>) => void;
};

export const MessageInput = ({
  className,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  children,
  ...props
}: MessageInputProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = value.trim();
    if (!message) {
      return;
    }
    onSubmit?.(message, event);
    setValue("");
  };

  const contextValue = useMemo(() => ({ value, setValue }), [value, setValue]);

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
  );
};

export type MessageInputFieldProps = Omit<
  ComponentProps<typeof Input>,
  "value" | "onChange"
>;

export const MessageInputField = ({
  className,
  placeholder = "Send a message...",
  ...props
}: MessageInputFieldProps) => {
  const { value, setValue } = useMessageInputContext();

  return (
    <Input
      className={cn("flex-1", className)}
      placeholder={placeholder}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      {...props}
    />
  );
};

export type MessageInputSubmitProps = ComponentProps<typeof Button> & {
  tooltip?: ReactNode;
  voiceTooltip?: ReactNode;
  status?: ChatStatus;
  onStop?: () => void;
  onVoice?: () => void;
};

export const MessageInputSubmit = ({
  className,
  children,
  disabled,
  tooltip = "Send message",
  voiceTooltip = "Voice chat",
  status,
  onStop,
  onVoice,
  onClick,
  ...props
}: MessageInputSubmitProps) => {
  const { value } = useMessageInputContext();
  const isGenerating = status === "submitted" || status === "streaming";
  const isEmpty = value.trim().length === 0;
  const mode = isGenerating ? "stop" : isEmpty ? "voice" : "send";

  const handleClick = useCallback<
    NonNullable<MessageInputSubmitProps["onClick"]>
  >(
    (event) => {
      if (isGenerating && onStop) {
        event.preventDefault();
        onStop();
        return;
      }
      if (isEmpty && !isGenerating) {
        event.preventDefault();
        onVoice?.();
        return;
      }
      onClick?.(event);
    },
    [isGenerating, onStop, isEmpty, onVoice, onClick]
  );

  const label =
    mode === "stop" ? "Stop" : mode === "voice" ? voiceTooltip : tooltip;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type={mode === "send" ? "submit" : "button"}
            variant="outline"
            size="icon"
            aria-label={mode === "voice" ? "Voice chat" : mode === "stop" ? "Stop" : "Send message"}
            disabled={disabled ?? false}
            onClick={handleClick}
            className={cn("rounded-full", isGenerating && "animate-pulse", className)}
            {...props}
          >
            {children ??
              (mode === "stop" ? (
                <HugeiconsIcon icon={SquareIcon} strokeWidth={2} />
              ) : mode === "voice" ? (
                <HugeiconsIcon icon={AudioWave01Icon} strokeWidth={2} />
              ) : (
                <HugeiconsIcon icon={SentIcon} />
              ))}
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};