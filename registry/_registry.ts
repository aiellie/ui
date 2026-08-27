import type { Registry } from "shadcn/schema";
import { examples } from "./_examples-registry";
import { aiellieui } from "./_aiellieui-registry";
import { lib } from "./_lib-registry";
import { hooks } from "./_hooks-registry";
import { components } from "./_components-registry";

export const registry: Registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "aiellie-ui",
  homepage: "https://aiellie.dev",
  items: [...aiellieui, ...examples, ...lib, ...hooks, ...components],
};