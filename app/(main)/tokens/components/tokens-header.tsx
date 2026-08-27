import { PaletteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function TokensHeader() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="flex items-center gap-2 text-lg font-medium">
          <HugeiconsIcon icon={PaletteIcon} className="size-4.5" />
          Tokens
        </h1>
      </div>
      <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-foreground/50">
        The values every element is built from — the colours they are painted
        in, and the type they are set in.
      </p>
    </div>
  )
}
