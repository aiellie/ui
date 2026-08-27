"use client"

import {
  MessageContextMenuDemo,
  MessageContextMenuReactionsDemo,
} from "@/examples/messages/message-context-menu"

export default function Page() {
  return (
    <div className="flex flex-col gap-10 p-10">
      <MessageContextMenuDemo />
      <MessageContextMenuReactionsDemo />
    </div>
  )
}
