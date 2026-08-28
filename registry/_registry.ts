import type { Registry } from "shadcn/schema"

import { aiellieui } from "./_aiellieui-registry"
import { components } from "./_components-registry"
import { examples } from "./_examples-registry"
import { hooks } from "./_hooks-registry"
import { lib } from "./_lib-registry"
import { ui } from "./_ui-registry"
import { icons } from "./_icons-registry"

export const registry: Registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "aiellie-ui",
  homepage: "https://ui.aiellie.dev",
  items: [
    ...aiellieui,
    ...components,
    ...ui,
    ...examples,
    ...lib,
    ...hooks,
    ...icons,
  ],
}
