'use client';

import { clsx } from 'clsx';

interface DatabasePillProps {
  name: string;
  active: boolean;
  count?: number;
  comingSoon?: boolean;
  onClick?: () => void;
  color?: string;
}

const dbColors: Record<string, string> = {
  PubMed: '#2d6be4',
  'Semantic Scholar': '#0d9e6e',
  CrossRef: '#c97d2a',
  Scopus: '#8b5cf6',
  'Web of Science': '#06b6d4',
  EMBASE: '#ec4899',
  CINAHL: '#f59e0b',
  PsycINFO: '#84cc16',
};

export function DatabasePill({ name, active, count, comingSoon, onClick, color }: DatabasePillProps) {
  const pillColor = color || dbColors[name] || '#8b9ab0';

  return (
    <button
      onClick={onClick}
      disabled={comingSoon}
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-dm font-medium',
        'border transition-all duration-200',
        comingSoon && 'opacity-40 cursor-not-allowed',
        !comingSoon && 'cursor-pointer',
        active
          ? 'border-transparent text-white'
          : 'border-[#1f2d45] text-[#8b9ab0] bg-transparent hover:border-[#283d5e]'
      )}
      style={
        active
          ? { backgroundColor: pillColor + '25', borderColor: pillColor + '60', color: pillColor }
          : {}
      }
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: active ? pillColor : '#5a6a80' }}
      />
      {name}
      {count !== undefined && count > 0 && (
        <span
          className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
          style={
            active
              ? { backgroundColor: pillColor + '30', color: pillColor }
              : { backgroundColor: '#1f2d45', color: '#5a6a80' }
          }
        >
          {count}
        </span>
      )}
      {comingSoon && (
        <span className="text-[9px] text-[#5a6a80] uppercase tracking-wider">Soon</span>
      )}
    </button>
  );
}
