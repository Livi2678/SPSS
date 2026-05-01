'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, RotateCcw, ChevronDown } from 'lucide-react';
import { useStream } from '@/hooks/useStream';
import { useApiKey } from '@/hooks/useApiKey';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ResultStream } from '@/components/ui/ResultStream';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { useToast } from '@/components/ui/Toast';
import type { ManuscriptScore } from '@/types';

const DISCIPLINES = [
  'Cardiology', 'Oncology', 'Neuroscience', 'Immunology', 'Endocrinology',
  'Epidemiology', 'Public Health', 'Psychiatry', 'Pharmacology', 'Genetics',
  'Radiology', 'Surgery', 'Emergency Medicine', 'Pediatrics', 'Geriatrics',
  'Infectious Disease', 'Rheumatology', 'Nephrology', 'Gastroenterology',
  'Pulmonology', 'Hematology', 'Dermatology', 'Orthopedics', 'Ophthalmology',
  'Biomedical Engineering', 'Bioinformatics', 'Biochemistry', 'Pathology',
  'Obstetrics', 'Psychology', 'Economics', 'Sociology', 'Education',
  'Computer Science', 'Physics', 'Chemistry', 'Environmental Science',
  'Nutrition', 'Sports Medicine', 'Anesthesiology', 'Urology', 'ENT',
  'Dentistry', 'Nursing', 'Physiotherapy',
];

const MANUSCRIPT_TYPES = [
  'Original Research Article',
  'Systematic Review',
  'Meta-Analysis',
  'Randomized Controlled Trial',
  'Cohort Study',
  'Case-Control Study',
  'Cross-Sectional Study',
  'Case Report / Case Series',
  'Review Article',
  'Letter to Editor',
  'Short Communication',
  'Technical Note',
  'Methodology Paper',
];

const SECTIONS = [
  'Full Manuscript',
  'Abstract Only',
  'Introduction',
  'Methods Section',
  'Results Section',
  'Discussion Section',
  'Conclusion',
];

