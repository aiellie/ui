"use client"

import * as React from "react"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { useRender } from "@base-ui/react/use-render"

import { floating, ghostButton } from "@/components/aiellie-ui/actions"
import { MenuContent, MenuItem } from "@/components/aiellie-ui/menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type Highlight = {
  /** The selected text, trimmed. */
  text: string
  /** Where the toolbar should sit, in pixels from the region's top left. */
  x: number
  y: number
}

type HighlightContextValue = {
  highlight: Highlight | null
  clear: () => void
}

const HighlightContext = React.createContext<HighlightContextValue | null>(null)

/**
 * What is selected inside the nearest `MessageHighlight`, for an action that
 * needs the words themselves — a reply that quotes them, an explanation of
 * them, a note they are saved to.
 */
export function useMessageHighlight() {
  const context = React.useContext(HighlightContext)
  if (!context) {
    throw new Error(
      "useMessageHighlight must be used inside <MessageHighlight>"
    )
  }
  return context
}

/** How far above the selection the toolbar sits, and how near an edge it may go. */
const gap = 10
const edge = 72

/**
 * The region a highlight toolbar watches. Wrap the message — or the whole
 * thread — and put the toolbar inside it.
 *
 * The selection is read on pointer and key release rather than on every
 * `selectionchange`: a toolbar that follows the cursor mid-drag is a toolbar
 * moving under the hand that is drawing the selection.
 *
 * What dismisses it is a press somewhere else, not the selection going away.
 * Pressing a control collapses the selection before the control has run —
 * browsers differ on whether that can be defaulted away, and a toolbar that
 * unmounts under its own button is worse than one that outstays a selection by
 * a moment. The words are captured when the selection is read, so an action
 * still has them either way.
 */
