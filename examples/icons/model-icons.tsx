"use client"

import {
  CapabilityIcon,
  ModelIcon,
  ProviderIcon,
} from "@/components/icons/model-icons"
import { modelCapabilities, models, type ModelCapability } from "@/lib/models"
import { providers } from "@/lib/providers"
import { cn } from "@/lib/utils"

// `pb-14` keeps the last row clear of the floating toolbar.
const demoShell = "flex h-full min-h-0 w-full flex-col overflow-y-auto pb-14"

/**
 * Models wear their own colours by default — the logo is how a model is
 * recognised — so this tab is `ModelIcon` exactly as it comes.
 */
export function ModelIconsDemo() {
  return (
    <div className={cn(demoShell, "grid grid-cols-2 content-start gap-2")}>
      {models.map((model) => (
        <div
          key={model.id}
          className="flex min-w-0 items-center gap-2.5 rounded-lg border px-3 py-2"
        >
          <ModelIcon
            model={model.id}
            provider={model.provider}
            className="size-4 text-foreground"
          />
          <span className="truncate text-xs text-muted-foreground">
            {model.name}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Providers are monochrome by default — a run of full-colour logos down a
 * list reads as a sponsor list, not a menu — so this tab is the plain set.
 */
export function ModelIconsProvidersDemo() {
  return (
    <div className={cn(demoShell, "grid grid-cols-2 content-start gap-2")}>
      {providers.map((provider) => (
        <div
          key={provider.id}
          className="flex min-w-0 items-center gap-2.5 rounded-lg border px-3 py-2"
        >
          <ProviderIcon
            provider={provider.id}
            className="size-4 text-foreground"
          />
          <span className="truncate text-xs text-muted-foreground">
            {provider.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export function ModelIconsCapabilitiesDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      {(Object.keys(modelCapabilities) as ModelCapability[]).map(
        (capability) => (
          <div
            key={capability}
            className="flex min-w-0 items-center gap-2.5 rounded-lg border px-3 py-2"
          >
            <CapabilityIcon
              capability={capability}
              className="size-4 text-foreground"
            />
            <span className="text-xs font-medium">
              {modelCapabilities[capability].name}
            </span>
            <span className="ms-auto truncate ps-2 text-xs text-muted-foreground">
              {modelCapabilities[capability].description}
            </span>
          </div>
        )
      )}
    </div>
  )
}
