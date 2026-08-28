"use client"

import { InspectionPanelIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ChatAvatarImage } from "@/components/aiellie-ui/chat-avatar"
import { findAgentCategory, type Agent } from "@/lib/agents"

import { Pane, PaneTitle } from "./pane"

/** One fact about the agent, said as a term and its value. */
function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 text-foreground/45">{term}</dt>
      <dd className="truncate">{children}</dd>
    </div>
  )
}

/**
 * What is known about the agent on screen. Undecided as a surface — it is the
 * panel a run's plan and tool calls will end up in — so for now it says the
 * plain facts of the entry it was given rather than standing an empty frame
 * where those will go.
 */
function AgentDetails({ agent }: { agent: Agent }) {
  const category = findAgentCategory(agent.category)

  return (
    <Pane header={<PaneTitle icon={InspectionPanelIcon}>Details</PaneTitle>}>
      <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <ChatAvatarImage
            src={agent.avatar}
            className="[--chat-avatar-size:3.5rem]"
            fallback={
              <HugeiconsIcon
                icon={agent.icon}
                strokeWidth={1.5}
                className="size-6"
              />
            }
          />
          <div>
            <p className="text-[13px] font-medium">{agent.name}</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-balance text-muted-foreground">
              {agent.description}
            </p>
          </div>
        </div>

        <dl className="flex flex-col gap-2 border-t border-border/40 pt-3 text-[12px]">
          <Row term="Identifier">
            <span className="font-mono text-[11px] tracking-tight">
              {agent.id}
            </span>
          </Row>
          {category ? <Row term="Kind">{category.name}</Row> : null}
        </dl>
      </div>
    </Pane>
  )
}

export { AgentDetails }
