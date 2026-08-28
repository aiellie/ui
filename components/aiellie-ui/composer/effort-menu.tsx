"use client"

import * as React from "react"
import { Slider } from "@base-ui/react/slider"

import { Menu, MenuContent, MenuTrigger } from "@/components/aiellie-ui/menu"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { cn } from "@/lib/utils"

/**
 * How hard the model is asked to think, set from the composer — the third of
 * the questions asked per message rather than once in settings, next to which
 * model is answering and what it may reach for.
 *
 * A slider rather than a list of rows, because effort is the one of the three
 * that is *ordered*: low and ultra are not two options, they are the two ends
 * of the same thing, and a menu of six rows says nothing about which is more
 * than which. Dragging along a ladder is the gesture the setting already is.
 *
 * The trigger is the same ladder drawn small — bars that fill as the slider
 * moves, so the answer to "how hard is it thinking?" is on the composer rather
 * than one click inside it. That is also why the popup does not close when a
 * rung is chosen: the point of a control whose trigger reflects it is watching
 * the reflection, and a menu that shuts on the first drag never shows it.
 *
 * The surface is `menu`'s, whole. What this file adds is the ladder itself,
 * the sentence on each rung, and the one thing a menu has no opinion about:
 * that the trigger draws one bar per entry in the catalogue and fills them to
 * the value, so the glyph and the ladder cannot fall out of step.
 */

interface Effort {
  /**
   * What the rung is stored and sent as — the value a request carries, so a
   * transcript can be read straight against this list.
   */
  id: string
  /** The same thing written the way it is spoken, for a label and a stop. */
  name: string
  /**
   * One line on what the rung buys and what it costs — the reason a reader
   * would move the slider here rather than to the stop beside it. Kept to
   * about two lines at the width the menu draws it: the popup holds the room
   * whichever rung is chosen, and a third line would make it jump as the
   * slider was dragged past.
   */
  description: string
}

/**
 * The ladder, least first. The order of this list *is* the setting — the
 * slider's stops are its indices and the trigger draws one bar per entry — so
 * a seventh rung is a line here and nothing else, and taking one away narrows
 * the glyph to match without a class being touched.
 *
 * Six is more than a setting needs, deliberately. The ends are not there to be
 * chosen often but to say how much room there is, which is what makes the
 * middle legible as the middle.
 */
const efforts: Effort[] = [
  {
    id: "low",
    name: "Low",
    description:
      "Answers straight off. For work with no puzzle in it — reformat this, list that.",
  },
  {
    id: "medium",
    name: "Medium",
    description:
      "A moment's thought first. The rung most questions want, and the one to leave it on.",
  },
  {
    id: "high",
    name: "High",
    description:
      "Works the problem through before it starts writing. Multi-step questions live here.",
  },
  {
    id: "extra",
    name: "Extra",
    description:
      "Takes the long way round, checking its own reasoning as it goes rather than after.",
  },
  {
    id: "max",
    name: "Max",
    description:
      "Everything the model has. Slow and dear, and worth it when being wrong costs more.",
  },
  {
    id: "ultra",
    name: "Ultra",
    description:
      "Past max: it thinks until it is done. Reach for it when nothing else has worked.",
  },
]

/**
 * Where a menu starts when it is not told otherwise. Named rather than written
 * as `efforts[1]`, so the sensible default survives a rung being inserted below
 * it — which is exactly the edit that would silently move it. Not the first
 * rung, unlike the menus beside it: the bottom of a ladder is a floor, not a
 * default.
 */
const defaultEffort = "medium"

/**
 * The rung an id names, or nothing. A composer outlives the catalogue that was
 * current when it was written, so a rung since renamed or taken away has to
 * come back empty rather than throw.
 */
function findEffort(id: string, list: Effort[] = efforts) {
  return list.find((effort) => effort.id === id)
}

