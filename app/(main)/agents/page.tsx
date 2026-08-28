import { AgentsWorkspace } from "./components/agents-workspace"

/**
 * The workspace takes the window rather than sitting in a column of its own.
 * A panel group divides a frame, so it needs one: given the document's height
 * the panels would grow with the page instead of splitting it, and the handles
 * would have nothing to move. `--header-height` is set by the layout.
 */
export default function Page() {
  return (
    <div className="h-[calc(100svh-var(--header-height))] overflow-hidden">
      <AgentsWorkspace />
    </div>
  )
}
