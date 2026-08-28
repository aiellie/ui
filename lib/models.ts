import type { Provider } from "@/lib/providers"
import { findProvider, providers } from "@/lib/providers"

/**
 * The catalogue the model picker reads, and the only thing that decides what
 * it offers. The models below are a sample one — swap the list for whatever
 * the app actually has keys for, and the picker follows without being touched.
 *
 * Plain data, like `lib/providers` beside it: what a model is called, which
 * house it comes from, what it is for and what it can do. The marks are in
 * `components/icons/model-icons`, keyed by the ids here. Nothing in this file
 * talks to a provider either — the call is made with `id`, and that is the
 * whole contract.
 */

/** What a model can do, beyond answering in text. */
type ModelCapability = "reasoning" | "vision" | "tools" | "search" | "code"

interface ModelCapabilityMeta {
  name: string
  /** Read out as the glyph's label, so a row of marks is not a row of guesses. */
  description: string
}

/**
 * One entry per capability, so a row can be written as a list of keys and the
 * picker looks up the rest. The wording is what a reader gets on hover, so it
 * says what the capability means rather than restating its name.
 */
const modelCapabilities: Record<ModelCapability, ModelCapabilityMeta> = {
  reasoning: {
    name: "Reasoning",
    description: "Works the problem through before it answers",
  },
  vision: {
    name: "Vision",
    description: "Reads images alongside the text",
  },
  tools: {
    name: "Tools",
    description: "Calls the tools it is given",
  },
  search: {
    name: "Search",
    description: "Looks things up on the web as it answers",
  },
  code: {
    name: "Code",
    description: "Tuned for reading and writing code",
  },
}

/**
 * The plan a model needs. Ordered least to most, so what a plan reaches is a
 * comparison rather than a list of special cases — a third tier is one more
 * entry here and nothing else.
 */
type ModelTier = "free" | "pro"

const modelTiers: ModelTier[] = ["free", "pro"]

interface Model {
  /** What the call is made with, and what the picker's value is. */
  id: string
  name: string
  /** A `Provider["id"]` from `lib/providers`. */
  provider: string
  /** One line on what it is for — the reason a reader would pick this one. */
  description: string
  capabilities: ModelCapability[]
  /** In tokens; `formatContextWindow` is what puts it on screen. */
  contextWindow: number
  tier: ModelTier
  /** A word over the name — "New", "Preview" — or nothing, which is usual. */
  badge?: string
}

/**
 * A sample catalogue, in the order the menu lists them: within a house,
 * deepest first, since that is the order the choice is usually made in — take
 * the best one, and drop down only when it is worth trading depth for speed.
 *
 * Descriptions are kept to roughly forty characters. A picker row is one line
 * wide, and a sentence that has to be clipped in half to fit was never doing
 * the job the row wanted from it.
 */
