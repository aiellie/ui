import type { Registry } from "shadcn/schema";

/**
 * Registry item definitions for the elements, used to build registry.json
 * (https://ui.shadcn.com/docs/registry/getting-started).
 *
 * Local item names in registryDependencies ("surface-tokens", "range") resolve
 * against this registry once it is published; the build step maps them to
 * `<homepage>/r/<name>.json` URLs.
 */
export const aiellieui: Registry["items"] = [
  {
    name: "code-snippet",
    type: "registry:ui",
    title: "Code Snippet",
    description:
      "The line that installs a thing, under tabs for the package manager running it — npx, pnpm dlx, bunx, or yarn dlx — or under tabs of your own, or under none at all, coloured like code on request, with a copy action handed exactly the line on screen.",
    registryDependencies: ["utils", "surface-tokens", "highlight"],
    files: [
      {
        path: "components/aiellie-ui/code/code-snippet.tsx",
        type: "registry:ui",
        target: "components/aiellie-ui/code/code-snippet.tsx",
      },
    ],
  },
];
