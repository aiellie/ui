/**
 * Writes `registry/docs.json` — the API reference the docs panel reads, taken
 * from the elements' own source rather than written out beside them.
 *
 * A hand-written props table is a second copy of the truth, and the copy is
 * always the one that goes stale: rename a prop and the table still lists the
 * old one, with nothing to catch it. So the reference is derived. What a reader
 * sees on `/elements` is what the file they are about to install actually
 * accepts, or the build that made the page was reading a different file.
 *
 * This reads the syntax and not the type system. A checker-backed pass would
 * resolve `React.ComponentProps<"div">` into three hundred HTML attributes and
 * bury the six props that are ours, so a base the element did not declare
 * itself is named rather than expanded — "and everything a `<div>` takes" is
 * the sentence a reader wanted anyway. What is expanded is what this repository
 * writes by hand: object literals, the local aliases they are built from,
 * `Omit`/`Pick`/`Partial` over those, and the variants a `cva` call declares.
 *
 * Run by `pnpm registry:build`, ahead of the registry itself, so a props table
 * cannot be published for a file that failed its dependency check.
 */

import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import ts from "typescript"
import type { RegistryItem } from "shadcn/schema"

import { registry } from "../registry/_registry"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const docsFile = path.join(root, "registry", "docs.json")

/** One prop, as a row of the table. */
interface DocProp {
  name: string
  type: string
  optional: boolean
  /** The literal in the destructuring pattern, when there is one. */
  default?: string
  description?: string
}

/** One exported component, with the props it declares for itself. */
interface DocComponent {
  name: string
  description?: string
  props: DocProp[]
  /**
   * Prop sets it takes but does not spell out — `React.ComponentProps<"div">`,
   * a Base UI part's own props. Named rather than expanded.
   */
  extends: string[]
}

/** Everything the panel shows for one registry item. */
interface ItemDocs {
  /** Where a consumer imports from, once the CLI has written the files. */
  imports: { module: string; names: string[] }[]
  components: DocComponent[]
  /** Types, constants and hooks the item exports beside its components. */
  exports: string[]
}

/** The utility types worth resolving through rather than naming. */
const MAPPED = new Set(["Omit", "Pick", "Partial", "Required"])

/** Everything one file declares that a props annotation might point at. */
interface FileScope {
  source: ts.SourceFile
  types: Map<string, ts.TypeAliasDeclaration | ts.InterfaceDeclaration>
  /** `cva(…)` calls by the const they were assigned to, for `VariantProps`. */
  variants: Map<string, DocProp[]>
}

/** Collapses the newlines a printed type node keeps, so a cell stays a cell. */
function oneLine(text: string) {
  return text
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
}

/** The `/** … *\/` above a declaration, as plain prose. */
function docOf(node: ts.Node): string | undefined {
  const parts = ts
    .getJSDocCommentsAndTags(node)
    .filter(ts.isJSDoc)
    .map((doc) => ts.getTextOfJSDocComment(doc.comment) ?? "")
    .filter(Boolean)

  const text = oneLine(parts.join(" "))
  return text || undefined
}

/** `"a" | "b"` and `"a"` alike, as the keys they name. */
function literalKeys(node: ts.TypeNode | undefined): string[] {
  if (!node) return []
  if (ts.isUnionTypeNode(node)) return node.types.flatMap(literalKeys)
  if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) {
    return [node.literal.text]
  }
  return []
}

/**
 * The variants a `cva` call declares, as props — the shape `VariantProps` would
 * hand back, which is otherwise the one interesting base that reads as noise.
 * The default variant becomes the prop's default, since that is what it is.
 */
function variantProps(call: ts.CallExpression): DocProp[] {
  const config = call.arguments[1]
  if (!config || !ts.isObjectLiteralExpression(config)) return []

  const at = (object: ts.ObjectLiteralExpression, key: string) => {
    const found = object.properties.find(
      (property) =>
        ts.isPropertyAssignment(property) &&
        property.name.getText(property.getSourceFile()) === key
    )
    return found && ts.isPropertyAssignment(found)
      ? found.initializer
      : undefined
  }

  const variants = at(config, "variants")
  if (!variants || !ts.isObjectLiteralExpression(variants)) return []

  const defaults = at(config, "defaultVariants")
  const defaultFor = (name: string) => {
    if (!defaults || !ts.isObjectLiteralExpression(defaults)) return undefined
    const value = at(defaults, name)
    return value?.getText(value.getSourceFile())
  }

  return variants.properties.flatMap((property) => {
    if (!ts.isPropertyAssignment(property)) return []
    if (!ts.isObjectLiteralExpression(property.initializer)) return []

    const name = property.name.getText(property.getSourceFile())
    const values = property.initializer.properties
      .map((option) => option.name?.getText(option.getSourceFile()) ?? "")
      .filter(Boolean)
      .map((option) => `"${option.replace(/^["']|["']$/g, "")}"`)

    return [
      {
        name,
        type: values.join(" | "),
        optional: true,
        default: defaultFor(name),
      },
    ]
  })
}

