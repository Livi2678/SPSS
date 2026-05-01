'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, ChevronRight, Play, RotateCcw } from 'lucide-react';
import { useApiKey } from '@/hooks/useApiKey';
import { useStream } from '@/hooks/useStream';
import { ResultStream } from '@/components/ui/ResultStream';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useToast } from '@/components/ui/Toast';

type StageId = 1 | 2 | 3 | 4 | 5;

const STAGES = [
  { id: 1 as StageId, name: 'Protocol', short: 'Protocol', color: '#c9952a' },
  { id: 2 as StageId, name: 'Search', short: 'Search', color: '#2d6be4' },
  { id: 3 as StageId, name: 'Screen', short: 'Screen', color: '#0d9e6e' },
  { id: 4 as StageId, name: 'Extract', short: 'Extract', color: '#8b5cf6' },
  { id: 5 as StageId, name: 'Synthesize', short: 'Synthesize', color: '#c97d2a' },
];

const PRISMA_ITEMS = [
  { section: 'Title', items: [{ num: 1, req: 'Identify report as systematic review, meta-analysis, or both' }] },
  {
    section: 'Abstract',
    items: [
      { num: 2, req: 'Structured summary: background, objectives, data sources, eligibility criteria, participants, interventions, assessment, synthesis' },
    ],
  },
  {
    section: 'Introduction',
    items: [
      { num: 3, req: 'Rationale: describe the rationale for the review in the context of what is already known' },
      { num: 4, req: 'Objectives: provide explicit statement of questions being addressed with reference to PICO' },
    ],
  },
  {
    section: 'Methods',
    items: [
      { num: 5, req: 'Protocol and registration: indicate if review protocol exists' },
      { num: 6, req: 'Eligibility criteria: specify study characteristics and report characteristics used as criteria for eligibility' },
      { num: 7, req: 'Information sources: describe all information sources searched' },
      { num: 8, req: 'Search strategy: present full search strategy for at least one database' },
      { num: 9, req: 'Study selection: state process for selecting studies' },
      { num: 10, req: 'Data collection process: describe method of data extraction from reports' },
      { num: 11, req: 'Data items: list and define all variables for which data were sought' },
      { num: 12, req: 'Risk of bias in individual studies: describe methods used for assessing risk of bias' },
      { num: 13, req: 'Summary measures: state principal summary measures' },
      { num: 14, req: 'Synthesis of results: describe the methods of handling data and combining results' },
      { num: 15, req: 'Risk of bias across studies: specify assessment of risk of bias that may affect cumulative evidence' },
      { num: 16, req: 'Additional analyses: describe methods of additional analyses' },
    ],
  },
  {
    section: 'Results',
    items: [
      { num: 17, req: 'Study selection: give numbers of studies screened, assessed for eligibility, included, with reasons for exclusions at each stage' },
      { num: 18, req: 'Study characteristics: present characteristics of each included study' },
      { num: 19, req: 'Risk of bias within studies: present data on risk of bias of each study' },
      { num: 20, req: 'Results of individual studies: present results of each study' },
      { num: 21, req: 'Synthesis of results: present results of each meta-analysis' },
      { num: 22, req: 'Risk of bias across studies: present results of assessment of risk of bias' },
      { num: 23, req: 'Additional analysis: give results of additional analyses' },
    ],
  },
  {
    section: 'Discussion',
    items: [
      { num: 24, req: 'Summary of evidence: summarize main findings including strength of evidence for each main outcome' },
      { num: 25, req: 'Limitations: discuss limitations at study and outcome level' },
      { num: 26, req: 'Conclusions: provide a general interpretation of the results' },
    ],
  },
  {
    section: 'Funding',
    items: [{ num: 27, req: 'Funding: describe sources of funding for systematic review and other support' }],
  },
];

