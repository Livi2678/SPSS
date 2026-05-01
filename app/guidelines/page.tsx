'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { GuidelinesChecker } from '@/components/modules/GuidelinesChecker';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function GuidelinesPage() {
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
          <div className="w-8 h-8 rounded-lg bg-[#0d9e6e]/15 border border-[#0d9e6e]/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#0d9e6e]" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-[#dde4ee]">Guidelines Checker</h1>
        </div>
        <p className="text-sm text-[#8b9ab0] font-dm max-w-2xl">
          Check your manuscript against PRISMA, CONSORT, STROBE, STARD, TRIPOD, SPIRIT, CARE, and ARRIVE
          reporting standards. Look up journal-specific word limits and submission requirements.
        </p>
      </div>
      <GuidelinesChecker />
    </motion.div>
  );
}