const DEMO_OUTPUT = `## Overall Verdict
**Score: 67/100 — Major Revision Required**

This manuscript presents an interesting investigation into troponin elevation patterns in non-ST elevation myocardial infarction (NSTEMI) patients, but falls short of Q1 cardiology journal standards in several critical areas. The core hypothesis is clinically relevant, but methodological weaknesses undermine the conclusions.

SCORES: SR:62 N:71 M:58 C:74 ST:65

## Score Breakdown
- **Scientific Rigor: 62/100** — Adequate for a pilot study but insufficient for major journals
- **Novelty & Impact: 71/100** — Clinically meaningful question with incremental contribution
- **Methods Quality: 58/100** — Critical statistical and design flaws identified
- **Writing Clarity: 74/100** — Clear prose, minor inconsistencies in terminology
- **Structure: 65/100** — Logical flow disrupted by misplaced sub-analyses

## Desk Rejection Risks
1. **CRITICAL — Underpowered study**: Sample size of n=87 is insufficient for multivariate logistic regression with 8 predictors (minimum n=320 required by EPV=10 rule). JACC, Circulation, and EHJ will auto-reject underpowered studies without justification.
2. **HIGH — No pre-registration**: Observational studies with post-hoc analyses require PROSPERO registration. Missing registration is an automatic reject flag at most Q1 journals since 2022.
3. **HIGH — Missing sensitivity analyses**: No intention-to-treat analysis reported. No analysis excluding patients who received intervention within 12h.
4. **MEDIUM — Outdated references**: 4 of your 6 foundational references are >8 years old. Current landscape (2021-2024) literature is underrepresented.
5. **LOW — Abbreviation inconsistency**: NSTEMI vs. non-STEMI used interchangeably across sections (use one form consistently).

## Methods & Statistics Check
The Mann-Whitney U test was correctly applied for non-normal continuous variables. However, your primary outcome analysis uses Pearson correlation when Spearman would be more appropriate given the non-normal distribution of troponin values (Shapiro-Wilk p<0.05, per your Table 1). This is a correctable error but requires re-running the analysis.

**Critical issues to address:**
- Logistic regression violated the assumption of no multicollinearity (VIF not reported)
- C-statistic/AUC reported without confidence intervals
- Missing calibration assessment (Hosmer-Lemeshow test) for the predictive model
- Competing events not accounted for in time-to-event analyses (if applicable)

The statistical approach in general is reasonable for exploratory work but would need to be substantially strengthened for a major cardiology journal. Consider consulting with a biostatistician before resubmission.

## Novelty Assessment
The central finding — that early troponin kinetics predict 30-day MACE independent of peak troponin — is incrementally novel. At least 3 similar analyses exist in PubMed (Reichlin et al. 2012; Roffi et al. 2018; ISCHAEMIA trial substudy 2021). Your comparative advantage is the real-world community hospital setting, but this is mentioned only briefly in the discussion. Strengthen this angle substantially.

## Target Journal Fit Analysis
For the current manuscript as written, the following journals represent realistic targets:

| Journal | IF | Likelihood | Notes |
|---|---|---|---|
| Heart (BMJ) | 6.2 | Moderate | Good fit for observational cardiology |
| Clinical Cardiology | 3.4 | Good | Accepts well-conducted single-center studies |
| J Am Heart Assoc | 5.5 | Possible after major revision | Requires stronger methodology |
| JACC | 24.0 | Very Low | Sample size and novelty insufficient |

Do NOT submit to Circulation or NEJM at this stage.

## Introduction Assessment
The introduction establishes adequate clinical context but has three structural weaknesses: (1) the gap in knowledge is stated but not quantified — cite specific limitations of prior work; (2) the study hypothesis is not explicitly stated as a testable hypothesis; (3) the final paragraph is vague ("this study aims to investigate...") — replace with a specific primary aim statement.

**Recommended rewrite of final intro paragraph:**
"We hypothesized that the delta-troponin ratio at 3 hours (ΔTn3h) would independently predict 30-day major adverse cardiovascular events (MACE), defined as cardiac death, recurrent MI, or urgent revascularization, beyond peak troponin values in NSTEMI patients managed at a community hospital. We therefore conducted a retrospective cohort analysis of [N] consecutive NSTEMI admissions over [period] to test this hypothesis."

## Discussion & Conclusions
The discussion over-interprets the findings given the sample size. Statements such as "our findings support broad implementation of delta-troponin protocols" are not justified by n=87. Replace with appropriately hedged language: "these preliminary findings, if confirmed in larger prospective studies..."

The limitations section is adequately comprehensive but omits: (1) information bias in retrospective chart review, (2) unmeasured confounders (medication adherence, socioeconomic status), and (3) lack of external validation cohort.

## Reference Quality
- 31 total references: appropriate quantity
- 4/31 are >10 years old — acceptable for foundational references, problematic for current-state claims
- Missing citations for: GRACE score validation studies (mandatory), high-sensitivity troponin assay comparisons (3 key papers)
- Self-citation ratio: 12% — within acceptable limits
- Predatory journal citations: none identified

## Formatting & Structure
Abstract: 248 words (over the 250-word limit for Heart — check target journal guidelines). Structured format (AIMS/METHODS/RESULTS/CONCLUSIONS) is correct.

Figure quality: Cannot assess from text alone, but ensure all figures meet 300 DPI minimum and use colorblind-friendly palettes (avoid red/green combinations).

Tables: Table 2 appears to combine baseline characteristics with outcome data — separate these into distinct tables per standard reporting practice.

## Action Priority List
1. [URGENT] Recalculate sample size requirements and either acknowledge limitation explicitly or collect additional data
2. [URGENT] Re-run primary analysis with Spearman correlation
3. [URGENT] Register study retrospectively if possible (some journals accept retrospective registration with disclosure)
4. [HIGH] Add sensitivity analyses (complete case, multiple imputation for missing data)
5. [HIGH] Update literature review with 2021-2024 publications
6. [MEDIUM] Restructure Table 2 into two separate tables
7. [MEDIUM] Clarify study hypothesis and primary aim in introduction
8. [LOW] Standardize NSTEMI abbreviation throughout
9. [LOW] Reduce abstract to ≤250 words`;

function parseScores(text: string): Partial<ManuscriptScore> {
  const match = text.match(/SCORES:\s*SR:(\d+)\s+N:(\d+)\s+M:(\d+)\s+C:(\d+)\s+ST:(\d+)/);
  if (!match) return {};
  const overall = Math.round(
    (parseInt(match[1]) + parseInt(match[2]) + parseInt(match[3]) + parseInt(match[4]) + parseInt(match[5])) / 5
  );
  return {
    scientificRigor: parseInt(match[1]),
    novelty: parseInt(match[2]),
    methods: parseInt(match[3]),
    clarity: parseInt(match[4]),
    structure: parseInt(match[5]),
    overall,
  };
}

