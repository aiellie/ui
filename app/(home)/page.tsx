import { ExamplesGrid } from "@/examples/examples-grid"
import { ElementsHeader } from "./components/elements-header"
export default function Page() {
  return (
    <div className="min-h-svh p-6 md:p-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-1">
          <ElementsHeader />
        </header>
        <ExamplesGrid />
      </div>
    </div>
  )
}