const models: Model[] = [
  {
    id: "claude-fable-5",
    name: "Fable 5",
    provider: "anthropic",
    description: "For writing, analysis, and careful agents.",
    capabilities: ["reasoning", "vision", "tools"],
    contextWindow: 1_000_000,
    tier: "pro",
    badge: "New",
  },
  {
    id: "claude-opus-5",
    name: "Opus 5",
    provider: "anthropic",
    description: "The deepest one, for problems worth the wait.",
    capabilities: ["reasoning", "vision", "tools", "code"],
    contextWindow: 1_000_000,
    tier: "pro",
  },
  {
    id: "claude-sonnet-5",
    name: "Sonnet 5",
    provider: "anthropic",
    description: "The everyday one. Quick, and still strong.",
    capabilities: ["reasoning", "vision", "tools", "code"],
    contextWindow: 1_000_000,
    tier: "free",
  },
  {
    id: "claude-haiku-4-5",
    name: "Haiku 4.5",
    provider: "anthropic",
    description: "The fast one, for short turns and sorting.",
    capabilities: ["reasoning", "vision", "tools"],
    contextWindow: 200_000,
    tier: "free",
  },
  {
    id: "gpt-5.6-sol",
    name: "GPT-5.6 Sol",
    provider: "openai",
    description: "The flagship, for work that has to land.",
    capabilities: ["reasoning", "vision", "tools", "code"],
    contextWindow: 1_000_000,
    tier: "pro",
  },
  {
    id: "gpt-5.6-terra",
    name: "GPT-5.6 Terra",
    provider: "openai",
    description: "Everyday work, without the flagship bill.",
    capabilities: ["reasoning", "vision", "tools", "code"],
    contextWindow: 1_000_000,
    tier: "free",
  },
  {
    id: "gpt-5.6-luna",
    name: "GPT-5.6 Luna",
    provider: "openai",
    description: "Cheap and quick, for volume and speed.",
    capabilities: ["reasoning", "vision", "tools"],
    contextWindow: 1_000_000,
    tier: "free",
  },
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    provider: "google",
    description: "The long one. Whole repositories, whole books.",
    capabilities: ["reasoning", "vision", "tools", "search"],
    contextWindow: 1_000_000,
    tier: "pro",
  },
  {
    id: "gemini-3.7-flash",
    name: "Gemini 3.7 Flash",
    provider: "google",
    description: "The long context again, answered in a hurry.",
    capabilities: ["reasoning", "vision", "tools", "search"],
    contextWindow: 1_000_000,
    tier: "free",
    badge: "New",
  },
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    provider: "deepseek",
    description: "Open frontier, and it shows its working.",
    capabilities: ["reasoning", "tools", "code"],
    contextWindow: 1_000_000,
    tier: "free",
  },
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    provider: "deepseek",
    description: "The same family, cheaper to leave running.",
    capabilities: ["reasoning", "tools", "code"],
    contextWindow: 1_000_000,
    tier: "free",
  },
  {
    id: "grok-4.6",
    name: "Grok 4.6",
    provider: "xai",
    description: "Reasoning with the live feed of X behind it.",
    capabilities: ["reasoning", "vision", "tools", "search"],
    contextWindow: 500_000,
    tier: "pro",
  },
  {
    id: "muse-spark-1.2",
    name: "Muse Spark 1.2",
    provider: "meta",
    description: "Meta's agent model, and it holds a million.",
    capabilities: ["reasoning", "vision", "tools", "code"],
    contextWindow: 1_000_000,
    tier: "free",
  },
  {
    id: "mistral-large-3",
    name: "Mistral Large 3",
    provider: "mistral",
    description: "European, open weight, small enough to host.",
    capabilities: ["reasoning", "tools", "code"],
    contextWindow: 256_000,
    tier: "free",
  },
  {
    id: "qwen3.8-max",
    name: "Qwen3.8 Max",
    provider: "alibaba",
    description: "The widest open family, and strong on code.",
    capabilities: ["reasoning", "vision", "tools", "code"],
    contextWindow: 1_000_000,
    tier: "pro",
  },
  {
    id: "kimi-k3",
    name: "Kimi K3",
    provider: "moonshot",
    description: "Open frontier, and it holds a long thread.",
    capabilities: ["reasoning", "vision", "tools", "code"],
    contextWindow: 1_000_000,
    tier: "free",
  },
  {
    id: "glm-5.3",
    name: "GLM-5.3",
    provider: "zai",
    description: "Open weights, aimed squarely at coding agents.",
    capabilities: ["reasoning", "tools", "code"],
    contextWindow: 1_000_000,
    tier: "free",
  },
]

/**
 * Whether a model answers to what was typed. Four things are searched, because
 * all four are how someone actually looks for one: the name they know it by
 * ("opus"), the id they call it with ("claude-opus-5"), the house it comes from
 * ("anthropic"), and what they need it to do ("vision").
 *
 * Every term has to match something, so "fast anthropic" narrows rather than
 * widens — an OR across terms turns a second word into more results, which is
 * the opposite of what typing a second word means.
 */
function matchesModel(model: Model, query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return true

  const haystack = [
    model.name,
    model.id,
    findProvider(model.provider)?.name ?? model.provider,
    ...model.capabilities.map(
      (capability) => modelCapabilities[capability].name
    ),
  ]
    .join(" ")
    .toLowerCase()

  return terms.every((term) => haystack.includes(term))
}

/** The catalogue narrowed to what was typed, in its original order. */
function filterModels(list: Model[] = models, query: string) {
  return query.trim()
    ? list.filter((model) => matchesModel(model, query))
    : list
}

/** The model an id names, or nothing — an id can outlive its model. */
function findModel(id: string, list: Model[] = models) {
  return list.find((model) => model.id === id)
}

/**
 * The list split into the runs the menu labels, in `providers` order rather
 * than the list's. A provider with nothing under it is dropped, so a filtered
 * list leaves no empty headings behind — and so a catalogue that only uses
 * four of the twenty houses is not a menu with sixteen blank labels in it.
 */
function modelsByProvider(
  list: Model[] = models
): { provider: Provider; models: Model[] }[] {
  return providers.flatMap((provider) => {
    const grouped = list.filter((model) => model.provider === provider.id)
    return grouped.length ? [{ provider, models: grouped }] : []
  })
}

/** Whether a plan reaches a model, by tier order rather than by name. */
function canUseModel(model: Model, plan: ModelTier) {
  return modelTiers.indexOf(model.tier) <= modelTiers.indexOf(plan)
}

/**
 * A context window as it is spoken about — "200K", "1M". Tokens are counted in
 * thousands by everyone who quotes them, and the exact figure is noise in a row
 * that is already carrying a name and a sentence.
 */
function formatContextWindow(tokens: number) {
  if (tokens >= 1_000_000) {
    const millions = tokens / 1_000_000
    return `${Number(millions.toFixed(1))}M`
  }
  return `${Math.round(tokens / 1_000)}K`
}

export {
  canUseModel,
  filterModels,
  findModel,
  formatContextWindow,
  matchesModel,
  modelCapabilities,
  models,
  modelsByProvider,
  modelTiers,
}
export type { Model, ModelCapability, ModelCapabilityMeta, ModelTier }
