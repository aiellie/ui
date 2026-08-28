"use client"

import * as React from "react"
import {
  ArrowDown01Icon,
  Search01Icon,
  SquareLock01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@/components/aiellie-ui/menu"
import {
  CapabilityIcon,
  ModelIcon,
  ProviderIcon,
} from "@/components/icons/model-icons"
import { Button } from "@/components/ui/button"
import type { Model, ModelTier } from "@/lib/models"
import {
  canUseModel,
  filterModels,
  findModel,
  formatContextWindow,
  modelCapabilities,
  models as defaultModels,
  modelsByProvider,
} from "@/lib/models"
import { cn } from "@/lib/utils"

/**
 * Which model is answering, and the choosing of another one — the control that
 * sits in a composer next to the field rather than in a settings page, because
 * the choice is made per message far more often than it is made once.
 *
 * A row carries only what is needed to choose between two models at a glance:
 * the name, and the marks for what it can do. Everything else — what it is for,
 * how much it holds — is a hover away in a submenu, so a list of fifteen models
 * stays a list rather than becoming fifteen paragraphs. The search field is
 * what makes that scale: past a dozen models, scanning is slower than typing.
 *
 * The menu is `menu`'s, whole; the marks are `model-icons`'.
 */

type ModelPickerContextValue = {
  value: string
  setValue: (id: string) => void
  models: Model[]
  plan: ModelTier
}

const ModelPickerContext = React.createContext<
  ModelPickerContextValue | undefined
>(undefined)

function useModelPickerContext(part: string) {
  const context = React.useContext(ModelPickerContext)
  if (!context) {
    throw new Error(`${part} must be used within a ModelPicker.`)
  }
  return context
}

type ModelPickerProps = Omit<React.ComponentProps<typeof Menu>, "children"> & {
  /** The chosen model's id, for a picker whose state is held outside it. */
  value?: string
  /** Where an uncontrolled picker starts; the first model on offer otherwise. */
  defaultValue?: string
  onValueChange?: (id: string) => void
  /** The catalogue to offer. Defaults to every model `lib/models` names. */
  models?: Model[]
  /**
   * The plan being drawn for. Models above it are shown locked rather than
   * hidden: a picker that omits them answers "which model is this?" but never
   * "what else is there?", which is the question that makes someone upgrade.
   */
  plan?: ModelTier
  children?: React.ReactNode
}

/**
 * The open state is held here rather than left to Base UI, because a row is a
 * submenu trigger now and clicking one of those opens a submenu instead of
 * closing the menu. Choosing a model has to shut the whole thing, so the root
 * needs to be something this file can close.
 */
function ModelPicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  models = defaultModels,
  plan = "pro",
  open: openProp,
  onOpenChange,
  children,
  ...props
}: ModelPickerProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? models[0]?.id ?? ""
  )
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isOpenControlled = openProp !== undefined
  const open = isOpenControlled ? openProp : uncontrolledOpen

  const setOpen = React.useCallback(
    (
      next: boolean,
      details: Parameters<NonNullable<typeof onOpenChange>>[1]
    ) => {
      if (!isOpenControlled) setUncontrolledOpen(next)
      onOpenChange?.(next, details)
    },
    [isOpenControlled, onOpenChange]
  )

  const setValue = React.useCallback(
    (id: string) => {
      if (!isControlled) setUncontrolledValue(id)
      onValueChange?.(id)
      if (!isOpenControlled) setUncontrolledOpen(false)
    },
    [isControlled, onValueChange, isOpenControlled]
  )

  const context = React.useMemo(
    () => ({ value, setValue, models, plan }),
    [value, setValue, models, plan]
  )

  return (
    <ModelPickerContext.Provider value={context}>
      <Menu
        data-slot="model-picker"
        open={open}
        onOpenChange={setOpen}
        {...props}
      >
        {children}
      </Menu>
    </ModelPickerContext.Provider>
  )
}

/**
 * The chosen model, as the thing that opens the list. It is a ghost button and
 * a small one on purpose: in a composer this sits beside the field, and a
 * control with a border on it competes with the field for the same attention.
 *
 * The mark is the model's rather than the house's — someone running Qwen is not
 * looking for Alibaba.
 *
 * `render` is passed straight through, so a composer with a control of its own
 * keeps it and only borrows the behaviour.
 */
