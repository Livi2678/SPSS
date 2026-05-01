'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ExternalLink, CheckCircle, AlertCircle, XCircle, Search } from 'lucide-react';
import { useApiKey } from '@/hooks/useApiKey';
import { useStream } from '@/hooks/useStream';
import { ResultStream } from '@/components/ui/ResultStream';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import type { Guideline } from '@/types';

const GUIDELINES: Guideline[] = [
  {
    id: 'prisma',
    name: 'PRISMA',
    fullName: 'Preferred Reporting Items for Systematic Reviews and Meta-Analyses',
    description: 'For systematic reviews and meta-analyses. Covers search strategy, study selection, data extraction, and synthesis.',
    studyType: 'Systematic Review / Meta-Analysis',
    itemCount: 27,
    color: '#2d6be4',
  },
  {
    id: 'consort',
    name: 'CONSORT',
    fullName: 'Consolidated Standards of Reporting Trials',
    description: 'For randomized controlled trials. Includes SPIRIT extension for protocols and additional checklists for cluster RCTs.',
    studyType: 'Randomized Controlled Trial',
    itemCount: 25,
    color: '#0d9e6e',
  },
  {
    id: 'strobe',
    name: 'STROBE',
    fullName: 'Strengthening the Reporting of Observational Studies in Epidemiology',
    description: 'For cohort, case-control, and cross-sectional studies. Identifies required elements for transparent reporting.',
    studyType: 'Observational Studies',
    itemCount: 22,
    color: '#c97d2a',
  },
  {
    id: 'stard',
    name: 'STARD',
    fullName: 'Standards for Reporting Diagnostic Accuracy Studies',
    description: 'For studies evaluating diagnostic tests and biomarkers. Includes flowchart requirements.',
    studyType: 'Diagnostic Accuracy Study',
    itemCount: 30,
    color: '#8b5cf6',
  },
  {
    id: 'tripod',
    name: 'TRIPOD',
    fullName: 'Transparent Reporting of a Multivariable Prediction Model',
    description: 'For prediction model development and validation studies, including clinical decision tools.',
    studyType: 'Prediction Models',
    itemCount: 22,
    color: '#c9952a',
  },
  {
    id: 'spirit',
    name: 'SPIRIT',
    fullName: 'Standard Protocol Items: Recommendations for Interventional Trials',
    description: 'For clinical trial protocols. Ensures complete protocol documentation before trial commencement.',
    studyType: 'Clinical Trial Protocol',
    itemCount: 33,
    color: '#ec4899',
  },
  {
    id: 'care',
    name: 'CARE',
    fullName: 'CAse REport Reporting Guidelines',
    description: 'For case reports and case series. Ensures all essential clinical information is reported.',
    studyType: 'Case Report / Case Series',
    itemCount: 13,
    color: '#06b6d4',
  },
  {
    id: 'arrive',
    name: 'ARRIVE',
    fullName: 'Animal Research: Reporting of In Vivo Experiments',
    description: 'For animal research studies. Improves transparency and reproducibility of preclinical research.',
    studyType: 'Animal Studies',
    itemCount: 21,
    color: '#84cc16',
  },
];

