import Link from "next/link"

/**
 * One boundary at the root rather than one per section: `notFound()` from an
 * unmatched element slug and a mistyped URL both land here, and the page keeps
 * the site's own surface — the default 404 is a jarring break from a site
 * whose whole point is how things look.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-xl font-semibold tracking-tight">
        Nothing lives at this address
      </h1>
      <p className="max-w-sm text-sm text-balance text-muted-foreground">
        The element may have been renamed, or the link predates it. Everything
        the registry has is on the elements page.
      </p>
      <Link
        href="/elements"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Browse the elements
      </Link>
    </main>
  )
}
