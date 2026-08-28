import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { fontVariables } from "@/lib/fonts"
import { cn } from "@/lib/utils"

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
          <ThemeToggle className="fixed right-4 bottom-4 z-50" />
        </ThemeProvider>
      </body>
    </html>
  )
}
