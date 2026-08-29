# ROADMAP.md

Where this registry is going, in the order it will get there. The near list is
what the next stretch of commits is for; the far list is direction, not
promise. Shipped work leaves this file rather than being ticked on it — the
site itself is the changelog.

## Now

- A homepage that shows the thing: a composed chat scene built from the
  elements, the one-line install, and the way into `/elements`.
- An accessibility pass to the standard DESIGN.md already claims: every
  visual state announced, real tab semantics where tabs are claimed, the
  muted text ramp held to contrast.
- Tool calls that ask first: an awaiting-approval state with approve and deny,
  a cancel on a running call, and a call streaming its arguments in — the
  states an agent's day is actually made of.
- The mobile pass: the collapsed rail, the docs drawer and the stage verified
  on real widths, not just plausible ones.

## Next

- The assembled chat as an installable block, wired to a real streaming
  backend rather than a script.
- Working cards: an image generator, a video generator — generation demos a
  reader can point at their own key and run, not just look at.
- Agent cards: beyond generation, the shapes an agent's work takes — runs,
  approvals, handoffs.
- A playground worth the tab: the elements composable on a scratch surface.

## Later

- A listing in the shadcn registry directory, so `@aiellie` resolves from the
  CLI and editors' agents can install from here out of the box.
- `llms.txt`, and the docs readable as plain markdown by anything that asks.
- Open-in-v0 on every card.
- Blocks: larger compositions — a support thread, a code-review thread, an
  agent console — each installable as one item.
