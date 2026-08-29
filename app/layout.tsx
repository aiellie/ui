import "./globals.css"
import type { Metadata } from "next"

import { ThemeProvider } from "@/components/theme-provider"
import { fontVariables } from "@/lib/fonts"
import { cn } from "@/lib/utils"

/**
 * The site-wide defaults every page inherits: the pages under `/elements` set
 * their own titles into the template, and everything else — the description,
 * the cards a pasted link unfurls into — is said once here rather than per
 * page. `metadataBase` is what turns the relative OG image paths the routes
 * declare into the absolute URLs the crawlers require.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://ui.aiellie.dev"),
  title: {
    default: "aiellie ui",
    template: "%s — aiellie ui",
  },
  description:
    "A shadcn-style registry of the elements an AI chat interface is made of — messages, composer, code — each one installable on its own.",
  openGraph: {
    siteName: "aiellie ui",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans antialiased", fontVariables)}
    >
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
