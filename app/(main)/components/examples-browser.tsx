"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { Popover } from "@base-ui/react/popover"
import type { PanelImperativeHandle } from "react-resizable-panels"
import {
  Cancel01Icon,
  FilterHorizontalIcon,
  Layers01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { DemoCard } from "@/components/aiellie-ui/demo-card"
import { DemoToolbar } from "@/components/aiellie-ui/demo-toolbar"
import { DemosSwitcher } from "@/components/aiellie-ui/demos-switcher"
import {
  ElementDocs,
  type ElementDoc,
} from "@/components/aiellie-ui/element-docs"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
  menuPopup,
} from "@/components/aiellie-ui/menu"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { registryCategories } from "@/lib/categories"
import { cn } from "@/lib/utils"
import type { Example } from "@/registry/_demos"
import { slugFor } from "@/registry/_paths"

import { navButton } from "./nav-button"

/** A run of rail items under one label: a category, and what fell into it. */
type Group = {
  slug: string
  name: string
  icon: IconSvgElement
  examples: Example[]
}

/** One rail item, with the place it holds in the run it is standing in. */
type Item = {
  example: Example
  index: number
}

/**
 * The rail's two resting widths, in pixels. Anything between them is a size the
 * handle passes through rather than settles at, which is what makes a single
 * comparison enough to know which of the two the rail is in.
 */
const RAIL_COLLAPSED = 48
const RAIL_MIN = 176

/**
 * The width the whole browser stops having room for a list of names beside a
 * demo. Below it the rail is put to its icons whether or not anyone dragged it
 * there: a 240px rail out of 600 is most of the window given to a nav, and the
 * docs stop being a panel and become a drawer over the demo — three columns in
 * 700 pixels is three columns none of which can be read.
 */
const NARROW = 768

/**
 * The reference panel's resting width and the range the handle moves it
 * through. Its minimum is what a signature needs before it starts wrapping
 * mid-token; its maximum is the width past which a column of prose is harder
 * to read rather than easier.
 */
const DOCS_DEFAULT = 360
const DOCS_MIN = 288
const DOCS_MAX = 560

/**
 * What the stage keeps whatever else is open. In pixels rather than the
 * percentage it used to be: a percentage floor is a different number of pixels
 * on every screen, and with a rail on one side and the reference on the other
 * it was the demo that paid for it on a laptop.
 */
const STAGE_MIN = 320

/** The hairline only firms up under the pointer, so it reads as a divider first and a control second. */
const handle = "bg-border/50 transition-colors hover:bg-border active:bg-border"

/**
 * The bucket for an example whose categories name nothing visible. Its slug is
 * never a category's, so the two can't collide in the rail — it is a run of its
 * own at the foot of the list.
 */
const ungrouped = { slug: "ungrouped", name: "Other", icon: Layers01Icon }

/**
 * The lit state a header control takes while it is narrowing the list, said on
 * the glyph as well as on the button: `ghost` paints its own svg
 * `muted-foreground`, and a rule on the icon beats a colour the button is only
 * passing down by inheritance.
 */
const headerLit = cn(
  "text-accent hover:text-accent",
  "[&_svg]:text-accent hover:[&_svg]:text-accent"
)

/** The lit-while-current treatment both shapes of rail item share. */
const railCurrent = cn(
  "data-[active=true]:bg-muted data-[active=true]:text-foreground",
  "data-[active=true]:hover:bg-muted data-[active=true]:hover:text-foreground"
)

/**
 * The kit's ghost treatment again, re-shaped for a sidebar row: the header
 * nav's own button, stretched to the rail's width and set left. It keeps that
 * button's selected pill, so the two navs read as one system.
 */
const sidebarItem = cn(
  navButton,
  "h-7.5 w-full shrink-0 justify-start px-2 text-[13px] font-normal"
)

/**
 * The label a run stands under. The same mono-uppercase treatment the sections
 * once had, since it is doing the same job one rung further down: it names the
 * run rather than being something to press, so it takes the category's glyph
 * at a smaller, dimmer size than the items and carries their count.
 */
const sidebarLabel =
  "mb-1 flex shrink-0 items-center gap-1.5 px-2 font-mono text-[10px] tracking-[0.08em] text-foreground/30 uppercase"