function ModelPickerTrigger({
  className,
  children,
  showIcon = true,
  ...props
}: React.ComponentProps<typeof MenuTrigger> & { showIcon?: boolean }) {
  const { value, models } = useModelPickerContext("ModelPickerTrigger")
  const model = findModel(value, models)

  return (
    <MenuTrigger
      data-slot="model-picker-trigger"
      aria-label={model ? `Model: ${model.name}` : "Choose a model"}
      render={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            // `w-fit` because a Button is `width: auto` and a picker put in a
            // column would otherwise be stretched the width of the column —
            // a chip that says which model is answering, drawn as a bar.
            "w-fit gap-1.5 font-medium text-muted-foreground hover:text-foreground",
            className
          )}
        />
      }
      {...props}
    >
      {children ?? (
        <>
          {showIcon && model ? (
            <ModelIcon
              model={model.id}
              provider={model.provider}
              className="size-3.5 opacity-70"
            />
          ) : null}
          {model?.name ?? "Choose a model"}
          <HugeiconsIcon
            aria-hidden
            icon={ArrowDown01Icon}
            strokeWidth={2}
            className="size-3 opacity-60"
          />
        </>
      )}
    </MenuTrigger>
  )
}

/**
 * The field the list is narrowed with. Not a menu item, so the arrow keys walk
 * past it to the models — but printable keys have to be kept from bubbling, or
 * Base UI's typeahead reads them as an attempt to jump to a row and drags the
 * highlight around while the query is still being typed.
 */
function ModelPickerSearch({
  value,
  onValueChange,
  className,
  placeholder = "Search models…",
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "onChange"> & {
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <div
      data-slot="model-picker-search"
      className={cn(
        "-mx-1 -mt-1 mb-1 flex shrink-0 items-center gap-2 border-b border-border/60 px-3 py-2",
        className
      )}
    >
      <HugeiconsIcon
        aria-hidden
        icon={Search01Icon}
        strokeWidth={2}
        className="size-3.5 shrink-0 text-muted-foreground/70"
      />
      <input
        type="text"
        autoComplete="off"
        spellCheck={false}
        aria-label="Search models"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          // The keys the menu owns pass through: up and down move the
          // highlight, Escape shuts it, Enter takes the highlighted row.
          const navigational =
            event.key.length > 1 || event.metaKey || event.ctrlKey
          if (!navigational) event.stopPropagation()
        }}
        className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/70"
        {...props}
      />
    </div>
  )
}

/** The marks a row carries for what its model can do, read out as one list. */
function ModelCapabilities({
  capabilities,
  className,
  ...props
}: React.ComponentProps<"span"> & { capabilities: Model["capabilities"] }) {
  if (!capabilities.length) return null

  return (
    <span
      data-slot="model-capabilities"
      role="img"
      // One label for the run rather than one per glyph: read separately they
      // interrupt the row's name with four more announcements.
      aria-label={capabilities
        .map((capability) => modelCapabilities[capability].name)
        .join(", ")}
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {capabilities.map((capability) => (
        <CapabilityIcon
          key={capability}
          capability={capability}
          className="size-3.5 text-muted-foreground/70"
        />
      ))}
    </span>
  )
}

