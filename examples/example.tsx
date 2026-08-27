import * as React from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { ExampleToolbar } from "@/examples/example-toolbar"
import { cn } from "@/lib/utils"

type ExampleProps = Omit<React.ComponentProps<"section">, "title"> & {
  title: string
  /** Hugeicons glyph shown beside the title. */
  icon?: IconSvgElement
  description?: string
  /** Extra classes for the scrolling panel, e.g. to change its padding. */
  contentClassName?: string
}

function isSection(
  child: React.ReactNode
): child is React.ReactElement<ExampleSectionProps> {
  return React.isValidElement(child) && child.type === ExampleSection
}

/**
 * A card holding one worked example. It stays a server component on purpose:
 * splitting `children` into sections relies on comparing each child's type
 * against `ExampleSection`, and that identity only holds while both sides live
 * in the same module graph. Handing the split list to a client component keeps
 * the interactive part small and the comparison correct — done the other way
 * round, every child arrives as an opaque client reference and matches nothing.
 */
function Example({
  title,
  icon,
  description,
  className,
  contentClassName,
  children,
  ...props
}: ExampleProps) {
  // Sections become tabs; anything else stays pinned above them.
  const items = React.Children.toArray(children)
  const tabs = items.filter(isSection).map((section, index) => ({
    value: String(index),
    label: section.props.label,
    content: section,
  }))
  const rest = items.filter((child) => !isSection(child))

  return (
    <section
      data-slot="example"
      className={cn(
        "flex max-h-[32rem] flex-col overflow-hidden rounded-xl border bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      <header
        data-slot="example-header"
        className="flex shrink-0 flex-col gap-1 border-b px-5 py-4"
      >
        <div className="flex items-center gap-2">
          {icon ? (
            <HugeiconsIcon
              icon={icon}
              strokeWidth={2}
              className="size-4 shrink-0 text-muted-foreground"
            />
          ) : null}
          <h2 className="text-sm leading-none font-medium">{title}</h2>
        </div>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <ExampleToolbar tabs={tabs} contentClassName={contentClassName}>
        {rest}
      </ExampleToolbar>
    </section>
  )
}

type ExampleSectionProps = React.ComponentProps<"div"> & {
  label: string
  description?: string
}

/** A labelled block inside an example, surfaced as one tab of its toolbar. */
function ExampleSection({
  label,
  description,
  className,
  children,
  ...props
}: ExampleSectionProps) {
  return (
    <div
      data-slot="example-section"
      role="tabpanel"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <div className="flex flex-col gap-0.5">
        <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </h3>
        {description ? (
          <p className="text-xs text-muted-foreground/70">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}

export { Example, ExampleSection }
export type { ExampleProps, ExampleSectionProps }
