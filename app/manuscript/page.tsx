'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { ManuscriptEvaluator } from '@/components/modules/ManuscriptEvaluator';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function ManuscriptPage() {
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
          <div className="w-8 h-8 rounded-lg bg-[#c9952a]/15 border border-[#c9952a]/30 flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#c9952a]" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-[#dde4ee]">Manuscript Evaluator</h1>
        </div>
        <p className="text-sm text-[#8b9ab0] font-dm max-w-2xl">
          Receive Q1-level peer review feedback on your manuscript with section-by-section analysis, scoring metrics,
          desk rejection risk assessment, and actionable revision guidance.
        </p>
      </div>
      <ManuscriptEvaluator />
    </motion.div>
  );
}