export function MessageHighlight({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const regionRef = React.useRef<HTMLDivElement>(null)
  const [highlight, setHighlight] = React.useState<Highlight | null>(null)

  const clear = React.useCallback(() => {
    setHighlight(null)
    document.getSelection()?.removeAllRanges()
  }, [])

  React.useEffect(() => {
    const region = regionRef.current
    if (!region) return undefined

    function inToolbar(node: EventTarget | null) {
      return (
        node instanceof Node &&
        Boolean(
          (node instanceof Element ? node : node.parentElement)?.closest(
            "[data-slot=message-highlight-toolbar],[role=menu]"
          )
        )
      )
    }

    function read(event: Event) {
      // A press that lands in the toolbar is the reader using it, not choosing
      // different words.
      if (inToolbar(event.target)) return

      const selection = document.getSelection()
      const host = regionRef.current
      if (
        !host ||
        !selection ||
        selection.isCollapsed ||
        !selection.rangeCount
      ) {
        setHighlight(null)
        return
      }

      const range = selection.getRangeAt(0)
      if (!host.contains(range.commonAncestorContainer)) {
        setHighlight(null)
        return
      }

      const text = selection.toString().trim()
      if (!text) {
        setHighlight(null)
        return
      }

      const rect = range.getBoundingClientRect()
      const bounds = host.getBoundingClientRect()
      setHighlight({
        text,
        // Clamped so a selection at either end of a line does not hang the
        // toolbar off the side of the thread.
        x: Math.min(
          Math.max(rect.left + rect.width / 2 - bounds.left, edge),
          Math.max(bounds.width - edge, edge)
        ),
        y: rect.top - bounds.top - gap,
      })
    }

    // The menu a toolbar control opens is portalled out of the region, so it is
    // matched by role rather than by containment.
    function dismissOnOutsidePress(event: PointerEvent) {
      if (inToolbar(event.target)) return
      setHighlight(null)
    }

    region.addEventListener("pointerup", read)
    region.addEventListener("keyup", read)
    document.addEventListener("pointerdown", dismissOnOutsidePress)

    return () => {
      region.removeEventListener("pointerup", read)
      region.removeEventListener("keyup", read)
      document.removeEventListener("pointerdown", dismissOnOutsidePress)
    }
  }, [])

  const context = React.useMemo(
    () => ({ highlight, clear }),
    [highlight, clear]
  )

  return (
    <HighlightContext.Provider value={context}>
      <div
        ref={regionRef}
        data-slot="message-highlight"
        data-highlighted={highlight ? "" : undefined}
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    </HighlightContext.Provider>
  )
}

/**
 * Shape and motion shared by every control in the pill. `ghostButton` brings
 * the centring, focus ring and press scale; the rest squares it off, since a
 * row of circles inside a pill reads as beads on a string.
 */
const highlightToolbarItem = cn(
  ghostButton,
  "size-7 cursor-pointer rounded-lg text-muted-foreground ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-foreground active:scale-[0.94] [&_svg:not([class*='size-'])]:size-4"
)

type TooltipSide = React.ComponentProps<typeof TooltipContent>["side"]

/**
 * A tooltip is wired up as `aria-describedby`, not a name — so an icon-only
 * control still needs a label. Borrow the tooltip when it is plain text.
 */
function labelFrom(tooltip: React.ReactNode, ariaLabel?: string) {
  return ariaLabel ?? (typeof tooltip === "string" ? tooltip : undefined)
}

/** Wraps a control in its tooltip, or returns it bare when there is none. */
function withTooltip(
  control: React.ReactElement,
  tooltip: React.ReactNode,
  side: TooltipSide
) {
  if (tooltip == null) return control

  return (
    <Tooltip>
      <TooltipTrigger render={control} />
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

/**
 * The pill itself, over the selection that summoned it. It is mounted only
 * while there is something selected — unlike a hover-revealed row, there is no
 * layout to hold, since it floats over the text rather than sitting in it.
 *
 * The press is defaulted away at the toolbar, in the capture phase: without it
 * the browser collapses the selection the moment a control is pressed, which
 * unmounts the toolbar out from under the press — the menu never opens, and the
 * action never sees the words it was about to act on. Capture, because a
 * control that stops propagation would otherwise skip it. Base UI opens its
 * menu from its own listener rather than from the default action, so nothing is
 * lost by cancelling it.
 */
export function MessageHighlightToolbar({
  className,
  children,
  "aria-label": ariaLabel = "Selection actions",
  ...props
}: React.ComponentProps<"div">) {
  const { highlight } = useMessageHighlight()

  if (!highlight) return null

  return (
    <TooltipProvider>
      <div
        data-slot="message-highlight-toolbar"
        role="toolbar"
        aria-label={ariaLabel}
        onMouseDownCapture={(event) => event.preventDefault()}
        style={{ left: highlight.x, top: highlight.y }}
        className={cn(
          floating,
          "absolute z-40 flex w-fit -translate-x-1/2 -translate-y-full items-center gap-0.5 rounded-xl border-border/40 p-1 shadow-lg backdrop-blur-xl",
          "animate-in duration-150 ease-out fill-mode-both zoom-in-95 fade-in slide-in-from-bottom-1 motion-reduce:animate-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TooltipProvider>
  )
}

/**
 * One control in the pill. Pass `render={<Link href="..." />}` to make it a
 * real link — modified clicks then keep working, which a button swallows.
 */
export function MessageHighlightAction({
  tooltip,
  side = "top",
  className,
  children,
  render,
  "aria-label": ariaLabel,
  ...props
}: useRender.ComponentProps<"button"> & {
  tooltip?: React.ReactNode
  side?: TooltipSide
}) {
  const action = useRender({
    render,
    defaultTagName: "button",
    props: {
      // `type` belongs to <button>; a `render` of <a> must not inherit it.
      ...(render ? {} : { type: "button" }),
      "data-slot": "message-highlight-action",
      "aria-label": labelFrom(tooltip, ariaLabel),
      className: cn(highlightToolbarItem, className),
      children,
      ...props,
    },
  })

  return withTooltip(action, tooltip, side)
}

export function MessageHighlightSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-highlight-separator"
      role="separator"
      aria-orientation="vertical"
      className={cn("mx-1 my-1 w-px self-stretch bg-border", className)}
      {...props}
    />
  )
}

/** An action with more than one target — save as a note, or a memory. */
export function MessageHighlightMenu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="message-highlight-menu" {...props} />
}

/**
 * Styled like the other controls and carrying the same tooltip. Base UI merges
 * the trigger through the tooltip's own trigger, so the one element is both
 * without either losing its behaviour.
 */
export function MessageHighlightMenuTrigger({
  tooltip,
  side = "top",
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: MenuPrimitive.Trigger.Props & {
  tooltip?: React.ReactNode
  side?: TooltipSide
}) {
  const trigger = (
    <MenuPrimitive.Trigger
      data-slot="message-highlight-menu-trigger"
      aria-label={labelFrom(tooltip, ariaLabel)}
      className={cn(
        highlightToolbarItem,
        "data-popup-open:bg-foreground/[0.06] data-popup-open:text-foreground dark:data-popup-open:bg-foreground/[0.09]",
        className
      )}
      {...props}
    >
      {children}
    </MenuPrimitive.Trigger>
  )

  return withTooltip(trigger, tooltip, side)
}

/** The shared menu surface, hung above the pill rather than below it. */
export function MessageHighlightMenuContent({
  side = "top",
  align = "end",
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  return (
    <MenuContent
      data-slot="message-highlight-menu-content"
      side={side}
      align={align}
      {...props}
    />
  )
}

export function MessageHighlightMenuItem(
  props: React.ComponentProps<typeof MenuItem>
) {
  return <MenuItem data-slot="message-highlight-menu-item" {...props} />
}
