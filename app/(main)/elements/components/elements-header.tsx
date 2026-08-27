import { AiElementsIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

export function ElementsHeader() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="flex items-center gap-2 text-lg font-medium">
          <HugeiconsIcon icon={AiElementsIcon} className="size-4.5" />
          Elements
        </h1>

      </div>
      <p className="text-foreground/50 mt-1.5 max-w-md text-[13.5px] leading-relaxed">
        Small, composable pieces for AI interfaces — streaming, waiting, and
        the surfaces they sit on.
      </p>
    </div>
  );
}
