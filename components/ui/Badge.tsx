'use client';

import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'blue' | 'green' | 'red' | 'amber' | 'dim' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'dim', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full font-dm',
        size === 'sm' ? 'px-2 py-0.5 text-[10px] tracking-wider uppercase' : 'px-3 py-1 text-xs',
        {
          'bg-[#7a5c1a]/20 text-[#e8b84b] border border-[#7a5c1a]/40': variant === 'gold',
          'bg-[#2d6be4]/15 text-[#6b9ffd] border border-[#2d6be4]/30': variant === 'blue',
          'bg-[#0d9e6e]/15 text-[#34d399] border border-[#0d9e6e]/30': variant === 'green',
          'bg-[#c94040]/15 text-[#f87171] border border-[#c94040]/30': variant === 'red',
          'bg-[#c97d2a]/15 text-[#fbbf24] border border-[#c97d2a]/30': variant === 'amber',
          'bg-[#1f2d45]/60 text-[#8b9ab0] border border-[#1f2d45]': variant === 'dim',
          'border border-[#1f2d45] text-[#8b9ab0] bg-transparent': variant === 'outline',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
