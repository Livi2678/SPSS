'use client';

import { clsx } from 'clsx';

interface SkeletonCardProps {
  lines?: number;
  showAvatar?: boolean;
  className?: string;
  height?: string;
}

function SkeletonLine({ width = '100%', height = '12px' }: { width?: string; height?: string }) {
  return (
    <div
      className="skeleton rounded"
      style={{ width, height }}
    />
  );
}

export function SkeletonCard({ lines = 3, showAvatar = false, className, height }: SkeletonCardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg border border-[#1f2d45] bg-[#111827] p-4',
        className
      )}
      style={height ? { height } : undefined}
    >
      <div className="flex gap-3">
        {showAvatar && (
          <div className="skeleton w-10 h-10 rounded-lg flex-shrink-0" />
        )}
        <div className="flex-1 space-y-2.5">
          <SkeletonLine width="75%" height="14px" />
          {lines >= 2 && <SkeletonLine width="55%" height="10px" />}
          {lines >= 3 && (
            <div className="space-y-1.5 mt-3">
              <SkeletonLine width="100%" height="10px" />
              <SkeletonLine width="90%" height="10px" />
              {lines >= 4 && <SkeletonLine width="70%" height="10px" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 4, className }: { lines?: number; className?: string }) {
  const widths = ['100%', '92%', '96%', '78%', '88%', '100%', '85%'];
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={widths[i % widths.length]} height="11px" />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-[#1f2d45] overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-3 border-b border-[#1f2d45] bg-[#0d1117]">
        {['30%', '50%', '25%', '20%'].map((w, i) => (
          <SkeletonLine key={i} width={w} height="11px" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-4 gap-4 p-3 border-b border-[#1f2d45]/50"
          style={{ backgroundColor: i % 2 === 0 ? '#111827' : '#0d1117' }}
        >
          {['60%', '85%', '40%', '30%'].map((w, j) => (
            <SkeletonLine key={j} width={w} height="10px" />
          ))}
        </div>
      ))}
    </div>
  );
}
