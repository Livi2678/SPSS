'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { ToastMessage } from '@/types';

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: {
    border: '#0d9e6e40',
    bg: '#0d9e6e10',
    icon: '#34d399',
    title: '#34d399',
  },
  error: {
    border: '#c9404040',
    bg: '#c9404010',
    icon: '#f87171',
    title: '#f87171',
  },
  warning: {
    border: '#c97d2a40',
    bg: '#c97d2a10',
    icon: '#fbbf24',
    title: '#fbbf24',
  },
  info: {
    border: '#2d6be440',
    bg: '#2d6be410',
    icon: '#60a5fa',
    title: '#60a5fa',
  },
};

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration ?? 4000;
  const Icon = iconMap[toast.type];
  const colors = colorMap[toast.type];

  useEffect(() => {
    if (duration <= 0) return;
    const interval = setInterval(() => {
      setProgress((p) => Math.max(0, p - (100 / (duration / 100))));
    }, 100);
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-80 rounded-lg overflow-hidden"
      style={{
        border: `1px solid ${colors.border}`,
        backgroundColor: '#0d1117',
      }}
    >
      <div className="p-3.5 flex gap-3">
        <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.icon }} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium font-dm" style={{ color: colors.title }}>
            {toast.title}
          </div>
          {toast.message && (
            <div className="text-xs text-[#8b9ab0] font-dm mt-0.5 leading-relaxed">
              {toast.message}
            </div>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-[#5a6a80] hover:text-[#8b9ab0] transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {duration > 0 && (
        <div className="h-0.5 bg-[#1f2d45]">
          <div
            className="h-full transition-all duration-100"
            style={{ width: `${progress}%`, backgroundColor: colors.icon }}
          />
        </div>
      )}
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
