import type * as React from "react"
import {
  AiBrain01Icon,
  AmazonIcon,
  ArtificialIntelligence04Icon,
  Atom02Icon,
  BrainCircuitIcon,
  ChatGptIcon,
  ClaudeIcon,
  ConnectIcon,
  DeepseekIcon,
  FireworksIcon,
  FlashIcon,
  GlobeIcon,
  GoogleGeminiIcon,
  GoogleIcon,
  Grok02Icon,
  Hexagon01Icon,
  Image02Icon,
  KimiAiIcon,
  MetaIcon,
  MicrosoftIcon,
  MistralIcon,
  PerplexityAiIcon,
  QwenIcon,
  Route01Icon,
  SourceCodeIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import type { ModelCapability } from "@/lib/models"
import { cn } from "@/lib/utils"

/**
 * The mark a provider, a model or a capability wears — the same job
 * `code-icons` does for a filename, and split out for the same reason: the
 * catalogues in `lib/providers` and `lib/models` are plain data, and anything
 * that only wants to know *which* model shouldn't be made to install an icon
 * set to find out.
 *
 * The distinction the two maps below turn on is a company against its product,
 * and it is easy to get wrong: `ClaudeIcon` is Claude's mark, not Anthropic's.
 * A provider wears the company's; a model wears the product's. Anthropic and
 * Claude are the clearest case of the two being different marks, but Google and
 * Gemini are the same mistake, and so are Alibaba and Qwen.
 *
 * Where Hugeicons carries a company's mark that is what is used. Where it does
 * not, the mark is drawn here — the same exception `code-icons` makes for the
 * Rust gear, and for the same reason: a logo is a specific mark, not a glyph
 * with a shape you can choose. The rest fall back to their best-known product
 * mark or to a neutral glyph, listed below, because a stand-in is honest and a
 * logo drawn from memory is not.
 */

type MarkProps = React.SVGProps<SVGSVGElement>

/**
 * Written without `width` or `height` so the class sizing it wins, and with
 * `aria-hidden` since the name it sits beside already says whose mark it is.
 */
function Mark({ children, ...props }: MarkProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      {children}
    </svg>
  )
}

/** The company's "A", which is not the Claude sunburst. */
const AnthropicMark = (props: MarkProps) => (
  <Mark viewBox="0 0 40 40" {...props}>
    <path
      fill="currentColor"
      d="M26.9568 9.88184H22.1265L30.7753 31.7848H35.4917L26.9568 9.88184ZM13.028 9.88184L4.4917 31.7848H9.32203L11.2305 27.1793H20.2166L22.0126 31.6724H26.8444L18.0832 9.88184H13.028ZM12.5783 23.1361L15.4987 15.3853L18.5315 23.1361H12.5783Z"
    />
  </Mark>
)

/**
 * Company marks drawn here because Hugeicons has none. One entry is one logo,
 * and `ProviderIcon` reaches for this before the Hugeicons map — so giving a
 * provider its real mark later is a single line added here and nothing else.
 */
const PROVIDER_MARKS: Record<string, (props: MarkProps) => React.ReactElement> =
  {
    anthropic: AnthropicMark,
  }

/**
 * Company marks Hugeicons does carry, keyed by the `id` in `lib/providers`.
 * A platform wears its parent company's mark rather than one of its own —
 * Bedrock is Amazon's, Vertex is Google's — since that is how a reader picks it
 * out of a list.
 *
 * Four of these are a product's mark standing in for a company that has none in
 * the set — OpenAI's blossom is ChatGPT's, and xAI, Alibaba and Moonshot are
 * wearing Grok, Qwen and Kimi. The rest of the platforms take a neutral glyph
 * chosen for what they are known for rather than a logo traced from memory: a
 * bolt for Groq, a circuit for Cerebras, a route for OpenRouter.
 */
const PROVIDER_ICONS: Record<string, IconSvgElement> = {
  openai: ChatGptIcon,
  google: GoogleIcon,
  meta: MetaIcon,
  deepseek: DeepseekIcon,
  xai: Grok02Icon,
  mistral: MistralIcon,
  alibaba: QwenIcon,
  moonshot: KimiAiIcon,
  zai: Hexagon01Icon,
  cohere: Atom02Icon,
  perplexity: PerplexityAiIcon,
  bedrock: AmazonIcon,
  azure: MicrosoftIcon,
  vertex: GoogleIcon,
  groq: FlashIcon,
  cerebras: BrainCircuitIcon,
  fireworks: FireworksIcon,
  together: ConnectIcon,
  openrouter: Route01Icon,
}

