import { AiElementsIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { elementExamples } from "@/registry/_demos"

export function ElementsHeader() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="flex items-center gap-2 text-lg font-medium">
          <HugeiconsIcon icon={AiElementsIcon} className="size-4.5" />
          Elements
        </h1>
        <span className="ms-auto font-mono text-[11px] tracking-tight text-foreground/30 tabular-nums">
          {String(elementExamples.length).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-foreground/50">
        Small, composable pieces for AI interfaces — streaming, waiting, and the
        surfaces they sit on.
      </p>
    </div>
  )
}
