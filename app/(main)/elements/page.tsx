import { ElementsSections } from "./components/elements-sections"
import { ElementsHeader } from "./components/elements-header"

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
      <header className="flex flex-col gap-1">
        <ElementsHeader />
      </header>
      <ElementsSections />
    </div>
  )
}
