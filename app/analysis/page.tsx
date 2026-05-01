'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { AnalysisHelper } from '@/components/modules/AnalysisHelper';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function AnalysisPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="px-8 py-6"
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-[#8b5cf6]" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-[#dde4ee]">Analysis Assistant</h1>
        </div>
        <p className="text-sm text-[#8b9ab0] font-dm max-w-2xl">
          Statistical test selection using a decision tree, complete R and Python code generation with
          assumption checks, and plain-English interpretation of your statistical output.
        </p>
      </div>
      <AnalysisHelper />
    </motion.div>
  );
}
