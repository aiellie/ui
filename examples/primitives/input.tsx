"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function InputDemo() {
  return (
    <div className="w-full max-w-xs">
      <Input type="text" placeholder="Name the thread" />
    </div>
  )
}

/**
 * Invalid arrives as `aria-invalid` rather than a prop of the field's own, so
 * the state the styling answers to is the one assistive tech is told about.
 */
export function InputStatesDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Input type="text" placeholder="At rest" />
      <Input type="text" placeholder="Disabled" disabled />
      <Input
        type="email"
        aria-invalid
        aria-label="Email"
        defaultValue="not-an-address"
      />
    </div>
  )
}

export function InputWithButtonDemo() {
  return (
    <form
      className="flex w-full max-w-xs items-center gap-2"
      onSubmit={(event) => event.preventDefault()}
    >
      <Input type="email" placeholder="you@example.com" aria-label="Email" />
      <Button type="submit" variant="outline">
        Invite
      </Button>
    </form>
  )
}
