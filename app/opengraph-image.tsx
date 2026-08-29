import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt =
  "aiellie ui — Elements for AI chat interfaces, installable one at a time."

/**
 * Colour literals, in a codebase whose rule is tokens only: `ImageResponse`
 * renders off-DOM through satori, where `globals.css` never loads and a CSS
 * custom property has nothing to resolve against. These are the light palette
 * transcribed by hand — the near-white ground, the violet `--accent`, the
 * `--muted-foreground` grey and the near-black `--foreground` — and if the
 * palette moves, this file has to be moved with it.
 *
 * No `fontFamily` for the same reason: satori cannot see system fonts, so the
 * text sets in the sans it bundles, which is the plain typographic voice this
 * card wants anyway.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 96px",
        backgroundColor: "#fbfbfa",
      }}
    >
      {/* The accent as a small filled square rather than a wash: one mark of
            the brand colour says more than a gradient it would drown in. */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: "#6456e8",
          marginBottom: 48,
        }}
      />
      <div
        style={{
          fontSize: 116,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          color: "#09090b",
        }}
      >
        aiellie ui
      </div>
      <div
        style={{
          marginTop: 28,
          fontSize: 34,
          color: "#6d6a78",
        }}
      >
        Elements for AI chat interfaces — installable one at a time.
      </div>
    </div>,
    size
  )
}