/** What a props annotation resolves to: the rows, and the bases left named. */
interface Resolved {
  props: Map<string, DocProp>
  bases: string[]
}

function empty(): Resolved {
  return { props: new Map(), bases: [] }
}

function merge(into: Resolved, from: Resolved) {
  /* Later wins: an intersection's right-hand side is how this codebase
     narrows a prop it inherited, so the narrower one is the one to print. */
  for (const [name, prop] of from.props) into.props.set(name, prop)
  for (const base of from.bases) {
    if (!into.bases.includes(base)) into.bases.push(base)
  }
}

/** The members of an object literal or an interface body, as rows. */
function membersOf(
  members: readonly ts.TypeElement[],
  scope: FileScope
): Map<string, DocProp> {
  const props = new Map<string, DocProp>()

  for (const member of members) {
    if (!ts.isPropertySignature(member) || !member.name) continue

    const name = member.name.getText(scope.source)
    props.set(name, {
      name,
      type: member.type
        ? oneLine(member.type.getText(scope.source))
        : "unknown",
      optional: Boolean(member.questionToken),
      description: docOf(member),
    })
  }

  return props
}

/**
 * A props annotation flattened into rows and named bases.
 *
 * `seen` is what stops a type that refers to itself — or two that refer to each
 * other — from walking for ever, and the depth cap is what stops a long chain
 * of aliases from being worth the walk at all.
 */
function resolve(
  node: ts.TypeNode | undefined,
  scope: FileScope,
  seen: Set<string>,
  depth = 0
): Resolved {
  if (!node || depth > 6) return empty()

  if (ts.isParenthesizedTypeNode(node)) {
    return resolve(node.type, scope, seen, depth + 1)
  }

  if (ts.isTypeLiteralNode(node)) {
    return { props: membersOf(node.members, scope), bases: [] }
  }

  if (ts.isIntersectionTypeNode(node)) {
    const result = empty()
    for (const part of node.types) {
      merge(result, resolve(part, scope, seen, depth + 1))
    }
    return result
  }

  if (ts.isTypeReferenceNode(node)) {
    return resolveNamed(
      node.typeName.getText(scope.source),
      node.typeArguments,
      oneLine(node.getText(scope.source)),
      scope,
      seen,
      depth
    )
  }

  return { props: new Map(), bases: [oneLine(node.getText(scope.source))] }
}

/**
 * A named type applied to its arguments. The mapped types are walked through
 * rather than printed, since `Omit<MessageInputProps, "children">` is a shape
 * this repository wrote and a reader is owed its rows; anything else is a
 * shape someone else wrote, and its name is the more useful answer.
 */
