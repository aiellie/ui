"use client"

import { PaintBoardIcon, TextFontIcon } from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import { DemoCard } from "@/components/aiellie-ui/demo-card"
import {
  DemosSwitcher,
  type DemoVariant,
} from "@/components/aiellie-ui/demos-switcher"
import { colorsVariants } from "@/examples/colors-demos"
import { fontsVariants } from "@/examples/fonts-demos"
import { cn } from "@/lib/utils"

type Demo = {
  href: string
  title: string
  description: string
  icon: IconSvgElement
  variants: DemoVariant[]
  wide?: boolean
}

const demos: Demo[] = [
  {
    href: "/examples/colors",
    title: "Colors",
    description:
      "Semantic tokens from globals.css. Every swatch follows the active theme.",
    icon: PaintBoardIcon,
    variants: colorsVariants,
  },
  {
    href: "/examples/fonts",
    title: "Fonts",
    description:
      "Geist for the interface, JetBrains Mono for code. Sizes and weights follow the Tailwind scale.",
    icon: TextFontIcon,
    variants: fontsVariants,
  },
]

/** Every demo, laid out in one responsive grid. Add new demos to `demos`. */
function ElementsGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="elements-grid"
      className={cn("grid items-start gap-8 md:grid-cols-2", className)}
      {...props}
    >
      {demos.map((demo, index) => (
        <DemoCard
          key={demo.href}
          href={demo.href}
          index={index + 1}
          title={demo.title}
          description={demo.description}
          icon={demo.icon}
          wide={demo.wide}
        >
          <DemosSwitcher variants={demo.variants} />
        </DemoCard>
      ))}
    </div>
  )
}

export { ElementsGrid }
