'use client';

import { create } from 'zustand';

type ApiKeyStatus = 'idle' | 'validating' | 'connected' | 'demo' | 'invalid';

interface ApiKeyStore {
  key: string | null;
  status: ApiKeyStatus;
  setKey: (key: string) => void;
  setStatus: (status: ApiKeyStatus) => void;
  validateKey: (key: string) => Promise<boolean>;
  enterDemoMode: () => void;
  clearKey: () => void;
}

export const useApiKey = create<ApiKeyStore>((set, get) => ({
  key: null,
  status: 'idle',

  setKey: (key: string) => {
    set({ key });
  },

  setStatus: (status: ApiKeyStatus) => {
    set({ status });
  },

  validateKey: async (key: string) => {
    set({ status: 'validating', key });
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello, respond with "OK" only.' }],
          systemPrompt: 'You are a test assistant. Only respond with "OK".',
          apiKey: key,
          test: true,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (response.ok) {
        set({ status: 'connected', key });
        return true;
      } else if (response.status === 401) {
        set({ status: 'invalid' });
        return false;
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
    set({ status: 'demo', key: null });
  },

  clearKey: () => {
    set({ key: null, status: 'idle' });
  },
}));