/**
 * The page's examples split into the categories `lib/categories.ts` names, in
 * the order it names them. An example falls into the first category it carries,
 * so one listing several never appears twice; one that matches no visible
 * category is kept in a group of its own rather than going missing, which is
 * the same reason `registry/_demos.ts` warns instead of dropping.
 *
 * A category holding nothing gets no run at all: the sidebar shows what the
 * page has, not everything the registry could name.
 */
function groupsFor(examples: Example[]): Group[] {
  const taken = new Set<string>()
  const groups: Group[] = []

  for (const category of registryCategories) {
    if (category.hidden) continue

    const items = examples.filter(
      (example) =>
        !taken.has(example.name) && example.categories.includes(category.slug)
    )
    if (!items.length) continue

    for (const example of items) taken.add(example.name)
    groups.push({
      slug: category.slug,
      name: category.name,
      icon: category.icon,
      examples: items,
    })
  }

  const rest = examples.filter((example) => !taken.has(example.name))
  if (rest.length) groups.push({ ...ungrouped, examples: rest })

  return groups
}

/**
 * The runs the rail actually draws: the page's, with anything the search and
 * the category filter rule out taken away, and a run left with nothing dropped
 * rather than left standing as a label over an empty space.
 *
 * The description is searched as well as the title, so a query like "hover" or
 * "streaming" finds the thing it describes and not only the thing named after
 * it. What this narrows is the rail and nothing else — a card is still numbered
 * by where it sits in its whole category, so searching cannot renumber the page
 * under someone.
 */
function shownIn(groups: Group[], query: string, categories: string[]) {
  const needle = query.trim().toLowerCase()

  return groups.flatMap((group) => {
    if (categories.length && !categories.includes(group.slug)) return []

    const examples = needle
      ? group.examples.filter(
          (example) =>
            example.title.toLowerCase().includes(needle) ||
            example.description.toLowerCase().includes(needle)
        )
      : group.examples

    return examples.length ? [{ ...group, examples }] : []
  })
}

/**
 * One example resolved out of the page's list, with the place it holds in its
 * own run — so a card is numbered from one inside its category rather than on
 * down the page, the way the grid used to number it.
 */
function itemFor(examples: Example[], slug: string): Item | undefined {
  for (const group of groupsFor(examples)) {
    const index = group.examples.findIndex(
      (example) => slugFor(example.name) === slug
    )
    if (index >= 0) return { example: group.examples[index], index: index + 1 }
  }
}

/**
 * The search field, wherever it is drawn: in the rail's header, or in the
 * popover a collapsed rail opens.
 *
 * The clear button holds its place rather than arriving with the first
 * keystroke — mounted it would shove whatever sits beside it sideways the
 * moment you started typing, which is the same reason a hover-revealed row
 * reserves its space instead of appearing.
 */