function resolveNamed(
  name: string,
  args: ts.NodeArray<ts.TypeNode> | undefined,
  printed: string,
  scope: FileScope,
  seen: Set<string>,
  depth: number
): Resolved {
  const bare = name.replace(/^React\./, "")

  if (MAPPED.has(bare) && args?.length) {
    const inner = resolve(args[0], scope, seen, depth + 1)

    if (bare === "Omit" || bare === "Pick") {
      const keys = new Set(literalKeys(args[1]))
      const props = new Map<string, DocProp>()
      for (const [key, prop] of inner.props) {
        if (bare === "Omit" ? !keys.has(key) : keys.has(key))
          props.set(key, prop)
      }

      /* The base is kept, but said as what it now is — a reader dropping
         `children` still needs to know a `div`'s attributes come through.
         An `Omit` over an `Omit` is folded into one rather than printed as
         two, which is a shape this codebase reaches often enough that the
         nesting would be most of what the line said. */
      const quoted = [...keys].map((key) => `"${key}"`)
      const bases = inner.bases.map((base) => {
        if (!quoted.length) return base

        const nested = bare === "Omit" && /^Omit<(.+), (.+)>$/.exec(base)
        if (nested) {
          const already = nested[2].split(" | ")
          const all = [...new Set([...already, ...quoted])]
          return `Omit<${nested[1]}, ${all.join(" | ")}>`
        }

        return `${bare}<${base}, ${quoted.join(" | ")}>`
      })
      return { props, bases }
    }

    const props = new Map<string, DocProp>()
    for (const [key, prop] of inner.props) {
      props.set(key, { ...prop, optional: bare === "Partial" })
    }
    return { props, bases: inner.bases }
  }

  if (bare === "VariantProps" && args?.length) {
    /* `typeof buttonVariants` — the const the `cva` call was assigned to. */
    const argument = args[0]
    const target = ts.isTypeQueryNode(argument)
      ? argument.exprName.getText(scope.source)
      : undefined
    const variants = target ? scope.variants.get(target) : undefined
    if (variants) {
      return {
        props: new Map(variants.map((prop) => [prop.name, prop])),
        bases: [],
      }
    }
  }

  const declaration = scope.types.get(bare)
  if (declaration && !seen.has(bare)) {
    seen.add(bare)

    if (ts.isTypeAliasDeclaration(declaration)) {
      return resolve(declaration.type, scope, seen, depth + 1)
    }

    const result: Resolved = {
      props: membersOf(declaration.members, scope),
      bases: [],
    }

    for (const clause of declaration.heritageClauses ?? []) {
      for (const heritage of clause.types) {
        merge(
          result,
          resolveNamed(
            heritage.expression.getText(scope.source),
            heritage.typeArguments,
            oneLine(heritage.getText(scope.source)),
            scope,
            seen,
            depth + 1
          )
        )
      }
    }

    /* The interface's own members outrank anything it extends, which `merge`
       would otherwise have overwritten with the base's copy of the prop. */
    for (const [key, prop] of membersOf(declaration.members, scope)) {
      result.props.set(key, prop)
    }

    return result
  }

  return { props: new Map(), bases: [printed] }
}

/** The defaults a component's destructuring pattern gives its props. */
function defaultsOf(
  parameter: ts.ParameterDeclaration | undefined,
  source: ts.SourceFile
) {
  const defaults = new Map<string, string>()
  if (!parameter || !ts.isObjectBindingPattern(parameter.name)) return defaults

  for (const element of parameter.name.elements) {
    if (!element.initializer) continue
    const name = (element.propertyName ?? element.name).getText(source)
    defaults.set(name, oneLine(element.initializer.getText(source)))
  }

  return defaults
}

/** A declaration's function-ish body, wherever this codebase happens to put it. */
function functionOf(
  node: ts.Node
):
  | ts.FunctionDeclaration
  | ts.ArrowFunction
  | ts.FunctionExpression
  | undefined {
  if (ts.isFunctionDeclaration(node)) return node
  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return node

  /* `forwardRef<HTMLButtonElement, TooltipIconButtonProps>((props, ref) => …)`
     — the props are the second type argument, not the parameter's annotation,
     so the call is unwrapped and the annotation put back on. */
  if (ts.isCallExpression(node)) {
    const callee = node.expression
      .getText(node.getSourceFile())
      .replace(/^React\./, "")
    if (callee === "forwardRef" || callee === "memo") {
      const inner = node.arguments[0]
      return inner ? functionOf(inner) : undefined
    }
  }

  return undefined
}

/** The props type a declaration states, by annotation or by type argument. */
function annotationOf(node: ts.Node, fn: ts.SignatureDeclarationBase) {
  if (ts.isCallExpression(node)) {
    const callee = node.expression
      .getText(node.getSourceFile())
      .replace(/^React\./, "")
    if (callee === "forwardRef" && node.typeArguments?.[1])
      return node.typeArguments[1]
    if (callee === "memo" && node.typeArguments?.[0])
      return node.typeArguments[0]
  }
  return fn.parameters[0]?.type
}

/** Everything a module exports, by name — both spellings this repo uses. */
function exportsOf(source: ts.SourceFile) {
  const names = new Set<string>()

  for (const statement of source.statements) {
    const modifiers = ts.canHaveModifiers(statement)
      ? ts.getModifiers(statement)
      : undefined
    const exported = modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
    )

    if (exported) {
      if (ts.isFunctionDeclaration(statement) && statement.name) {
        names.add(statement.name.text)
      }
      if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name))
            names.add(declaration.name.text)
        }
      }
      if (
        (ts.isTypeAliasDeclaration(statement) ||
          ts.isInterfaceDeclaration(statement)) &&
        statement.name
      ) {
        names.add(statement.name.text)
      }
    }

    /* `export { Bubble, BubbleContent }` at the foot of the file. */
    if (ts.isExportDeclaration(statement) && statement.exportClause) {
      if (ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          names.add(element.name.text)
        }
      }
    }
  }

  return names
}

