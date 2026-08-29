import type { MetadataRoute } from "next"

import { examples } from "@/registry/_examples-registry"
import { hrefFor } from "@/registry/_paths"

/**
 * A literal rather than `metadataBase`: the layout's metadata does not reach a
 * sitemap route, and a sitemap's URLs must be absolute anyway.
 */
const base = "https://ui.aiellie.dev"

/**
 * The element pages are derived from the same plain data the `[name]` route's
 * `generateStaticParams` reads — `_examples-registry.ts` through `_paths.ts` —
 * so a page cannot render without being listed here, nor be listed without
 * rendering. `/elements` itself redirects to the first item, but it is the
 * address people link and share, so it is listed as well.
 *
 * No `lastModified`: there is no honest per-page value to give, and stamping
 * the build date on every entry would claim the whole site changed on every
 * deploy.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base },
    { url: `${base}/elements` },
    ...examples.map((item) => ({ url: `${base}${hrefFor(item.name)}` })),
  ]
}