/**
 * How far up the ladder a rung sits, which is the number the slider and the
 * glyph both work in. `-1` for an id the list does not have, so a caller can
 * tell an id that is not on this ladder apart from one sitting at the bottom
 * of it — the two are a world apart, and a clamped `0` would hide it.
 */
function effortIndex(id: string, list: Effort[] = efforts) {
  return list.findIndex((effort) => effort.id === id)
}

/**
 * The rung at a position, clamped to the ladder. The clamp is what lets the
 * slider hand back whatever it likes without the caller checking first: a
 * control that runs off the end of the list should land on the end of it.
 */
function effortAt(index: number, list: Effort[] = efforts) {
  if (!list.length) return undefined
  return list[Math.min(Math.max(Math.round(index), 0), list.length - 1)]
}

type EffortMenuContextValue = {
  value: string
  setValue: (id: string) => void
  efforts: Effort[]
}

const EffortMenuContext = React.createContext<
  EffortMenuContextValue | undefined
>(undefined)

function useEffortMenuContext(part: string) {
  const context = React.useContext(EffortMenuContext)
  if (!context) {
    throw new Error(`${part} must be used within an EffortMenu.`)
  }
  return context
}

type EffortMenuProps = Omit<React.ComponentProps<typeof Menu>, "children"> & {
  /** The chosen rung's id, for a menu whose state is held outside it. */
  value?: string
  /** Where an uncontrolled menu starts; the ladder's sensible middle otherwise. */
  defaultValue?: string
  onValueChange?: (id: string) => void
  /** The ladder to offer. Defaults to all six rungs. */
  efforts?: Effort[]
  children?: React.ReactNode
}

function EffortMenu({
  value: valueProp,
  defaultValue,
  onValueChange,
  efforts: list = efforts,
  children,
  ...props
}: EffortMenuProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? defaultEffort
  )
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue

  /**
   * No closing here, unlike the pickers next door. Choosing a model ends the
   * question; moving the slider is the question, and it is asked by dragging —
   * which would be one gesture per opening if the popup went away with it.
   */
  const setValue = React.useCallback(
    (id: string) => {
      if (!isControlled) setUncontrolledValue(id)
      onValueChange?.(id)
    },
    [isControlled, onValueChange]
  )

  const context = React.useMemo(
    () => ({ value, setValue, efforts: list }),
    [value, setValue, list]
  )

  return (
    <EffortMenuContext.Provider value={context}>
      <Menu data-slot="effort-menu" {...props}>
        {children}
      </Menu>
    </EffortMenuContext.Provider>
  )
}

/**
 * The ladder as a glyph: one bar per rung, ascending, lit up to the one that is
 * chosen. Drawn from spans rather than imported from the icon set — not to save
 * a dependency, but because no set has this. An icon is a fixed picture and
 * this is a readout: its bar count comes from the catalogue and its fill from
 * the value, and neither is something a path can be asked for. What the set
 * buys — one look, restyled and resized from the outside — it keeps: the bars
 * take their colour from `currentColor` and their scale from the container, so
 * it sits in a button beside real icons and behaves like one.
 *
 * `aria-hidden` throughout. The bars say the same thing as the label on
 * whatever is carrying them, and a screen reader reading six spans afterwards
 * is six announcements for a fact already given.
 */
function EffortBars({
  level,
  count,
  className,
  ...props
}: React.ComponentProps<"span"> & {
  /** How far up the ladder, as an index. Below zero lights nothing. */
  level: number
  /** How many rungs there are, which is how many bars get drawn. */
  count: number
}) {
  return (
    <span
      aria-hidden
      data-slot="effort-bars"
      className={cn("flex h-3.5 shrink-0 items-end gap-px", className)}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          data-lit={index <= level || undefined}
          // The shortest bar is kept at a third rather than run down to
          // nothing: a ladder whose bottom rung is invisible reads as five
          // bars with a gap, and the gap reads as a fault.
          style={{
            height: `${30 + (count > 1 ? index / (count - 1) : 1) * 70}%`,
          }}
          className="w-0.5 rounded-full bg-current opacity-20 transition-opacity duration-200 data-lit:opacity-100 motion-reduce:transition-none"
        />
      ))}
    </span>
  )
}