/**
 * Product marks, keyed by model *family* rather than by id — a family outlives
 * every version of itself, so `claude-opus-5` and whatever replaces it both key
 * on `claude` and neither has to be listed.
 *
 * This is where `ClaudeIcon` belongs: Claude is the product. A family with no
 * mark of its own falls back to its provider's, so only the families worth
 * naming need an entry — `llama` is here for the lookup's sake and lands on
 * Meta's mark either way.
 */
const MODEL_ICONS: Record<string, IconSvgElement> = {
  claude: ClaudeIcon,
  gpt: ChatGptIcon,
  o: ChatGptIcon,
  gemini: GoogleGeminiIcon,
  gemma: GoogleGeminiIcon,
  llama: MetaIcon,
  muse: MetaIcon,
  deepseek: DeepseekIcon,
  grok: Grok02Icon,
  mistral: MistralIcon,
  magistral: MistralIcon,
  devstral: MistralIcon,
  codestral: MistralIcon,
  qwen: QwenIcon,
  qwq: QwenIcon,
  kimi: KimiAiIcon,
  glm: Hexagon01Icon,
  command: Atom02Icon,
  sonar: PerplexityAiIcon,
  nova: AmazonIcon,
  phi: MicrosoftIcon,
}

/** The mark for each thing a model can do, keyed as `lib/models` names them. */
const CAPABILITY_ICONS: Record<ModelCapability, IconSvgElement> = {
  reasoning: AiBrain01Icon,
  vision: Image02Icon,
  tools: Wrench01Icon,
  search: GlobeIcon,
  code: SourceCodeIcon,
}

/**
 * The family a model id or name belongs to: the leading run of letters,
 * lowercased. `claude-opus-5` → `claude`, `GPT-5.6 Luna` → `gpt`,
 * `qwen3.8-max` → `qwen`. A name that starts with something other than a letter
 * has no family to find, and falls through to the provider.
 */
function familyOf(nameOrId: string) {
  return (
    nameOrId
      .trim()
      .toLowerCase()
      .match(/^[a-z]+/)?.[0] ?? ""
  )
}

/**
 * The Hugeicons mark for a provider, or a neutral one. Providers drawn from
 * `PROVIDER_MARKS` are not here — use `ProviderIcon`, which covers both. This
 * is for the callers that need the icon *data* rather than something rendered.
 */
export function providerIconFor(id: string): IconSvgElement {
  return PROVIDER_ICONS[id] ?? ArtificialIntelligence04Icon
}

/**
 * The mark for a model, by family first and by the provider that ships it
 * second. Both fall back, so an unknown model from an unknown house still gets
 * a glyph rather than a gap in the row.
 */
export function modelIconFor(
  nameOrId: string,
  providerId?: string
): IconSvgElement {
  const family = MODEL_ICONS[familyOf(nameOrId)]
  if (family) return family
  return providerId ? providerIconFor(providerId) : ArtificialIntelligence04Icon
}

export function capabilityIconFor(capability: ModelCapability): IconSvgElement {
  return CAPABILITY_ICONS[capability]
}

type IconProps = Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">

/**
 * The three marks as components, for the common case of drawing one beside a
 * name. All are `aria-hidden`: the name they sit next to is already saying
 * which provider or model this is, and a glyph repeating it is one more thing
 * read aloud for nothing.
 */
function ProviderIcon({
  provider,
  className,
  ...props
}: IconProps & { provider: string }) {
  /* A drawn mark wins over the Hugeicons map: it is only ever there because
     the set has nothing for that company. */
  const Drawn = PROVIDER_MARKS[provider]
  if (Drawn) return <Drawn className={cn("shrink-0", className)} />

  return (
    <HugeiconsIcon
      aria-hidden
      icon={providerIconFor(provider)}
      strokeWidth={2}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

/**
 * A model's own mark. Falls back through its provider, and a provider with a
 * drawn mark is honoured there too — so a house whose model families are all
 * unlisted still shows the right logo.
 */
function ModelIcon({
  model,
  provider,
  className,
  ...props
}: IconProps & { model: string; provider?: string }) {
  const family = MODEL_ICONS[familyOf(model)]
  if (!family && provider && PROVIDER_MARKS[provider]) {
    return <ProviderIcon provider={provider} className={className} {...props} />
  }

  return (
    <HugeiconsIcon
      aria-hidden
      icon={modelIconFor(model, provider)}
      strokeWidth={2}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function CapabilityIcon({
  capability,
  className,
  ...props
}: IconProps & { capability: ModelCapability }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={capabilityIconFor(capability)}
      strokeWidth={2}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

export {
  CAPABILITY_ICONS,
  CapabilityIcon,
  MODEL_ICONS,
  ModelIcon,
  PROVIDER_ICONS,
  PROVIDER_MARKS,
  ProviderIcon,
}
