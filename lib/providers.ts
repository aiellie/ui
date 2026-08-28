/**
 * The houses a model can come from — the major ones from models.dev's provider
 * list, which runs to a couple of hundred entries once every gateway and
 * reseller is counted. What is here is the set worth putting in a picker: the
 * labs that make the models, and the platforms most people reach them through.
 *
 * Pure data, and deliberately so. The mark a provider wears is in
 * `components/icons/model-icons`, keyed by the `id` below, so anything that
 * only needs to know *which* provider — a filter, a route, a stored setting —
 * costs nothing from an icon set it never draws from.
 */

/**
 * What a provider is, which is not the same question as who made the model.
 * A lab trains its own; a platform serves other people's, and the same model
 * turns up on several of them at different prices.
 */
type ProviderKind = "lab" | "platform"

interface Provider {
  /** The lookup key everywhere: icons, models, stored settings. */
  id: string
  name: string
  kind: ProviderKind
  /** One line — what it is, and what it is known for. */
  description: string
  /** Where the docs and the keys are, for a picker that offers a way in. */
  url: string
}

/**
 * In the order a picker lists them: labs first and roughly by how likely a
 * reader is to be looking for them, then the platforms. `kind` is what a
 * grouped list should split on, not position — this order is only the default.
 */
const providers: Provider[] = [
  {
    id: "anthropic",
    name: "Anthropic",
    kind: "lab",
    description: "Claude — long context, reasoning and tool use.",
    url: "https://anthropic.com",
  },
  {
    id: "openai",
    name: "OpenAI",
    kind: "lab",
    description: "GPT, and the API shape half the ecosystem copies.",
    url: "https://openai.com",
  },
  {
    id: "google",
    name: "Google",
    kind: "lab",
    description: "Gemini — the longest context windows on offer.",
    url: "https://ai.google.dev",
  },
  {
    id: "meta",
    name: "Meta",
    kind: "lab",
    description: "Llama, open weights, run wherever you like.",
    url: "https://llama.com",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    kind: "lab",
    description: "Open reasoning models at a fraction of the price.",
    url: "https://deepseek.com",
  },
  {
    id: "xai",
    name: "xAI",
    kind: "lab",
    description: "Grok, with the live feed of X behind it.",
    url: "https://x.ai",
  },
  {
    id: "mistral",
    name: "Mistral",
    kind: "lab",
    description: "European, open weight, and small enough to self-host.",
    url: "https://mistral.ai",
  },
  {
    id: "alibaba",
    name: "Alibaba",
    kind: "lab",
    description: "Qwen — a wide open-weight family, coding models included.",
    url: "https://alibabacloud.com",
  },
  {
    id: "moonshot",
    name: "Moonshot AI",
    kind: "lab",
    description: "Kimi — agentic models with very long context.",
    url: "https://moonshot.ai",
  },
  {
    id: "zai",
    name: "Z.AI",
    kind: "lab",
    description: "GLM — open weights, strong on code and agents.",
    url: "https://z.ai",
  },
  {
    id: "cohere",
    name: "Cohere",
    kind: "lab",
    description: "Enterprise retrieval, ranking and multilingual work.",
    url: "https://cohere.com",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    kind: "lab",
    description: "Answers with the web read and cited as it goes.",
    url: "https://perplexity.ai",
  },
  {
    id: "bedrock",
    name: "Amazon Bedrock",
    kind: "platform",
    description: "Many labs' models behind one AWS account.",
    url: "https://aws.amazon.com/bedrock",
  },
  {
    id: "azure",
    name: "Azure",
    kind: "platform",
    description: "OpenAI and others under Microsoft's tenancy and regions.",
    url: "https://azure.microsoft.com",
  },
  {
    id: "vertex",
    name: "Vertex",
    kind: "platform",
    description: "Gemini and partner models on Google Cloud.",
    url: "https://cloud.google.com/vertex-ai",
  },
  {
    id: "groq",
    name: "Groq",
    kind: "platform",
    description: "Open-weight models served unusually fast.",
    url: "https://groq.com",
  },
  {
    id: "cerebras",
    name: "Cerebras",
    kind: "platform",
    description:
      "Wafer-scale inference, measured in thousands of tokens a second.",
    url: "https://cerebras.ai",
  },
  {
    id: "fireworks",
    name: "Fireworks AI",
    kind: "platform",
    description: "Open-weight serving with fine-tuning alongside it.",
    url: "https://fireworks.ai",
  },
  {
    id: "together",
    name: "Together AI",
    kind: "platform",
    description: "A broad open-weight catalogue, and GPUs to train on.",
    url: "https://together.ai",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    kind: "platform",
    description: "One key and one endpoint in front of everyone else's.",
    url: "https://openrouter.ai",
  },
]

/** The provider an id names, or nothing — an id can outlive its provider. */
function findProvider(id: string) {
  return providers.find((provider) => provider.id === id)
}

/** Only the ones that train their own, for a picker that lists makers. */
const labs = providers.filter((provider) => provider.kind === "lab")

/** Only the ones that serve other people's, for a picker that lists routes. */
const platforms = providers.filter((provider) => provider.kind === "platform")

export { findProvider, labs, platforms, providers }
export type { Provider, ProviderKind }