/**
 * The bars, as the thing that opens the ladder. `TooltipIconButton` is the
 * control: ghost and square for the reason the pickers beside it are, with
 * the rung's name on a hover so the glyph still says how hard it is thinking
 * without taking a word's width to do it.
 *
 * `showLabel` widens it to carry the rung's name as well, for a composer with
 * the room — the bars alone are quick to read once but not self-explaining the
 * first time, and the name is what teaches them.
 *
 * `render` is passed straight through, so a composer with a control of its own
 * keeps it and only borrows the behaviour.
 */
function EffortMenuTrigger({
  className,
  children,
  showLabel = false,
  ...props
}: React.ComponentProps<typeof MenuTrigger> & { showLabel?: boolean }) {
  const { value, efforts } = useEffortMenuContext("EffortMenuTrigger")
  const effort = findEffort(value, efforts)
  const level = effortIndex(value, efforts)
  const name = effort?.name ?? "Effort"

  return (
    <MenuTrigger
      data-slot="effort-menu-trigger"
      aria-label={effort ? `Effort: ${effort.name}` : "Effort"}
      render={
        <TooltipIconButton
          type="button"
          tooltip={name}
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
          <EffortBars level={level} count={efforts.length} />
          {showLabel && effort ? <span>{effort.name}</span> : null}
        </>
      )}
    </MenuTrigger>
  )
}

/**
 * The ladder itself, and the only control in the popup.
 *
 * It works in indices rather than ids: the slider's whole job is that the rungs
 * are in an order, and an index *is* that order — so `step={1}` between `0` and
 * the last rung gives the stops for free, with no mapping table to keep in step
 * with the catalogue.
 *
 * The names below the track are the stops, and they are buttons: a slider is a
 * poor way to move exactly one rung and a fine way to move four, so both are
 * offered rather than the drag alone. They are positioned against the track
 * rather than laid out in a row, because a row's cells centre on the cell and
 * the thumb stops on the rung, and those are not the same place.
 */
