import type { DemoVariant } from "@/components/aiellie-ui/demos-switcher"
import { colorGroups, type ColorGroup, type ColorToken } from "@/lib/colors"
import { cn } from "@/lib/utils"

function Swatch({ token }: { token: ColorToken }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {/* The dotted backdrop is what makes a translucent token read as
          translucent rather than as an empty box. */}
      <div className="h-12 overflow-hidden rounded-lg border bg-dotted">
        <div className={cn("size-full", token.className)} />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-mono text-xs">{token.name}</span>
        <span className="truncate font-mono text-[0.6875rem] text-muted-foreground">
          {token.cssVar}
        </span>
      </div>
    </div>
  )
}

function ColorGroupDemo({ group }: { group: ColorGroup }) {
  return (
    // `pb-14` keeps the last row clear of the floating toolbar.
    <div className="flex h-full min-h-0 w-full flex-col gap-3 overflow-y-auto pb-14">
      <p className="shrink-0 text-xs text-muted-foreground">
        {group.description}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {group.tokens.map((token) => (
          <Swatch key={token.name} token={token} />
        ))}
      </div>
    </div>
  )
}

const colorsVariants: DemoVariant[] = colorGroups.map((group) => ({
  name: group.name,
  demo: () => <ColorGroupDemo group={group} />,
}))

export { colorsVariants }