function buildSystemPrompt(discipline: string, journal: string, manuscriptType: string, section: string): string {
  return `You are an expert peer reviewer and editorial board member at a Q1 ${discipline} journal with 20+ years of experience. You have reviewed for journals including Nature Medicine, NEJM, Lancet, JAMA, and leading specialty journals.

Your task is to evaluate the submitted ${manuscriptType} (${section}) targeting ${journal || 'a Q1 ' + discipline + ' journal'}.

Provide a comprehensive review structured EXACTLY as follows (use ## for section headers):

## Overall Verdict
(Overall score X/100 and brief summary — 3-4 sentences)

[REQUIRED — include this line exactly, replacing numbers:]
SCORES: SR:[0-100] N:[0-100] M:[0-100] C:[0-100] ST:[0-100]

## Score Breakdown
(Explain each sub-score: Scientific Rigor, Novelty, Methods, Clarity, Structure)

## Desk Rejection Risks
(List specific risks as numbered items with severity: CRITICAL/HIGH/MEDIUM/LOW)

## Methods & Statistics Check
(Detailed statistical and methodological critique)

## Novelty Assessment
(Comparison to existing literature, incremental contribution analysis)

## Target Journal Fit Analysis
(3-5 realistic target journals with impact factors and likelihood of acceptance)

## Introduction Assessment
(Critique with specific rewrite suggestions)

## Discussion & Conclusions
(Evaluate interpretation, over-claims, limitations section)

## Reference Quality
(Count, currency, missing key citations, predatory journal check)

## Formatting & Structure
(Journal compliance, figure/table quality, abstract)

## Action Priority List
(Numbered list: [URGENT/HIGH/MEDIUM/LOW] specific actionable items)

Be rigorous, specific, and honest. If the work is publishable, say so. If it has fatal flaws, identify them clearly. Always cite specific statistical tests, sample size calculations, and journal-specific requirements where relevant.`;
}