const DEMO_PROTOCOL = `## Systematic Review Protocol

**Title:** The effectiveness of [Intervention] versus [Comparator] in [Population] for [Outcome]: A systematic review and meta-analysis

**Background:**
[Population] represents a significant burden on healthcare systems globally, with [Outcome] as a primary determinant of morbidity and mortality. Current guidelines recommend [standard treatment], however emerging evidence suggests [Intervention] may offer additional benefits. This systematic review will synthesize existing evidence to inform clinical practice and future research.

**Objectives:**
To systematically review and synthesize evidence on the effectiveness and safety of [Intervention] compared to [Comparator] in [Population] for [Outcome].

**Primary Question (PICO):**
- **P (Population):** Adults with [condition], as defined by [diagnostic criteria]
- **I (Intervention):** [Intervention], including [specific details]
- **C (Comparator):** [Comparator] or placebo
- **O (Outcome):** [Primary outcome], measured at [timepoint]

**Secondary Outcomes:**
- [Secondary outcome 1] at [timepoint]
- [Secondary outcome 2] at [timepoint]
- Adverse events and safety outcomes
- Health-related quality of life

**Eligibility Criteria:**

*Inclusion:*
- Randomized controlled trials (RCTs)
- Adults aged ≥18 years
- Diagnosis confirmed by validated criteria
- Follow-up ≥ [minimum duration]
- Published in peer-reviewed journals
- English language

*Exclusion:*
- Non-randomized designs
- Pediatric populations
- Case reports, editorials, review articles
- Conference abstracts without full data
- Studies with incomplete outcome reporting

**Search Strategy:**
Databases to be searched: PubMed, EMBASE, CENTRAL, Web of Science, Scopus
Date range: January 2000 — present
Grey literature: ClinicalTrials.gov, WHO ICTRP, PROSPERO

**Data Extraction:**
Two independent reviewers will extract data using a standardized form. Discrepancies will be resolved by consensus or third reviewer arbitration.

**Risk of Bias Assessment:**
Cochrane RoB 2 tool for RCTs; ROBINS-I for non-randomized studies

**Statistical Analysis:**
Random-effects meta-analysis (DerSimonian-Laird method); heterogeneity assessed by I² statistic; sensitivity analyses planned for high RoB studies

**Registration:**
This protocol will be registered with PROSPERO prior to data extraction.`;

const DEMO_SCREENING = `## Abstract Screening Results

**Total abstracts screened:** 12
**Included:** 8 | **Excluded:** 4

---

### INCLUDED Studies (n=8)

1. **Smith et al. 2022** — Meets all inclusion criteria. RCT design, n=245, 12-month follow-up, primary outcome clearly measured. ✅ INCLUDE

2. **Johnson & Lee 2021** — Large multicenter RCT (n=1,847), directly addresses primary outcome. Pre-registered (NCT02345678). ✅ INCLUDE

3. **Wang et al. 2023** — Systematic review of 15 RCTs. Useful for identifying additional primary studies. ✅ INCLUDE

4. **Patel et al. 2020** — RCT, n=156. Short follow-up (6 months) but secondary outcomes relevant. ✅ INCLUDE

5. **Müller et al. 2022** — European multicenter RCT, provides external validity. ✅ INCLUDE

6. **Chen et al. 2019** — Earlier RCT establishing efficacy, foundational study for comparison. ✅ INCLUDE

7. **Thompson et al. 2023** — Adaptive platform trial, novel design but meets criteria. ✅ INCLUDE

8. **Garcia et al. 2021** — Pragmatic RCT in real-world setting, good generalizability. ✅ INCLUDE

---

### EXCLUDED Studies (n=4)

9. **Williams 2020** — Narrative review, not primary study. ❌ EXCLUDE (Wrong study type)

10. **Brown et al. 2018** — Pediatric population only (<18 years). ❌ EXCLUDE (Wrong population)

11. **Davis 2022** — Conference abstract, no full data available. ❌ EXCLUDE (Insufficient data)

12. **Kumar et al. 2021** — Observational cohort design, not RCT. ❌ EXCLUDE (Wrong study design)`;

