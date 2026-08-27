import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
