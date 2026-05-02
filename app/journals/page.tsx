'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, ChevronDown, ChevronUp, BookMarked, DollarSign, Clock, TrendingUp, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { JOURNAL_DATABASE, type JournalRequirements, searchJournals } from '@/lib/knowledge/journals';

const FIELDS = ['All Fields', 'Multidisciplinary', 'Medicine (Clinical)', 'Cardiology', 'Oncology', 'Neurology/Neuroscience', 'Gastroenterology', 'Epidemiology', 'Digital Health / Health Informatics', 'Radiology', 'Systematic Reviews / Evidence Synthesis'];

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function JournalCard({ journal, onSelect }: { journal: JournalRequirements; onSelect: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, translateY: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      className="cursor-pointer rounded-xl border p-5 group"
      style={{
        backgroundColor: '#111827',
        borderColor: '#1f2d45',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-playfair font-semibold text-[#dde4ee] text-base truncate group-hover:text-[#e8b84b] transition-colors">
            {journal.name}
          </h3>
          <p className="text-xs text-[#5a6a80] font-dm mt-0.5">{journal.publisher}</p>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded ml-3 flex-shrink-0"
          style={{
            backgroundColor: journal.quartile === 'Q1' ? '#c9952a20' : '#1f2d45',
            color: journal.quartile === 'Q1' ? '#e8b84b' : '#8b9ab0',
            border: `1px solid ${journal.quartile === 'Q1' ? '#c9952a40' : '#283d5e'}`,
          }}
        >
          {journal.quartile}
        </span>
      </div>

      <p className="text-xs text-[#8b9ab0] font-dm mb-4">{journal.field}</p>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-[13px] font-semibold text-[#e8b84b] font-dm">{journal.impactFactor}</div>
          <div className="text-[10px] text-[#5a6a80] font-dm mt-0.5">Impact Factor</div>
        </div>
        <div className="text-center">
          <div className="text-[13px] font-semibold text-[#dde4ee] font-dm">{Math.round(journal.acceptanceRate * 100)}%</div>
          <div className="text-[10px] text-[#5a6a80] font-dm mt-0.5">Accept Rate</div>
        </div>
        <div className="text-center">
          <div className="text-[13px] font-semibold text-[#dde4ee] font-dm">{journal.turnaroundDays}d</div>
          <div className="text-[10px] text-[#5a6a80] font-dm mt-0.5">Turnaround</div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {journal.openAccess.available && (
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: '#0d9e6e20', color: '#0d9e6e', border: '1px solid #0d9e6e30' }}>
            Open Access
          </span>
        )}
        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: '#1f2d45', color: '#8b9ab0', border: '1px solid #283d5e' }}>
          {journal.peerReviewType}
        </span>
      </div>
    </motion.div>
  );
}

