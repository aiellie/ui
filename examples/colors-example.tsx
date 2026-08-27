import { PaintBoardIcon } from "@hugeicons/core-free-icons"

import { Example, ExampleSection, type ExampleProps } from "@/examples/example"
import { colorGroups, type ColorToken } from "@/lib/colors"
import { cn } from "@/lib/utils"

type ColorsExampleProps = Omit<
  ExampleProps,
  "title" | "icon" | "description" | "children"
>

function ColorsExample(props: ColorsExampleProps) {
  return (
    <Example
      title="Colors"
      icon={PaintBoardIcon}
      description="Semantic tokens from globals.css. Every swatch follows the active theme."
      {...props}
    >
      {colorGroups.map((group) => (
        <ExampleSection
          key={group.name}
          label={group.name}
          description={group.description}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {group.tokens.map((token) => (
              <Swatch key={token.name} token={token} />
            ))}
          </div>
        </ExampleSection>
      ))}
    </Example>
  )
}

function Swatch({ token }: { token: ColorToken }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
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

export { ColorsExample }
