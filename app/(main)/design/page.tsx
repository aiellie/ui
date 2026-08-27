import { DesignBrowser } from "./components/design-browser"
import { DesignHeader } from "./components/design-header"

export default function Page() {
  return (
    <div className="mx-auto w-full {/*max-w-6xl*/} px-6 py-10 md:px-6">
     <header className="flex flex-col gap-1">
        <DesignHeader />
      </header> 
      <DesignBrowser />
    </div>
  )
}
