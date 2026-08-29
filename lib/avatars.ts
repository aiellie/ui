/**
 * The portrait service. `images.aiellie.app` paints a deterministic marbled
 * image for any name it is asked for — the same name always returns the same
 * picture — which is exactly what a set of agent personas needs: every agent
 * gets a face nobody had to draw, and the face survives a redeploy.
 *
 * One module owns the URL shape so a demo never writes the host by hand;
 * when the service moves or grows a parameter, this is the whole edit.
 */

const HOST = "https://images.aiellie.app"

/** URL-safe: the service keys on the path segment, so the name has to be one. */
function slugOf(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "anonymous"
  )
}

export interface AvatarOptions {
  /** Corner radius baked into the image itself. 0 by default — the elements
   * round their own corners, and a picture that arrives pre-rounded fights
   * whatever frame it is put in. */
  radius?: number
}

/** The portrait for a name — an agent's, a person's, a room's. */
export function avatarFor(name: string, { radius = 0 }: AvatarOptions = {}) {
  return `${HOST}/${slugOf(name)}.png?mode=image&radius=${radius}`
}

/**
 * The same service asked for a picture rather than a portrait. A sample
 * generator for demos: every prompt gets its own abstract, so a generation
 * card can be tried — typed into, waited on, given something back — without
 * anybody's API key. The `seed` varies repeat runs of one prompt, because a
 * generator that returns the identical picture twice reads as broken.
 */
export function sampleImageFor(prompt: string, seed = 0) {
  return avatarFor(seed ? `${prompt} ${seed}` : prompt)
}
