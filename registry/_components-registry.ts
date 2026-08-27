import type { Registry } from "shadcn/schema";

/**
 * Registry item definitions for the elements, used to build registry.json
 * (https://ui.shadcn.com/docs/registry/getting-started).
 *
 * Local item names in registryDependencies ("surface-tokens", "range") resolve
 * against this registry once it is published; the build step maps them to
 * `<homepage>/r/<name>.json` URLs.
 */
export const components: Registry["items"] = [
  {
    name: "actions",
    type: "registry:component",
    title: "Actions",
    description:
      "Actions are used to perform actions on the UI.",
    registryDependencies: ["utils"],
    files: [
      {
        path: "components/aiellie-ui/actions.tsx",
        type: "registry:component",
        target: "components/aiellie-ui/actions.tsx",
      },
    ],
  },
];
