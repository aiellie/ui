"use client"

import { HugeiconsIcon } from "@hugeicons/react"

import { ghostButton } from "@/components/aiellie-ui/actions"
import { agents } from "@/lib/agents"
import { cn } from "@/lib/utils"

/**
 * The kit's ghost treatment, re-shaped for a full-width row — the same
 * data-scoped hover rules as `navButton`, and for the same reason: `ghostButton`
 * ends in a plain `hover:` tint that the selected row would otherwise fade to
 * on pointer-over, and these outrank it on specificity so the fill holds.
 */
const agentButton = cn(
  ghostButton,
  "w-full justify-start gap-2 rounded-lg px-2 py-1.5 text-[13px]",
  "data-[active=true]:bg-muted data-[active=true]:text-foreground",
  "data-[active=true]:hover:bg-muted data-[active=true]:hover:text-foreground",
  "dark:data-[active=true]:hover:bg-muted"
)

export interface AgentsSidebarProps {
  value: string
  onValueChange: (id: string) => void
}

/**
 * The catalogue as a list to pick from. It reads `lib/agents` directly rather
 * than being handed the list: there is one catalogue, and a sidebar that could
 * be given a different one would only be a way of showing the wrong agents.
 */
function AgentsSidebar({ value, onValueChange }: AgentsSidebarProps) {
  return (
    <nav
      aria-label="Agents"
      className="flex h-full flex-col gap-px overflow-y-auto p-1.5"
    >
      {agents.map((agent) => (
        <button
          key={agent.id}
          type="button"
          data-active={agent.id === value}
          aria-current={agent.id === value ? "true" : undefined}
          onClick={() => onValueChange(agent.id)}
          className={agentButton}
        >
          <HugeiconsIcon
            icon={agent.icon}
            strokeWidth={1.75}
            className="size-4 shrink-0"
          />
          <span className="truncate">{agent.name}</span>
        </button>
      ))}
    </nav>
  )
}

export { AgentsSidebar }
