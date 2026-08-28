import { ElementsBrowser } from "./components/elements-browser"

/**
 * The rail lives in the layout rather than the page so it survives the move
 * from one example to the next: a layout is what Next keeps mounted across a
 * navigation within it, which is what holds the rail's scroll position and the
 * width it was dragged to.
 *
 * A panel group divides a frame, so it needs one: given the document's height
 * the panels would grow with the page instead of splitting it, and the handle
 * would have nothing to move. `--header-height` is set by the layout above,
 * the same way /agents measures against it.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[calc(100svh-var(--header-height))] overflow-hidden">
      <ElementsBrowser>{children}</ElementsBrowser>
    </div>
  )
}
