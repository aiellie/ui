import type { Registry } from "shadcn/schema";
import { examples } from "./_examples-registry";
import { aiellieui } from "./_aiellieui-registry";

export const registry: Registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "aiellie-ui",
  homepage: "https://aiellie.dev",
  items: [...aiellieui, ...examples],
};