/**
 * Writes the `registry.json` that `shadcn build` reads, from the item
 * definitions in `registry/_registry.ts`
 * (https://ui.shadcn.com/docs/registry/getting-started).
 *
 * Two things happen here that the CLI will not do for us:
 *
 * 1. Local names in `registryDependencies` become URLs. A bare name is only
 *    ever looked up in shadcn/ui's own registry — `styles/<style>/<name>.json`
 *    — so `"actions"` would 404 for anyone installing from this registry.
 *    Every bare name that matches an item defined here is rewritten to
 *    `<homepage>/r/<name>.json`; anything else is left alone, since that is
 *    exactly how you depend on a shadcn/ui item.
 *
 * 2. The items are checked against what the files actually import, so a new
 *    element cannot ship with a dependency its consumers do not get.
 *
 * Those URLs are only reachable once the site is deployed, so `REGISTRY_URL`
 * overrides the homepage they are built from — point it at the dev server to
 * install from a local registry, or at `$VERCEL_URL` to install from a preview.
 */

import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import type { RegistryItem } from "shadcn/schema"

import { registry } from "../registry/_registry"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const registryFile = path.join(root, "registry.json")

/** Provided by the framework, so no item has to declare them. */
const ambientPackages = new Set(["react", "react-dom", "next"])

/** Tried in order against an `@/`-aliased import, which carries no extension. */
const sourceExtensions = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]

const homepage = (process.env.REGISTRY_URL || registry.homepage).replace(
  /\/+$/,
  ""
)
const items = registry.items

/** The name of every item defined here — what makes a bare name "local". */
const localNames = new Set(items.map((item) => item.name))

/** Which item ships a given file, so an import can be traced back to a name. */
const ownerOfFile = new Map<string, string>()
for (const item of items) {
  for (const file of item.files ?? []) {
    ownerOfFile.set(file.path, item.name)
  }
}

const errors: string[] = []
const warnings: string[] = []

/**
 * A bare name is a dependency on this registry or on shadcn/ui. Anything with
 * a scope, a path, a protocol or a leading dot already says where it lives —
 * a namespaced item, a GitHub ref, a URL, a local file — and is passed through.
 */
function isBareName(dependency: string) {
  return !/^[@.]/.test(dependency) && !/[/:]/.test(dependency)
}

/** `@base-ui/react/separator` → `@base-ui/react`; `next/font/google` → `next`. */
function packageOf(specifier: string) {
  const segments = specifier.split("/")
  return specifier.startsWith("@")
    ? segments.slice(0, 2).join("/")
    : segments[0]
}

/** Every module a file pulls in, from static imports and re-exports alike. */
async function importsOf(file: string) {
  const source = await readFile(path.join(root, file), "utf8")
  const specifiers = source.matchAll(/\bfrom\s+["']([^"']+)["']/g)
  return new Set(Array.from(specifiers, (match) => match[1]))
}

/** An `@/`-aliased import as a repo-relative path, or null if nothing is there. */
function resolveAlias(specifier: string) {
  if (!specifier.startsWith("@/")) return null
  const base = specifier.slice(2)
  for (const extension of sourceExtensions) {
    const candidate = `${base}${extension}`
    if (existsSync(path.join(root, candidate))) return candidate
  }
  return null
}

/** Names are the URLs consumers install by, so a collision is unbuildable. */
function checkUniqueNames() {
  const seen = new Set<string>()
  for (const item of items) {
    if (seen.has(item.name)) errors.push(`Duplicate item name: ${item.name}.`)
    seen.add(item.name)
  }
}

/**
 * What an item's files import, against what the item promises to install with.
 * A missed `registryDependencies` entry leaves a dangling import in someone
 * else's project; a missed `dependencies` entry leaves a missing package.
 */
async function checkItem(item: RegistryItem) {
  const registryDependencies = new Set(item.registryDependencies ?? [])
  const packages = new Set(
    [...(item.dependencies ?? []), ...(item.devDependencies ?? [])].map(
      // Versions are allowed here — `zod@3.23.8` is still a dependency on zod.
      (dependency) => dependency.replace(/(?!^)@.+$/, "")
    )
  )

  for (const file of item.files ?? []) {
    if (!existsSync(path.join(root, file.path))) {
      errors.push(`${item.name}: file not found — ${file.path}.`)
      continue
    }

    for (const specifier of await importsOf(file.path)) {
      if (specifier.startsWith(".")) {
        errors.push(
          `${item.name}: ${file.path} imports "${specifier}" relatively. ` +
            `Use the "@/" alias so the import survives being installed elsewhere.`
        )
        continue
      }

      if (specifier.startsWith("@/")) {
        const target = resolveAlias(specifier)
        if (!target) {
          errors.push(
            `${item.name}: ${file.path} imports missing "${specifier}".`
          )
          continue
        }
        const owner = ownerOfFile.get(target)
        if (!owner) {
          errors.push(
            `${item.name}: ${file.path} imports "${specifier}", which no ` +
              `registry item ships. Add ${target} to an item.`
          )
        } else if (owner !== item.name && !registryDependencies.has(owner)) {
          errors.push(
            `${item.name}: missing registryDependencies entry "${owner}" ` +
              `(imported by ${file.path}).`
          )
        }
        continue
      }

      const dependency = packageOf(specifier)
      if (specifier.startsWith("node:") || ambientPackages.has(dependency))
        continue
      if (!packages.has(dependency)) {
        errors.push(
          `${item.name}: missing dependencies entry "${dependency}" ` +
            `(imported by ${file.path}).`
        )
      }
    }
  }
}

/** Local names become URLs; everything else is left for the CLI to resolve. */
function resolveRegistryDependencies(item: RegistryItem): RegistryItem {
  if (!item.registryDependencies?.length) return item

  return {
    ...item,
    registryDependencies: item.registryDependencies.map((dependency) => {
      if (!isBareName(dependency)) return dependency
      if (localNames.has(dependency)) return `${homepage}/r/${dependency}.json`
      warnings.push(
        `${item.name}: "${dependency}" is not defined here, so it will be ` +
          `installed from shadcn/ui.`
      )
      return dependency
    }),
  }
}

async function build() {
  checkUniqueNames()
  for (const item of items) await checkItem(item)

  if (errors.length) {
    console.error(
      `\nregistry.json not written — ${errors.length} problem(s):\n`
    )
    for (const error of errors) console.error(`  - ${error}`)
    console.error()
    process.exit(1)
  }

  const resolved = {
    ...registry,
    homepage,
    items: items.map(resolveRegistryDependencies),
  }

  await writeFile(registryFile, `${JSON.stringify(resolved, null, 2)}\n`)

  for (const warning of new Set(warnings)) console.warn(`  ! ${warning}`)
  console.log(
    `Wrote ${path.relative(root, registryFile)} — ${items.length} items.`
  )
}

await build()
