# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                 # Next.js dev server
pnpm registry:build      # regenerate registry.json + public/r/*.json (run after ANY registry edit)
pnpm build               # registry:build, then next build
pnpm typecheck           # tsc --noEmit
pnpm lint                # eslint
pnpm format              # prettier --write "**/*.{ts,tsx}"
```

There is no test suite.

`REGISTRY_URL` overrides the homepage that install URLs are built from. Use it to verify
an item actually installs before publishing:

```bash
REGISTRY_URL=http://localhost:3000 pnpm registry:build
```

Then in a throwaway project: `npx shadcn@latest add http://localhost:3000/r/<name>.json`.
Always rebuild without the override afterwards — `registry.json` and `public/r/` are
committed, and a localhost URL must never land in them.

## Architecture

This is a shadcn-style component registry _and_ the site that documents it. The registry
is the single source of truth: the site's pages are generated from it, not hand-written.

### An item has two halves

This is the thing to understand before touching anything.

1. **The serializable half** — `registry/_*-registry.ts`. Plain data, compiled into
   `registry.json` and `public/r/<name>.json`. This is what the shadcn CLI installs.
2. **The site half** — `registry/_demos.ts`. The `exampleDemos` map holds what can't be
   put in JSON: the actual demo _components_ and the glyph its card carries.

`registry/_demos.ts` joins them into `Example` objects and is the only thing the pages
read. An item registered and built but missing from `exampleDemos` installs correctly and
**renders nowhere**. It logs a dev-only warning (`[registry] No card for …`) rather than
failing, so check the dev console when a card doesn't appear.

### Where items are registered

`registry/_registry.ts` composes six files, each mapping to one directory:

| File                      | Target directory         | Holds                                                         |
| ------------------------- | ------------------------ | ------------------------------------------------------------- |
| `_ui-registry.ts`         | `components/ui/`         | shadcn-style primitives (kbd, tooltip, bubble)                |
| `_aiellieui-registry.ts`  | `components/aiellie-ui/` | published elements (code-snippet)                             |
| `_components-registry.ts` | `components/aiellie-ui/` | site chrome the elements need (demo-card, toolbars, switcher) |
| `_examples-registry.ts`   | `examples/<category>/`   | the `-demo` items, one per card                               |
| `_lib-registry.ts`        | `lib/`                   | utils, highlight, colors, fonts                               |
| `_hooks-registry.ts`      | `hooks/`                 | use-copy-to-clipboard                                         |

### The build script is a validator

`scripts/build-registry.ts` does two things `shadcn build` will not:

- **Rewrites bare `registryDependencies` names to URLs.** A bare name is otherwise looked
  up in _shadcn/ui's own_ registry (`styles/<style>/<name>.json`), so `"actions"` would
  404 for consumers and `"utils"` would silently install shadcn/ui's. Write bare local
  names and let the build rewrite them — never hand-write `https://aiellie.dev/r/…`.
  Names with a scope, path, protocol, or leading dot pass through untouched.
- **Checks every file's imports against the item's declared dependencies.** A `@/` import
  with no matching `registryDependencies` entry, or a bare package with no `dependencies`
  entry, fails the build before `registry.json` is written.

### Categories drive the site

Every example lives on one page, `/design`, and `categories` decides where in its
sidebar it lands — nothing else does.

`lib/categories.ts` is the whole of it: `registrySections` names the labels the rail
stands its items under (Elements, Tokens) and their order, and `registryCategories` names
the categories, their order, icon, and the `section` each belongs to.
`app/(main)/components/examples-browser.tsx` builds the rail from the two and shows one
category's grid at a time.

- An example falls into the **first** category it carries, so it can't appear twice.
- One matching no visible category lands in a trailing "Other" item rather than going
  missing, in a run of its own under no label.
- A category with nothing in it gets no item, and a section whose categories are all
  empty gets no label: the rail shows what the page has, not what the registry could
  name. So a new category is two edits — `lib/categories.ts`, and `categories` on the
  example — and no page needs touching.

