'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Eye, EyeOff, ExternalLink, Zap, Lock, CheckCircle } from 'lucide-react';
import { useApiKey } from '@/hooks/useApiKey';
import { useToast } from '@/components/ui/Toast';

interface ApiKeyModalProps {
  isOpen: boolean;
}

export function ApiKeyModal({ isOpen }: ApiKeyModalProps) {
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const { status, validateKey, enterDemoMode } = useApiKey();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    const trimmed = inputKey.trim();
    const success = await validateKey('anthropic', trimmed);
    if (success) {
      addToast({
        type: 'success',
        title: 'API key connected',
        message: 'Claude is ready for your research',
      });
    } else {
      addToast({
        type: 'error',
        title: 'Invalid API key',
        message: 'Please check your key at console.anthropic.com',
      });
    }
  };

  const handleDemoMode = () => {
    enterDemoMode();
    addToast({
      type: 'info',
      title: 'Demo mode active',
      message: 'Showing pre-written research examples',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#07090f]/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-[#1f2d45]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#c9952a]/15 border border-[#c9952a]/30 flex items-center justify-center">
                    <Key className="w-5 h-5 text-[#c9952a]" />
                  </div>
                  <div>
                    <h2 className="font-playfair text-lg font-semibold text-[#dde4ee]">
                      Connect to Claude
                    </h2>
                    <p className="text-xs text-[#5a6a80] font-dm">ScholarAI Pro requires an Anthropic API key</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5">
                {/* Features list */}
                <div className="mb-5 space-y-2">
                  {[
                    { icon: Zap, text: 'Real-time manuscript evaluation with scoring' },
                    { icon: CheckCircle, text: 'AI-powered literature synthesis' },
                    { icon: Lock, text: 'Your key is never stored — session only' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-[#c9952a] flex-shrink-0" />
                      <span className="text-xs text-[#8b9ab0] font-dm">{text}</span>
                    </div>
                  ))}
                </div>

                {/* Input form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#8b9ab0] font-dm mb-1.5">
                      Anthropic API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showKey ? 'text' : 'password'}
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        placeholder="sk-ant-api03-..."
                        className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2.5 pr-10 text-sm text-[#dde4ee] font-mono placeholder:text-[#5a6a80] focus:outline-none focus:border-[#c9952a]/60 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6a80] hover:text-[#8b9ab0] transition-colors"
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!inputKey.trim() || status === 'validating'}
                    className="w-full py-2.5 rounded-lg text-sm font-medium font-dm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: '#c9952a',
                      color: '#07090f',
                    }}
                  >
                    {status === 'validating' ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-[#07090f]/30 border-t-[#07090f] animate-spin" />
                        Validating...
                      </span>
                    ) : (
                      'Connect API Key'
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="h-px flex-1 bg-[#1f2d45]" />
                  <span className="text-xs text-[#5a6a80] font-dm">or</span>
                  <div className="h-px flex-1 bg-[#1f2d45]" />
                </div>

                {/* Demo mode */}
                <button
                  onClick={handleDemoMode}
                  className="w-full py-2.5 rounded-lg text-sm font-medium font-dm border border-[#1f2d45] text-[#8b9ab0] hover:border-[#283d5e] hover:text-[#dde4ee] transition-all duration-200"
                >
                  Continue in Demo Mode
                </button>

                {/* Link to Anthropic */}
                <a
                  href="https://console.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 mt-4 text-xs text-[#5a6a80] hover:text-[#8b9ab0] transition-colors font-dm"
                >
                  Get API key at console.anthropic.com
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
