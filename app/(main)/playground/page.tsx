import { TestTube01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
      <header className="flex flex-col gap-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="flex items-center gap-2 text-lg font-medium">
              <HugeiconsIcon icon={TestTube01Icon} className="size-4.5" />
              Playground
            </h1>
          </div>
          <p className="text-foreground/50 mt-1.5 max-w-md text-[13.5px] leading-relaxed">
            A scratch surface for composing elements together before they earn
            a card.
          </p>
        </div>
      </header>
    </div>
  )
}
