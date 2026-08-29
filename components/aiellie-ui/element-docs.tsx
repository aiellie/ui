"use client"

import * as React from "react"
import Link from "next/link"
import { Collapsible } from "@base-ui/react/collapsible"
import {
  ApiIcon,
  ArrowRight01Icon,
  Cancel01Icon,
  ComputerTerminal01Icon,
  CubeIcon,
  Folder01Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  collapsePanel,
  field,
  ghostButton,
  mono,
} from "@/components/aiellie-ui/actions"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockBody,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/aiellie-ui/code/code-block"
import {
  CodeSnippet,
  type PackageManager,
} from "@/components/aiellie-ui/code/code-snippet"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

/** One prop, as the reference lists it. */
export interface ElementDocProp {
  name: string
  /** Printed as it is written in the source, not as the checker expands it. */
  type: string
  optional: boolean
  /** The literal the component destructures it with, when there is one. */
  default?: string
  description?: string
}

/** One exported component and the props it declares for itself. */
export interface ElementDocComponent {
  name: string
  description?: string
  props: ElementDocProp[]
  /**
   * Prop sets it takes but does not spell out — a `<div>`'s attributes, a Base
   * UI part's own props. Named rather than listed: expanding
   * `React.ComponentProps<"div">` buries the six props that are the element's
   * under three hundred that are the platform's.
   */
  extends: string[]
}

/** Another registry item this one installs alongside itself. */
export interface ElementDocLink {
  name: string
  title: string
  /** Where it is read, when it has a page of its own. */
  href?: string
}

/** Everything the panel shows about one element. */
export interface ElementDoc {
  name: string
  title: string
  description: string
  /**
   * The install line without its runner — `shadcn@latest add …` — so the card
   * below can put `npx`, `pnpm dlx` or `bunx` in front of it as asked.
   */
  install: string
  /** The same, for the example that demos it. */
  demoInstall: string
  imports: { module: string; names: string[] }[]
  components: ElementDocComponent[]
  /** Types, constants and hooks it exports beside its components. */
  exports: string[]
  dependencies: string[]
  registryDependencies: ElementDocLink[]
  files: string[]
}

/**
 * The label a section stands under. The rail's own treatment one rung down: it
 * names the run rather than being something to press, so it is set in the same
 * mono uppercase at the same weight, and carries the section's glyph.
 */
const sectionLabel =
  "mb-2.5 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] text-foreground/30 uppercase"

/** A name in a row of them — a package, a file, an item that comes with it. */
const chip = cn(
  field,
  mono,
  "inline-flex max-w-full min-w-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-foreground/70"
)

/** The same chip, when pressing it goes somewhere. */
const chipLink = cn(
  chip,
  "transition-colors hover:bg-foreground/[0.09] hover:text-foreground motion-reduce:transition-none dark:hover:bg-foreground/[0.12]"
)

/**
 * The two-way toggle over the install card. A pair of pills rather than a
 * select: there are two of them, they are both short, and which one is chosen
 * changes the line directly underneath — a control whose whole result is
 * visible has nothing to gain from hiding one of its options behind a menu.
 */
const installTab = cn(
  ghostButton,
  "h-6 shrink-0 rounded-md px-2 text-[11px] font-medium whitespace-nowrap",
  "data-[active=true]:bg-muted data-[active=true]:text-foreground",
  "data-[active=true]:hover:bg-muted data-[active=true]:hover:text-foreground",
  "dark:data-[active=true]:hover:bg-muted"
)

function Section({
  icon,
  title,
  children,
}: {
  icon: IconSvgElement
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-border/40 px-4 py-4 last:border-b-0">
      <h3 className={sectionLabel}>
        <HugeiconsIcon
          icon={icon}
          strokeWidth={2}
          className="size-3 shrink-0"
        />
        {title}
      </h3>
      {children}
    </section>
  )
}

/**
 * One prop, as a stacked row rather than a cell in a table.
 *
 * A props table has four columns and this panel is three hundred pixels wide,
 * so the table would either scroll sideways — putting the description, the
 * column that is actual prose, off the edge — or squeeze the type into a
 * two-character gutter. Stacked, the same four facts read top to bottom at any
 * width, which is the responsive shape rather than a shrunken table.
 */
