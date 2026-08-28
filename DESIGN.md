# design.md

How the elements in this registry are built, and why. `CLAUDE.md` covers the
mechanics — where an item is registered, what the build validates, how a card
reaches a page. This file covers the decisions the mechanics cannot check.

The rules are drawn from what is already here: `bubble`, `marker`, `suggestions`,
`timestamps`, `message-actions`, `menu`. A new element that breaks one of them is
either wrong or is the reason to change the rule. Say which.

## Composition

**Ship parts, not props.** A component that takes `title`, `subtitle`, `footer`
and `icon` has decided what a message is. `Message` / `MessageHeader` /
`MessageContent` / `MessageFooter` has not. Reach for a prop when it names a
_choice_ (`variant`, `placement`, `align`), and for a part when it names a
_place_.

**A trigger is styled by whatever it triggers from.** `MenuTrigger` passes
through unstyled: a menu hangs off a toolbar button, a link, an avatar, and each
of those already has a shape. Layering a menu's own look on top means fighting
it back off.

**Use `render` rather than nesting.** Base UI's `useRender` lets one element be
two things — a menu trigger that is also a tooltip trigger, a `BubbleContent`
that is really a `<button>`, a toolbar item that is really a `<Link>` so
modified clicks keep working.

```tsx
<BubbleContent render={<button type="button" onClick={…} />}>{suggestion}</BubbleContent>
```

When a part types its props against a `div` but renders something else, put the
element's props on the `render` element, not on the part — that is where they
type-check.

**Every element carries a `data-slot`.** It is the only stable handle consumers
have for reaching inside something they did not write. State goes on data
attributes too — `data-active`, `data-busy`, `data-selected`, `data-placement` —
so a consumer can style a state without re-implementing it.

## State

**Selection lives with the caller when picking is doing.** `Suggestions` is
fully controlled because choosing a prompt is usually the same event as sending
it; a component holding that state privately would have to hand it straight
back. Keep state internal only when it is nobody else's business: a copy that
has just happened, a retry in flight, whether a menu is open.

**Model a value in one shape.** `Suggestions` keeps an array whether or not it
is multi-select — `multiple` decides what a pick does to the array, not what
type the caller receives. A prop that changes the type of another prop is a
prop too many.

**Read external things through `useSyncExternalStore`.** A clock is not state
the render owns. One store per interval, shared by every stamp reading it, so
the reading is cached between ticks, the render stays pure, and every stamp on
screen agrees about what "now" is.

**No `setState` in an effect, no `Date.now()` in render.** The React compiler
lint enforces both, and it is right to: the first is a second render pass you
did not need, the second is a render that cannot be repeated. Impure reads
belong in a module-scope store, not in `useMemo`.

## Layout that does not move

**Reveal by opacity, never by mounting.** Anything that appears on hover — a
timestamp, an action row — is `opacity-0` with its space already reserved.
Mounting it on hover makes the message jump under the pointer that summoned it.

```tsx
showOnHover &&
  "opacity-0 transition-opacity duration-150 group-hover/message:opacity-100 group-focus-within/message:opacity-100"
```

**Indicators keep their space.** A tick that appears on the chosen menu row is
`keepMounted` at `opacity-0`, so ticking a row does not change its width and
shove the label sideways.

**Alignment that survives overflow.** A row aligned to one end hides its far end
the moment the content is wider than the box. Use the safe variants —
`justify-end-safe`, `justify-center-safe` — so an overflowing row falls back to
its start and stays scrollable to.

**Overflow clips both axes.** `overflow-x-auto` also clips vertically, so a row
that scrolls sideways and lifts on hover needs the room as padding:
`py-1 -my-1`.

## Hover is never alone

**Pair every hover with focus.** A keyboard never hovers anything, so
`group-hover/message:` is always joined by `group-focus-within/message:`. A row
that only answers the mouse cannot be reached at all.

**Keep a control alive while its popup is open.** `has-data-open:opacity-100` on
a hover-revealed row, or the menu trigger vanishes from under its own menu when
the pointer leaves.

## Motion

**Every animation has a `motion-reduce` escape.** `motion-reduce:animate-none`,
`motion-reduce:transition-none`. No exceptions — a spinner, a stagger and a
fade are all motion to someone who asked for less of it.

**Transition the properties that change, not `all`.**
`transition-[opacity,scale]` says what is moving and keeps everything else from
being caught up in it.

**Roughly three speeds.** 150ms for a state that answers a pointer, 300ms for
something arriving, 70ms per item of stagger when several things arrive
together. Entry animations pair with `fill-mode-both` so an item is not visible
for a frame before its delay starts.

**A stagger needs a way to replay.** `cycle` on `Suggestions` is a key: bump it
and the row remounts, so a fresh set of prompts arrives rather than appearing.

## Feedback

**An action that takes a moment says so.** `busy` on a `MessageAction` turns the
icon for as long as the work runs and stops the control taking clicks, so a slow
retry cannot be fired three times over.

**An action that changes something shows it.** A copy that ticks, a rating that
leaves the thumb it was given, a suggestion that goes from dashed to tinted. An
icon that looks identical after a click leaves the reader guessing whether it
took.

**A state that is not permanent reverts.** The copied tick holds for two seconds
and goes back to offering the thing it offers. A button stuck on "copied" has
stopped being a button.