function EffortMenuSlider({
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof Slider.Root>,
  "value" | "onValueChange" | "min" | "max" | "step"
>) {
  const { value, setValue, efforts } = useEffortMenuContext("EffortMenuSlider")
  const index = Math.max(effortIndex(value, efforts), 0)
  const last = Math.max(efforts.length - 1, 0)

  const inputRef = React.useRef<HTMLInputElement>(null)

  /**
   * The popup exists only while it is open, so mounting is opening. Focus goes
   * to the thumb rather than being left on the popup: the arrow keys are the
   * fastest way to move one rung, and a menu that has to be tabbed into first
   * makes them the slowest. A frame's wait, because Base UI focuses the popup
   * on open and whichever of the two runs last is the one that wins.
   */
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <Slider.Root
      data-slot="effort-menu-slider"
      value={index}
      min={0}
      max={last}
      step={1}
      onValueChange={(next) => {
        const effort = effortAt(next as number, efforts)
        if (effort) setValue(effort.id)
      }}
      className={cn("w-full", className)}
      {...props}
    >
      <Slider.Control
        // A menu owns its arrow keys — they walk its rows — and so does a
        // slider. Stopping them here rather than letting them bubble is what
        // keeps the two from fighting over the same press; everything else,
        // Escape and Tab above all, still reaches the menu.
        onKeyDown={(event) => {
          if (event.key.startsWith("Arrow") || event.key.startsWith("Page")) {
            event.stopPropagation()
          }
          if (event.key === "Home" || event.key === "End") {
            event.stopPropagation()
          }
        }}
        className="relative flex h-4 w-full touch-none items-center select-none"
      >
        <Slider.Track className="h-1 w-full rounded-full bg-foreground/10 select-none dark:bg-foreground/15">
          <Slider.Indicator className="rounded-full bg-foreground select-none" />

          {/* A dot per rung, so the stops are visible before anything is
              dragged. The lit ones are drawn in the page's ground rather than
              its ink: they sit on top of the filled indicator, and ink on ink
              is a dot nobody can see. */}
          {efforts.map((effort, tick) => (
            <span
              key={effort.id}
              aria-hidden
              data-lit={tick <= index || undefined}
              style={{ insetInlineStart: `${last ? (tick / last) * 100 : 0}%` }}
              className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/25 data-lit:bg-background/70 rtl:translate-x-1/2"
            />
          ))}

          <Slider.Thumb
            inputRef={inputRef}
            aria-label="Effort"
            getAriaValueText={(_, thumbValue) =>
              efforts[thumbValue]?.name ?? `${thumbValue}`
            }
            className="size-3.5 rounded-full border border-border/60 bg-background shadow-sm select-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground/40 dark:bg-popover"
          />
        </Slider.Track>
      </Slider.Control>

      {/* The rungs' names, each centred on the stop it belongs to. The ends
          hang past the track by half a word, which is what the padding around
          this whole block is holding room for. */}
      <div className="relative mt-2 h-4">
        {efforts.map((effort, tick) => (
          <button
            key={effort.id}
            type="button"
            data-chosen={tick === index || undefined}
            aria-label={`Effort: ${effort.name}`}
            aria-current={tick === index || undefined}
            onClick={() => setValue(effort.id)}
            style={{ insetInlineStart: `${last ? (tick / last) * 100 : 0}%` }}
            className="absolute top-0 -translate-x-1/2 cursor-pointer rounded px-1 text-[10px] leading-4 font-medium text-nowrap text-muted-foreground/70 transition-colors outline-none hover:text-foreground focus-visible:ring-1 focus-visible:ring-foreground/20 data-chosen:text-foreground motion-reduce:transition-none rtl:translate-x-1/2"
          >
            {effort.name}
          </button>
        ))}
      </div>
    </Slider.Root>
  )
}

/**
 * The popup: what the rung is called, what it buys, and the ladder to move it
 * on. The bars are repeated up here beside the name because the trigger they
 * live on is behind the popup while it is open — without them the thing being
 * explained is hidden by the explanation.
 */
function EffortMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  const { value, efforts } = useEffortMenuContext("EffortMenuContent")
  const effort = findEffort(value, efforts)
  const level = effortIndex(value, efforts)

  return (
    <MenuContent
      data-slot="effort-menu-content"
      // Wide for a menu, because the width is the ladder: six names have to sit
      // along it without touching, and a narrower popup would have to abbreviate
      // them into the guesswork the names exist to remove.
      className={cn("w-80 max-w-[calc(100vw-2rem)] p-2", className)}
      {...props}
    >
      {children ?? (
        <>
          <div className="flex items-center gap-2 px-1">
            <EffortBars
              level={level}
              count={efforts.length}
              className="text-foreground"
            />
            <span className="text-xs font-medium text-foreground">
              {effort?.name ?? "Effort"}
            </span>
          </div>

          {/* The floor is two lines' worth, held whichever rung is chosen: the
              popup is anchored to a composer at the foot of the page, and a
              description one line shorter than the last would walk the whole
              thing up and down as the slider is dragged past it. */}
          <p className="mt-1 min-h-8 px-1 text-[11px] leading-4 text-muted-foreground">
            {effort?.description}
          </p>

          {/* The inset is for the two end names, which hang past the ends of
              the track by half a word each. */}
          <div className="mt-1 px-3 pb-1">
            <EffortMenuSlider />
          </div>
        </>
      )}
    </MenuContent>
  )
}

export {
  defaultEffort,
  effortAt,
  effortIndex,
  EffortBars,
  EffortMenu,
  EffortMenuContent,
  EffortMenuSlider,
  EffortMenuTrigger,
  efforts,
  findEffort,
}
export type { Effort, EffortMenuProps }
