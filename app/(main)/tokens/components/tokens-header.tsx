import { TokenCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { tokenExamples } from "@/registry/_demos"

export function TokensHeader() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="flex items-center gap-2 text-lg font-medium">
          <HugeiconsIcon icon={TokenCircleIcon} className="size-4.5" />
          Tokens
        </h1>
        <span className="ms-auto font-mono text-[11px] tracking-tight text-foreground/30 tabular-nums">
          {String(tokenExamples.length).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-foreground/50">
        The values every element is built from — the colours they are painted
        in, and the type they are set in.
      </p>
    </div>
  )
}
