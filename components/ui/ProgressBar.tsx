'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'gold' | 'blue' | 'green' | 'red' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
  className?: string;
  animate?: boolean;
}

const colorMap = {
  gold: '#c9952a',
  blue: '#2d6be4',
  green: '#0d9e6e',
  red: '#c94040',
  amber: '#c97d2a',
};

function getColorByValue(value: number): string {
  if (value >= 75) return colorMap.green;
  if (value >= 55) return colorMap.gold;
  if (value >= 35) return colorMap.amber;
  return colorMap.red;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  color,
  size = 'md',
  indeterminate = false,
  className,
  animate = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = color ? colorMap[color] : getColorByValue(percentage);

  const heightClass = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2.5',
  }[size];

  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs text-[#8b9ab0] font-dm">{label}</span>
          )}
          {showValue && (
            <span className="text-xs font-medium font-mono" style={{ color: barColor }}>
              {Math.round(percentage)}
            </span>
          )}
        </div>
      )}
      <div
        className={clsx(
          'w-full rounded-full overflow-hidden bg-[#111827] border border-[#1f2d45]/50',
          heightClass
        )}
      >
        {indeterminate ? (
          <div className="h-full rounded-full relative overflow-hidden" style={{ backgroundColor: barColor + '20' }}>
            <div
              className="absolute top-0 bottom-0 rounded-full"
              style={{
                backgroundColor: barColor,
                width: '30%',
                animation: 'progress-indeterminate 1.4s ease-in-out infinite',
              }}
            />
          </div>
        ) : (
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: barColor }}
            initial={animate ? { width: 0 } : { width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
          />
        )}
      </div>
    </div>
  );
}
