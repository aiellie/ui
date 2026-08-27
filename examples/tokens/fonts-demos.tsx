import { fontFamilies, fontWeights, typeScale } from "@/lib/fonts"
import { cn } from "@/lib/utils"

// `pb-14` keeps the last row clear of the floating toolbar.
const demoShell = "flex h-full min-h-0 w-full flex-col overflow-y-auto pb-14"

function FamiliesDemo() {
  return (
    <div className={cn(demoShell, "gap-3")}>
      {fontFamilies.map((family) => (
        <div
          key={family.name}
          className="flex min-w-0 shrink-0 flex-col gap-2 rounded-lg border p-4"
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
          <span className="text-xs text-muted-foreground">{family.role}</span>
        </div>
      ))}
    </div>
  )
}

function ScaleDemo() {
  return (
    <div className={demoShell}>
      {typeScale.map((step) => (
        <div
          key={step.className}
          className="flex shrink-0 items-baseline justify-between gap-4 border-b py-2.5 last:border-b-0"
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
  )
}

function WeightsDemo() {
  return (
    <div className={demoShell}>
      {fontWeights.map((weight) => (
        <div
          key={weight.className}
          className="flex shrink-0 items-baseline justify-between gap-4 border-b py-2.5 last:border-b-0"
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
  )
}

// Which tab shows which of these is settled by `meta.variants` on the
// `fonts-demo` registry item.
export { FamiliesDemo, ScaleDemo, WeightsDemo }