function JournalDetail({ journal, onClose }: { journal: JournalRequirements; onClose: () => void }) {
  const [expandedSection, setExpandedSection] = useState<string | null>('requirements');

  const sections = [
    { id: 'requirements', label: 'Key Requirements', icon: CheckCircle },
    { id: 'rejection', label: 'Rejection Reasons', icon: XCircle },
    { id: 'reviewers', label: 'Reviewer Focus', icon: Users },
    { id: 'abstract', label: 'Abstract Format', icon: BookMarked },
    { id: 'cover', label: 'Cover Letter Tips', icon: AlertCircle },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border overflow-hidden"
      style={{ backgroundColor: '#0d1117', borderColor: '#1f2d45' }}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: '#1f2d45' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#dde4ee]">{journal.name}</h2>
            <p className="text-sm text-[#8b9ab0] font-dm mt-1">{journal.publisher} · {journal.field}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#5a6a80] hover:text-[#dde4ee] transition-colors text-sm font-dm px-3 py-1.5 rounded border border-[#1f2d45] hover:border-[#283d5e]"
          >
            ← Back
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Impact Factor', value: journal.impactFactor, icon: TrendingUp, color: '#e8b84b' },
            { label: 'Acceptance Rate', value: `${Math.round(journal.acceptanceRate * 100)}%`, icon: Users, color: '#0d9e6e' },
            { label: 'Turnaround', value: `~${journal.turnaroundDays} days`, icon: Clock, color: '#2d6be4' },
            { label: 'APC', value: journal.openAccess.available && journal.openAccess.apc ? `${journal.openAccess.currency} ${journal.openAccess.apc.toLocaleString()}` : 'Subscription', icon: DollarSign, color: journal.openAccess.available ? '#c97d2a' : '#8b9ab0' },
          ].map(stat => (
            <div key={stat.label} className="rounded-lg p-3" style={{ backgroundColor: '#111827', border: '1px solid #1f2d45' }}>
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                <span className="text-[10px] text-[#5a6a80] font-dm uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-sm font-semibold font-dm" style={{ color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Word limits */}
        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#111827', border: '1px solid #1f2d45' }}>
          <p className="text-[11px] text-[#5a6a80] font-dm uppercase tracking-wider mb-2">Word Limits</p>
          <div className="flex flex-wrap gap-4">
            <span className="text-sm font-dm text-[#dde4ee]">Abstract: <strong className="text-[#e8b84b]">{journal.wordLimits.abstract}</strong></span>
            <span className="text-sm font-dm text-[#dde4ee]">Main text: <strong className="text-[#e8b84b]">{journal.wordLimits.main.toLocaleString()}</strong></span>
            {journal.wordLimits.references && (
              <span className="text-sm font-dm text-[#dde4ee]">References: <strong className="text-[#e8b84b]">{journal.wordLimits.references}</strong></span>
            )}
          </div>
        </div>

        {/* Structure */}
        <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#111827', border: '1px solid #1f2d45' }}>
          <p className="text-[11px] text-[#5a6a80] font-dm uppercase tracking-wider mb-2">Required Structure</p>
          <div className="flex flex-wrap gap-1.5">
            {journal.structure.map((section, i) => (
              <span key={i} className="text-xs font-dm px-2 py-0.5 rounded" style={{ backgroundColor: '#1f2d45', color: '#8b9ab0' }}>
                {section}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs font-dm text-[#8b9ab0]">
          <span>Citation: <strong className="text-[#dde4ee]">{journal.citationStyle}</strong></span>
          <span>·</span>
          <span>Review: <strong className="text-[#dde4ee]">{journal.peerReviewType}</strong></span>
          <span>·</span>
          <span>Figures: <strong className="text-[#dde4ee]">Max {journal.figureSpecs.maxFigures} · {journal.figureSpecs.format} · {journal.figureSpecs.minDPI} DPI</strong></span>
        </div>
      </div>

      {/* Expandable sections */}
      <div className="p-4 space-y-2">
        {sections.map(section => (
          <div key={section.id} className="rounded-lg overflow-hidden border" style={{ borderColor: '#1f2d45' }}>
            <button
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
              style={{ backgroundColor: expandedSection === section.id ? '#161f30' : '#111827' }}
            >
              <div className="flex items-center gap-2">
                <section.icon className="w-4 h-4 text-[#c9952a]" />
                <span className="text-sm font-medium font-dm text-[#dde4ee]">{section.label}</span>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="w-4 h-4 text-[#5a6a80]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#5a6a80]" />
              )}
            </button>
            <AnimatePresence>
              {expandedSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 border-t" style={{ backgroundColor: '#0d1117', borderColor: '#1f2d45' }}>
                    {section.id === 'requirements' && (
                      <ul className="space-y-2">
                        {journal.keyRequirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-[#0d9e6e] mt-0.5 flex-shrink-0" />
                            <span className="text-sm font-dm text-[#8b9ab0]">{req}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.id === 'rejection' && (
                      <ul className="space-y-2">
                        {journal.typicalRejectionReasons.map((reason, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <XCircle className="w-3.5 h-3.5 text-[#c94040] mt-0.5 flex-shrink-0" />
                            <span className="text-sm font-dm text-[#8b9ab0]">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.id === 'reviewers' && (
                      <ul className="space-y-2">
                        {journal.reviewerFocus.map((focus, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Users className="w-3.5 h-3.5 text-[#2d6be4] mt-0.5 flex-shrink-0" />
                            <span className="text-sm font-dm text-[#8b9ab0]">{focus}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.id === 'abstract' && (
                      <p className="text-sm font-dm text-[#8b9ab0] leading-relaxed">{journal.abstractFormat}</p>
                    )}
                    {section.id === 'cover' && (
                      <ul className="space-y-2">
                        {journal.coverLetterTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-[#c9952a] mt-0.5 flex-shrink-0" />
                            <span className="text-sm font-dm text-[#8b9ab0]">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function JournalsPage() {
  const [query, setQuery] = useState('');
  const [selectedField, setSelectedField] = useState('All Fields');
  const [selectedQuartile, setSelectedQuartile] = useState<string>('All');
  const [selectedJournal, setSelectedJournal] = useState<JournalRequirements | null>(null);

  const filtered = useMemo(() => {
    let results = query.trim() ? searchJournals(query) : [...JOURNAL_DATABASE];
    if (selectedField !== 'All Fields') results = results.filter(j => j.field === selectedField);
    if (selectedQuartile !== 'All') results = results.filter(j => j.quartile === selectedQuartile);
    return results.sort((a, b) => b.impactFactor - a.impactFactor);
  }, [query, selectedField, selectedQuartile]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="min-h-screen p-10"
      style={{ backgroundColor: '#07090f' }}
    >
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookMarked className="w-5 h-5 text-[#c9952a]" />
            <span className="text-xs font-dm text-[#5a6a80] uppercase tracking-wider">Reference</span>
          </div>
          <h1 className="font-playfair text-4xl font-bold text-[#dde4ee] mb-3">
            Journal Encyclopedia
          </h1>
          <p className="text-[#8b9ab0] font-dm text-base">
            Complete submission requirements for {JOURNAL_DATABASE.length} leading journals — word limits, structure, reviewer focus, and rejection patterns.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {selectedJournal ? (
            <JournalDetail key="detail" journal={selectedJournal} onClose={() => setSelectedJournal(null)} />
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6a80]" />
                  <input
                    type="text"
                    placeholder="Search journals by name, field, or publisher..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm font-dm text-[#dde4ee] placeholder-[#5a6a80] outline-none focus:ring-1"
                    style={{ backgroundColor: '#111827', border: '1px solid #1f2d45' }}
                  />
                </div>
                <select
                  value={selectedField}
                  onChange={e => setSelectedField(e.target.value)}
                  className="px-3 py-2.5 rounded-lg text-sm font-dm text-[#dde4ee] outline-none"
                  style={{ backgroundColor: '#111827', border: '1px solid #1f2d45' }}
                >
                  {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <select
                  value={selectedQuartile}
                  onChange={e => setSelectedQuartile(e.target.value)}
                  className="px-3 py-2.5 rounded-lg text-sm font-dm text-[#dde4ee] outline-none"
                  style={{ backgroundColor: '#111827', border: '1px solid #1f2d45' }}
                >
                  {['All', 'Q1', 'Q2', 'Q3', 'Q4'].map(q => <option key={q} value={q}>{q === 'All' ? 'All Quartiles' : q}</option>)}
                </select>
              </div>

              <p className="text-xs text-[#5a6a80] font-dm mb-4">{filtered.length} journals found</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(journal => (
                  <JournalCard
                    key={journal.name}
                    journal={journal}
                    onSelect={() => setSelectedJournal(journal)}
                  />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <BookMarked className="w-10 h-10 text-[#1f2d45] mx-auto mb-3" />
                  <p className="text-[#5a6a80] font-dm">No journals found for your search.</p>
                  <button onClick={() => { setQuery(''); setSelectedField('All Fields'); setSelectedQuartile('All'); }} className="mt-3 text-[#c9952a] text-sm font-dm hover:text-[#e8b84b]">
                    Clear filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
