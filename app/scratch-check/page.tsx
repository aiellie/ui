"use client"

import {
  TypingBubbleDemo,
  TypingBubbleFlowDemo,
  TypingBubbleVariantsDemo,
} from "@/examples/messages/typing-bubble"

export default function Page() {
  return (
    <div className="flex flex-col gap-12 p-10">
      <TypingBubbleDemo />
      <TypingBubbleVariantsDemo />
      <TypingBubbleFlowDemo />
    </div>
  )
}