function Prop({ prop }: { prop: ElementDocProp }) {
  return (
    <div className="grid gap-1 px-3 py-2.5">
      <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <code className="font-mono text-[12px] font-medium tracking-tight text-foreground">
          {prop.name}
        </code>
        {/* Said on the required ones rather than the optional ones: most props
            here are optional, and a badge on nearly every row is a badge
            nobody reads. */}
        {prop.optional ? null : (
          <span className="rounded-full bg-accent/10 px-1.5 text-[9.5px] font-medium tracking-[0.06em] text-accent uppercase">
            Required
          </span>
        )}
        {prop.default ? (
          <span className="ms-auto font-mono text-[10.5px] text-foreground/35 tabular-nums">
            = {prop.default}
          </span>
        ) : null}
      </dt>
      <dd className="min-w-0">
        {/* `wrap-break-word` because a signature is one long token as far as
            the line breaker is concerned, and left whole it widens the panel
            rather than wrapping inside it. */}
        <code className="font-mono text-[11px] leading-relaxed wrap-break-word text-accent/85">
          {prop.type}
        </code>
        {prop.description ? (
          <p className="mt-1 text-[12px] leading-relaxed text-foreground/50">
            {prop.description}
          </p>
        ) : null}
      </dd>
    </div>
  )
}

/**
 * One component's entry in the reference, folded closed after the first few.
 *
 * An element like `code-block` exports nine parts, and nine open props lists is
 * a panel you scroll past rather than read. The ones opened by default are the
 * ones a reader wants first — the element itself and its immediate parts — and
 * the rest say how many props they are hiding, so nothing is hidden silently.
 */
function ComponentDoc({
  component,
  defaultOpen,
}: {
  component: ElementDocComponent
  defaultOpen: boolean
}) {
  const count = component.props.length
  const bare = count === 0 && component.extends.length === 0

  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      data-slot="element-docs-component"
      className="border-b border-border/40 last:border-b-0"
    >
      <Collapsible.Trigger
        className={cn(
          "group/doc flex w-full cursor-pointer items-center gap-2 py-2 text-start outline-none",
          "focus-visible:ring-1 focus-visible:ring-foreground/20"
        )}
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          strokeWidth={2}
          className="size-3.5 shrink-0 text-foreground/30 transition-transform duration-200 group-data-[panel-open]/doc:rotate-90 motion-reduce:transition-none"
        />
        <code className="min-w-0 truncate font-mono text-[12.5px] font-medium text-foreground/85">
          {component.name}
        </code>
        <span className="ms-auto shrink-0 font-mono text-[10px] text-foreground/30 tabular-nums">
          {bare ? "—" : `${count} prop${count === 1 ? "" : "s"}`}
        </span>
      </Collapsible.Trigger>
      <Collapsible.Panel className={collapsePanel}>
        <div className="pb-3">
          {component.description ? (
            <p className="mb-2.5 text-[12px] leading-relaxed text-foreground/50">
              {component.description}
            </p>
          ) : null}
          {count ? (
            <dl className="divide-y divide-border/40 rounded-lg border border-border/40">
              {component.props.map((prop) => (
                <Prop key={prop.name} prop={prop} />
              ))}
            </dl>
          ) : null}
          {component.extends.length ? (
            <p className="mt-2 flex flex-wrap items-center gap-1 text-[11.5px] leading-relaxed text-foreground/40">
              <span>Also takes</span>
              {component.extends.map((base) => (
                <code key={base} className={cn(chip, "text-[10.5px]")}>
                  {base}
                </code>
              ))}
            </p>
          ) : null}
          {bare ? (
            <p className="text-[12px] leading-relaxed text-foreground/40">
              Takes no props of its own.
            </p>
          ) : null}
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  )
}

export interface ElementDocsProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "title"
> {
  docs: ElementDoc
  /** Shown as a close button in the header when the panel can be dismissed. */
  onClose?: () => void
}

/**
 * What an element is, how to install it, and everything it accepts — beside the
 * demo rather than instead of it.
 *
 * A docs page would cost you the thing you are reading the docs against: the
 * point of a props table is to have the demo in the corner of your eye while
 * you read it, and a navigation away is exactly what breaks that. So this is a
 * column, and whatever holds it decides whether that column is a panel of the
 * layout or a drawer over it.
 *
 * The reference is generated from the element's own source rather than written
 * out here — a hand-kept props table is a second copy of the truth, and the
 * copy is the one that goes stale. This component only lays out what it is
 * handed, so it has no opinion about where that came from.
 */
