import { TokensSections } from "./components/tokens-sections"
import { TokensHeader } from "./components/tokens-header"

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
      <header className="flex flex-col gap-1">
        <TokensHeader />
      </header>
      <TokensSections />
    </div>
  )
}
