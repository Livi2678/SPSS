'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Key, Eye, EyeOff, CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useApiKey } from '@/hooks/useApiKey';
import { useToast } from '@/components/ui/Toast';
import type { LLMProvider } from '@/lib/providers';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

const PROVIDERS: {
  id: LLMProvider;
  name: string;
  description: string;
  keyPrefix?: string;
  keyPlaceholder: string;
  getKeyUrl: string;
  freeNote: string;
  models: { id: string; name: string; note: string }[];
}[] = [
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Claude Sonnet 4 — Best for nuanced academic writing and deep analysis',
    keyPrefix: 'sk-ant-',
    keyPlaceholder: 'sk-ant-...',
    getKeyUrl: 'https://console.anthropic.com/keys',
    freeNote: 'Free tier includes $5 credit — enough for ~100 manuscript evaluations',
    models: [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', note: 'Recommended — best balance' },
      { id: 'claude-opus-4-7', name: 'Claude Opus 4', note: 'Most powerful — slower, higher cost' },
      { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4', note: 'Fastest — lighter analysis' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI GPT-4o',
    description: 'GPT-4o — Strong general-purpose research assistant',
    keyPrefix: 'sk-',
    keyPlaceholder: 'sk-...',
    getKeyUrl: 'https://platform.openai.com/api-keys',
    freeNote: 'New accounts include $5 free credit',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', note: 'Recommended' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', note: 'Faster and cheaper' },
    ],
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Gemini 2.0 Flash — Fast, capable, generous free tier',
    keyPlaceholder: 'AIza...',
    getKeyUrl: 'https://aistudio.google.com/app/apikey',
    freeNote: 'Gemini API has a generous free tier — 15 RPM at no cost',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', note: 'Recommended — fast & free tier' },
      { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', note: 'More capable' },
    ],
  },
];