function SearchField({
  value,
  onValueChange,
  onDismiss,
  placeholder,
  autoFocus,
}: {
  value: string
  onValueChange: (value: string) => void
  /** What Escape does once the field is already empty, if anything. */
  onDismiss?: () => void
  placeholder: string
  autoFocus?: boolean
}) {
  return (
    <>
      <HugeiconsIcon
        aria-hidden
        icon={Search01Icon}
        strokeWidth={1.75}
        className="size-3.5 shrink-0 text-muted-foreground/70"
      />
      <InputPrimitive
        // `role` rather than `type="search"`, which reads the same to a screen
        // reader but hands WebKit both the Escape key and a clear cross of its
        // own.
        type="text"
        role="searchbox"
        autoFocus={autoFocus}
        value={value}
        onValueChange={onValueChange}
        onKeyDown={(event) => {
          if (event.key !== "Escape") return

          /* Escape clears the query first, and only once the field is empty
             does it belong to whatever is holding it. Said here rather than
             left to bubble because Base UI's popover does not take Escape off
             a focused input — outside-click dismisses it, that key does not. */
          if (value !== "") {
            event.stopPropagation()
            onValueChange("")
            return
          }

          onDismiss?.()
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[12.5px] text-foreground outline-none placeholder:text-muted-foreground/70"
      />
      <TooltipIconButton
        tooltip="Clear search"
        onClick={() => onValueChange("")}
        // Inert rather than absent while there is nothing to clear: it is
        // still holding the space it will occupy.
        aria-hidden={!value}
        tabIndex={value ? undefined : -1}
        className={cn(
          "-me-1 shrink-0 transition-opacity duration-150 motion-reduce:transition-none",
          !value && "pointer-events-none opacity-0"
        )}
      >
        <HugeiconsIcon icon={Cancel01Icon} />
      </TooltipIconButton>
    </>
  )
}

/**
 * The reference panel is drawn by the *layout* and its contents come from the
 * *page*, so one of the two has to hand them to the other.
 *
 * It has to be that way round. The panel is beside the demo rather than instead
 * of it, which makes it part of the frame the layout owns — a layout is what
 * survives a navigation, and it is what keeps the width the panel was dragged
 * to and whether it was open at all. But only the page knows which example is
 * on the stage, and the docs are resolved on the server so a hundred kilobytes
 * of props tables never reach the browser. So the card publishes what its route
 * was given, and the layout draws it.
 *
 * `undefined` is a real answer — an example whose element has nothing generated
 * for it — and it takes the button away rather than opening an empty panel.
 */
type DocsSlot = {
  open: boolean
  setOpen: (open: boolean) => void
  publish: (docs: ElementDoc | undefined) => void
}

const DocsContext = createContext<DocsSlot | null>(null)

/**
 * The card for one example, which is what a route under `/elements` or
 * `/design` puts on the stage. The list is searched here rather than handed the
 * example, because only this side of the RSC boundary can hold one: a variant
 * carries its demo *component*, and a function cannot cross it.
 *
 * A slug with no card behind it renders nothing rather than throwing — the
 * route has already turned an unknown one away, so what is left is an example
 * that is registered but has no demo, which `registry/_demos.ts` drops and
 * warns about in dev.
 */
function ExampleCard({
  examples,
  slug,
  docs,
}: {
  examples: Example[]
  slug: string
  /** Resolved by the route, on the server, and handed to the layout's panel. */
  docs?: ElementDoc
}) {
  const item = useMemo(() => itemFor(examples, slug), [examples, slug])
  const [active, setActive] = useState(0)
  const slot = useContext(DocsContext)

  /* Handed up on mount and taken back on unmount, so an example with nothing
     generated for it cannot inherit the last one's reference. The card is
     keyed on the route, so the two happen in the same commit and the panel
     never blinks through empty on the way between examples. */
  const publish = slot?.publish
  useEffect(() => {
    publish?.(docs)
    return () => publish?.(undefined)
  }, [publish, docs])

  if (!item) return null

  const { example } = item

  return (
    <DemoCard
      toolbar={
        <DemoToolbar
          variants={example.variants.map((variant) => variant.name)}
          active={active}
          onActiveChange={setActive}
          installCommand={example.installCommand}
          demoInstallCommand={example.demoInstallCommand}
          /* No docs, no button: a control that opens an empty panel is worse
             than the one that is not there. */
          docsOpen={slot?.open}
          onDocsOpenChange={docs && slot ? slot.setOpen : undefined}
          fullscreenHref={example.fullscreenHref}
        />
      }
    >
      <DemosSwitcher variants={example.variants} active={active} />
    </DemoCard>
  )
}

/**
 * A page's examples behind a rail of all of them, labelled by the category each
 * fell into, with the one being read beside it. Which examples arrive here is
 * the page's business — `/design` passes the token ones, `/elements` the rest —
 * so a new demo needs an item in `registry/_examples-registry.ts`, its
 * components in `registry/_demos.ts`, a category in `lib/categories.ts` if it
 * carries a new one, and nothing here.
 *
 * The items are links to real URLs (`/elements/bubble`), so this belongs in a
 * *layout* rather than a page: a layout is what survives a navigation between
 * two of them, which is what keeps the rail's scroll position and the width you
 * dragged it to from being thrown away on every click.
 *
 * The two are a resizable group rather than a fixed column and the rest,
 * because the reading shifts: a long list wants the names wide enough to read
 * whole, a demo wants everything the window has. It divides a frame the page
 * gives it — given the document's height the panels would grow with the page
 * instead of splitting it, and the handle would have nothing to move.
 */
function ExamplesBrowser({
  examples,
  noun,
  children,
}: {
  examples: Example[]
  /** What this page calls the things it lists, for the field's placeholder. */
  noun: string
  children: ReactNode
}) {
  const groups = useMemo(() => groupsFor(examples), [examples])
  const pathname = usePathname()

  /* The query and the picked categories are held here, at the layout, so
     they survive the move from one example to the next: narrowing the rail to
     find something and having it thrown away by opening what you found is the
     one thing a filter must not do. */
  const [query, setQuery] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  const shown = useMemo(
    () => shownIn(groups, query, categories),
    [groups, query, categories]
  )
  const filtered = categories.length > 0
  const queried = query.trim() !== ""

  /* What is narrowing the rail, said the way the reset offers to undo it — a
     button promising to clear a filter nobody set is a button that has not
     been looking. */
  const narrowed = queried || filtered
  const clearLabel =
    queried && filtered
      ? "Clear search and filters"
      : filtered
        ? "Clear filters"
        : "Clear search"

  function clearAll() {
    setQuery("")
    setCategories([])
  }

  /* What the field would search if you typed into it now: the categories that
     are picked, and not the query — a field saying how much is left to search
     once you have searched it is a field answering its own question. */
  const searchable = useMemo(
    () =>
      shownIn(groups, "", categories).reduce(
        (total, group) => total + group.examples.length,
        0
      ),
    [groups, categories]
  )
  const placeholder = `Search ${searchable} ${noun}...`

  /* Dragged past its minimum the rail collapses to a strip of glyphs, so what
     it is showing has to be known here and not just in CSS: the two shapes are
     different markup, not one restyled.

     Measured off the rail itself rather than taken from the panel's `onResize`,
     which reports a drag long after the width it is reporting has been applied
     — the shape would go on lagging the box it is drawn in. A callback ref
     rather than an effect, so the observer is attached to whatever node is
     actually mounted and torn down with it. */
  const [collapsed, setCollapsed] = useState(false)
  const [searching, setSearching] = useState(false)

  /* Whether the reference is showing is held here rather than on the card, so
     it survives the move from one example to the next: opening the docs, going
     to the next element and having them shut again is the panel forgetting
     what it was just asked to do. What is *in* them comes the other way, from
     whichever card is on the stage. */
  const [docs, setDocs] = useState<ElementDoc | undefined>(undefined)
  const [docsOpen, setDocsOpen] = useState(false)
  const publish = useCallback(
    (next: ElementDoc | undefined) => setDocs(next),
    []
  )
  const slot = useMemo(
    () => ({ open: docsOpen, setOpen: setDocsOpen, publish }),
    [docsOpen, publish]
  )
  const measure = useCallback((node: HTMLElement | null) => {
    if (!node) return

    const observer = new ResizeObserver(([entry]) => {
      /* The border box, not `contentRect`: the rail's own padding changes with
         the shape, so the content width would answer a question about the box
         with a measure of what is left after it. */
      const width =
        entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width
      const narrow = width < RAIL_MIN

      setCollapsed(narrow)
      /* The popover only exists while the rail is a strip. Left open on the
         way out it would spring back the next time the rail was collapsed,
         having been shut by the rail widening rather than by anyone. */
      if (!narrow) setSearching(false)
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  /* Below `NARROW` the rail is put to its icons on its own, and given back its
     width when there is room for it again.

     Measured off the document rather than the panel group, whose own
     `elementRef` never calls a callback ref — and the width that decides this
     is the window's either way. `roomy` remembers the last answer so only the
     crossing is acted on: run on every tick it would fight anyone dragging the
     handle at a width it has already had its say about.

     Nothing is done on the first reading while there is room, because `expand`
     on a panel that is not collapsed takes it to its maximum rather than doing
     nothing — the rail would fly open to 384px on every load. */
  const rail = useRef<PanelImperativeHandle>(null)
  /* The same crossing decides the reference's shape: a panel while there are
     three columns' worth of room, a drawer over the demo below that. Started
     wide because that is what the server rendered, and corrected on mount
     before anything can be opened. */
  const [wide, setWide] = useState(true)
  useEffect(() => {
    let roomy: boolean | null = null

    const observer = new ResizeObserver(([entry]) => {
      const width =
        entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width
      const next = width >= NARROW
      if (next === roomy) return

      const first = roomy === null
      roomy = next
      setWide(next)

      /* Out of the frame the resize is being laid out in: a size set inside
         that pass is overwritten by the end of it. */
      requestAnimationFrame(() => {
        if (!next) rail.current?.collapse()
        else if (!first) rail.current?.expand()
      })
    })

    observer.observe(document.documentElement)
    return () => observer.disconnect()
  }, [])

  /* Escape shuts the drawer, which is the one shape of the reference that is
     covering something. As a panel it is beside the demo rather than over it,
     and a key that closes what you are reading beside your work is a key that
     goes off by accident. */
  const drawer = !wide && docsOpen && Boolean(docs)
  useEffect(() => {
    if (!drawer) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDocsOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [drawer])

  return (
    <DocsContext.Provider value={slot}>
      <ResizablePanelGroup orientation="horizontal">
        {/* The rail is a nav of destinations now, so the items are links marked
          `aria-current` — a modified click opens one in a tab, and the one you
          are reading has a URL to send someone. Each run is a group of its own
          so its label names the items it stands over, rather than floating
          above the whole list. */}
        <ResizablePanel
          id="examples"
          collapsible
          panelRef={rail}
          collapsedSize={RAIL_COLLAPSED}
          defaultSize={240}
          minSize={RAIL_MIN}
          maxSize={384}
        >
          {/* The wrapper is what the panel's width is read off, being the one
            box that is always exactly it — the nav's own padding changes with
            the shape, and the header is a row rather than the whole column. */}
          <div ref={measure} className="flex h-full flex-col">
            {/* The search and the filter sit in a header of the rail's own,
              a header of its own, a row that stays while the list under it
              scrolls. Collapsed there is no room for a field, so the row keeps the
              filter alone: it is the same control it was, it still says when
              something is hidden, and a rail you cannot read is not one you
              would be searching. */}
            <header
              className={cn(
                "flex shrink-0 border-b border-border/40",
                collapsed
                  ? "flex-col items-center gap-1 px-2 py-2"
                  : "h-9 items-center gap-2 px-3"
              )}
            >
              {collapsed ? (
                /* No room for a field in a 48px strip, so the search becomes a
                 button that hands you one — the same field, in a popup beside
                 the rail. It is lit while a query is standing, so a list
                 shortened by one still says why. */
                <Popover.Root open={searching} onOpenChange={setSearching}>
                  <Popover.Trigger
                    render={
                      <TooltipIconButton
                        tooltip="Search"
                        side="right"
                        className={cn("shrink-0", queried && headerLit)}
                      />
                    }
                  >
                    <HugeiconsIcon icon={Search01Icon} />
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Positioner
                      side="right"
                      sideOffset={6}
                      align="start"
                      collisionPadding={8}
                      className="isolate z-50"
                    >
                      {/* The menus' own popup, since it is the same kind of
                        thing hanging off the same kind of button. */}
                      <Popover.Popup
                        className={cn(
                          menuPopup("glass"),
                          "flex w-64 items-center gap-2 px-2.5 py-1.5"
                        )}
                      >
                        <SearchField
                          autoFocus
                          value={query}
                          onValueChange={setQuery}
                          onDismiss={() => setSearching(false)}
                          placeholder={placeholder}
                        />
                      </Popover.Popup>
                    </Popover.Positioner>
                  </Popover.Portal>
                </Popover.Root>
              ) : (
                <SearchField
                  value={query}
                  onValueChange={setQuery}
                  placeholder={placeholder}
                />
              )}
              <Menu>
                <MenuTrigger
                  render={
                    <TooltipIconButton
                      tooltip="Filter"
                      side={collapsed ? "right" : "bottom"}
                      // Lit while something is hidden, so a list that looks
                      // short says why without the menu having to be opened.
                      className={cn(
                        "relative shrink-0",
                        !collapsed && "-me-1",
                        filtered && headerLit
                      )}
                    />
                  }
                >
                  <HugeiconsIcon icon={FilterHorizontalIcon} />
                  {/* How many, not just that there are any — the glyph's own
                    colour already says that much, and one category hidden
                    reads very differently from four. aria-hidden because the
                    menu underneath says the same thing in full, and a bare
                    number read out after "Filter" is a riddle. */}
                  {filtered ? (
                    <span
                      aria-hidden
                      className="absolute -end-1 -top-1 flex size-3 items-center justify-center rounded-full bg-accent font-mono text-[8px] leading-none text-accent-foreground tabular-nums"
                    >
                      {categories.length}
                    </span>
                  ) : null}
                </MenuTrigger>
                <MenuContent
                  align={collapsed ? "start" : "end"}
                  side={collapsed ? "right" : "bottom"}
                  aria-label="Filter examples"
                >
                  <MenuGroup>
                    <MenuGroupLabel>Category</MenuGroupLabel>
                    {/* The page's own categories, not the registry's: a filter
                      offering a category this page has nothing in is a way of
                      emptying the rail on purpose. Counted off `groups` rather
                      than what is on screen, so the numbers say what picking a
                      category would give you rather than what the last pick
                      already took away. */}
                    {groups.map((group) => (
                      <MenuCheckboxItem
                        key={group.slug}
                        checked={categories.includes(group.slug)}
                        onCheckedChange={(checked) =>
                          setCategories((previous) =>
                            checked
                              ? [...previous, group.slug]
                              : previous.filter((slug) => slug !== group.slug)
                          )
                        }
                        // Held open, because picking two categories is two
                        // clicks and a menu that shuts between them is a menu
                        // reopened.
                        closeOnClick={false}
                      >
                        <HugeiconsIcon icon={group.icon} strokeWidth={2} />
                        {group.name}
                        <MenuShortcut className="font-mono tabular-nums">
                          {String(group.examples.length).padStart(2, "0")}
                        </MenuShortcut>
                      </MenuCheckboxItem>
                    ))}
                  </MenuGroup>
                  <MenuSeparator />
                  <MenuItem
                    disabled={!filtered}
                    onClick={() => setCategories([])}
                  >
                    Clear filters
                  </MenuItem>
                </MenuContent>
              </Menu>
            </header>
            {/* The scrolling lives on the nav rather than the panel: a panel is
            left `overflow: visible` by the library, and a rail listing every
            example the page has is taller than the frame. `flex-1 min-h-0` is
            what gives it something to overflow, now that the header has taken
            its share of the column.

            `relative` is load-bearing, not decoration. Collapsed, every item
            carries its name in an `sr-only` span, and `sr-only` is
            `position: absolute` — with no positioned ancestor those spans hang
            off the initial containing block, where no `overflow` between here
            and the page can clip them, and the document grows to the height of
            a list that is supposed to be scrolling inside this box. Making the
            rail their containing block puts them back inside what clips
            them. */}
            <nav
              aria-label="Examples"
              data-collapsed={collapsed}
              className={cn(
                "relative flex min-h-0 flex-1 flex-col gap-5 overflow-x-hidden overflow-y-auto py-4",
                collapsed ? "items-center px-2" : "px-2"
              )}
            >
              {shown.map((group) => (
                <div
                  key={group.slug}
                  role="group"
                  aria-label={group.name}
                  className="flex shrink-0 flex-col gap-0.5"
                >
                  {/* aria-hidden either way: the run is already named by
                  `aria-label` above, so the label would only say it twice.
                  Collapsed it keeps the glyph alone — the run still has to be
                  told from the one above it, and the names are on the items'
                  tooltips by then. */}
                  {collapsed ? (
                    <span
                      aria-hidden
                      className="mb-1 flex h-4 items-center justify-center text-foreground/25"
                    >
                      <HugeiconsIcon
                        icon={group.icon}
                        strokeWidth={2}
                        className="size-3"
                      />
                    </span>
                  ) : (
                    <span aria-hidden className={sidebarLabel}>
                      <HugeiconsIcon
                        icon={group.icon}
                        strokeWidth={2}
                        className="size-3 shrink-0"
                      />
                      {group.name}
                      <span className="ms-auto ps-2 tracking-tight tabular-nums">
                        {String(group.examples.length).padStart(2, "0")}
                      </span>
                    </span>
                  )}
                  {group.examples.map((example) => {
                    const current = pathname === example.href
                    const glyph = (
                      <HugeiconsIcon
                        icon={example.icon}
                        strokeWidth={2}
                        className="size-3.5 shrink-0"
                      />
                    )

                    return collapsed ? (
                      <TooltipIconButton
                        key={example.name}
                        tooltip={example.title}
                        side="right"
                        /* The rail item is a link wherever it is drawn, collapsed
                       or not. `nativeButton={false}` is Base UI being told so:
                       left true it expects a real `<button>` in `render` and
                       warns that it is handing an anchor button semantics it
                       cannot keep. */
                        render={<Link href={example.href} />}
                        nativeButton={false}
                        data-active={current}
                        aria-current={current ? "page" : undefined}
                        className={cn("size-7.5 rounded-md", railCurrent)}
                      >
                        {glyph}
                      </TooltipIconButton>
                    ) : (
                      <Link
                        key={example.name}
                        href={example.href}
                        data-active={current}
                        aria-current={current ? "page" : undefined}
                        className={sidebarItem}
                      >
                        {glyph}
                        <span className="min-w-0 truncate">
                          {example.title}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              ))}
              {/* Collapsed the row would be a wall of wrapped text in a 48px
                strip, and the filter glyph above is already lit — so the empty
                rail says it with nothing rather than badly. */}
              {shown.length === 0 && !collapsed ? (
                /* Centred in whatever the runs have left, which when there are
                 no runs is the whole rail: an empty list left at the top reads
                 as a list that has not loaded, and the way out of it is worth
                 putting where the eye already is. `-mt-9` for the header the
                 column above has taken, so the middle of the rail is the middle
                 of the panel. */
                <div className="-mt-9 flex flex-1 flex-col items-center justify-center gap-3 px-2 text-center">
                  <p className="text-[12.5px] leading-relaxed text-balance text-foreground/35">
                    {queried
                      ? `Nothing matching “${query.trim()}”.`
                      : "Nothing to show."}
                  </p>
                  {/* Only when there is something to undo: an empty rail with no
                    query and no filter on it is a page with nothing in it, and
                    a reset would be a button that does nothing. */}
                  {narrowed ? (
                    <button
                      type="button"
                      onClick={clearAll}
                      className={cn(
                        navButton,
                        "w-auto border border-border text-foreground/60"
                      )}
                    >
                      {clearLabel}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </nav>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className={handle} />

        <ResizablePanel id="stage" defaultSize="80" minSize={STAGE_MIN}>
          {/* The stage is a height, not a scroller: the card takes what it is
            given, and what is being demonstrated does its own scrolling inside
            it. `overflow-hidden` so a demo that is briefly too tall on its way
            in cannot push a scrollbar onto the frame. `relative` is what the
            drawer below is positioned against, so it covers the demo and not
            the rail — the rail is how you leave, and a sheet over the way out
            is a sheet you have to dismiss to escape. */}
          <div className="relative h-full overflow-hidden">
            {/* Keyed on the route so moving between examples re-mounts the card
              and it fades in, rather than the card swapping its contents in
              place. */}
            <div
              key={pathname}
              className="h-full min-w-0 animate-in duration-300 fade-in motion-reduce:animate-none"
            >
              {children}
            </div>
            {drawer && docs ? (
              <>
                {/* A real button rather than a div with a click on it: it is
                  the way out of the drawer for a pointer, and it should be
                  the way out for a keyboard too. */}
                <button
                  type="button"
                  aria-label="Close docs"
                  onClick={() => setDocsOpen(false)}
                  className="absolute inset-0 z-40 animate-in cursor-default bg-background/60 backdrop-blur-[2px] duration-200 fade-in motion-reduce:animate-none"
                />
                <aside
                  aria-label={`${docs.title} docs`}
                  className="absolute inset-y-0 end-0 z-50 flex w-full max-w-sm animate-in flex-col border-s border-border/40 bg-background shadow-2xl duration-200 slide-in-from-right motion-reduce:animate-none dark:bg-popover"
                >
                  <ElementDocs docs={docs} onClose={() => setDocsOpen(false)} />
                </aside>
              </>
            ) : null}
          </div>
        </ResizablePanel>

        {/* Mounted only while it is open, so the group divides two frames when
          there is nothing to read and three when there is — a panel collapsed
          to nothing still leaves its handle standing in the layout, which is a
          divider marking the edge of something that is not there. */}
        {wide && docsOpen && docs ? (
          <>
            <ResizableHandle withHandle className={handle} />
            <ResizablePanel
              id="docs"
              defaultSize={DOCS_DEFAULT}
              minSize={DOCS_MIN}
              maxSize={DOCS_MAX}
            >
              <ElementDocs
                docs={docs}
                onClose={() => setDocsOpen(false)}
                className="border-s border-border/40"
              />
            </ResizablePanel>
          </>
        ) : null}
      </ResizablePanelGroup>
    </DocsContext.Provider>
  )
}

export { ExamplesBrowser, ExampleCard }
