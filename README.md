# aiellie ui

A [shadcn-style registry](https://ui.shadcn.com/docs/registry) of the elements
an AI chat interface is made of — messages, composer, code — and the site that
documents it, at **[ui.aiellie.dev](https://ui.aiellie.dev)**.

Every element installs on its own, brings exactly what it needs, and lands as
source in your project rather than as a dependency:

```bash
npx shadcn@latest add https://ui.aiellie.dev/r/bubble.json
```

Each element's page carries the live demo, the install command, and a props
reference generated from the component's own source.

## What's inside

- **Chat** — the assembled experiences: a full chat frame, a chat card, the
  empty-state greeting, avatars.
- **Messages** — the message side: bubbles, streaming text, reasoning, tool
  calls, citations, reactions, timestamps, hover actions, context menus, a
  scroller that holds its place.
- **Composer** — the input stack: the field, attachments, @-mentions, slash
  commands, model and tool pickers, approval and effort menus.
- **Coding** — the code family: highlighted blocks, diffs, tabs, terminals,
  file trees, annotations, install snippets.

Built on [Base UI](https://base-ui.com), Tailwind v4 and
[Hugeicons](https://hugeicons.com), for React 19.

## How it's put together

The registry is the single source of truth: the site's pages, the rail, the
install commands and the props tables are all derived from it, never
hand-written. Two build steps do what `shadcn build` will not:

- `scripts/build-registry.ts` rewrites bare dependency names to absolute URLs
  (so installs resolve against this registry, not shadcn/ui's) and fails the
  build if any file imports something its item did not declare.
- `scripts/build-docs.ts` reads each component's TypeScript syntax tree and
  writes the props reference from it — a hand-written props table is a second
  copy of the truth, and the copy is always the one that goes stale.

The rules the elements are built to — parts over props, hover always paired
with focus, every animation with a `motion-reduce` escape, tokens only — are
written down in [DESIGN.md](DESIGN.md), and rendered on the site itself.

## Development

```bash
pnpm dev             # the site, at localhost:3000
pnpm registry:build  # regenerate registry.json, public/r/ and the docs
pnpm typecheck
pnpm lint
```

`registry.json` and `public/r/` are generated but committed; rebuild before
committing any registry change. The architecture is documented at length in
[CLAUDE.md](CLAUDE.md).

## License

[MIT](LICENSE)