/** What a row keeps back: what the model is for, and how much it holds. */
function ModelPickerDetail({ model }: { model: Model }) {
  return (
    <div data-slot="model-picker-detail" className="w-56 p-2">
      <p className="text-xs leading-relaxed font-normal text-muted-foreground">
        {model.description}
      </p>

      <dl className="mt-2.5 space-y-1.5 border-t border-border/60 pt-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[11px] text-muted-foreground/70">Context</dt>
          <dd className="text-[11px] text-foreground tabular-nums">
            {formatContextWindow(model.contextWindow)} tokens
          </dd>
        </div>
        {model.capabilities.map((capability) => (
          <div
            key={capability}
            className="flex items-baseline justify-between gap-3"
          >
            <dt className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
              <CapabilityIcon
                capability={capability}
                className="size-3 translate-y-px"
              />
              {modelCapabilities[capability].name}
            </dt>
            <dd className="sr-only">
              {modelCapabilities[capability].description}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/**
 * One model: its name, and the marks for what it can do. Clicking it chooses
 * the model; resting on it opens what the row left out.
 *
 * It is a submenu trigger rather than a radio item, so the radio semantics have
 * to be put back by hand — `aria-current` rather than `aria-checked`, since a
 * thing with a submenu hanging off it cannot claim to be a radio button. The
 * tick is drawn here for the same reason: there is no `RadioItemIndicator` on a
 * trigger to inherit one from.
 */
function ModelPickerItem({
  model,
  className,
  ...props
}: React.ComponentProps<typeof MenuSubTrigger> & { model: Model }) {
  const { value, setValue, plan } = useModelPickerContext("ModelPickerItem")
  const locked = !canUseModel(model, plan)
  const chosen = value === model.id

  /**
   * The submenu is held open here rather than by Base UI so that a press can be
   * told apart from a hover. Base UI opens a submenu on either, and an open
   * submenu holds its parent open — so a click would choose the model and then
   * keep the menu standing there behind the choice it had just made.
   *
   * Hover still opens it, and so does the right arrow, which is the keyboard
   * saying the same thing. Only the press is refused.
   */
  const [detailOpen, setDetailOpen] = React.useState(false)

  return (
    <MenuSub
      open={detailOpen}
      onOpenChange={(next, details) => {
        if (next && details.reason === "trigger-press") return
        setDetailOpen(next)
      }}
    >
      <MenuSubTrigger
        data-slot="model-picker-item"
        data-chosen={chosen || undefined}
        aria-current={chosen || undefined}
        disabled={locked}
        openOnHover
        delay={120}
        onClick={() => {
          if (locked) return
          setDetailOpen(false)
          setValue(model.id)
        }}
        className={cn("gap-2 pe-1.5", className)}
        {...props}
      >
        <span className="truncate text-foreground">{model.name}</span>

        {model.badge ? (
          <span className="shrink-0 rounded-full bg-foreground/[0.06] px-1.5 py-px text-[10px] leading-4 font-medium text-foreground/70 dark:bg-foreground/[0.09]">
            {model.badge}
          </span>
        ) : null}

        {locked ? (
          <HugeiconsIcon
            icon={SquareLock01Icon}
            strokeWidth={2}
            className="size-3 shrink-0 text-muted-foreground/70"
            aria-label="Not on this plan"
          />
        ) : null}

        <ModelCapabilities
          capabilities={model.capabilities}
          className="ms-auto ps-2"
        />

        {/* The space is held either way, so a tick appearing does not shunt
            the marks beside it sideways. */}
        <HugeiconsIcon
          aria-hidden
          icon={Tick02Icon}
          strokeWidth={2}
          className={cn(
            "size-3.5 shrink-0 text-foreground",
            !chosen && "opacity-0"
          )}
        />
      </MenuSubTrigger>

      <MenuSubContent className="w-auto min-w-0 p-0">
        <ModelPickerDetail model={model} />
      </MenuSubContent>
    </MenuSub>
  )
}

/** What the list says when nothing is left of it. */
function ModelPickerEmpty({ query }: { query: string }) {
  return (
    <p className="px-2 py-6 text-center text-xs text-muted-foreground">
      No model matches “{query.trim()}”.
    </p>
  )
}

/**
 * The list, standing each house's models under its name, narrowed by whatever
 * is in the search field. Written from the catalogue rather than by hand, since
 * a picker that has to be edited every time a model ships is one that goes
 * stale.
 *
 * The query is dropped when the menu shuts: a picker reopened an hour later
 * showing three models and no clue why is a picker that looks broken.
 */
function ModelPickerContent({
  className,
  children,
  searchable = true,
  ...props
}: React.ComponentProps<typeof MenuContent> & { searchable?: boolean }) {
  const { models } = useModelPickerContext("ModelPickerContent")
  const [query, setQuery] = React.useState("")

  React.useEffect(() => () => setQuery(""), [])

  const groups = React.useMemo(
    () => modelsByProvider(filterModels(models, query)),
    [models, query]
  )

  return (
    <MenuContent
      data-slot="model-picker-content"
      className={cn(
        "flex w-72 max-w-[calc(100vw-2rem)] flex-col overflow-hidden",
        // Twenty models is a plausible catalogue and twenty rows is taller than
        // most viewports, so the popup is capped and the list inside it scrolls.
        // `--available-height` is Base UI's measure of the room actually left
        // between the trigger and the edge, so the cap is the smaller of what
        // looks right and what fits.
        "max-h-[min(24rem,var(--available-height))]",
        className
      )}
      {...props}
    >
      {/* Outside the scroller on purpose: a search field that scrolls away is
          one you have to scroll back to before you can narrow the list. */}
      {searchable ? (
        <ModelPickerSearch value={query} onValueChange={setQuery} />
      ) : null}

      <div
        data-slot="model-picker-list"
        // `overscroll-contain` so reaching the end of the list does not hand
        // the scroll to the page behind and drag the menu off the trigger.
        className="-mx-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-1"
      >
        {children ??
          (groups.length ? (
            groups.map(({ provider, models: grouped }) => (
              <MenuGroup key={provider.id}>
                <MenuGroupLabel className="flex items-center gap-1.5">
                  <ProviderIcon provider={provider.id} className="size-3" />
                  {provider.name}
                </MenuGroupLabel>
                {grouped.map((model) => (
                  <ModelPickerItem key={model.id} model={model} />
                ))}
              </MenuGroup>
            ))
          ) : (
            <ModelPickerEmpty query={query} />
          ))}
      </div>
    </MenuContent>
  )
}

export {
  ModelCapabilities,
  ModelPicker,
  ModelPickerContent,
  ModelPickerDetail,
  ModelPickerEmpty,
  ModelPickerItem,
  ModelPickerSearch,
  ModelPickerTrigger,
}
export type { ModelPickerProps }
