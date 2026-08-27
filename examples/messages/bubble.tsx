"use client";

import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble";

export function BubbleDemo() {
  return (
    <BubbleGroup className="w-full max-w-sm">
      <Bubble align="end">
        <BubbleContent>Can you summarize the thread for me?</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          Three people debated the rollout date and settled on shipping behind
          a flag next Tuesday.
        </BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>That works.</BubbleContent>
      </Bubble>
    </BubbleGroup>
  );
}

export function BubbleVariantsDemo() {
  return (
    <div className="flex overflow-scroll h-full">
    <BubbleGroup className="flex w-full max-w-sm flex-col gap-4">
      <Bubble align="end">
        <BubbleContent>This is the default primary bubble.</BubbleContent>
      </Bubble>
      <Bubble variant="secondary" align="start">
        <BubbleContent>This is the secondary variant.</BubbleContent>
      </Bubble>
      <Bubble variant="muted" align="end">
        <BubbleContent>
          This one is muted. It uses a lower emphasis color for the chat bubble.
        </BubbleContent>
        <BubbleReactions role="img" aria-label="Reaction: thumbs up">
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="tinted" align="start">
        <BubbleContent>
          This one is tinted. The tint is a softer color derived from the
          primary color.
        </BubbleContent>
      </Bubble>
      <Bubble variant="outline" align="end">
        <BubbleContent>We can also use an outlined variant.</BubbleContent>
      </Bubble>
      <Bubble variant="destructive" align="start">
        <BubbleContent>Or a destructive variant with a reaction.</BubbleContent>
        <BubbleReactions role="img" aria-label="Reaction: fire">
          <span>🔥</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="ghost" align="end">
        <BubbleContent>
          <p>{`Ghost bubbles work for assistant text, **markdown**, and other content that should not be framed.
This is perfect for assistant messages that should not have a frame and can take the full width of the container. You can also render \`code\` in it.
Ghost bubbles are full width and can take the full width of the container.
`}</p>
        </BubbleContent>
      </Bubble>
    </BubbleGroup>
    </div>
  );
}

export function BubbleReactionsDemo() {
  return (
    <BubbleGroup className="w-full max-w-sm gap-7">
      <Bubble align="end">
        <BubbleContent>Shipping this today.</BubbleContent>
        <BubbleReactions>🎉 2</BubbleReactions>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>Nice — I&apos;ll write the release note.</BubbleContent>
        <BubbleReactions align="start">👏 4</BubbleReactions>
      </Bubble>
    </BubbleGroup>
  );
}