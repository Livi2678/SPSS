'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  animate?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 75) return '#0d9e6e';
  if (score >= 55) return '#c9952a';
  if (score >= 35) return '#c97d2a';
  return '#c94040';
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 45) return 'Needs Work';
  return 'Major Issues';
}

export function ScoreRing({
  score,
  size = 160,
  strokeWidth = 8,
  label,
  sublabel,
  animate: shouldAnimate = true,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (score / 100) * circumference;

  const color = getScoreColor(score);
  const scoreLabel = sublabel || getScoreLabel(score);

  const circleRef = useRef<SVGCircleElement>(null);
  const motionValue = useMotionValue(circumference);

  useEffect(() => {
    if (!shouldAnimate || !circleRef.current) return;

    const controls = animate(motionValue, dashoffset, {
      duration: 1.2,
      ease: 'easeOut',
      delay: 0.2,
    });

    const unsub = motionValue.on('change', (v) => {
      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = String(v);
      }
    });

    return () => {
      controls.stop();
      unsub();
    };
  }, [dashoffset, motionValue, shouldAnimate]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1f2d45"
            strokeWidth={strokeWidth}
          />
          {/* Colored progress arc */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={shouldAnimate ? circumference : dashoffset}
            style={{
              filter: `drop-shadow(0 0 6px ${color}60)`,
              transition: shouldAnimate ? undefined : 'none',
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-playfair font-bold leading-none"
            style={{ fontSize: size * 0.22, color }}
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-[#5a6a80] font-dm uppercase tracking-wider mt-0.5">
            / 100
          </span>
        </div>
      </div>
      {label && (
        <div className="text-center">
          <div className="text-sm font-medium text-[#dde4ee] font-dm">{label}</div>
          <div className="text-xs mt-0.5 font-dm" style={{ color }}>{scoreLabel}</div>
        </div>
      )}
    </div>
  );
}
