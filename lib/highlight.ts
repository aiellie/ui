/**
 * How a piece of code is rendered, shared by every element that shows one:
 * the scanner that splits it into coloured tokens, and the badge that names
 * the language it is written in.
 *
 * Deliberately not a component — the code block, the diff, and the tabbed
 * card each lay their rows out differently, and only agree on what a token is
 * and what colour it takes.
 */

import {
    BashIcon,
    CppIcon,
    CssThreeIcon,
    HtmlFiveIcon,
    JavaIcon,
    JavaScriptIcon,
    Jsx01Icon,
    PhpIcon,
    PythonIcon,
    SourceCodeIcon,
    SqlIcon,
    Typescript01Icon,
  } from "@hugeicons/core-free-icons";
  import type { IconSvgElement } from "@hugeicons/react";
  
  export type TokenKind =
    | "comment"
    | "string"
    | "number"
    | "function"
    | "keyword"
    | "punctuation"
    | "plain";
  
  export interface Token {
    text: string;
    kind: TokenKind;
  }
  
  /**
   * Enough of a highlighter for a transcript, not a parser: one pass of
   * alternation over comments, strings, numbers, call sites, words, and
   * punctuation. An assistant answers in whichever language was asked about, so
   * one keyword set spanning the common ones beats a grammar per language at
   * this size — a language name labels the code, it does not switch the scanner.
   */
  const KEYWORDS = new Set(
    (
      "and as async await break case catch class const continue def default " +
      "delete do elif else export extends false finally for from function if " +
      "import in instanceof interface lambda let new none not null of or pass " +
      "return self static super switch this throw true try type typeof " +
      "undefined var void while with yield"
    ).split(" ")
  );
  
  /**
   * Comments and strings come first so a keyword inside either stays quiet, and
   * `#` only opens a comment at the start of a line, where no language spends it
   * on something else. Multi-line matches (block comments, template strings) are
   * split back into rows by `tokenize`.
   */
  const TOKEN =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|^[ \t]*#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d[\w.]*)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)|([^\w\s])/gm;
  
  /** Three hues carry meaning; everything else is the foreground at a weight. */
  export const TOKEN_COLORS: Record<TokenKind, string> = {
    comment: "text-emerald-600 dark:text-emerald-400",
    string: "text-red-600 dark:text-red-400",
    number: "text-emerald-600 dark:text-emerald-400",
    keyword: "text-indigo-600 dark:text-indigo-400",
    function: "text-foreground",
    punctuation: "text-indigo-600 dark:text-indigo-400",
    plain: "text-foreground/75",
  };
  
  /**
   * The same distinctions with the hue taken out: what colour was carrying,
   * weight carries instead — comments furthest back, literals a step behind the
   * words, punctuation between them, and the names at full strength.
   *
   * Every step is the foreground at a fraction, so the ramp inverts with the
   * theme and holds against either background without a `dark:` of its own.
   */
  export const TOKEN_COLORS_MONO: Record<TokenKind, string> = {
    comment: "text-foreground/30",
    string: "text-foreground/55",
    number: "text-foreground/55",
    keyword: "text-foreground",
    function: "text-foreground",
    punctuation: "text-foreground/45",
    plain: "text-foreground/75",
  };
  
  /**
   * The pair a diff is read in. Deliberately not tokens: `lib/colors` names
   * nothing for "added" and "removed", and minting two would put them in
   * `/tokens` as though anything on the page could reach for them. They belong
   * here beside the token colours because they are the same kind of thing — a
   * hue that says something about the code rather than about the interface
   * around it — and they are the same emerald and red the scanner already
   * spends on literals, so a diff and the code inside it agree.
   *
   * The tint goes on the row and the hue on the mark, leaving the code itself
   * to keep its own colouring: a changed line is still code, and a reader
   * needs to see what kind before they can judge the change.
   */
  export const DIFF_ROW: Record<"add" | "remove", string> = {
    add: "bg-emerald-500/[0.08] dark:bg-emerald-400/[0.12]",
    remove: "bg-red-500/[0.07] dark:bg-red-400/[0.11]",
  };

  export const DIFF_MARK: Record<"add" | "remove", string> = {
    add: "text-emerald-600 dark:text-emerald-400",
    remove: "text-red-600 dark:text-red-400",
  };

  export type TokenPalette = "color" | "mono";
  
  /** The palettes a code element offers, for one to be chosen by name. */
  export const TOKEN_PALETTES: Record<TokenPalette, Record<TokenKind, string>> = {
    color: TOKEN_COLORS,
    mono: TOKEN_COLORS_MONO,
  };
  
  function kindOf(match: RegExpMatchArray): TokenKind {
    const [, comment, string, number, call, word] = match;
    if (comment) return "comment";
    if (string) return "string";
    if (number) return "number";
    if (call) return "function";
    if (word) return KEYWORDS.has(word) ? "keyword" : "plain";
    return "punctuation";
  }
  
  /** `code` as rows of tokens, one row per line, blank lines kept as empty. */
  export function tokenize(code: string): Token[][] {
    const lines: Token[][] = [[]];
  
    const push = (text: string, kind: TokenKind) => {
      text.split("\n").forEach((part, index) => {
        if (index > 0) lines.push([]);
        if (part) lines[lines.length - 1].push({ text: part, kind });
      });
    };
  
    let last = 0;
    for (const match of code.matchAll(TOKEN)) {
      const index = match.index ?? 0;
      if (index > last) push(code.slice(last, index), "plain");
      push(match[0], kindOf(match));
      last = index + match[0].length;
    }
    if (last < code.length) push(code.slice(last), "plain");
  
    return lines;
  }
  
  /** A URL, or a path that leads with a slash or a dot-slash. */
  const URLISH = /^([a-z][\w+.-]*:\/\/|\.{0,2}\/)/i;
  
  /**
   * A shell command as one row of tokens, in the same vocabulary as `tokenize`
   * so a command line reads like the code above it: the program at full
   * strength, flags in the accent, and URLs and versions as the literals they
   * are.
   *
   * A command is one line and is not a language, so it gets its own pass rather
   * than the keyword set — `add` means nothing to a grammar and everything here.
   * Whitespace is kept as its own token, since the line is rendered `pre` and
   * has to come back out exactly as it went in.
   */
  export function tokenizeCommand(command: string): Token[] {
    const tokens: Token[] = [];
  
    const push = (text: string, kind: TokenKind) => {
      if (text) tokens.push({ text, kind });
    };
  
    command.split(/(\s+)/).forEach((word, index) => {
      if (!word) return;
      if (/^\s+$/.test(word)) return push(word, "plain");
      /* The program being run leads the line, and is the one word on it that
         says what is about to happen. */
      if (index === 0) return push(word, "function");
      if (word.startsWith("-")) return push(word, "keyword");
      if (URLISH.test(word)) return push(word, "string");
  
      /* `pkg@version` splits so the version reads as the literal it is. A
         leading `@` is a scope, not a separator, so the search starts past it. */
      const at = word.indexOf("@", 1);
      if (at > 0) {
        push(word.slice(0, at), "plain");
        push("@", "punctuation");
        push(word.slice(at + 1), "number");
        return;
      }
  
      push(word, "plain");
    });
  
    return tokens;
  }
  
  /**
   * Keyed by both extension and language name, since the same code arrives
   * labelled `ts`, `typescript`, or `use-tick.ts` and all three should land on
   * one icon.
   */
  const LANGUAGE_ICONS: Record<string, IconSvgElement> = {
    ts: Typescript01Icon,
    mts: Typescript01Icon,
    typescript: Typescript01Icon,
    tsx: Jsx01Icon,
    jsx: Jsx01Icon,
    js: JavaScriptIcon,
    mjs: JavaScriptIcon,
    javascript: JavaScriptIcon,
    py: PythonIcon,
    python: PythonIcon,
    java: JavaIcon,
    php: PhpIcon,
    cpp: CppIcon,
    cc: CppIcon,
    sql: SqlIcon,
    sh: BashIcon,
    zsh: BashIcon,
    bash: BashIcon,
    shell: BashIcon,
    html: HtmlFiveIcon,
    css: CssThreeIcon,
  };
  
  /**
   * The badge for a filename or a language name. A name with no extension —
   * `Dockerfile`, `README` — falls through to the generic source icon rather
   * than matching on the whole word.
   */
  export function iconFor(nameOrLanguage: string): IconSvgElement {
    const key = nameOrLanguage.split(".").pop() ?? nameOrLanguage;
    return LANGUAGE_ICONS[key.toLowerCase()] ?? SourceCodeIcon;
  }