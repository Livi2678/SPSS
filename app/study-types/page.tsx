'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, CheckCircle, XCircle, AlertTriangle, BookOpen, ChevronRight, BarChart2, Clock, DollarSign } from 'lucide-react';
import { STUDY_TYPES, type StudyType } from '@/lib/knowledge/studyTypes';

const CATEGORY_LABELS: Record<StudyType['category'], string> = {
  primary: 'Primary Studies',
  secondary: 'Evidence Synthesis',
  qualitative: 'Qualitative',
  mixed: 'Mixed Methods',
  other: 'Other',
};

const CATEGORY_COLORS: Record<StudyType['category'], string> = {
  primary: '#2d6be4',
  secondary: '#0d9e6e',
  qualitative: '#c9952a',
  mixed: '#c97d2a',
  other: '#8b9ab0',
};

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

function EvidenceBar({ level }: { level: string }) {
  const levelMap: Record<string, number> = {
    'Level I (Highest)': 100,
    'Level I (Summary of systematic reviews)': 100,
    'Level II (single RCT); Level I when pooled in systematic review': 85,
    'Level III (observational)': 60,
    'Level IV': 45,
    'Level V (Expert Opinion)': 30,
    'Qualitative evidence (separate hierarchy)': 50,
    'Evidence map (not clinical evidence level)': 50,
    'Varies by component; integration provides added insight': 65,
  };
  const pct = levelMap[level] ?? 50;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: '#1f2d45' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: '#c9952a' }}
        />
      </div>
      <span className="text-[10px] text-[#5a6a80] font-dm whitespace-nowrap">{level}</span>
    </div>
  );
}

