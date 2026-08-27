import { ExamplesGrid } from "@/examples/examples-grid"

export default function Page() {
  return (
    <div className="min-h-svh p-6 md:p-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-medium">UI kit</h1>
          <p className="text-sm text-muted-foreground">
            The design tokens this project builds on. Press{" "}
            <kbd className="font-mono">d</kbd> to toggle dark mode.
          </p>
        </header>
        <ExamplesGrid />
      </div>
    </div>
  )
}
