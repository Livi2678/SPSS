'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { LiteratureSearch } from '@/components/modules/LiteratureSearch';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function SearchPage() {
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
          <div className="w-8 h-8 rounded-lg bg-[#2d6be4]/15 border border-[#2d6be4]/30 flex items-center justify-center">
            <Search className="w-4 h-4 text-[#2d6be4]" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-[#dde4ee]">Literature Search</h1>
        </div>
        <p className="text-sm text-[#8b9ab0] font-dm max-w-2xl">
          Search PubMed, Semantic Scholar, and CrossRef simultaneously. Use free-text, PICO framework,
          or advanced boolean queries. AI-synthesized summaries identify key themes and research gaps.
        </p>
      </div>
      <LiteratureSearch />
    </motion.div>
  );
}
