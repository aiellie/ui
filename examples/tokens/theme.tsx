import type { ReactNode } from "react"

import { colorGroups } from "@/lib/colors"
import { cn } from "@/lib/utils"

// `pb-14` keeps the last row clear of the floating toolbar.
const demoShell =
  "flex h-full min-h-0 w-full flex-col gap-3 overflow-y-auto pb-14"

/**
 * A mode is a class that re-declares the custom properties, so putting one on
 * a container hands that subtree the other theme without touching the page —
 * which is the only way a card can show both at once while the site is showing
 * one of them.
 *
 * `.light` exists for exactly this: `:root` alone would leave a "light" panel
 * inheriting the page's dark values whenever the page is dark, and a panel that
 * agrees with the page is not a comparison. `globals.css` names it beside
 * `:root` rather than repeating the palette.
 *
 * Nothing inside these panels may use a `dark:` utility. The variant matches
 * any descendant of `.dark`, so on a dark page it would fire inside the light
 * panel too — the tokens invert on their own, and that is the whole point.
 */
const modes = [
  { name: "Light", scope: "light", selector: ".light" },
  { name: "Dark", scope: "dark", selector: ".dark" },
] as const

type Mode = (typeof modes)[number]

/**
 * A surface and the text it is meant to carry, named together — a background
 * token is only half a decision, and the pair is what a reader has to judge.
 */
const surfaces = [
  { name: "background", className: "bg-background text-foreground" },
  { name: "card", className: "bg-card text-card-foreground" },
  { name: "popover", className: "bg-popover text-popover-foreground" },
  { name: "muted", className: "bg-muted text-muted-foreground" },
  { name: "secondary", className: "bg-secondary text-secondary-foreground" },
]

/**
 * The tones that are meant to be seen. `destructive` is the odd one: this
 * palette spends `--destructive-foreground` on a tint rather than on text, so
 * the house treatment is the hue over a wash of itself, as `Button` does it.
 */
const accents = [
  { name: "primary", className: "bg-primary text-primary-foreground" },
  { name: "accent", className: "bg-accent text-accent-foreground" },
  { name: "destructive", className: "bg-destructive/10 text-destructive" },
  { name: "selection", className: "bg-selection text-selection-foreground" },
]

/** The label a panel is read under, kept in the page's theme rather than its own. */
function ModeLabel({ mode }: { mode: Mode }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-xs font-medium">{mode.name}</span>
      <span className="truncate font-mono text-[0.6875rem] text-muted-foreground">
        {mode.selector}
      </span>
    </div>
  )
}

/** The two modes beside each other, each column labelled once at the top. */
function Modes({ children }: { children: (mode: Mode) => ReactNode }) {
  return (
    <div className="grid shrink-0 grid-cols-2 gap-3">
      {modes.map((mode) => (
        <div key={mode.scope} className="flex min-w-0 flex-col gap-1.5">
          <ModeLabel mode={mode} />
          {children(mode)}
        </div>
      ))}
    </div>
  )
}

function ModesDemo() {
  return (
    <div className={demoShell}>
      <p className="shrink-0 text-xs text-muted-foreground">
        One set of tokens, both modes — the same markup either side, with only
        the class on the panel differing.
      </p>
      <Modes>
        {(mode) => (
          <div
            className={cn(
              mode.scope,
              "flex flex-col gap-2.5 rounded-xl border bg-background p-3 text-foreground"
            )}
          >
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium">Aa</span>
              <span className="text-[11px] text-muted-foreground">
                Muted copy
              </span>
            </div>
            <div className="rounded-lg border bg-card p-2 text-card-foreground">
              <span className="text-[11px]">Raised surface</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-md bg-primary px-1.5 py-1 text-[10px] font-medium text-primary-foreground">
                Primary
              </span>
              <span className="rounded-md bg-secondary px-1.5 py-1 text-[10px] font-medium text-secondary-foreground">
                Secondary
              </span>
            </div>
            {/* The ring has no surface of its own, so it is shown as the halo
                it actually renders as — named, or it reads as an empty field. */}
            <div className="rounded-md border border-ring px-2 py-1 text-[10px] text-muted-foreground ring-3 ring-ring/50">
              Focus ring
            </div>
          </div>
        )}
      </Modes>
    </div>
  )
}

/** A stack of `bg`/`text` pairs, each writing its own name in its own foreground. */
function Pairs({
  mode,
  pairs,
}: {
  mode: Mode
  pairs: { name: string; className: string }[]
}) {
  return (
    <div
      className={cn(
        mode.scope,
        "flex flex-col gap-1.5 rounded-xl border bg-background p-2"
      )}
    >
      {pairs.map((pair) => (
        <div
          key={pair.name}
          className={cn(
            "truncate rounded-md border px-2 py-1.5 font-mono text-[11px]",
            pair.className
          )}
        >
          {pair.name}
        </div>
      ))}
    </div>
  )
}

function SurfacesDemo() {
  return (
    <div className={demoShell}>
      <p className="shrink-0 text-xs text-muted-foreground">
        The elevation ladder. It does not simply invert: light stacks downwards
        from white, dark stacks upwards from the page, so card is the lighter
        surface in one and the darker in the other.
      </p>
      <Modes>{(mode) => <Pairs mode={mode} pairs={surfaces} />}</Modes>
    </div>
  )
}

function AccentsDemo() {
  return (
    <div className={demoShell}>
      <p className="shrink-0 text-xs text-muted-foreground">
        The tones meant to be noticed, each written in the foreground it is
        paired with — the pair is the token, not the background alone.
      </p>
      <Modes>{(mode) => <Pairs mode={mode} pairs={accents} />}</Modes>
    </div>
  )
}

/**
 * Every token split down the middle, light on the left and dark on the right,
 * over the dotted backdrop that makes a translucent token read as translucent.
 * The seam is where the value changes, so a token that holds still across modes
 * shows no seam at all.
 */
function TokensDemo() {
  return (
    <div className={demoShell}>
      <p className="shrink-0 text-xs text-muted-foreground">
        Each token as it lands in either mode. Where the halves match, the token
        does not move between themes.
      </p>
      {colorGroups.map((group) => (
        <div key={group.name} className="flex shrink-0 flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.08em] text-foreground/30 uppercase">
            {group.name}
          </span>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {group.tokens.map((token) => (
              <div key={token.name} className="flex min-w-0 flex-col gap-1">
                <div className="grid h-10 grid-cols-2 overflow-hidden rounded-lg border bg-dotted">
                  {modes.map((mode) => (
                    <div
                      key={mode.scope}
                      className={cn("size-full", mode.scope, token.className)}
                    />
                  ))}
                </div>
                <span className="truncate font-mono text-[0.6875rem] text-muted-foreground">
                  {token.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Which tab shows which of these is settled by `meta.variants` on the
// `theme-demo` registry item.
export { ModesDemo, SurfacesDemo, AccentsDemo, TokensDemo }