/** Reads one file into the declarations a props annotation can point at. */
function scopeOf(source: ts.SourceFile): FileScope {
  const types = new Map<
    string,
    ts.TypeAliasDeclaration | ts.InterfaceDeclaration
  >()
  const variants = new Map<string, DocProp[]>()

  for (const statement of source.statements) {
    if (
      ts.isTypeAliasDeclaration(statement) ||
      ts.isInterfaceDeclaration(statement)
    ) {
      types.set(statement.name.text, statement)
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name) || !declaration.initializer)
          continue
        if (!ts.isCallExpression(declaration.initializer)) continue
        if (declaration.initializer.expression.getText(source) !== "cva")
          continue
        variants.set(
          declaration.name.text,
          variantProps(declaration.initializer)
        )
      }
    }
  }

  return { source, types, variants }
}

/** Every component one file exports, with its props flattened. */
function componentsOf(source: ts.SourceFile) {
  const scope = scopeOf(source)
  const exported = exportsOf(source)
  const components: DocComponent[] = []
  const found = new Set<string>()

  const consider = (name: string, declaration: ts.Node, docNode: ts.Node) => {
    if (!exported.has(name) || found.has(name)) return
    if (!/^[A-Z]/.test(name)) return

    const fn = functionOf(declaration)
    if (!fn) return

    const annotation = annotationOf(declaration, fn)
    const { props, bases } = resolve(annotation, scope, new Set())
    const defaults = defaultsOf(fn.parameters[0], source)

    found.add(name)
    components.push({
      name,
      description: docOf(docNode) ?? docOf(declaration),
      props: [...props.values()]
        .map((prop) => ({
          ...prop,
          default: prop.default ?? defaults.get(prop.name),
        }))
        /* Required first, then alphabetical: what a caller must pass is what
           it reads for, and the rest is a reference to be looked up in. */
        .sort((a, b) =>
          a.optional === b.optional
            ? a.name.localeCompare(b.name)
            : Number(a.optional) - Number(b.optional)
        ),
      extends: bases,
    })
  }

  for (const statement of source.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      consider(statement.name.text, statement, statement)
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name) || !declaration.initializer)
          continue
        consider(declaration.name.text, declaration.initializer, statement)
      }
    }
  }

  /* What is exported and is not a component: the types a caller has to name to
     hold one of these in their own state, and the constants they compare to. */
  const others = [...exported]
    .filter((name) => !found.has(name))
    .sort((a, b) => a.localeCompare(b))

  return { components, others }
}

/** `components/ui/bubble.tsx` → `@/components/ui/bubble`. */
function moduleOf(target: string) {
  return `@/${target.replace(/\.(tsx?|jsx?)$/, "")}`
}

async function docsFor(item: RegistryItem): Promise<ItemDocs | undefined> {
  const files = (item.files ?? []).filter((file) => /\.tsx?$/.test(file.path))
  if (!files.length) return

  const imports: ItemDocs["imports"] = []
  const components: DocComponent[] = []
  const exports: string[] = []

  for (const file of files) {
    const text = await readFile(path.join(root, file.path), "utf8")
    const source = ts.createSourceFile(
      file.path,
      text,
      ts.ScriptTarget.Latest,
      /* setParentNodes, so `getText()` can reach back to the source. */ true,
      ts.ScriptKind.TSX
    )

    const found = componentsOf(source)
    components.push(...found.components)
    exports.push(...found.others)

    const names = [
      ...found.components.map((component) => component.name),
      ...found.others,
    ]
    if (names.length) {
      imports.push({ module: moduleOf(file.target ?? file.path), names })
    }
  }

  if (!components.length && !exports.length) return

  return { imports, components, exports }
}

async function main() {
  const docs: Record<string, ItemDocs> = {}

  for (const item of registry.items) {
    /* Examples are the demo of an element, not an element — their API is the
       element's, which is documented under its own name. */
    if (item.type === "registry:example") continue

    const found = await docsFor(item)
    if (found) docs[item.name] = found
  }

  await writeFile(docsFile, `${JSON.stringify(docs, null, 2)}\n`, "utf8")

  const props = Object.values(docs).reduce(
    (total, item) =>
      total +
      item.components.reduce(
        (count, component) => count + component.props.length,
        0
      ),
    0
  )
  console.log(
    `docs.json: ${Object.keys(docs).length} items, ` +
      `${Object.values(docs).reduce((total, item) => total + item.components.length, 0)} components, ` +
      `${props} props`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