function PRISMADiagram({ identified, screened, included }: { identified: number; screened: number; included: number }) {
  const excluded = Math.max(0, identified - screened);
  const excludedFull = Math.max(0, screened - included);

  const box = (text: string, count: number, color: string) => (
    <div
      className="rounded-lg border p-3 text-center"
      style={{ borderColor: color + '40', backgroundColor: color + '10' }}
    >
      <div className="text-lg font-bold font-playfair" style={{ color }}>{count}</div>
      <div className="text-xs text-[#8b9ab0] font-dm mt-0.5">{text}</div>
    </div>
  );

  return (
    <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5">
      <h3 className="font-playfair text-base font-semibold text-[#dde4ee] mb-4">PRISMA Flow Diagram</h3>
      <div className="flex flex-col items-center gap-3">
        {box('Identified via databases', identified, '#2d6be4')}
        <div className="w-0.5 h-4 bg-[#1f2d45]" />
        {box('Screened (after deduplication)', screened, '#c9952a')}
        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-0.5 h-4 bg-[#1f2d45]" />
            {box('Excluded (title/abstract)', excluded, '#c94040')}
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-0.5 h-4 bg-[#1f2d45]" />
            {box('Full text assessed', screened - excluded, '#0d9e6e')}
          </div>
        </div>
        <div className="w-0.5 h-4 bg-[#1f2d45]" />
        {box(`Included in synthesis`, included, '#0d9e6e')}
      </div>
    </div>
  );
}

export function SystematicReview() {
  const [activeStage, setActiveStage] = useState<StageId>(1);
  const [completedStages, setCompletedStages] = useState<Set<StageId>>(new Set());
  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('');
  const [population, setPopulation] = useState('');
  const [intervention, setIntervention] = useState('');
  const [comparator, setComparator] = useState('');
  const [outcome, setOutcome] = useState('');
  const [abstracts, setAbstracts] = useState('');
  const [inclusionCriteria, setInclusionCriteria] = useState('');
  const [exclusionCriteria, setExclusionCriteria] = useState('');
  const [prismaChecked, setPrismaChecked] = useState<Set<number>>(new Set());
  const [prismaNumbers, setPrismaNumbers] = useState({ identified: 1247, screened: 312, included: 28 });

  const { key, status } = useApiKey();
  const { addToast } = useToast();
  const { content, isStreaming, error, startStream, reset } = useStream({
    onError: (err) => addToast({ type: 'error', title: 'AI error', message: err }),
  });

  const completeStage = (stage: StageId) => {
    setCompletedStages((prev) => new Set([...prev, stage]));
    if (stage < 5) setActiveStage((stage + 1) as StageId);
  };

  const handleGenerateProtocol = useCallback(async () => {
    reset();
    if (status === 'demo') return;
    if (!key) {
      addToast({ type: 'error', title: 'No API key required' });
      return;
    }
    await startStream(
      [{
        role: 'user',
        content: `Generate a comprehensive systematic review protocol for:
Title: ${title || '[Your Review Title]'}
Background: ${background || '[Background context]'}
PICO:
- Population: ${population || '[Population]'}
- Intervention: ${intervention || '[Intervention]'}
- Comparator: ${comparator || '[Comparator]'}
- Outcome: ${outcome || '[Outcome]'}

Include all PRISMA 2020 required protocol elements.`,
      }],
      'You are a systematic review methodologist. Generate a complete, PROSPERO-ready review protocol following PRISMA 2020 guidelines. Use ## for section headers.',
      key
    );
  }, [title, background, population, intervention, comparator, outcome, status, key, reset, startStream, addToast]);

  const handleScreenAbstracts = useCallback(async () => {
    reset();
    if (!abstracts.trim()) {
      addToast({ type: 'warning', title: 'No abstracts', message: 'Paste abstracts to screen.' });
      return;
    }
    if (status === 'demo') return;
    if (!key) return;
    await startStream(
      [{
        role: 'user',
        content: `Screen the following abstracts against these criteria:
Inclusion: ${inclusionCriteria || 'RCTs, adults, relevant intervention'}
Exclusion: ${exclusionCriteria || 'Non-RCT, pediatric, wrong outcome'}

For each abstract, provide INCLUDE or EXCLUDE with specific reason.

ABSTRACTS:
${abstracts}`,
      }],
      'You are a systematic review screener. Apply inclusion/exclusion criteria rigorously. For each abstract: state the decision (INCLUDE/EXCLUDE) and cite the specific criterion met/violated. Be consistent.',
      key
    );
  }, [abstracts, inclusionCriteria, exclusionCriteria, status, key, reset, startStream, addToast]);

  const totalPrismaItems = PRISMA_ITEMS.reduce((sum, s) => sum + s.items.length, 0);
  const prismaCompliance = Math.round((prismaChecked.size / totalPrismaItems) * 100);

  return (
    <div className="space-y-6">
      {/* Stage stepper */}
      <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5">
        <div className="flex items-center gap-2 overflow-x-auto">
          {STAGES.map((stage, i) => {
            const isCompleted = completedStages.has(stage.id);
            const isActive = activeStage === stage.id;

            return (
              <div key={stage.id} className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setActiveStage(stage.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all font-dm text-sm font-medium ${
                    isActive
                      ? 'text-white'
                      : isCompleted
                      ? 'text-[#8b9ab0] hover:text-[#dde4ee]'
                      : 'text-[#5a6a80] hover:text-[#8b9ab0]'
                  }`}
                  style={isActive ? { backgroundColor: stage.color + '20', border: `1px solid ${stage.color}40` } : { border: '1px solid transparent' }}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" style={{ color: stage.color }} />
                  ) : (
                    <Circle className="w-4 h-4" style={{ color: isActive ? stage.color : '#5a6a80' }} />
                  )}
                  <span>{stage.name}</span>
                </button>
                {i < STAGES.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-[#1f2d45] flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage content */}
      <AnimatePresence mode="wait">
        {/* Stage 1: Protocol */}
        {activeStage === 1 && (
          <motion.div
            key="stage1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5">
                <h3 className="font-playfair text-base font-semibold text-[#dde4ee] mb-4">PICO Builder</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#5a6a80] font-dm mb-1 uppercase tracking-wider">Review Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Effectiveness of X vs Y in Z patients..."
                      className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm placeholder:text-[#5a6a80] focus:outline-none focus:border-[#c9952a]/60"
                    />
                  </div>
                  {[
                    { label: 'P — Population', value: population, setter: setPopulation, placeholder: 'Adults with type 2 diabetes, aged ≥18' },
                    { label: 'I — Intervention', value: intervention, setter: setIntervention, placeholder: 'Metformin 500-2000mg/day' },
                    { label: 'C — Comparator', value: comparator, setter: setComparator, placeholder: 'Placebo or lifestyle intervention' },
                    { label: 'O — Outcome', value: outcome, setter: setOutcome, placeholder: 'HbA1c reduction at 6 months' },
                  ].map(({ label, value, setter, placeholder }) => (
                    <div key={label}>
                      <label className="block text-xs text-[#5a6a80] font-dm mb-1 uppercase tracking-wider">{label}</label>
                      <input
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm placeholder:text-[#5a6a80] focus:outline-none focus:border-[#c9952a]/60"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-[#5a6a80] font-dm mb-1 uppercase tracking-wider">Background / Rationale</label>
                    <textarea
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      placeholder="Brief background on the clinical problem and why this review is needed..."
                      className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm placeholder:text-[#5a6a80] focus:outline-none focus:border-[#c9952a]/60 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <motion.button
                    onClick={handleGenerateProtocol}
                    disabled={isStreaming}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium font-dm disabled:opacity-60"
                    style={{ backgroundColor: '#c9952a', color: '#07090f' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Play className="w-3.5 h-3.5" />
                    Generate Protocol
                  </motion.button>
                  <button
                    onClick={() => completeStage(1)}
                    className="px-4 py-2 rounded-lg text-sm font-medium font-dm border border-[#0d9e6e]/40 text-[#0d9e6e] hover:bg-[#0d9e6e]/10 transition-colors"
                  >
                    Mark Complete →
                  </button>
                </div>
              </div>
            </div>

            <div>
              <ResultStream
                content={status === 'demo' ? DEMO_PROTOCOL : content}
                isStreaming={isStreaming}
                error={error}
                placeholder="Fill in the PICO fields and click Generate Protocol to create a PROSPERO-ready systematic review protocol."
                maxHeight="600px"
              />
            </div>
          </motion.div>
        )}

        {/* Stage 2: Search */}
        {activeStage === 2 && (
          <motion.div
            key="stage2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5 space-y-4">
              <h3 className="font-playfair text-base font-semibold text-[#dde4ee]">Search Tracking</h3>
              {[
                { db: 'PubMed', color: '#2d6be4' },
                { db: 'EMBASE', color: '#ec4899' },
                { db: 'CENTRAL', color: '#0d9e6e' },
                { db: 'Web of Science', color: '#06b6d4' },
                { db: 'Scopus', color: '#8b5cf6' },
              ].map(({ db, color }) => (
                <div key={db} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-sm text-[#8b9ab0] font-dm w-32">{db}</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-20 bg-[#111827] border border-[#1f2d45] rounded px-2 py-1 text-sm text-[#dde4ee] font-mono text-right focus:outline-none"
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setPrismaNumbers((prev) => ({ ...prev, identified: prev.identified + val }));
                    }}
                  />
                  <span className="text-xs text-[#5a6a80] font-dm">results</span>
                </div>
              ))}
              <div className="border-t border-[#1f2d45] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#dde4ee] font-dm">Total Identified</span>
                  <span className="text-lg font-bold font-playfair text-[#c9952a]">{prismaNumbers.identified.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => completeStage(2)}
                className="w-full py-2 rounded-lg text-sm font-medium font-dm border border-[#0d9e6e]/40 text-[#0d9e6e] hover:bg-[#0d9e6e]/10 transition-colors"
              >
                Mark Search Complete →
              </button>
            </div>
            <PRISMADiagram {...prismaNumbers} />
          </motion.div>
        )}

        {/* Stage 3: Screening */}
        {activeStage === 3 && (
          <motion.div
            key="stage3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5 space-y-4">
              <h3 className="font-playfair text-base font-semibold text-[#dde4ee]">Abstract Screening</h3>
              <div>
                <label className="block text-xs text-[#5a6a80] font-dm mb-1.5 uppercase tracking-wider">Inclusion Criteria</label>
                <textarea
                  value={inclusionCriteria}
                  onChange={(e) => setInclusionCriteria(e.target.value)}
                  placeholder="RCTs, adults ≥18, relevant intervention, ≥6 months follow-up"
                  className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm placeholder:text-[#5a6a80] focus:outline-none resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs text-[#5a6a80] font-dm mb-1.5 uppercase tracking-wider">Exclusion Criteria</label>
                <textarea
                  value={exclusionCriteria}
                  onChange={(e) => setExclusionCriteria(e.target.value)}
                  placeholder="Non-RCT designs, pediatric populations, conference abstracts"
                  className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm placeholder:text-[#5a6a80] focus:outline-none resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs text-[#5a6a80] font-dm mb-1.5 uppercase tracking-wider">Paste Abstracts to Screen</label>
                <textarea
                  value={abstracts}
                  onChange={(e) => setAbstracts(e.target.value)}
                  placeholder="1. [Title] Authors et al. [Journal] [Year]\n[Abstract text]\n\n2. [Title] Authors et al..."
                  className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm placeholder:text-[#5a6a80] focus:outline-none resize-none font-mono"
                  rows={6}
                />
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={handleScreenAbstracts}
                  disabled={isStreaming}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium font-dm disabled:opacity-60"
                  style={{ backgroundColor: '#0d9e6e', color: '#fff' }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Play className="w-3.5 h-3.5" />
                  Screen Abstracts
                </motion.button>
                <button
                  onClick={() => completeStage(3)}
                  className="px-4 py-2 rounded-lg text-sm font-medium font-dm border border-[#0d9e6e]/40 text-[#0d9e6e] hover:bg-[#0d9e6e]/10"
                >
                  Mark Complete →
                </button>
              </div>
            </div>
            <ResultStream
              content={status === 'demo' ? DEMO_SCREENING : content}
              isStreaming={isStreaming}
              error={error}
              placeholder="Paste abstracts above and click Screen to apply AI-assisted inclusion/exclusion screening."
              maxHeight="600px"
            />
          </motion.div>
        )}

        {/* Stage 4: Data Extraction */}
        {activeStage === 4 && (
          <motion.div
            key="stage4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-playfair text-base font-semibold text-[#dde4ee]">Data Extraction Template</h3>
                <button
                  onClick={() => completeStage(4)}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium font-dm border border-[#0d9e6e]/40 text-[#0d9e6e] hover:bg-[#0d9e6e]/10"
                >
                  Mark Complete →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-dm">
                  <thead>
                    <tr className="border-b border-[#1f2d45]">
                      {['Study', 'Year', 'Design', 'N', 'Population', 'Intervention', 'Comparator', 'Outcomes', 'Follow-up', 'RoB'].map((h) => (
                        <th key={h} className="text-left py-2 px-3 text-[#5a6a80] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['Study 1', 'Study 2', 'Study 3'].map((s, i) => (
                      <tr key={i} className="border-b border-[#1f2d45]/50">
                        {Array(10).fill(0).map((_, j) => (
                          <td key={j} className="py-2 px-1">
                            <input
                              className="w-full bg-[#111827] border border-[#1f2d45] rounded px-2 py-1 text-[#dde4ee] focus:outline-none focus:border-[#c9952a]/60 text-xs font-dm"
                              placeholder={j === 0 ? s : '—'}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RoB Assessment */}
            <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5">
              <h3 className="font-playfair text-base font-semibold text-[#dde4ee] mb-4">Risk of Bias (Cochrane RoB 2)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-dm">
                  <thead>
                    <tr className="border-b border-[#1f2d45]">
                      <th className="text-left py-2 px-3 text-[#5a6a80]">Study</th>
                      {['Randomization', 'Deviations', 'Missing data', 'Measurement', 'Reporting', 'Overall'].map((d) => (
                        <th key={d} className="text-left py-2 px-3 text-[#5a6a80] whitespace-nowrap">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['Study 1', 'Study 2', 'Study 3'].map((s, i) => (
                      <tr key={i} className="border-b border-[#1f2d45]/50">
                        <td className="py-2 px-3 text-[#dde4ee]">{s}</td>
                        {Array(6).fill(0).map((_, j) => (
                          <td key={j} className="py-2 px-3">
                            <select className="bg-[#111827] border border-[#1f2d45] rounded px-1.5 py-1 text-xs text-[#dde4ee] focus:outline-none">
                              <option value="">—</option>
                              <option value="low">🟢 Low</option>
                              <option value="some">🟡 Some concern</option>
                              <option value="high">🔴 High</option>
                            </select>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stage 5: Synthesize */}
        {activeStage === 5 && (
          <motion.div
            key="stage5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {/* PRISMA Checklist */}
            <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2d45]">
                <div>
                  <h3 className="font-playfair text-base font-semibold text-[#dde4ee]">PRISMA 2020 Checklist</h3>
                  <p className="text-xs text-[#5a6a80] font-dm mt-0.5">{prismaChecked.size}/{totalPrismaItems} items completed</p>
                </div>
                <div className="w-24">
                  <ProgressBar value={prismaCompliance} color="green" animate={false} size="sm" />
                  <div className="text-center text-xs text-[#0d9e6e] font-dm mt-1">{prismaCompliance}%</div>
                </div>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '520px' }}>
                {PRISMA_ITEMS.map((section) => (
                  <div key={section.section}>
                    <div className="px-5 py-2 bg-[#111827] border-b border-[#1f2d45]">
                      <span className="text-[10px] text-[#5a6a80] font-dm uppercase tracking-widest">{section.section}</span>
                    </div>
                    {section.items.map((item) => (
                      <div
                        key={item.num}
                        className="flex items-start gap-3 px-5 py-3 border-b border-[#1f2d45]/50 hover:bg-[#111827]/60"
                      >
                        <input
                          type="checkbox"
                          checked={prismaChecked.has(item.num)}
                          onChange={() => {
                            setPrismaChecked((prev) => {
                              const next = new Set(prev);
                              if (next.has(item.num)) next.delete(item.num);
                              else next.add(item.num);
                              return next;
                            });
                          }}
                          className="mt-0.5 accent-[#0d9e6e] flex-shrink-0"
                        />
                        <div>
                          <span className="text-[10px] text-[#5a6a80] font-dm font-bold mr-2">#{item.num}</span>
                          <span className="text-xs text-[#8b9ab0] font-dm">{item.req}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative synthesis */}
            <div className="space-y-4">
              <PRISMADiagram {...prismaNumbers} />
              <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-playfair text-sm font-semibold text-[#dde4ee]">Narrative Synthesis</h3>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={async () => {
                        reset();
                        if (status === 'demo' || !key) return;
                        await startStream(
                          [{ role: 'user', content: 'Generate a narrative synthesis section for a systematic review.' }],
                          'Generate a comprehensive narrative synthesis for a systematic review including: summary of included studies, direction and consistency of findings, quality of evidence (GRADE approach), and clinical implications. Use ## for section headers.',
                          key
                        );
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm font-medium rounded-lg"
                      style={{ backgroundColor: '#c97d2a', color: '#07090f' }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Play className="w-3 h-3" />
                      Generate
                    </motion.button>
                    <button onClick={reset} className="p-1.5 text-[#5a6a80] hover:text-[#8b9ab0]">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <ResultStream
                  content={content}
                  isStreaming={isStreaming}
                  error={error}
                  placeholder="Click Generate to create a narrative synthesis, or write your own below."
                  maxHeight="300px"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
