import { ElementsGrid } from "@/app/(main)/elements/components/elements-grid"
import { ElementsHeader } from "./components/elements-header"
export default function Page() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <header className="flex flex-col gap-1">
          <ElementsHeader />
        </header>
        <div className="mx-auto w-full max-w-6xl pt-6">
        <ElementsGrid />
        </div>
    </div>
  )
}