const DEMO_CHECK = `## CONSORT Compliance Report

**Guideline:** CONSORT 2010 — Randomized Controlled Trials
**Overall Compliance: 72% (18/25 items)**

---

### ✅ Present & Complete (18 items)

**Item 1a** — Trial title identifying as RCT: ✅ Present — "...randomized controlled trial" in title

**Item 2a** — Scientific background and explanation of rationale: ✅ Present — Introduction paragraphs 2-3

**Item 3a** — Description of trial design: ✅ Present — "parallel-group, double-blind, placebo-controlled RCT" (Methods, line 45)

**Item 4a** — Eligibility criteria for participants: ✅ Present — Inclusion/exclusion criteria clearly listed (Methods, Table 1)

**Item 5** — Interventions with detail sufficient to allow replication: ✅ Present — Dosing, timing, and administration described

**Item 7a** — Sample size determination: ✅ Present — Power calculation with assumptions stated (Methods, line 89)

**Item 8a** — Sequence generation method: ✅ Present — "computer-generated random number sequence"

**Item 9** — Allocation concealment mechanism: ✅ Present — Opaque sealed envelopes described

**Item 11a** — Blinding method: ✅ Present — Double-blind with identical placebo described

**Item 13a** — Participant flow diagram: ✅ Present — Figure 1 is CONSORT flow diagram

---

### ⚠️ Partially Present (4 items)

**Item 6a** — Primary and secondary outcomes: ⚠️ **PARTIAL** — Primary outcome defined but secondary outcomes listed without pre-specified hierarchy
*Fix:* Explicitly state which outcomes are primary vs secondary and cite your trial registration where outcomes are pre-specified

**Item 12a** — Statistical methods: ⚠️ **PARTIAL** — Main analysis described but missing specification of subgroup analysis methods
*Fix:* Add sentence: "Subgroup analyses were pre-specified and tested for interaction using [test]. These were exploratory and results should be interpreted with caution."

**Item 14a** — Dates defining period of recruitment: ⚠️ **PARTIAL** — Start date given but end date missing
*Fix:* Add: "Recruitment was conducted from [start] to [end date]"

**Item 25** — Registration number and name of trial registry: ⚠️ **PARTIAL** — NCT number present but missing registration date
*Fix:* Add registration date to confirm prospective registration

---

### ❌ Missing (3 items)

**Item 6b** — Any changes to trial outcomes after trial commencement: ❌ **MISSING** — No protocol deviation statement
*Fix:* Add to Methods: "No changes were made to trial outcomes after commencement" OR document any changes made

**Item 16** — For each group, numbers analyzed for each outcome: ❌ **MISSING** — Table 2 presents results without denominator per outcome
*Fix:* Revise results tables to include n analyzed for each outcome, not just n randomized

**Item 19** — All important harms or unintended effects in each group: ❌ **MISSING** — Adverse events section lacks systematic reporting format
*Fix:* Add complete adverse events table: [Event Type | Intervention n (%) | Control n (%) | p-value]

---

### Priority Fixes
1. ❌ Add adverse events table (Item 19) — Required for all Q1 clinical journals
2. ❌ Add analyzed n per outcome in results tables (Item 16)
3. ❌ Add protocol deviation/amendment statement (Item 6b)
4. ⚠️ Clarify outcome hierarchy in Methods (Item 6a)`;

const DEMO_JOURNAL = `## Journal Profile: JAMA (Journal of the American Medical Association)

**Impact Factor (2024):** 63.1
**Publisher:** American Medical Association
**ISSN:** 0098-7484 (print), 1538-3598 (online)
**Acceptance Rate:** ~5%

---

### Word Limits
| Article Type | Word Limit | Abstract | References |
|---|---|---|---|
| Original Investigation | 3,000 | 350 (structured) | 40 max |
| Research Letter | 800 | No abstract | 5 max |
| Brief Report | 1,500 | 150 (unstructured) | 15 max |
| Review | 3,500 | 350 (structured) | 100 max |
| Viewpoint | 1,200 | No abstract | 15 max |

### Structure Requirements
1. Title (≤150 characters, no abbreviations)
2. Abstract (structured: Background, Objective, Design/Setting/Participants, Interventions, Main Outcomes and Measures, Results, Conclusions and Relevance)
3. Introduction (no heading — ≤3 paragraphs)
4. Methods (Study Design → Participants → Exposures/Interventions → Outcomes → Statistical Analysis)
5. Results
6. Discussion (Main findings → Limitations → Conclusions)
7. No standalone "Conclusion" section (part of Discussion)

### Required Statements
- IRB/Ethics approval with protocol number
- CONSORT/STROBE/PRISMA compliance statement
- ClinicalTrials.gov registration (mandatory for clinical trials)
- Conflict of interest disclosure (ICMJE form)
- Data availability statement
- Code availability (if applicable)

### Article Processing Charges (APC)
- Subscription model: $0 APC for standard publication
- Open Access (CC-BY): $5,000 USD
- Open Access (CC-BY-NC): $3,000 USD

### Key Rejection Reasons
1. Does not address a clinically important question
2. Limited generalizability (single-center, small N)
3. Inadequate statistical rigor
4. Does not change clinical practice or policy
5. Previous publication of same data

### Contact
- Editorial office: manuscriptsubmission@jamanetwork.org
- Submission system: JAMA Author Portal (via AMA system)`;