export function ManuscriptEvaluator() {
  const [manuscript, setManuscript] = useState('');
  const [discipline, setDiscipline] = useState('Cardiology');
  const [journal, setJournal] = useState('');
  const [manuscriptType, setManuscriptType] = useState('Original Research Article');
  const [section, setSection] = useState('Full Manuscript');
  const [scores, setScores] = useState<Partial<ManuscriptScore>>({});
  const [hasResult, setHasResult] = useState(false);

  const { key, status } = useApiKey();
  const { addToast } = useToast();
  const { content, isStreaming, error, startStream, cancelStream, reset } = useStream({
    onChunk: (chunk) => {
      // Parse scores as they stream in
      const fullSoFar = content + chunk;
      const parsed = parseScores(fullSoFar);
      if (parsed.overall) setScores(parsed);
    },
    onComplete: (full) => {
      const parsed = parseScores(full);
      if (parsed.overall) setScores(parsed);
      setHasResult(true);
    },
    onError: (err) => {
      addToast({ type: 'error', title: 'Evaluation failed', message: err });
    },
  });

  const handleEvaluate = useCallback(async () => {
    if (!manuscript.trim()) {
      addToast({ type: 'warning', title: 'No manuscript text', message: 'Please paste your manuscript text first.' });
      return;
    }
    if (manuscript.trim().length < 100) {
      addToast({ type: 'warning', title: 'Text too short', message: 'Please provide at least 100 characters of manuscript text.' });
      return;
    }

    reset();
    setScores({});
    setHasResult(false);

    if (status === 'demo') {
      // Simulate streaming for demo
      const words = DEMO_OUTPUT.split(' ');
      let i = 0;
      const interval = setInterval(() => {
        if (i >= words.length) {
          clearInterval(interval);
          const parsed = parseScores(DEMO_OUTPUT);
          setScores(parsed);
          setHasResult(true);
          return;
        }
        const chunk = words.slice(i, i + 5).join(' ') + ' ';
        i += 5;
        // We can't use startStream in demo mode, so we manage state directly
      }, 30);
      // In demo mode, show full output immediately after brief delay
      setTimeout(() => {
        clearInterval(interval);
        const parsed = parseScores(DEMO_OUTPUT);
        setScores(parsed);
        setHasResult(true);
      }, 100);
      // Trigger the stream with demo content
      await startStream(
        [{ role: 'user', content: 'DEMO' }],
        'DEMO',
        null
      );
      return;
    }

    if (!key) {
      addToast({ type: 'error', title: 'No API key', message: 'Please set your Anthropic API key first.' });
      return;
    }

    const systemPrompt = buildSystemPrompt(discipline, journal, manuscriptType, section);
    await startStream(
      [{ role: 'user', content: `Please evaluate the following ${section.toLowerCase()}:\n\n${manuscript}` }],
      systemPrompt,
      key
    );
  }, [manuscript, discipline, journal, manuscriptType, section, status, key, reset, startStream, addToast, content]);

  // Parse scores from content whenever it updates
  useEffect(() => {
    if (content) {
      const parsed = parseScores(content);
      if (parsed.overall) setScores(parsed);
    }
  }, [content]);

  const displayContent = status === 'demo' && !content ? '' : content;

  const subScores = [
    { label: 'Scientific Rigor', value: scores.scientificRigor ?? 0, key: 'sr' },
    { label: 'Novelty & Impact', value: scores.novelty ?? 0, key: 'n' },
    { label: 'Methods Quality', value: scores.methods ?? 0, key: 'm' },
    { label: 'Writing Clarity', value: scores.clarity ?? 0, key: 'c' },
    { label: 'Structure', value: scores.structure ?? 0, key: 'st' },
  ];

  return (
    <div className="flex gap-6 h-full">
      {/* Left panel — Config */}
      <div className="w-[40%] flex-shrink-0 space-y-5">
        {/* Config panel */}
        <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5">
          <h3 className="font-playfair text-base font-semibold text-[#dde4ee] mb-4">Evaluation Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8b9ab0] font-dm mb-1.5">Discipline</label>
              <div className="relative">
                <select
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm appearance-none focus:outline-none focus:border-[#c9952a]/60 transition-colors"
                >
                  {DISCIPLINES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6a80] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8b9ab0] font-dm mb-1.5">Target Journal (optional)</label>
              <input
                type="text"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="e.g., JAMA Cardiology, BMJ, Nature Medicine"
                className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm placeholder:text-[#5a6a80] focus:outline-none focus:border-[#c9952a]/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8b9ab0] font-dm mb-1.5">Manuscript Type</label>
              <div className="relative">
                <select
                  value={manuscriptType}
                  onChange={(e) => setManuscriptType(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm appearance-none focus:outline-none focus:border-[#c9952a]/60 transition-colors"
                >
                  {MANUSCRIPT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6a80] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8b9ab0] font-dm mb-1.5">Section to Evaluate</label>
              <div className="relative">
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm appearance-none focus:outline-none focus:border-[#c9952a]/60 transition-colors"
                >
                  {SECTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6a80] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Score display */}
        <AnimatePresence mode="wait">
          {(isStreaming || hasResult) ? (
            <motion.div
              key="scores"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5"
            >
              <h3 className="font-playfair text-base font-semibold text-[#dde4ee] mb-5">Score Analysis</h3>
              <div className="flex justify-center mb-5">
                <ScoreRing
                  score={scores.overall ?? 0}
                  label="Overall Score"
                  animate={true}
                />
              </div>
              <div className="space-y-3">
                {subScores.map((sub) => (
                  <ProgressBar
                    key={sub.key}
                    value={sub.value}
                    label={sub.label}
                    showValue={true}
                    animate={true}
                  />
                ))}
              </div>
            </motion.div>
          ) : isStreaming ? (
            <SkeletonCard lines={4} showAvatar={false} className="rounded-xl" />
          ) : null}
        </AnimatePresence>
      </div>

      {/* Right panel — Input + Results */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        {/* Manuscript input */}
        <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-medium text-[#8b9ab0] font-dm">Manuscript Text</label>
            <span className="text-xs text-[#5a6a80] font-dm">{manuscript.length} chars</span>
          </div>
          <textarea
            value={manuscript}
            onChange={(e) => setManuscript(e.target.value)}
            placeholder="Paste your manuscript text here... (abstract, introduction, methods, results, discussion, or full manuscript)"
            className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-3 text-sm text-[#dde4ee] font-dm placeholder:text-[#5a6a80] focus:outline-none focus:border-[#c9952a]/60 transition-colors resize-none"
            rows={8}
          />
          <div className="flex items-center gap-3 mt-3">
            <motion.button
              onClick={isStreaming ? cancelStream : handleEvaluate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium font-dm transition-all"
              style={{
                backgroundColor: isStreaming ? '#c94040' : '#c9952a',
                color: '#07090f',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {isStreaming ? (
                <>
                  <Square className="w-4 h-4" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Evaluate Manuscript
                </>
              )}
            </motion.button>
            {(content || error) && (
              <button
                onClick={() => { reset(); setScores({}); setHasResult(false); }}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-dm text-[#8b9ab0] hover:text-[#dde4ee] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
            {status === 'demo' && (
              <span className="text-xs text-[#c97d2a] font-dm ml-auto">Demo mode — showing example evaluation</span>
            )}
          </div>
        </div>

        {/* Results */}
        <ResultStream
          content={displayContent || (status === 'demo' && isStreaming ? DEMO_OUTPUT : '')}
          isStreaming={isStreaming}
          error={error}
          placeholder="Paste your manuscript text and click Evaluate to receive a comprehensive Q1-level peer review analysis."
          maxHeight="calc(100vh - 400px)"
          className="flex-1"
        />
      </div>
    </div>
  );
}
