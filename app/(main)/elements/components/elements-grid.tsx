"use client"

import { DemoCard } from "@/components/aiellie-ui/demo-card"
import { DemosSwitcher } from "@/components/aiellie-ui/demos-switcher"
import { cn } from "@/lib/utils"
import { examplesWithDemos } from "@/registry/_demos"

/**
 * Every example in the registry, laid out in one responsive grid. Add a demo by
 * adding its item to `registry/_examples-registry.ts` and its components to
 * `registry/_demos.ts` — nothing here needs to change.
 */
function ElementsGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="elements-grid"
      className={cn("grid items-start gap-8 md:grid-cols-2", className)}
      {...props}
    >
      {examplesWithDemos.map((example, index) => (
        <DemoCard
          key={example.name}
          href={example.href}
          index={index + 1}
          title={example.title}
          description={example.description}
          icon={example.icon}
          wide={example.wide}
        >
          <DemosSwitcher variants={example.variants} />
        </DemoCard>
      ))}
    </div>
  )
}

export { ElementsGrid }
