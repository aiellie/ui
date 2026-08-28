"use client"

import * as React from "react"
import {
  InspectionPanelIcon,
  MachineRobotIcon,
} from "@hugeicons/core-free-icons"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { agents, findAgent } from "@/lib/agents"

import { AgentChat } from "./agent-chat"
import { AgentDetails } from "./agent-details"
import { AgentsSidebar } from "./agents-sidebar"
import { Pane, PaneEmpty } from "./pane"

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

/**
 * The three regions an agent is read across: which one you are talking to, the
 * conversation, and what is known about it.
 *
 * They are one resizable group rather than a fixed grid because the reading
 * shifts — a long plan wants the details wide, a conversation wants them out of
 * the way — and the split is the only thing on the page a reader would want to
 * set for themselves.
 *
 * The selection is held here because it is the one piece of state all three
 * regions are about: the sidebar sets it, and the other two are entirely a view
 * of it.
 */
function AgentsWorkspace() {
  const [selected, setSelected] = React.useState(agents[0]?.id ?? "")
  const agent = findAgent(selected)

  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel
        id="agents"
        defaultSize="18"
        minSize="14"
        maxSize="30"
        style={pane}
      >
        <Pane icon={MachineRobotIcon} title="Agents">
          <AgentsSidebar value={selected} onValueChange={setSelected} />
        </Pane>
      </ResizablePanel>

      <ResizableHandle withHandle className={handle} />

      <ResizablePanel id="chat" defaultSize="82" minSize="30" style={pane}>
        {/* Keyed by agent, so switching starts that agent's conversation
            rather than carrying the last one's thread across into it. */}
        {agent ? <AgentChat key={agent.id} agent={agent} /> : null}
      </ResizablePanel>

      <ResizableHandle withHandle className={handle} />

      {/* Shut on arrival. The details are what you go looking for once
          something in the thread reads oddly, so they earn their width on being
          asked for rather than holding a quarter of the page open against the
          chance. `collapsible` is what makes 0 a resting size rather than a
          violation of `minSize` — dragging it back out snaps to the minimum. */}
      <ResizablePanel
        id="details"
        collapsible
        defaultSize="0"
        minSize="16"
        maxSize="40"
        style={pane}
      >
        <Pane icon={InspectionPanelIcon} title="Details">
          {agent ? (
            <AgentDetails agent={agent} />
          ) : (
            <PaneEmpty>Pick an agent to see its details.</PaneEmpty>
          )}
        </Pane>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export { AgentsWorkspace }
