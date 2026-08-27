import { ColorsExample } from "@/examples/colors-example"
import { FontsExample } from "@/examples/fonts-example"
import { cn } from "@/lib/utils"

/** Every example, laid out in one responsive grid. Add new examples here. */
function ExamplesGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="examples-grid"
      className={cn("grid items-start gap-6 lg:grid-cols-2", className)}
      {...props}
    >
      <ColorsExample />
      <FontsExample />
    </div>
  )
}

export { ExamplesGrid }
