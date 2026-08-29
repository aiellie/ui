"use client"

import * as React from "react"

import {
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/components/aiellie-ui/menu"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { cn } from "@/lib/utils"

/**
 * The frame a generation is asked to fill, chosen from a composer's toolbar.
 *
 * A generator's one honest setting besides the model: everything else about a
 * picture is in the prompt, but the canvas has to be named before the pixels
 * exist. The catalogue speaks in words a person uses — square, wide, tall —
 * with the provider's `w:h` string riding along as the value.
 */

export interface Ratio {
  /** The `w:h` the provider is handed — `"16:9"`. */
  id: string
  /** The word a person would use for it. */
  name: string
  /** Width over height, for drawing the little frame. */
  ratio: number
}

const defaultRatios: Ratio[] = [
  { id: "1:1", name: "Square", ratio: 1 },
  { id: "3:2", name: "Landscape", ratio: 3 / 2 },
  { id: "16:9", name: "Wide", ratio: 16 / 9 },
  { id: "3:4", name: "Portrait", ratio: 3 / 4 },
  { id: "9:16", name: "Tall", ratio: 9 / 16 },
]

export function findRatio(id: string, ratios: Ratio[] = defaultRatios) {
  return ratios.find((ratio) => ratio.id === id)
}

/**
 * The glyph is the value: an empty frame in the proportion being named. Not a
 * Hugeicons mark and deliberately so — the icon rule exists so glyphs come
 * from one drawn set, but no set draws "3:2 as opposed to 16:9"; this is a
 * diagram of the choice, the way the effort menu's bars are a diagram of a
 * level, and a borrowed rectangle icon would show the wrong proportions on
 * every row but one.
 */
function RatioFrame({
  ratio,
  className,
}: {
  ratio: number
  className?: string
}) {
  const wide = ratio >= 1

  return (
    <span
      aria-hidden
      style={{ aspectRatio: String(ratio) }}
      className={cn(
        "shrink-0 rounded-[3px] border-[1.5px] border-current",
        wide ? "w-4" : "h-4",
        className
      )}
    />
  )
}

type RatioMenuContextValue = {
  value: string
  setValue: (next: string) => void
  ratios: Ratio[]
}

const RatioMenuContext = React.createContext<RatioMenuContextValue | undefined>(
  undefined
)

function useRatioMenuContext(part: string) {
  const context = React.useContext(RatioMenuContext)
  if (!context) throw new Error(`${part} must be used within a RatioMenu.`)
  return context
}

export interface RatioMenuProps extends Omit<
  React.ComponentProps<typeof Menu>,
  "children"
> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  ratios?: Ratio[]
  children?: React.ReactNode
}

export function RatioMenu({
  value: valueProp,
  defaultValue = "1:1",
  onValueChange,
  ratios = defaultRatios,
  children,
  ...props
}: RatioMenuProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolled

  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setUncontrolled(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const context = React.useMemo(
    () => ({ value, setValue, ratios }),
    [value, setValue, ratios]
  )

  return (
    <RatioMenuContext.Provider value={context}>
      <Menu data-slot="ratio-menu" {...props}>
        {children}
      </Menu>
    </RatioMenuContext.Provider>
  )
}

/**
 * The trigger wears the chosen frame, so the toolbar answers "what shape" at
 * a glance the way the model picker answers "who". `showLabel` adds the word
 * for a toolbar with room to say it.
 */
export function RatioMenuTrigger({
  showLabel = false,
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuTrigger> & { showLabel?: boolean }) {
  const { value, ratios } = useRatioMenuContext("RatioMenuTrigger")
  const ratio = findRatio(value, ratios)

  return (
    <MenuTrigger
      data-slot="ratio-menu-trigger"
      aria-label={ratio ? `Aspect ratio: ${ratio.name}` : "Aspect ratio"}
      render={
        <TooltipIconButton
          type="button"
          tooltip={ratio?.name ?? "Aspect ratio"}
          side="top"
          className={cn(
            "size-7 text-muted-foreground hover:text-foreground",
            showLabel && "w-fit gap-1.5 rounded-full px-2.5",
            className
          )}
        />
      }
      {...props}
    >
      {children ?? (
        <>
          <RatioFrame ratio={ratio?.ratio ?? 1} />
          {showLabel && ratio ? <span>{ratio.name}</span> : null}
        </>
      )}
    </MenuTrigger>
  )
}

export function RatioMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  const { value, setValue, ratios } = useRatioMenuContext("RatioMenuContent")

  return (
    <MenuContent
      data-slot="ratio-menu-content"
      className={cn("w-44", className)}
      {...props}
    >
      {children ?? (
        <MenuRadioGroup
          value={value}
          onValueChange={(next) => setValue(String(next))}
        >
          {ratios.map((ratio) => (
            <MenuRadioItem key={ratio.id} value={ratio.id}>
              {/* The frames hang from one centre line so the row of them
                  reads as one shape changing, not five shapes jittering. */}
              <span className="flex w-5 justify-center">
                <RatioFrame
                  ratio={ratio.ratio}
                  className="text-foreground/60"
                />
              </span>
              <span className="flex-1">{ratio.name}</span>
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {ratio.id}
              </span>
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      )}
    </MenuContent>
  )
}