export function ElementDocs({
  docs,
  onClose,
  className,
  ...props
}: ElementDocsProps) {
  const [manager, setManager] = React.useState<PackageManager>("npm")
  const [withDemo, setWithDemo] = React.useState(false)
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  const command = withDemo ? docs.demoInstall : docs.install

  /* One import per file the item ships, which for almost every element is one
     line. Built here rather than in the generator so the panel can keep it to
     the width it has: a nine-part element on one line would scroll sideways
     for ever, so anything past three names is broken onto its own row. */
  const usage = docs.imports
    .map(({ module, names }) =>
      names.length > 3
        ? `import {\n${names.map((name) => `  ${name},`).join("\n")}\n} from "${module}"`
        : `import { ${names.join(", ")} } from "${module}"`
    )
    .join("\n\n")

  return (
    <div
      data-slot="element-docs"
      className={cn("flex h-full min-h-0 flex-col", className)}
      {...props}
    >
      <header className="flex h-9 shrink-0 items-center gap-2 border-b border-border/40 px-4">
        <span className="truncate text-[12.5px] font-medium">{docs.title}</span>
        <code className={cn(mono, "shrink-0 text-foreground/30")}>
          {docs.name}
        </code>
        {onClose ? (
          <TooltipIconButton
            tooltip="Close docs"
            onClick={onClose}
            className="ms-auto shrink-0"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              strokeWidth={2}
              className="size-3.5"
            />
          </TooltipIconButton>
        ) : null}
      </header>

      {/* `overscroll-contain` so reaching the end of the reference does not
          then start scrolling the page behind the drawer. */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {docs.description ? (
          <p className="border-b border-border/40 px-4 py-4 text-[13px] leading-relaxed text-foreground/55">
            {docs.description}
          </p>
        ) : null}

        <Section icon={ComputerTerminal01Icon} title="Installation">
          <div className="mb-2 flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setWithDemo(false)}
              data-active={!withDemo}
              aria-pressed={!withDemo}
              className={installTab}
            >
              Component
            </button>
            <button
              type="button"
              onClick={() => setWithDemo(true)}
              data-active={withDemo}
              aria-pressed={withDemo}
              className={installTab}
            >
              With demo
            </button>
          </div>
          {/* Keyed on which line it is showing, so the copied tick does not
              carry over from the line before it and claim something that is no
              longer on the clipboard. */}
          <CodeSnippet
            key={command}
            command={command}
            manager={manager}
            onManagerChange={setManager}
            highlight
            copied={isCopied}
            onCopy={copyToClipboard}
          />
        </Section>

        {usage ? (
          <Section icon={SourceCodeIcon} title="Import">
            <CodeBlock className="max-w-full">
              <CodeBlockHeader>
                {/* "brand" rather than an icon of its own: the mark is
                    derived from the name, so the extension picks it. */}
                <CodeBlockTitle icon="brand">{docs.name}.tsx</CodeBlockTitle>
                <CodeBlockActions>
                  <CodeBlockCopy code={usage} />
                </CodeBlockActions>
              </CodeBlockHeader>
              <CodeBlockBody code={usage} />
            </CodeBlock>
          </Section>
        ) : null}

        {docs.components.length ? (
          <Section icon={ApiIcon} title="API reference">
            <div className="-mt-2">
              {docs.components.map((component, index) => (
                <ComponentDoc
                  key={component.name}
                  component={component}
                  defaultOpen={index < 3}
                />
              ))}
            </div>
            {docs.exports.length ? (
              <div className="mt-3">
                <p className="mb-1.5 text-[11.5px] text-foreground/40">
                  Also exported
                </p>
                <div className="flex flex-wrap gap-1">
                  {docs.exports.map((name) => (
                    <code key={name} className={chip}>
                      {name}
                    </code>
                  ))}
                </div>
              </div>
            ) : null}
          </Section>
        ) : null}

        {docs.registryDependencies.length || docs.dependencies.length ? (
          <Section icon={CubeIcon} title="Comes with">
            {docs.registryDependencies.length ? (
              <div className="flex flex-wrap gap-1">
                {docs.registryDependencies.map((dependency) =>
                  dependency.href ? (
                    <Link
                      key={dependency.name}
                      href={dependency.href}
                      className={chipLink}
                    >
                      {dependency.name}
                    </Link>
                  ) : (
                    <code key={dependency.name} className={chip}>
                      {dependency.name}
                    </code>
                  )
                )}
              </div>
            ) : null}
            {docs.dependencies.length ? (
              <div className={docs.registryDependencies.length ? "mt-3" : ""}>
                <p className="mb-1.5 text-[11.5px] text-foreground/40">
                  npm packages
                </p>
                <div className="flex flex-wrap gap-1">
                  {docs.dependencies.map((dependency) => (
                    <code key={dependency} className={chip}>
                      {dependency}
                    </code>
                  ))}
                </div>
              </div>
            ) : null}
          </Section>
        ) : null}

        {docs.files.length ? (
          <Section icon={Folder01Icon} title="Files">
            <ul className="flex flex-col gap-1">
              {docs.files.map((file) => (
                <li key={file} className="min-w-0">
                  <code className={cn(chip, "block truncate")}>{file}</code>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}
      </div>
    </div>
  )
}
