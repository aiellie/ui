import { TextFontIcon } from "@hugeicons/core-free-icons"

import { Example, ExampleSection, type ExampleProps } from "@/examples/example"
import { fontFamilies, fontWeights, typeScale } from "@/lib/fonts"
import { cn } from "@/lib/utils"

type FontsExampleProps = Omit<
  ExampleProps,
  "title" | "icon" | "description" | "children"
>

function FontsExample(props: FontsExampleProps) {
  return (
    <Example
      title="Fonts"
      icon={TextFontIcon}
      description="Geist for the interface, JetBrains Mono for code. Sizes and weights follow the Tailwind scale."
      {...props}
    >
      <ExampleSection
        label="Families"
        description="Loaded with next/font and exposed as CSS variables."
      >
        <div className="flex flex-col gap-3">
          {fontFamilies.map((family) => (
            <div
              key={family.name}
              className="flex min-w-0 flex-col gap-2 rounded-lg border p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium">{family.name}</span>
                <span className="shrink-0 font-mono text-[0.6875rem] text-muted-foreground">
                  {family.cssVar}
                </span>
              </div>
              <p className={cn("truncate text-lg", family.className)}>
                {family.sample}
              </p>
              <span className="text-xs text-muted-foreground">
                {family.role}
              </span>
            </div>
          ))}
        </div>
      </ExampleSection>

      <ExampleSection
        label="Scale"
        description="Size over line height, in pixels at the browser default."
      >
        <div className="flex flex-col">
          {typeScale.map((step) => (
            <div
              key={step.className}
              className="flex items-baseline justify-between gap-4 border-b py-2.5 last:border-b-0"
            >
              <span className={cn("min-w-0 flex-1 truncate", step.className)}>
                The quick brown fox
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {step.className} · {step.size}/{step.lineHeight}
              </span>
            </div>
          ))}
        </div>
      </ExampleSection>

      <ExampleSection
        label="Weights"
        description="Geist is a variable font, so every step is a single file."
      >
        <div className="flex flex-col">
          {fontWeights.map((weight) => (
            <div
              key={weight.className}
              className="flex items-baseline justify-between gap-4 border-b py-2.5 last:border-b-0"
            >
              <span className={cn("min-w-0 flex-1 truncate", weight.className)}>
                {weight.name}
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {weight.className} · {weight.value}
              </span>
            </div>
          ))}
        </div>
      </ExampleSection>
    </Example>
  )
}

export { FontsExample }
