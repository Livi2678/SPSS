'use client';

import { create } from 'zustand';
import type { LLMProvider } from '@/lib/providers';

type ApiKeyStatus = 'idle' | 'validating' | 'connected' | 'demo' | 'invalid';

interface ApiKeyStore {
  // Active provider config
  activeProvider: LLMProvider;
  status: ApiKeyStatus;

  // Keys per provider (runtime only — never persisted)
  anthropicKey: string | null;
  openaiKey: string | null;
  geminiKey: string | null;

  // Derived: current active key
  key: string | null;

  // Actions
  setProvider: (provider: LLMProvider) => void;
  setKeyForProvider: (provider: LLMProvider, key: string) => void;
  validateKey: (provider: LLMProvider, key: string, model?: string) => Promise<boolean>;
  enterDemoMode: () => void;
  clearKey: () => void;
  getActiveModel: () => string;
}

const DEFAULT_MODELS: Record<LLMProvider, string> = {
  anthropic: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o',
  gemini: 'gemini-2.0-flash',
  demo: 'demo',
};

export const useApiKey = create<ApiKeyStore>((set, get) => ({
  activeProvider: 'anthropic',
  status: 'idle',
  anthropicKey: null,
  openaiKey: null,
  geminiKey: null,
  key: null,

  setProvider: (provider: LLMProvider) => {
    const store = get();
    let key: string | null = null;
    if (provider === 'anthropic') key = store.anthropicKey;
    if (provider === 'openai') key = store.openaiKey;
    if (provider === 'gemini') key = store.geminiKey;
    const status = provider === 'demo' ? 'demo' : key ? 'connected' : 'idle';
    set({ activeProvider: provider, key, status });
  },

  setKeyForProvider: (provider: LLMProvider, key: string) => {
    if (provider === 'anthropic') set({ anthropicKey: key });
    if (provider === 'openai') set({ openaiKey: key });
    if (provider === 'gemini') set({ geminiKey: key });
    if (get().activeProvider === provider) set({ key });
  },

  validateKey: async (provider: LLMProvider, key: string, model?: string) => {
    set({ status: 'validating' });
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hi' }],
          systemPrompt: 'Respond with "OK" only.',
          apiKey: key,
          provider,
          model: model || DEFAULT_MODELS[provider],
          test: true,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (response.ok) {
        if (provider === 'anthropic') set({ anthropicKey: key });
        if (provider === 'openai') set({ openaiKey: key });
        if (provider === 'gemini') set({ geminiKey: key });
        set({ status: 'connected', key, activeProvider: provider });
        return true;
      } else {
        set({ status: 'invalid' });
        return false;
      }
    } catch {
      set({ status: 'invalid' });
      return false;
    }
  },

  enterDemoMode: () => {
    set({ status: 'demo', key: null, activeProvider: 'demo' });
  },

  clearKey: () => {
    set({ key: null, status: 'idle', anthropicKey: null, openaiKey: null, geminiKey: null });
  },

  getActiveModel: () => {
    return DEFAULT_MODELS[get().activeProvider];
  },
}));
