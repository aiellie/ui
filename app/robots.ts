import type { MetadataRoute } from "next"

/**
 * Everything is open, and deliberately so — AI crawlers included. This registry
 * exists to be fetched by machines: the shadcn CLI pulls `/r/<name>.json`, and
 * an agent reading an element's page before installing it is the intended
 * reader, not an abuse case. So no rule singles a crawler out and nothing is
 * disallowed; blocking the bots would block the audience.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://ui.aiellie.dev/sitemap.xml",
  }
}
