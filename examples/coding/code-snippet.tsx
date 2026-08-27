"use client";

import { useEffect, useState } from "react";
import {
  CodeSnippet,
  type CodeSnippetTab,
  type PackageManager,
} from "@/components/aiellie-ui/code/code-snippet";

const COMMAND = "shadcn@latest add https://aiellie.dev/r/code-block.json";

const SEVERAL =
  "shadcn@latest add https://aiellie.dev/r/message-scroller.json https://aiellie.dev/r/message.json";

/** No manager to pick from, so the line arrives with its runner already on it. */
const BARE = "npx shadcn@latest add https://aiellie.dev/r/install-command.json";

/** Carries a flag and a version, so every kind of token has something to show. */
const HIGHLIGHTED =
  "shadcn@latest add --overwrite https://aiellie.dev/r/install-command.json";

/** Tabs that differ by more than a runner, which is what custom tabs are for. */
const TABS: readonly CodeSnippetTab[] = [
  {
    name: "cli",
    command: "npx shadcn@latest add https://aiellie.dev/r/code-block.json",
  },
  { name: "manual", command: "npm i @hugeicons/react clsx tailwind-merge" },
  {
    name: "tokens",
    command: "npx shadcn@latest add https://aiellie.dev/r/surface-tokens.json",
  },
];

/** How long the copy action holds its confirmed state. */
const CONFIRMED_MS = 1600;

/** The copy state every variant shares; the element only reports the press. */
function useCopied() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), CONFIRMED_MS);
    return () => clearTimeout(id);
  }, [copied]);

  return { copied, onCopy: () => setCopied(true) };
}

/** Owns the chosen manager on top of that; the element only reports it. */
function useInstall() {
  const copy = useCopied();
  const [manager, setManager] = useState<PackageManager>("npm");

  return { ...copy, manager, onManagerChange: setManager };
}

export function CodeSnippetDemo() {
  const state = useInstall();
  return <CodeSnippet command={COMMAND} {...state} />;
}

export function InstallCommandSeveralDemo() {
  const state = useInstall();
  return <CodeSnippet command={SEVERAL} {...state} />;
}

export function InstallCommandBareDemo() {
  const state = useCopied();
  return <CodeSnippet command={BARE} {...state} />;
}

export function InstallCommandHighlightedDemo() {
  const state = useInstall();
  return <CodeSnippet command={HIGHLIGHTED} highlight {...state} />;
}

export function InstallCommandTabsDemo() {
  const state = useCopied();
  const [active, setActive] = useState(0);

  return (
    <CodeSnippet
      tabs={TABS}
      active={active}
      onActiveChange={setActive}
      {...state}
    />
  );
}