function ProviderCard({ provider }: { provider: typeof PROVIDERS[0] }) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(provider.models[0].id);
  const { validateKey, activeProvider, anthropicKey, openaiKey, geminiKey, enterDemoMode } = useApiKey();
  const { addToast } = useToast();
  const isValidating = false;

  const currentKey = provider.id === 'anthropic' ? anthropicKey : provider.id === 'openai' ? openaiKey : geminiKey;
  const isActive = activeProvider === provider.id;

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    const success = await validateKey(provider.id, key.trim(), selectedModel);
    if (success) {
      addToast({ type: 'success', title: `${provider.name} connected`, message: `Now using ${selectedModel}` });
      setKey('');
    } else {
      addToast({ type: 'error', title: 'Invalid key', message: `Check your key at ${provider.getKeyUrl}` });
    }
  };

  return (
    <div
      className="rounded-xl border p-5 transition-colors"
      style={{
        backgroundColor: '#111827',
        borderColor: isActive ? '#c9952a60' : '#1f2d45',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold font-dm text-[#dde4ee]">{provider.name}</h3>
            {isActive && currentKey && (
              <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: '#c9952a20', color: '#e8b84b', border: '1px solid #c9952a40' }}>
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-[#5a6a80] font-dm">{provider.description}</p>
        </div>
        {currentKey ? (
          <CheckCircle className="w-5 h-5 text-[#0d9e6e] flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-[#5a6a80] flex-shrink-0" />
        )}
      </div>

      {currentKey && (
        <div className="mb-4 p-2 rounded-lg text-xs font-dm" style={{ backgroundColor: '#0d9e6e15', border: '1px solid #0d9e6e30', color: '#0d9e6e' }}>
          ✓ Key validated and active. Showing last 4 chars: ···{currentKey.slice(-4)}
        </div>
      )}

      <form onSubmit={handleValidate} className="space-y-3">
        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5a6a80]" />
          <input
            type={showKey ? 'text' : 'password'}
            placeholder={provider.keyPlaceholder}
            value={key}
            onChange={e => setKey(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-lg text-sm font-dm text-[#dde4ee] placeholder-[#5a6a80] outline-none"
            style={{ backgroundColor: '#0d1117', border: '1px solid #1f2d45' }}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6a80] hover:text-[#8b9ab0]"
          >
            {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        <select
          value={selectedModel}
          onChange={e => setSelectedModel(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm font-dm text-[#dde4ee] outline-none"
          style={{ backgroundColor: '#0d1117', border: '1px solid #1f2d45' }}
        >
          {provider.models.map(m => (
            <option key={m.id} value={m.id}>{m.name} — {m.note}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!key.trim() || isValidating}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-dm font-medium transition-all disabled:opacity-40"
            style={{ backgroundColor: '#c9952a', color: '#07090f' }}
          >
            {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {isValidating ? 'Validating...' : 'Validate & Connect'}
          </button>
        </div>
      </form>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] text-[#5a6a80] font-dm">{provider.freeNote}</p>
        <a
          href={provider.getKeyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] text-[#2d6be4] hover:text-[#5b8ef0] font-dm transition-colors"
        >
          Get key <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { enterDemoMode, status } = useApiKey();
  const { addToast } = useToast();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.3 }}
      className="min-h-screen p-10"
      style={{ backgroundColor: '#07090f' }}
    >
      <div className="max-w-[960px] mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-5 h-5 text-[#c9952a]" />
            <span className="text-xs font-dm text-[#5a6a80] uppercase tracking-wider">Configuration</span>
          </div>
          <h1 className="font-playfair text-4xl font-bold text-[#dde4ee] mb-3">Settings</h1>
          <p className="text-[#8b9ab0] font-dm">Configure your AI provider. All keys are stored in browser memory only — never sent to any server except the AI provider.</p>
        </div>

        {/* AI Provider section */}
        <section>
          <h2 className="font-playfair text-xl font-semibold text-[#dde4ee] mb-1">AI Provider</h2>
          <p className="text-sm text-[#5a6a80] font-dm mb-5">Connect any provider. The app works in Demo Mode without any key — add one to unlock live AI analysis.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {PROVIDERS.map(p => <ProviderCard key={p.id} provider={p} />)}
          </div>

          {/* Demo mode */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: '#111827', borderColor: '#1f2d45' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold font-dm text-[#dde4ee] mb-1">Demo Mode</h3>
                <p className="text-xs text-[#5a6a80] font-dm">Use pre-built realistic examples without any API key. Full functionality with sample outputs.</p>
              </div>
              <button
                onClick={() => { enterDemoMode(); addToast({ type: 'info', title: 'Demo Mode active', message: 'Using pre-built research examples' }); }}
                className="px-4 py-2 rounded-lg text-sm font-dm font-medium transition-all"
                style={{ backgroundColor: status === 'demo' ? '#c9952a20' : '#1f2d45', color: status === 'demo' ? '#e8b84b' : '#8b9ab0', border: status === 'demo' ? '1px solid #c9952a40' : '1px solid #283d5e' }}
              >
                {status === 'demo' ? '✓ Active' : 'Use Demo Mode'}
              </button>
            </div>
          </div>
        </section>

        {/* Privacy note */}
        <section className="rounded-xl border p-5" style={{ backgroundColor: '#111827', borderColor: '#1f2d45' }}>
          <h2 className="font-playfair text-lg font-semibold text-[#dde4ee] mb-2">Privacy & Security</h2>
          <ul className="space-y-2">
            {[
              'API keys are stored in browser memory only and are never sent to our servers',
              'Keys are cleared when you close the browser tab',
              'Your manuscript text is sent directly to your chosen AI provider — we never store it',
              'No account required — this tool works entirely client-side',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#0d9e6e] mt-0.5 flex-shrink-0" />
                <span className="text-xs text-[#8b9ab0] font-dm">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* About */}
        <section className="rounded-xl border p-5" style={{ backgroundColor: '#111827', borderColor: '#1f2d45' }}>
          <h2 className="font-playfair text-lg font-semibold text-[#dde4ee] mb-3">About ScholarAI Pro</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Version', value: '2.0.0' },
              { label: 'Journals', value: '25+' },
              { label: 'Study Types', value: '10+' },
              { label: 'AI Providers', value: '3' },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-lg" style={{ backgroundColor: '#0d1117' }}>
                <div className="text-lg font-bold font-dm text-[#e8b84b]">{item.value}</div>
                <div className="text-[11px] text-[#5a6a80] font-dm">{item.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
