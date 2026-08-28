import { getRuleDocs } from "./components/rules-docs"
import { SiteHeader } from "./components/site-header"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* The documents are read here rather than in the header, which is a
          client component and so has no file system to read them from. */}
      <SiteHeader docs={getRuleDocs()} />
      {children}
    </>
  )
}
