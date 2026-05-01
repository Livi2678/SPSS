'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Database,
  Palette,
} from 'lucide-react';
import { useApiKey } from '@/hooks/useApiKey';
import { useToast } from '@/components/ui/Toast';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function SettingsPage() {
  const [newKey, setNewKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const { key, status, validateKey, enterDemoMode, clearKey } = useApiKey();
  const { addToast } = useToast();

  const handleUpdateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    const trimmed = newKey.trim();
    if (!trimmed.startsWith('sk-ant-')) {
      addToast({ type: 'error', title: 'Invalid key format', message: 'API keys must start with "sk-ant-"' });
      return;
    }
    const success = await validateKey(trimmed);
    if (success) {
      addToast({ type: 'success', title: 'API key updated', message: 'Claude is now connected' });
      setNewKey('');
    } else {
      addToast({ type: 'error', title: 'Invalid API key', message: 'Check your key at console.anthropic.com' });
    }
  };

  const statusConfig = {
    connected: { icon: CheckCircle, color: '#0d9e6e', label: 'Connected', message: 'Claude API is active and responding' },
    demo: { icon: AlertTriangle, color: '#c97d2a', label: 'Demo Mode', message: 'Using pre-written examples — no AI generation' },
    validating: { icon: RefreshCw, color: '#2d6be4', label: 'Validating...', message: 'Checking API key with Anthropic' },
    invalid: { icon: XCircle, color: '#c94040', label: 'Invalid', message: 'API key was rejected — please check and re-enter' },
    idle: { icon: Key, color: '#5a6a80', label: 'Not Set', message: 'No API key has been provided' },
  };

  const sc = statusConfig[status];
  const StatusIcon = sc.icon;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="px-8 py-6 max-w-3xl"
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#5a6a80]/15 border border-[#5a6a80]/30 flex items-center justify-center">
            <Settings className="w-4 h-4 text-[#8b9ab0]" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-[#dde4ee]">Settings</h1>
        </div>
        <p className="text-sm text-[#8b9ab0] font-dm">Manage your API key and application preferences.</p>
      </div>

      <div className="space-y-6">
        {/* API Key section */}
        <section className="rounded-xl border border-[#1f2d45] bg-[#0d1117] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1f2d45] flex items-center gap-2">
            <Key className="w-4 h-4 text-[#c9952a]" />
            <h2 className="font-playfair text-base font-semibold text-[#dde4ee]">Anthropic API Key</h2>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Current status */}
            <div
              className="flex items-center gap-3 p-4 rounded-lg border"
              style={{ borderColor: sc.color + '30', backgroundColor: sc.color + '08' }}
            >
              <StatusIcon
                className="w-5 h-5 flex-shrink-0"
                style={{
                  color: sc.color,
                  animation: status === 'validating' ? 'spin 1s linear infinite' : undefined,
                }}
              />
              <div>
                <div className="text-sm font-medium font-dm" style={{ color: sc.color }}>
                  {sc.label}
                </div>
                <div className="text-xs text-[#8b9ab0] font-dm">{sc.message}</div>
              </div>
              {(status === 'connected' || status === 'demo' || status === 'invalid') && (
                <button
                  onClick={() => {
                    clearKey();
                    addToast({ type: 'info', title: 'API key cleared' });
                  }}
                  className="ml-auto text-xs text-[#5a6a80] hover:text-[#8b9ab0] font-dm transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Key preview */}
            {status === 'connected' && key && (
              <div className="flex items-center gap-2 px-3 py-2 bg-[#111827] rounded-lg border border-[#1f2d45]">
                <Key className="w-3.5 h-3.5 text-[#5a6a80]" />
                <span className="text-xs font-mono text-[#8b9ab0] flex-1">
                  {showKey ? key : key.slice(0, 10) + '•'.repeat(20) + key.slice(-4)}
                </span>
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="text-[#5a6a80] hover:text-[#8b9ab0]"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Update key form */}
            <form onSubmit={handleUpdateKey} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#8b9ab0] font-dm mb-1.5">
                  {status === 'connected' ? 'Update' : 'Enter'} API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="sk-ant-api03-..."
                    className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2.5 pr-10 text-sm text-[#dde4ee] font-mono placeholder:text-[#5a6a80] focus:outline-none focus:border-[#c9952a]/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6a80] hover:text-[#8b9ab0]"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!newKey.trim() || status === 'validating'}
                  className="px-5 py-2 rounded-lg text-sm font-medium font-dm transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#c9952a', color: '#07090f' }}
                >
                  {status === 'validating' ? 'Validating...' : 'Save & Validate'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    enterDemoMode();
                    addToast({ type: 'info', title: 'Demo mode activated' });
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium font-dm border border-[#1f2d45] text-[#8b9ab0] hover:border-[#283d5e] transition-colors"
                >
                  Use Demo Mode
                </button>
              </div>
            </form>

            <div className="p-3 rounded-lg bg-[#111827] border border-[#1f2d45] flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#c9952a] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#8b9ab0] font-dm leading-relaxed">
                <strong className="text-[#dde4ee]">Privacy:</strong> Your API key is stored only in browser memory
                and is never sent to our servers. It is cleared when you close the browser tab.
              </div>
            </div>

            <a
              href="https://console.anthropic.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#5a6a80] hover:text-[#c9952a] transition-colors font-dm"
            >
              <ExternalLink className="w-3 h-3" />
              Get or manage API keys at console.anthropic.com
            </a>
          </div>
        </section>

        {/* Database APIs */}
        <section className="rounded-xl border border-[#1f2d45] bg-[#0d1117] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1f2d45] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#2d6be4]" />
            <h2 className="font-playfair text-base font-semibold text-[#dde4ee]">Research Database APIs</h2>
          </div>
          <div className="px-6 py-5 space-y-3">
            {[
              {
                name: 'PubMed E-utilities',
                status: 'Free — No key required',
                color: '#2d6be4',
                note: 'Rate limit: 3 req/s without key, 10 req/s with NCBI API key',
                link: 'https://ncbiinsights.ncbi.nlm.nih.gov/2017/11/02/new-api-keys-for-the-e-utilities/',
              },
              {
                name: 'Semantic Scholar',
                status: 'Free — No key required',
                color: '#0d9e6e',
                note: 'Rate limit: 100 req/5min without key. Optional API key increases limits.',
                link: 'https://api.semanticscholar.org/',
              },
              {
                name: 'CrossRef',
                status: 'Free — No key required',
                color: '#c97d2a',
                note: 'Polite pool: unlimited with User-Agent email header. Faster with registration.',
                link: 'https://www.crossref.org/documentation/retrieve-metadata/rest-api/',
              },
            ].map((db) => (
              <div key={db.name} className="flex items-start gap-3 p-3 rounded-lg bg-[#111827] border border-[#1f2d45]">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: db.color }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-[#dde4ee] font-dm">{db.name}</span>
                    <span className="text-[10px] font-dm px-2 py-0.5 rounded-full" style={{ backgroundColor: db.color + '20', color: db.color }}>
                      {db.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#5a6a80] font-dm">{db.note}</p>
                </div>
                <a href={db.link} target="_blank" rel="noopener noreferrer" className="text-[#5a6a80] hover:text-[#8b9ab0]">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* App info */}
        <section className="rounded-xl border border-[#1f2d45] bg-[#0d1117] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1f2d45] flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#8b9ab0]" />
            <h2 className="font-playfair text-base font-semibold text-[#dde4ee]">Application</h2>
          </div>
          <div className="px-6 py-5 space-y-3">
            {[
              { label: 'Version', value: '0.1.0' },
              { label: 'AI Model', value: 'claude-sonnet-4-20250514' },
              { label: 'Framework', value: 'Next.js 14 (App Router)' },
              { label: 'Design System', value: 'Deep-Sea Observatory / Oxford Library' },
              { label: 'Guidelines', value: 'PRISMA, CONSORT, STROBE, STARD, TRIPOD, SPIRIT, CARE, ARRIVE' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-[#1f2d45]/50 last:border-0">
                <span className="text-xs text-[#5a6a80] font-dm">{label}</span>
                <span className="text-xs text-[#8b9ab0] font-dm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
