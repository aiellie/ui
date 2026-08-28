import { getRuleDocs } from "./components/rules-docs"
import { SiteHeader } from "./components/site-header"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    /* The header's height is named once here — it has to match `h-11` on the
       header itself — so a page that fills the window rather than scrolling the
       document can measure against it without restating the number. /agents is
       the one that needs it: a panel group divides a fixed frame, so it has to
       be told what is left over after the header.

       `min-h`, not `h`: the document is still the scroller for every page
       taller than the window, which is what the header's `sticky` is for. */
    <div className="flex min-h-svh flex-col [--header-height:2.75rem]">
      {/* The documents are read here rather than in the header, which is a
          client component and so has no file system to read them from. */}
      <SiteHeader docs={getRuleDocs()} />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