export function GuidelinesChecker() {
  const [selectedGuideline, setSelectedGuideline] = useState<Guideline | null>(null);
  const [manuscriptText, setManuscriptText] = useState('');
  const [journalQuery, setJournalQuery] = useState('');
  const [activeView, setActiveView] = useState<'check' | 'journal'>('check');

  const { key, status } = useApiKey();
  const { addToast } = useToast();
  const { content, isStreaming, error, startStream, reset } = useStream({
    onError: (err) => addToast({ type: 'error', title: 'AI error', message: err }),
  });

  const handleCheck = useCallback(async () => {
    if (!selectedGuideline) {
      addToast({ type: 'warning', title: 'No guideline selected', message: 'Click a guideline card first.' });
      return;
    }
    if (!manuscriptText.trim()) {
      addToast({ type: 'warning', title: 'No manuscript text', message: 'Paste your manuscript text.' });
      return;
    }
    reset();
    if (status === 'demo') return;
    if (!key) { addToast({ type: 'error', title: 'No API key' }); return; }

    await startStream(
      [{
        role: 'user',
        content: `Check this manuscript for compliance with ${selectedGuideline.name} (${selectedGuideline.fullName}) guidelines.

For EACH of the ${selectedGuideline.itemCount} checklist items, determine:
1. Is it Present (✅), Partially Present (⚠️), or Missing (❌)?
2. If present: cite the location (section, paragraph, table number)
3. If partial/missing: provide specific fix instructions

MANUSCRIPT TEXT:
${manuscriptText.slice(0, 8000)}`,
      }],
      `You are a ${selectedGuideline.name} compliance expert. Systematically check each of the ${selectedGuideline.itemCount} ${selectedGuideline.name} items. Use ✅ for Present, ⚠️ for Partial, ❌ for Missing. Group by Present/Partial/Missing sections. End with Priority Fixes list.`,
      key
    );
  }, [selectedGuideline, manuscriptText, status, key, reset, startStream, addToast]);

  const handleJournalLookup = useCallback(async () => {
    if (!journalQuery.trim()) return;
    reset();
    if (status === 'demo') return;
    if (!key) { addToast({ type: 'error', title: 'No API key' }); return; }
    await startStream(
      [{ role: 'user', content: `Provide detailed submission requirements for: ${journalQuery}` }],
      'You are an expert on academic journal submission requirements. Provide: impact factor, word limits by article type, structure requirements, required statements (ethics, CONSORT, etc.), APC, typical acceptance rate, common rejection reasons, submission system. Present in organized tables where appropriate.',
      key
    );
  }, [journalQuery, status, key, reset, startStream, addToast]);

  return (
    <div className="flex gap-6">
      {/* Left: Guideline cards + controls */}
      <div className="w-72 flex-shrink-0 space-y-4">
        {/* View toggle */}
        <div className="flex gap-1 p-1 bg-[#0d1117] rounded-xl border border-[#1f2d45]">
          <button
            onClick={() => setActiveView('check')}
            className={`flex-1 py-2 rounded-lg text-xs font-dm font-medium transition-all ${
              activeView === 'check'
                ? 'bg-[#111827] text-[#dde4ee] border border-[#1f2d45]'
                : 'text-[#5a6a80] hover:text-[#8b9ab0]'
            }`}
          >
            Check Compliance
          </button>
          <button
            onClick={() => setActiveView('journal')}
            className={`flex-1 py-2 rounded-lg text-xs font-dm font-medium transition-all ${
              activeView === 'journal'
                ? 'bg-[#111827] text-[#dde4ee] border border-[#1f2d45]'
                : 'text-[#5a6a80] hover:text-[#8b9ab0]'
            }`}
          >
            Journal Lookup
          </button>
        </div>

        {/* Guideline cards */}
        {activeView === 'check' && (
          <div className="space-y-2">
            {GUIDELINES.map((gl) => (
              <motion.button
                key={gl.id}
                onClick={() => setSelectedGuideline(selectedGuideline?.id === gl.id ? null : gl)}
                className="w-full text-left rounded-lg p-3 border transition-all"
                style={
                  selectedGuideline?.id === gl.id
                    ? { borderColor: gl.color + '60', backgroundColor: gl.color + '10' }
                    : { borderColor: '#1f2d45', backgroundColor: '#0d1117' }
                }
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className="text-xs font-bold font-dm"
                    style={{ color: selectedGuideline?.id === gl.id ? gl.color : '#dde4ee' }}
                  >
                    {gl.name}
                  </span>
                  <Badge variant="dim">{gl.itemCount} items</Badge>
                </div>
                <p className="text-[10px] text-[#5a6a80] font-dm leading-relaxed">{gl.studyType}</p>
              </motion.button>
            ))}
          </div>
        )}

        {activeView === 'journal' && (
          <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-4 space-y-3">
            <h3 className="font-playfair text-sm font-semibold text-[#dde4ee]">Journal Lookup</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6a80]" />
              <input
                type="text"
                value={journalQuery}
                onChange={(e) => setJournalQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJournalLookup()}
                placeholder="JAMA, Lancet, BMJ..."
                className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg pl-10 pr-3 py-2 text-sm text-[#dde4ee] font-dm placeholder:text-[#5a6a80] focus:outline-none"
              />
            </div>
            <motion.button
              onClick={handleJournalLookup}
              disabled={isStreaming || !journalQuery.trim()}
              className="w-full py-2 rounded-lg text-xs font-medium font-dm disabled:opacity-60"
              style={{ backgroundColor: '#c9952a', color: '#07090f' }}
              whileHover={{ scale: 1.02 }}
            >
              Look Up Requirements
            </motion.button>
            <div className="space-y-1">
              <p className="text-[10px] text-[#5a6a80] font-dm uppercase tracking-wider">Quick access</p>
              {['JAMA', 'NEJM', 'Lancet', 'BMJ', 'Nature Medicine', 'PLOS ONE'].map((j) => (
                <button
                  key={j}
                  onClick={() => { setJournalQuery(j); }}
                  className="block w-full text-left text-xs text-[#8b9ab0] font-dm hover:text-[#c9952a] transition-colors py-0.5"
                >
                  {j}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: content area */}
      <div className="flex-1 min-w-0 space-y-5">
        {activeView === 'check' && (
          <>
            {/* Selected guideline info */}
            <AnimatePresence mode="wait">
              {selectedGuideline ? (
                <motion.div
                  key={selectedGuideline.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl p-4 border"
                  style={{
                    borderColor: selectedGuideline.color + '40',
                    backgroundColor: selectedGuideline.color + '08',
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-playfair text-base font-bold" style={{ color: selectedGuideline.color }}>
                          {selectedGuideline.name}
                        </span>
                        <Badge variant="dim">{selectedGuideline.itemCount} items</Badge>
                        <Badge variant="dim">{selectedGuideline.studyType}</Badge>
                      </div>
                      <p className="text-xs text-[#8b9ab0] font-dm">{selectedGuideline.fullName}</p>
                      <p className="text-xs text-[#5a6a80] font-dm mt-1">{selectedGuideline.description}</p>
                    </div>
                    <a
                      href={`https://www.equator-network.org/reporting-guidelines/${selectedGuideline.name.toLowerCase()}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-xs text-[#5a6a80] hover:text-[#8b9ab0] flex items-center gap-1 transition-colors"
                    >
                      Full checklist
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-6 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">📋</div>
                    <p className="text-sm text-[#5a6a80] font-dm">Select a reporting guideline from the left panel</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Manuscript input */}
            <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-medium text-[#8b9ab0] font-dm uppercase tracking-wider">Manuscript Text</label>
                <span className="text-xs text-[#5a6a80] font-dm">{manuscriptText.length} chars</span>
              </div>
              <textarea
                value={manuscriptText}
                onChange={(e) => setManuscriptText(e.target.value)}
                placeholder="Paste your manuscript text here for compliance checking..."
                className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2.5 text-sm text-[#dde4ee] font-dm placeholder:text-[#5a6a80] focus:outline-none focus:border-[#c9952a]/60 resize-none"
                rows={6}
              />
              <motion.button
                onClick={handleCheck}
                disabled={isStreaming || !selectedGuideline || !manuscriptText.trim()}
                className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium font-dm disabled:opacity-60"
                style={{ backgroundColor: selectedGuideline ? selectedGuideline.color : '#c9952a', color: '#fff' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Play className="w-4 h-4" />
                Check {selectedGuideline?.name || 'Guideline'} Compliance
              </motion.button>
            </div>

            {/* Results */}
            <ResultStream
              content={status === 'demo' ? DEMO_CHECK : content}
              isStreaming={isStreaming}
              error={error}
              placeholder="Select a guideline and paste your manuscript to receive a detailed compliance report with item-by-item analysis and specific fix instructions."
              maxHeight="500px"
            />
          </>
        )}

        {activeView === 'journal' && (
          <>
            <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5">
              <h3 className="font-playfair text-base font-semibold text-[#dde4ee] mb-2">Journal Requirements Database</h3>
              <p className="text-sm text-[#8b9ab0] font-dm">
                Search any academic journal to retrieve word limits, structure requirements, required statements, APCs, and submission guidelines.
              </p>
            </div>

            <ResultStream
              content={status === 'demo' ? DEMO_JOURNAL : content}
              isStreaming={isStreaming}
              error={error}
              placeholder="Search for a journal in the left panel to retrieve its full submission requirements."
              maxHeight="600px"
            />
          </>
        )}
      </div>
    </div>
  );
}
