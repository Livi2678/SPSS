// Supports: Anthropic Claude, OpenAI GPT-4, Google Gemini
// Falls back to rich built-in demo mode if no key provided
export type LLMProvider = 'anthropic' | 'openai' | 'gemini' | 'demo';

export interface ProviderConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string;
}

export const PROVIDER_MODELS: Record<LLMProvider, string> = {
  anthropic: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o',
  gemini: 'gemini-2.0-flash',
  demo: 'demo',
};

export const PROVIDER_LABELS: Record<LLMProvider, string> = {
  anthropic: 'Anthropic Claude',
  openai: 'OpenAI GPT-4o',
  gemini: 'Google Gemini',
  demo: 'Demo Mode',
};

export const PROVIDER_DESCRIPTIONS: Record<LLMProvider, string> = {
  anthropic: 'Claude Sonnet 4 — Excellent for academic writing and analysis',
  openai: 'GPT-4o — Strong general-purpose research assistance',
  gemini: 'Gemini 2.0 Flash — Fast and capable multimodal AI',
  demo: 'Rich built-in demo responses — no API key needed',
};

export const PROVIDER_KEY_PREFIXES: Partial<Record<LLMProvider, string>> = {
  anthropic: 'sk-ant-',
  openai: 'sk-',
};

export const PROVIDER_GET_KEY_LINKS: Partial<Record<LLMProvider, string>> = {
  anthropic: 'https://console.anthropic.com/keys',
  openai: 'https://platform.openai.com/api-keys',
  gemini: 'https://aistudio.google.com/app/apikey',
};
