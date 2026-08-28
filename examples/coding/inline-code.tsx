"use client"

import {
  InlineCode,
  InlineCodeCopy,
  InlineCodeLink,
} from "@/components/aiellie-ui/code/inline-code"

export function InlineCodeDemo() {
  return (
    <p className="max-w-sm text-sm leading-relaxed text-pretty text-foreground">
      Every part carries a <InlineCode>data-slot</InlineCode>, and state goes on
      data attributes too — <InlineCode>data-active</InlineCode>,{" "}
      <InlineCode>data-busy</InlineCode> — so a consumer can style a state
      without re-implementing it.
    </p>
  )
}

/** The chip that copies itself, which is what a symbol worth naming is for. */
export function InlineCodeCopyDemo() {
  return (
    <p className="max-w-sm text-sm leading-relaxed text-pretty text-foreground">
      Add it with{" "}
      <InlineCodeCopy copy="npx shadcn@latest add https://ui.aiellie.dev/r/inline-code.json">
        npx shadcn add inline-code
      </InlineCodeCopy>
      , then set the tint with <InlineCodeCopy>--primary</InlineCodeCopy> and
      everything derived from it follows.
    </p>
  )
}

/** A symbol that leads somewhere, as a real link so a modified click works. */
export function InlineCodeLinkDemo() {
  return (
    <p className="max-w-sm text-sm leading-relaxed text-pretty text-foreground">
      The scanner is{" "}
      <InlineCodeLink href="#tokenize">tokenize()</InlineCodeLink> in{" "}
      <InlineCodeLink href="#highlight">lib/highlight</InlineCodeLink>, and the
      badge is <InlineCodeLink href="#iconFor">iconFor()</InlineCodeLink> in{" "}
      <InlineCodeLink href="#code-icons">lib/code-icons</InlineCodeLink>.
    </p>
  )
}

/**
 * Sized in `em`, so the same chip comes out a shade smaller than whatever it
 * is set among rather than snapping to one size everywhere.
 */
export function InlineCodeScaleDemo() {
  return (
    <div className="flex max-w-sm flex-col gap-3 text-foreground">
      <h3 className="text-lg font-medium">
        Deriving <InlineCode>--primary</InlineCode>
      </h3>
      <p className="text-sm leading-relaxed">
        The tinted bubble is <InlineCode>oklch(from …)</InlineCode> at a fixed
        lightness.
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Change <InlineCode>--primary</InlineCode> and the set stays coherent.
      </p>
    </div>
  )
}
