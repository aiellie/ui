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
   * Elements and tokens are one page now, and the rail sorts them out. The old
   * routes are kept as redirects so the links already out there — a card's
   * install line is not the only thing people copy — still land somewhere.
   */
  async redirects() {
    return [
      { source: "/elements", destination: "/design", permanent: true },
      { source: "/tokens", destination: "/design", permanent: true },
    ]
  },
}

export default nextConfig
