import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /**
   * The rules panel reads `CLAUDE.md`, `DESIGN.md` and `TODO.md` off disk.
   * Every route is prerendered, so that happens at build time and the text is
   * baked into the output — but the read is written against `process.cwd()`,
   * which the tracer cannot follow, and left to guess it drags the whole
   * repository into the bundle. Naming the files keeps the trace exact and
   * keeps them present should a route under this layout ever become dynamic.
   */
  outputFileTracingIncludes: {
    "/**": ["./CLAUDE.md", "./DESIGN.md", "./TODO.md"],
  },

  /**
   * Every example is read under `/elements` now; the tokens and the page that
   * showed them are gone. The old routes are kept as redirects so the links
   * already out there — a card's install line is not the only thing people
   * copy — still land somewhere.
   */
  async redirects() {
    return [
      { source: "/design", destination: "/elements", permanent: true },
      { source: "/design/:slug", destination: "/elements", permanent: true },
      { source: "/tokens", destination: "/elements", permanent: true },
    ]
  },
}

export default nextConfig
