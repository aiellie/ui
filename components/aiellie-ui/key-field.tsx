"use client"

import * as React from "react"
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/**
 * A key of the reader's own, kept in the reader's own browser.
 *
 * A demo that can really call a provider needs a credential, and the only
 * honest place for somebody else's credential is their machine: this field
 * writes to `localStorage` and nowhere further, so the key survives a reload,
 * never rides in a URL, and never touches a server this site runs. What the
 * key is then *sent to* is the caller's business, and worth saying in the
 * hint under the field — a secret box with no word on where the secret goes
 * is asking for more trust than it has earned.
 */

/** Notifies same-tab readers; the browser only fires `storage` across tabs. */
const emitter = new EventTarget()

function readKey(storageKey: string) {
  // Guarded rather than assumed: the same code renders on the server, and a
  // browser with storage blocked throws on the accessor itself.
  try {
    return window.localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

/**
 * The stored key, live. `useSyncExternalStore` because storage is exactly the
 * kind of thing it exists for — external, shared between components, and
 * changed by hands other than this render's (another tab included).
 */
export function useStoredKey(storageKey: string) {
  const key = React.useSyncExternalStore(
    React.useCallback(
      (onChange) => {
        emitter.addEventListener(storageKey, onChange)
        window.addEventListener("storage", onChange)
        return () => {
          emitter.removeEventListener(storageKey, onChange)
          window.removeEventListener("storage", onChange)
        }
      },
      [storageKey]
    ),
    () => readKey(storageKey),
    // The server has no storage and must not pretend to: a null first paint
    // that fills in on the client is the truthful order of events.
    () => null
  )

  const setKey = React.useCallback(
    (value: string) => {
      try {
        if (value) window.localStorage.setItem(storageKey, value)
        else window.localStorage.removeItem(storageKey)
      } catch {
        // Storage refused; the key simply will not persist, which the reader
        // will see the next time the page loads. Nothing useful to throw at.
      }
      emitter.dispatchEvent(new Event(storageKey))
    },
    [storageKey]
  )

  return [key, setKey] as const
}

export interface KeyFieldProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** Where the key lives in storage. Scope it: `"aiellie:gemini-key"`. */
  storageKey: string
  label: React.ReactNode
  placeholder?: string
  /** Where the key goes. Every field should be able to answer that. */
  hint?: React.ReactNode
}

export function KeyField({
  storageKey,
  label,
  placeholder = "Paste an API key…",
  hint = "Kept in this browser's storage and sent only to the provider.",
  className,
  ...props
}: KeyFieldProps) {
  const [key, setKey] = useStoredKey(storageKey)
  const [revealed, setRevealed] = React.useState(false)
  const id = React.useId()

  return (
    <div
      data-slot="key-field"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      <label htmlFor={id} className="text-xs font-medium">
        {label}
      </label>
      <div className="flex items-center gap-1">
        <Input
          id={id}
          /* `password` until revealed — not for security theatre, but because
             a key on a shared screen is a key shared. */
          type={revealed ? "text" : "password"}
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={key ?? ""}
          /* Saved as typed: a key arrives by paste, and a paste that then
             needs a save button found is a paste that gets lost. Emptying
             the field is how it is forgotten, and the hint says where it
             lived so the reader knows what emptying undoes. */
          onChange={(event) => setKey(event.target.value)}
        />
        <TooltipIconButton
          tooltip={revealed ? "Hide key" : "Show key"}
          aria-pressed={revealed}
          onClick={() => setRevealed((current) => !current)}
        >
          <HugeiconsIcon icon={revealed ? ViewOffIcon : ViewIcon} />
        </TooltipIconButton>
      </div>
      {hint ? (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
