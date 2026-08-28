"use client"

import { useEffect, useState } from "react"

/**
 * The clipboard without the async API: a hidden textarea, selected and copied
 * through the old editor command. Still worth carrying — `navigator.clipboard`
 * is absent on insecure origins, which is where a local preview usually runs.
 */
function legacyCopyToClipboard(value: string) {
  const textArea = document.createElement("textarea")
  textArea.value = value
  textArea.setAttribute("readonly", "")
  textArea.style.position = "fixed"
  textArea.style.opacity = "0"
  textArea.style.pointerEvents = "none"

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  textArea.setSelectionRange(0, value.length)

  let hasCopied = false
  try {
    hasCopied = document.execCommand("copy")
  } catch {
    hasCopied = false
  }

  document.body.removeChild(textArea)
  return hasCopied
}

export interface UseCopyToClipboardOptions {
  /** How long `isCopied` holds; 0 keeps it up until something clears it. */
  timeout?: number
  onCopy?: () => void
}

/**
 * Writes text to the clipboard and reports it for a moment after, so a button
 * can swap to a tick without keeping a timer of its own.
 *
 * `copyToClipboard` resolves to whether the write actually landed: a refused
 * permission, or a call made outside a user gesture, leaves `isCopied` false
 * rather than confirming something that never happened.
 */
export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
}: UseCopyToClipboardOptions = {}) {
  /* A count rather than a flag: copying again while the tick is still up
     bumps it, and the effect below restarts on the new value instead of
     letting the first copy's deadline cut the second one short. */
  const [copies, setCopies] = useState(0)
  const isCopied = copies > 0

  useEffect(() => {
    if (copies === 0 || timeout === 0) return
    const id = setTimeout(() => setCopies(0), timeout)
    return () => clearTimeout(id)
  }, [copies, timeout])

  const copyToClipboard = async (value: string) => {
    if (typeof window === "undefined" || !value) return false

    let hasCopied = false

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value)
        hasCopied = true
      } catch {
        hasCopied = legacyCopyToClipboard(value)
      }
    } else {
      hasCopied = legacyCopyToClipboard(value)
    }

    if (!hasCopied) return false

    setCopies((count) => count + 1)
    onCopy?.()

    return true
  }

  return { isCopied, copyToClipboard }
}
