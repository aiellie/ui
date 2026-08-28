import Link from "next/link"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

type ElementHeaderProps = {
  href: string
  index: number
  title: string
  description: string
  /** Hugeicons glyph shown beside the title. */
  icon?: IconSvgElement
}

/**
 * What an example is called and what it is for: its place in its category, its
 * glyph, its name as a link to itself, and the line underneath saying what it
 * does.
 *
 * Kept apart from `DemoCard`, which is now only the stage — a caption is not
 * the frame's business, and the two are wanted in different places: the card
 * fills a page on its own, and this goes wherever the naming belongs.
 *
 * Nothing imports it yet.
 */
function ElementHeader({
  href,
  index,
  title,
  description,
  icon,
}: ElementHeaderProps) {
  return (
    <div data-slot="element-header">
      <Link href={href} className="group/link flex items-baseline gap-2.5">
        <span className="font-mono text-[11px] tracking-tight text-foreground/30 tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
        {icon ? (
          <HugeiconsIcon
            icon={icon}
            strokeWidth={2}
            className="size-3.5 shrink-0 self-center text-foreground/40"
          />
        ) : null}
        <h3 className="text-[13.5px] font-medium group-hover/link:underline group-hover/link:underline-offset-4">
          {title}
        </h3>
      </Link>
      <p className="mt-1 text-[13px] leading-relaxed text-foreground/50">
        {description}
      </p>
    </div>
  )
}

export { ElementHeader }
export type { ElementHeaderProps }