### RSC boundary

`Example.variants[].demo` is a React component — a function — so an `Example` **cannot be
passed from a Server Component to a Client Component**. It throws
`Functions cannot be passed directly to Client Components`.

`/design` is a Server Component. It therefore has a thin `"use client"` wrapper
(`design-browser.tsx`) that imports `examplesWithDemos` from `registry/_demos.ts` inside
the client bundle and renders `<ExamplesBrowser>` with it. Keep that shape: don't
"simplify" it by lifting the list into the page.

## Adding a component and its demo

Six steps. Skipping step 5 is the common failure — everything builds and installs, and the
card just isn't on the page.

1. **Write the component.** `components/ui/<name>.tsx` for a primitive, or
   `components/aiellie-ui/<name>.tsx` for an element.

2. **Register it** in `_ui-registry.ts` or `_aiellieui-registry.ts`:

   ```ts
   {
     name: "bubble",
     type: "registry:ui",
     title: "Bubble",
     description: "A bubble is a container for a message.",
     registryDependencies: ["utils"],     // bare local names
     dependencies: ["@base-ui/react"],    // npm packages
     files: [{ path: "components/ui/bubble.tsx", type: "registry:ui", target: "components/ui/bubble.tsx" }],
   }
   ```

   Every `@/` import needs a `registryDependencies` entry and every bare package a
   `dependencies` entry, or the build fails and tells you which.

3. **Write the demos** at `examples/<category>/<name>.tsx`, one exported component per tab:

   ```tsx
   export function BubbleDemo() { … }
   export function BubbleVariantsDemo() { … }
   ```

4. **Register the demo** in `_examples-registry.ts` as `<name>-demo`:

   ```ts
   {
     name: "bubble-demo",
     type: "registry:example",
     title: "Bubble",
     description: "A bubble is a container for a message.",
     registryDependencies: ["bubble"],   // FIRST entry must be the element being demoed
     files: [{ path: "examples/messages/bubble.tsx", type: "registry:example", target: "examples/messages/bubble.tsx" }],
     categories: ["messages"],
     meta: {
       variants: [
         { name: "Default", demo: "BubbleDemo" },        // demo = the export name
         { name: "Variants", demo: "BubbleVariantsDemo" },
       ],
       wide: false,                                       // true spans both grid columns
     },
   }
   ```

   `registryDependencies[0]` is load-bearing: the card's toolbar copies it as the
   "Component" install line, with the demo item itself as "With demo". Reordering that
   array silently changes what users copy.

   The `-demo` suffix is also load-bearing: `hrefFor` in `_demos.ts` strips it to build the
   card's link.

5. **Wire the site half** in `registry/_demos.ts` — import the demos and add the entry:

   ```ts
   import * as bubbleDemos from "@/examples/messages/bubble"

   const exampleDemos: Record<string, ExampleDemos> = {
     "bubble-demo": {
       icon: MessageSquareDotIcon,
       components: { ...bubbleDemos },
     },
   }
   ```

   Use `variants:` instead of `components:` for a demo whose tabs are generated from data
   rather than named exports (see `colors-demo`).

6. **`pnpm registry:build`**, then check the page. Nothing in `app/` needs editing — the
   grid, sections, numbering, and install commands all derive from the registry.

## Conventions

- `registry.json` and `public/r/` are generated but **committed**. Rebuild before committing
  any registry change.
- Icons are Hugeicons (`@hugeicons/core-free-icons` + `@hugeicons/react`), set in
  `components.json`. Card glyphs live in `exampleDemos`; section glyphs in `lib/categories.ts`.
- Comments in this codebase explain _why_, often at length, and prose is in British spelling.
  Match that register rather than adding restating comments.
- `DemoCard` lazy-mounts its children behind an IntersectionObserver and demos fade in over
  300ms — an empty preview box in a screenshot or scripted DOM check usually means you
  sampled too early, not that rendering is broken.
