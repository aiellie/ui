import { ElementsBrowser } from "./components/elements-browser"
import { ElementsHeader } from "./components/elements-header"

export default function Page() {
  return (
    /* A panel group divides a frame, so it needs one: given the document's
       height the panels would grow with the page instead of splitting it, and
       the handle would have nothing to move. `--header-height` is set by the
       layout, the same way /agents measures against it. */
    <div className="h-[calc(100svh-var(--header-height))] overflow-hidden">
      {/*<header className="flex flex-col gap-1">
        <ElementsHeader />
      </header> */}
      <ElementsBrowser />
    </div>
  )
}