function StudyTypeDetail({ study }: { study: StudyType }) {
  const [activeTab, setActiveTab] = useState<'guide' | 'mistakes' | 'write' | 'examples'>('guide');

  const tabs = [
    { id: 'guide', label: 'Step-by-Step Guide' },
    { id: 'mistakes', label: 'Common Mistakes' },
    { id: 'write', label: 'How to Write' },
    { id: 'examples', label: 'Examples & Stats' },
  ] as const;

  return (
    <motion.div
      key={study.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1"
    >
      {/* Header */}
      <div className="rounded-xl border p-6 mb-4" style={{ backgroundColor: '#0d1117', borderColor: '#1f2d45' }}>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${study.color}20` }}>
            <Compass className="w-5 h-5" style={{ color: study.color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-playfair text-2xl font-bold text-[#dde4ee]">{study.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${CATEGORY_COLORS[study.category]}20`, color: CATEGORY_COLORS[study.category], border: `1px solid ${CATEGORY_COLORS[study.category]}40` }}>
                {CATEGORY_LABELS[study.category]}
              </span>
            </div>
            <p className="text-sm text-[#8b9ab0] font-dm leading-relaxed">{study.definition}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { icon: BookOpen, label: 'Reporting', value: study.reportingGuideline, color: '#2d6be4' },
            { icon: Clock, label: 'Time Required', value: study.timeRequired, color: '#0d9e6e' },
            { icon: DollarSign, label: 'Cost', value: study.cost, color: '#c9952a' },
            { icon: BarChart2, label: 'Framework', value: study.framework, color: '#c97d2a' },
          ].map(item => (
            <div key={item.label} className="rounded-lg p-3" style={{ backgroundColor: '#111827', border: '1px solid #1f2d45' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <item.icon className="w-3 h-3" style={{ color: item.color }} />
                <span className="text-[10px] text-[#5a6a80] font-dm uppercase tracking-wider">{item.label}</span>
              </div>
              <div className="text-xs font-dm text-[#dde4ee] leading-snug">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="space-y-1.5">
          <p className="text-[11px] text-[#5a6a80] font-dm uppercase tracking-wider">Evidence Level</p>
          <EvidenceBar level={study.evidence_level} />
        </div>
      </div>

      {/* When to use */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border p-5" style={{ backgroundColor: '#111827', borderColor: '#1f2d45' }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-[#0d9e6e]" />
            <h3 className="text-sm font-semibold font-dm text-[#dde4ee]">When to Use</h3>
          </div>
          <ul className="space-y-2">
            {study.whenToUse.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-[#0d9e6e] mt-2 flex-shrink-0" />
                <span className="text-xs text-[#8b9ab0] font-dm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border p-5" style={{ backgroundColor: '#111827', borderColor: '#1f2d45' }}>
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 text-[#c94040]" />
            <h3 className="text-sm font-semibold font-dm text-[#dde4ee]">When NOT to Use</h3>
          </div>
          <ul className="space-y-2">
            {study.whenNotToUse.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-[#c94040] mt-2 flex-shrink-0" />
                <span className="text-xs text-[#8b9ab0] font-dm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#0d1117', borderColor: '#1f2d45' }}>
        <div className="flex border-b" style={{ borderColor: '#1f2d45' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 px-4 py-3 text-xs font-dm font-medium transition-colors"
              style={{
                backgroundColor: activeTab === tab.id ? '#111827' : 'transparent',
                color: activeTab === tab.id ? '#c9952a' : '#5a6a80',
                borderBottom: activeTab === tab.id ? '2px solid #c9952a' : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            {activeTab === 'guide' && (
              <motion.div key="guide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {study.keySteps.map(step => (
                  <div key={step.step} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold font-dm" style={{ backgroundColor: `${study.color}20`, color: study.color, border: `1px solid ${study.color}40` }}>
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold font-dm text-[#dde4ee] mb-0.5">{step.title}</h4>
                      <p className="text-xs text-[#8b9ab0] font-dm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'mistakes' && (
              <motion.div key="mistakes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {study.commonMistakes.map((m, i) => (
                  <div key={i} className="rounded-lg p-4" style={{ backgroundColor: '#111827', border: '1px solid #c9404020' }}>
                    <div className="flex items-start gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-[#c94040] mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-semibold font-dm text-[#c94040]">{m.mistake}</span>
                    </div>
                    <p className="text-xs text-[#8b9ab0] font-dm mb-2 ml-6"><strong className="text-[#c97d2a]">Consequence:</strong> {m.consequence}</p>
                    <p className="text-xs font-dm ml-6" style={{ color: '#0d9e6e' }}><strong>Fix:</strong> {m.fix}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'write' && (
              <motion.div key="write" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: '#111827', border: '1px solid #1f2d45' }}>
                  <p className="text-xs font-dm text-[#8b9ab0]"><strong className="text-[#dde4ee]">Sample Size:</strong> {study.sampleSizeConsiderations}</p>
                </div>
                <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: '#111827', border: '1px solid #1f2d45' }}>
                  <p className="text-xs font-dm text-[#8b9ab0]"><strong className="text-[#dde4ee]">Statistical Approach:</strong> {study.statisticalApproach}</p>
                </div>
                {study.howToWriteEachSection.map((s, i) => (
                  <div key={i} className="border-l-2 pl-4" style={{ borderColor: study.color }}>
                    <h4 className="text-sm font-semibold font-dm text-[#dde4ee] mb-1">{s.section}</h4>
                    <p className="text-xs text-[#8b9ab0] font-dm leading-relaxed">{s.guidance}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'examples' && (
              <motion.div key="examples" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <h3 className="text-sm font-semibold font-dm text-[#dde4ee] mb-3">Example Research Questions</h3>
                  <div className="space-y-2">
                    {study.exampleResearchQuestions.map((q, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: '#111827', border: '1px solid #1f2d45' }}>
                        <ChevronRight className="w-3.5 h-3.5 text-[#c9952a] mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-[#8b9ab0] font-dm italic">&ldquo;{q}&rdquo;</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg p-4" style={{ backgroundColor: '#111827', border: '1px solid #1f2d45' }}>
                    <h4 className="text-sm font-semibold font-dm text-[#0d9e6e] mb-2">Strengths</h4>
                    <ul className="space-y-1.5">
                      {study.strengthsAndLimitations.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-[#8b9ab0] font-dm flex items-start gap-1.5">
                          <span className="text-[#0d9e6e] mt-0.5">+</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg p-4" style={{ backgroundColor: '#111827', border: '1px solid #1f2d45' }}>
                    <h4 className="text-sm font-semibold font-dm text-[#c94040] mb-2">Limitations</h4>
                    <ul className="space-y-1.5">
                      {study.strengthsAndLimitations.limitations.map((l, i) => (
                        <li key={i} className="text-xs text-[#8b9ab0] font-dm flex items-start gap-1.5">
                          <span className="text-[#c94040] mt-0.5">−</span> {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function StudyTypesPage() {
  const [selected, setSelected] = useState<StudyType>(STUDY_TYPES[0]);
  const categories = ['secondary', 'primary', 'qualitative', 'mixed'] as const;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.3 }}
      className="min-h-screen p-10"
      style={{ backgroundColor: '#07090f' }}
    >
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Compass className="w-5 h-5 text-[#c9952a]" />
            <span className="text-xs font-dm text-[#5a6a80] uppercase tracking-wider">Methodology</span>
          </div>
          <h1 className="font-playfair text-4xl font-bold text-[#dde4ee] mb-3">Study Design Hub</h1>
          <p className="text-[#8b9ab0] font-dm text-base">
            Complete guides for {STUDY_TYPES.length} study designs — from RCTs to scoping reviews. Step-by-step methodology, common mistakes, and writing guidance.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Left sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="rounded-xl border overflow-hidden sticky top-8" style={{ backgroundColor: '#0d1117', borderColor: '#1f2d45' }}>
              {categories.map(cat => (
                <div key={cat}>
                  <div className="px-4 py-2 border-b" style={{ borderColor: '#1f2d45', backgroundColor: '#111827' }}>
                    <span className="text-[10px] font-bold font-dm uppercase tracking-wider" style={{ color: CATEGORY_COLORS[cat] }}>
                      {CATEGORY_LABELS[cat]}
                    </span>
                  </div>
                  {STUDY_TYPES.filter(s => s.category === cat).map(study => (
                    <button
                      key={study.id}
                      onClick={() => setSelected(study)}
                      className="w-full text-left px-4 py-2.5 border-b transition-colors flex items-center gap-2 group"
                      style={{
                        borderColor: '#1f2d45',
                        backgroundColor: selected.id === study.id ? '#161f30' : 'transparent',
                        borderLeft: selected.id === study.id ? `3px solid ${study.color}` : '3px solid transparent',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: study.color }} />
                      <span className="text-xs font-dm transition-colors" style={{ color: selected.id === study.id ? '#dde4ee' : '#8b9ab0' }}>
                        {study.name}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <StudyTypeDetail key={selected.id} study={selected} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