**Say it once, in the right place.** A verdict shows on the control that opened
the menu — the pair of thumbs becomes the thumb that was chosen — so the reader
does not have to open the menu to find out what they picked.

## Surface and colour

**Tokens only.** `bg-background`, `text-muted-foreground`, `border-border`, and
`dark:bg-popover` where the dark surface differs. A hex value in a component is
a bug in this registry; the palette is `lib/colors` and it is what `/tokens`
documents.

**Derive, do not add.** The `tinted` bubble is the primary hue at a fixed
lightness — `oklch(from var(--primary) 0.93 calc(c*0.4) h)` — so a consumer who
changes one token gets a coherent set rather than a clash.

**Glass is a fill you can see through plus a blur.** Translucent fill,
`backdrop-blur-xl`, and a border lightened to match: `bg-background/70
backdrop-blur-xl border-border/40 dark:bg-popover/70`. An opaque panel with a
backdrop filter is just a card, and a solid edge around a soft panel reads as a
card with a blurry picture in it.

**Borders carry meaning.** Dashed is an offer not yet taken; solid is a field;
none, with a tint behind it, is a choice already made. That is the whole logic
of `suggestions`, and it should stay true wherever it is repeated.

## Direction and locale

**Logical properties throughout.** `ps`/`pe`, `ms`/`me`, `start`/`end`,
`side="inline-end"`. A submenu opens the other way in an RTL layout, so its
chevron is `rtl:-scale-x-100` — an arrow pointing the wrong way is worse than no
arrow.

**Say what the reader would say.** 4:28 pm, not 14:28; "Yesterday", not the
date; "Just now", not "in 0 minutes". Formatting goes through `Intl`, and the
locale and clock are props so a caller can disagree.

**`suppressHydrationWarning` only where the value genuinely depends on the
reader.** A clock and a time zone qualify; a layout does not. It goes on the one
element whose text and attributes differ, never further up.

## Semantics

**Real elements.** A timestamp is a `<time dateTime={iso}>` carrying the full
moment in `title`, so the exact value is a hover or a screen reader away no
matter how loosely it is phrased. A row of controls is `role="toolbar"`. A
suggestion is a `<button>`, because picking one does something.

**A tooltip is a description, not a name.** It is wired as `aria-describedby`,
so an icon-only control still needs a label — borrow the tooltip when it is
plain text, and take an explicit `aria-label` when it is not.

```tsx
function labelFrom(tooltip: React.ReactNode, ariaLabel?: string) {
  return ariaLabel ?? (typeof tooltip === "string" ? tooltip : undefined)
}
```

**State that is visual is also announced.** `aria-pressed` for a toggle,
`aria-busy` while work is running, `aria-label` on anything wearing only a
glyph.

## Icons

**Always Hugeicons.** `@hugeicons/core-free-icons` with `@hugeicons/react`, per
`components.json` — in primitives, elements and demos alike. Never a hand-drawn
inline SVG: one icon set drawn one way is the whole point of having one, and a
path written by hand is a glyph nobody can restyle, resize or swap.

**Except a brand mark, which is not a glyph.** The language logos in
`lib/code-icons` are the one set of paths written by hand here, and the reason
is that a logo has no shape to choose: the TypeScript square is that blue, the
React atom is that cyan, and no icon set is going to supply them. A mark is
only allowed in when it identifies something outside this registry and arrives
in colours that are not ours to pick. Everything else — ticks, chevrons,
folders, crosses, spinners — comes from Hugeicons, always. Marks live in
`code-icons` and nowhere else, so the exception cannot spread by being
convenient.

**Passed as children, not named by a prop.** `<MenuItem><HugeiconsIcon
icon={TrashIcon} />Delete</MenuItem>` keeps the choice with the caller, so a
consumer can put their own set in without the component knowing. Declare
`@hugeicons/core-free-icons` and `@hugeicons/react` in the item's
`dependencies` and the build will check you did.

**Size icons from the container.**
`[&_svg:not([class*='size-'])]:size-4` on the row means a menu can be written as
an icon and a word, with neither wrapped in anything, and an explicit size still
wins.

## Naming

- `variant` is how a thing looks (`tinted`, `glass`, `destructive`).
- `placement`, `align`, `side` are where it sits.
- Booleans default to `false` and read as claims about the thing: `showOnHover`,
  `busy`, `active`, `live`, `multiple`.
- `children` on a formatted component overrides the formatting rather than
  fighting it — a label the formatter could not have known.
- The exported class strings (`menuItem`, `messageActionItem`,
  `floatingToolbarItem`) are the seam for anything hand-rolling a row that has
  to match.

## Prose

Comments explain _why_, at length where the why is not obvious, and in British
spelling. If a comment restates the line under it, delete it. The test: would a
competent reader who disagreed with the line find their objection answered?

---

## Checklist for a new element

- [ ] Parts where the API names places, props where it names choices
- [ ] `data-slot` on every part; state on data attributes
- [ ] Hover paired with focus; popups keep their trigger visible
- [ ] Revealed things reserve their space
- [ ] `motion-reduce` on every transition and animation
- [ ] Tokens only; dark surface handled
- [ ] Logical properties; RTL checked
- [ ] Real element underneath; icon-only controls named
- [ ] Actions that take time or change something say so, and revert
- [ ] Registered, demoed, wired into `exampleDemos`, `pnpm registry:build` run
