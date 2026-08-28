import { DesignBrowser } from "./components/design-browser"
import { DesignHeader } from "./components/design-header"

export default function Page() {
  return (
    <div className="{/*max-w-6xl*/} mx-auto w-full px-6 py-4 md:px-6">
      {/*<header className="flex flex-col gap-1">
        <DesignHeader />
      </header> */}
      <DesignBrowser />
    </div>
  )
}
