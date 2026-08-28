import { ElementsBrowser } from "./components/elements-browser"
import { ElementsHeader } from "./components/elements-header"

export default function Page() {
  return (
    <div className="mx-auto w-full px-6 py-4 md:px-6">
      {/*<header className="flex flex-col gap-1">
        <ElementsHeader />
      </header> */}
      <ElementsBrowser />
    </div>
  )
}
