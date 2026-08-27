import { AiDrawingIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { examplesWithDemos } from "@/registry/_demos"

export function DesignHeader() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="flex items-center gap-2 text-lg font-medium">
          <HugeiconsIcon icon={AiDrawingIcon} className="size-4.5" />
          Design
        </h1>
        <span className="ms-auto font-mono text-[11px] tracking-tight text-foreground/30 tabular-nums">
          {String(examplesWithDemos.length).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-foreground/50">
        Small, composable pieces for AI interfaces — streaming, waiting, and the
        surfaces they sit on — and the colours and type they are built from.
      </p>
    </div>
  )
}
