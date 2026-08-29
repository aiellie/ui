import type { RegistryItem } from "shadcn/schema"

import type {
  ElementDoc,
  ElementDocComponent,
} from "@/components/aiellie-ui/element-docs"

import { examples } from "./_examples-registry"
import { hrefFor } from "./_paths"
import { registry } from "./_registry"
import generated from "./docs.json"

/**
 * What the docs panel is handed for one example: the registry's own account of
 * the element — how it installs, what comes with it, what it writes — joined to
 * the API reference `scripts/build-docs.ts` reads out of the source.
 *
 * Plain data throughout, deliberately. It is resolved on the server and handed
 * across to the panel as props, which keeps `docs.json` — a hundred kilobytes
 * of props tables, most of them for elements you are not reading — out of the
 * client bundle entirely. The demos cannot travel that way, since a variant
 * carries a component; a props table is only ever strings.
 *
 * Kept apart from `_demos.ts` for the same reason `_paths.ts` is: the routes
 * need this on the server, and importing that file would drag every demo
 * component in behind it.
 */

/** The generated half, keyed by the registry item whose files it read. */
const api = generated as Record<
  string,
  {
    imports: { module: string; names: string[] }[]
    components: ElementDocComponent[]
    exports: string[]
  }
>

const items = new Map(registry.items.map((item) => [item.name, item]))

const homepage = registry.homepage.replace(/\/+$/, "")

/**
 * The install line without its runner, so the panel can put `npx`, `pnpm dlx`
 * or `bunx` in front of it as asked. `_demos.ts` builds the `npx` form for the
 * toolbar's copy button, which wants one line and no choice about it.
 */
function installFor(name: string) {
  return `shadcn@latest add ${homepage}/r/${name}.json`
}

/**
 * The element an example demos — a demo's first registry dependency is the
 * thing it demos, which is the same convention the toolbar's "Component"
 * install line is built on.
 */
function elementOf(item: RegistryItem) {
  return item.registryDependencies?.[0] ?? item.name
}

/**
 * Where a dependency is read, when it is read anywhere. Only the items an
 * example demos have a page, so `utils` and `highlight` are named without being
 * linked rather than pointing at a route that would 404.
 */
const pages = new Map(
  examples.map((example) => [elementOf(example), hrefFor(example.name)])
)

/**
 * Everything the panel shows for one example, or nothing when the example does
 * not name a registry item this build knows about — which the routes have
 * already ruled out, so in practice it is the guard and not the answer.
 */
export function docsFor(exampleName: string): ElementDoc | undefined {
  const example = items.get(exampleName)
  if (!example) return

  const name = elementOf(example)
  const element = items.get(name)
  if (!element) return

  const found = api[name]

  return {
    name,
    title: element.title ?? name,
    /* The element's own line, not the demo's: they differ, and the one worth
       reading beside a props table is what the thing is rather than what this
       particular demo of it is showing. */
    description: element.description ?? example.description ?? "",
    install: installFor(name),
    demoInstall: installFor(example.name),
    imports: found?.imports ?? [],
    components: found?.components ?? [],
    exports: found?.exports ?? [],
    dependencies: element.dependencies ?? [],
    registryDependencies: (element.registryDependencies ?? []).map(
      (dependency) => ({
        name: dependency,
        title: items.get(dependency)?.title ?? dependency,
        href: pages.get(dependency),
      })
    ),
    files: (element.files ?? []).map((file) => file.target ?? file.path),
  }
}
