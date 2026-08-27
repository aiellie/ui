"use client"

import { DemoCard } from "@/components/aiellie-ui/demo-card"
import { DemosSwitcher } from "@/components/aiellie-ui/demos-switcher"
import { cn } from "@/lib/utils"
import type { Example } from "@/registry/_demos"

/**
 * A list of examples laid out in one responsive grid, shared by every page that
 * shows cards. Which examples arrive here is the page's business — `/tokens`
 * passes the token ones, `/elements` the rest — so adding a demo is still an
 * item in `registry/_examples-registry.ts` and its components in
 * `registry/_demos.ts`, and nothing here needs to change.
 */
function ExamplesGrid({
  examples,
  className,
  ...props
}: React.ComponentProps<"div"> & { examples: Example[] }) {
  return (
    <div
      data-slot="examples-grid"
      className={cn("grid items-start gap-8 md:grid-cols-2", className)}
      {...props}
    >
      {examples.map((example, index) => (
        <DemoCard
          key={example.name}
          href={example.href}
          index={index + 1}
          title={example.title}
          description={example.description}
          icon={example.icon}
          wide={example.wide}
        >
          <DemosSwitcher
            variants={example.variants}
            installCommand={example.installCommand}
            demoInstallCommand={example.demoInstallCommand}
          />
        </DemoCard>
      ))}
    </div>
  )
}

export { ExamplesGrid }
