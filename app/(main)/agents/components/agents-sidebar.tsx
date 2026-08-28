"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { FilterHorizontalIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ghostButton } from "@/components/aiellie-ui/actions"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/aiellie-ui/menu"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { agentCategories, filterAgents } from "@/lib/agents"
import { cn } from "@/lib/utils"

import { Pane, PaneEmpty } from "./pane"

/**
 * The kit's ghost treatment, re-shaped for a full-width row — the same
 * data-scoped hover rules as `navButton`, and for the same reason: `ghostButton`
 * ends in a plain `hover:` tint that the selected row would otherwise fade to
 * on pointer-over, and these outrank it on specificity so the fill holds.
 */
const agentButton = cn(
  ghostButton,
  "w-full justify-start gap-2 rounded-lg px-2 py-1.5 text-[13px] font-medium",
  "data-[active=true]:bg-muted data-[active=true]:text-foreground",
  "data-[active=true]:hover:bg-muted data-[active=true]:hover:text-foreground",
  "dark:data-[active=true]:hover:bg-muted"
)

export interface AgentsSidebarProps {
  value: string
  onValueChange: (id: string) => void
}

/**
 * The catalogue as a list to pick from, with the search and the filter in the
 * header rather than in a bar under it: the pane is short on height and a row
 * of controls costs the same as three agents.
 *
 * It reads `lib/agents` directly rather than being handed the list — there is
 * one catalogue, and a sidebar that could be given a different one would only
 * be a way of showing the wrong agents. What "matches" means lives there too,
 * so this file holds the query and nothing about how it is applied.
 */
function AgentsSidebar({ value, onValueChange }: AgentsSidebarProps) {
  const [query, setQuery] = React.useState("")
  const [categories, setCategories] = React.useState<string[]>([])

  const shown = filterAgents({ query, categories })
  const filtered = categories.length > 0

  return (
    <Pane
      header={
        <>
          <HugeiconsIcon
            aria-hidden
            icon={Search01Icon}
            strokeWidth={1.75}
            className="size-3.5 shrink-0 text-muted-foreground/70"
          />
          <InputPrimitive
            // `role` rather than `type="search"`, which reads the same to a
            // screen reader but hands WebKit both the Escape key and a clear
            // cross of its own.
            type="text"
            role="searchbox"
            value={query}
            onValueChange={setQuery}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query !== "") setQuery("")
            }}
            placeholder="Search agents"
            aria-label="Search agents"
            className="min-w-0 flex-1 bg-transparent text-[12.5px] text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <Menu>
            <MenuTrigger
              render={
                <TooltipIconButton
                  tooltip="Filter"
                  // Lit while something is hidden, so a list that looks short
                  // says why without the menu having to be opened.
                  className={cn(
                    "-me-1 shrink-0",
                    filtered && "text-accent hover:text-accent"
                  )}
                />
              }
            >
              <HugeiconsIcon icon={FilterHorizontalIcon} />
            </MenuTrigger>
            <MenuContent align="end" aria-label="Filter agents">
              <MenuGroup>
                <MenuGroupLabel>Kind</MenuGroupLabel>
                {agentCategories.map((category) => (
                  <MenuCheckboxItem
                    key={category.id}
                    checked={categories.includes(category.id)}
                    onCheckedChange={(checked) =>
                      setCategories((previous) =>
                        checked
                          ? [...previous, category.id]
                          : previous.filter((id) => id !== category.id)
                      )
                    }
                    // Held open, because picking two kinds is two clicks and
                    // a menu that shuts between them is a menu reopened.
                    closeOnClick={false}
                  >
                    <HugeiconsIcon icon={category.icon} strokeWidth={2} />
                    {category.name}
                  </MenuCheckboxItem>
                ))}
              </MenuGroup>
              <MenuSeparator />
              <MenuItem disabled={!filtered} onClick={() => setCategories([])}>
                Show every kind
              </MenuItem>
            </MenuContent>
          </Menu>
        </>
      }
    >
      <nav
        aria-label="Agents"
        className="flex h-full flex-col gap-px overflow-y-auto p-1.5"
      >
        {shown.map((agent) => (
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
              strokeWidth={2}
              className="size-4 shrink-0"
            />
            <span className="truncate">{agent.name}</span>
          </button>
        ))}
        {shown.length === 0 ? (
          <PaneEmpty>
            {query.trim()
              ? `Nothing matching “${query.trim()}”.`
              : "Nothing to show."}
          </PaneEmpty>
        ) : null}
      </nav>
    </Pane>
  )
}

export { AgentsSidebar }
