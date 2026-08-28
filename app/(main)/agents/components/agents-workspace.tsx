"use client"

import {
  MessageSquareDotIcon,
  TimelineListIcon,
  WorkflowSquare01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

/**
 * One region of the workspace: a header that stays put and a body that scrolls
 * under it.
 *
 * The header is pinned by the layout rather than by `sticky`, which is why the
 * panel wrapping it has to give up its own scrolling — see `pane` below.
 */
function Pane({
  icon,
  title,
  children,
}: {
  icon: IconSvgElement
  title: string
  children?: React.ReactNode
}) {
  return (
    <section className="flex h-full min-h-0 flex-col">
      <header className="flex h-9 shrink-0 items-center gap-2 border-b border-border/40 px-3">
        <HugeiconsIcon
          icon={icon}
          strokeWidth={2}
          className="size-3.5 shrink-0 text-foreground/40"
        />
        <h2 className="text-[12.5px] font-medium">{title}</h2>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </section>
  )
}

/**
 * A panel scrolls itself: the library writes `overflow: auto` inline on the
 * element the class name lands on, which no utility can outrank. Handing it
 * back as a style is the supported way round it — the prop is spread over the
 * defaults — and it is what lets each pane keep its own header still while only
 * the body underneath moves.
 */
const pane = { overflow: "hidden" } as const

/** The hairline only firms up under the pointer, so it reads as a divider first and a control second. */
const handle = "bg-border/50 transition-colors hover:bg-border active:bg-border"

/** Placeholder for a region that has nothing in it yet. */
function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 py-2.5 text-[12.5px] text-foreground/35">{children}</p>
  )
}

/**
 * The three regions an agent run is read across: what has been run, the run
 * itself, and the trace it left.
 *
 * They are one resizable group rather than a fixed grid because the reading
 * shifts — a long plan wants the trace wide, a conversation wants it out of the
 * way — and the split is the only thing on the page a reader would want to set
 * for themselves.
 */
function AgentsWorkspace() {
  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel
        id="sessions"
        defaultSize="18"
        minSize="14"
        maxSize="30"
        style={pane}
      >
        <Pane icon={TimelineListIcon} title="Sessions">
          <Empty>No runs yet.</Empty>
        </Pane>
      </ResizablePanel>

      <ResizableHandle withHandle className={handle} />

      <ResizablePanel id="run" defaultSize="82" minSize="30" style={pane}>
        <Pane icon={MessageSquareDotIcon} title="Run">
          <Empty>Pick a session to read it.</Empty>
        </Pane>
      </ResizablePanel>

      <ResizableHandle withHandle className={handle} />

      {/* Shut on arrival. The trace is what you go looking for once something
          in the run reads oddly, so it earns its width on being asked for
          rather than holding a quarter of the page open against the chance.
          `collapsible` is what makes 0 a resting size rather than a violation
          of `minSize` — dragging it back out snaps to the minimum. */}
      <ResizablePanel
        id="trace"
        collapsible
        defaultSize="0"
        minSize="16"
        maxSize="40"
        style={pane}
      >
        <Pane icon={WorkflowSquare01Icon} title="Trace">
          <Empty>Plans and tool calls land here.</Empty>
        </Pane>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export { AgentsWorkspace }
