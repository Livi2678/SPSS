'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Key, RefreshCw } from 'lucide-react';
import { useApiKey } from '@/hooks/useApiKey';

const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Dashboard', description: 'Research intelligence overview' },
  '/manuscript': { title: 'Manuscript Evaluator', description: 'AI-powered journal readiness assessment' },
  '/search': { title: 'Literature Search', description: 'Multi-database academic search' },
  '/review': { title: 'Systematic Review', description: 'PRISMA-compliant review workflow' },
  '/analysis': { title: 'Analysis Assistant', description: 'Statistical method selection & interpretation' },
  '/guidelines': { title: 'Guidelines Checker', description: 'Reporting standards compliance' },
  '/settings': { title: 'Settings', description: 'Application preferences' },
};

export function TopBar() {
  const pathname = usePathname();
  const { status, clearKey } = useApiKey();
  const pageInfo = pageTitles[pathname] || { title: 'ScholarAI Pro', description: '' };

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between px-6 py-3"
      style={{
        left: '240px',
        backgroundColor: '#07090f',
        borderBottom: '1px solid #1f2d45',
        height: '56px',
      }}
    >
      {/* Page title */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="font-playfair text-[15px] font-semibold text-[#dde4ee]">
          {pageInfo.title}
        </h1>
        {pageInfo.description && (
          <p className="text-[11px] text-[#5a6a80] font-dm">{pageInfo.description}</p>
        )}
      </motion.div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* API Key status badge */}
        {status === 'connected' && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0d9e6e]/10 border border-[#0d9e6e]/25">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0d9e6e] animate-pulse" />
            <span className="text-xs text-[#0d9e6e] font-dm font-medium">Claude Connected</span>
            <button
              onClick={clearKey}
              className="ml-1 text-[#0d9e6e]/60 hover:text-[#0d9e6e] transition-colors"
              title="Disconnect API key"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        )}
        {status === 'demo' && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c97d2a]/10 border border-[#c97d2a]/25">
            <span className="text-xs text-[#c97d2a] font-dm font-medium">Demo Mode</span>
            <button
              onClick={clearKey}
              className="ml-1 text-[#c97d2a]/60 hover:text-[#c97d2a] transition-colors"
              title="Enter API key"
            >
              <Key className="w-3 h-3" />
            </button>
          </div>
        )}
        {status === 'invalid' && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c94040]/10 border border-[#c94040]/25">
            <span className="text-xs text-[#c94040] font-dm font-medium">Invalid Key</span>
            <button
              onClick={clearKey}
              className="ml-1 text-[#c94040]/60 hover:text-[#c94040] transition-colors"
              title="Re-enter API key"
            >
              <Key className="w-3 h-3" />
            </button>
          </div>
        )}
        {(status === 'idle') && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1f2d45]/60 border border-[#1f2d45]">
            <Key className="w-3 h-3 text-[#5a6a80]" />
            <span className="text-xs text-[#5a6a80] font-dm font-medium">No API Key</span>
          </div>
        )}
      </div>
    </header>
  );
}
