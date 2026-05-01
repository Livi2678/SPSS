'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ExternalLink,
  BookPlus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useApiKey } from '@/hooks/useApiKey';
import { useStream } from '@/hooks/useStream';
import { DatabasePill } from '@/components/ui/DatabasePill';
import { Badge } from '@/components/ui/Badge';
import { ResultStream } from '@/components/ui/ResultStream';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { useToast } from '@/components/ui/Toast';
import type { SearchResult } from '@/types';

type SearchTab = 'freetext' | 'pico' | 'boolean';
type ActiveDB = 'pubmed' | 'semantic' | 'crossref';

const ALL_DATABASES: { id: ActiveDB; name: string }[] = [
  { id: 'pubmed', name: 'PubMed' },
  { id: 'semantic', name: 'Semantic Scholar' },
  { id: 'crossref', name: 'CrossRef' },
];

const COMING_SOON = ['Scopus', 'Web of Science', 'EMBASE', 'CINAHL', 'PsycINFO'];

const STUDY_TYPES = [
  'Randomized Controlled Trial',
  'Systematic Review',
  'Meta-Analysis',
  'Cohort Study',
  'Case-Control Study',
  'Cross-Sectional Study',
];

const DEMO_SYNTHESIS = `## Literature Synthesis

Based on the 3 databases searched (PubMed, Semantic Scholar, CrossRef), the following synthesis emerges:

### Key Themes Identified

**1. Consistent Efficacy Evidence (Strong)**
Multiple high-quality RCTs consistently demonstrate statistically significant efficacy for the intervention across different patient populations. The effect sizes range from moderate (SMD 0.4-0.6) to large (SMD >0.8) depending on outcome measure and follow-up duration.

**2. Safety Profile (Moderate evidence)**
The safety data is reassuring in short-term trials (<12 months), with adverse event rates comparable to placebo. Long-term safety data beyond 2 years remains limited to 2 observational cohorts with potential confounding.

**3. Heterogeneity in Study Populations**
Significant methodological heterogeneity exists across studies (I² = 67-82%), driven primarily by variation in patient selection criteria, dosing protocols, and outcome definitions. This limits direct meta-analytic pooling.

### Research Gaps
- No studies in pediatric populations (<18 years)
- Only 1 study in low/middle-income country settings
- Optimal duration of treatment not established
- Comparative effectiveness against current standard-of-care lacking

### Recommended Next Steps
Consider a formal systematic review and meta-analysis with subgroup analyses by: (1) disease severity, (2) comorbidity burden, (3) intervention intensity. PROSPERO registration recommended before proceeding.`;

function SearchResultCard({ result, onAddToReview }: { result: SearchResult; onAddToReview?: (r: SearchResult) => void }) {
  const [expanded, setExpanded] = useState(false);

  const sourceColors = {
    pubmed: '#2d6be4',
    semantic: '#0d9e6e',
    crossref: '#c97d2a',
  };

  return (
    <motion.div
      className="rounded-lg border border-[#1f2d45] bg-[#111827] p-4 hover:border-[#283d5e] transition-colors"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-1 rounded-full flex-shrink-0 mt-1 self-stretch min-h-[40px]"
          style={{ backgroundColor: sourceColors[result.source] }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h4 className="text-sm font-semibold text-[#dde4ee] font-dm leading-snug line-clamp-2">
              {result.title}
            </h4>
            <div className="flex gap-1.5 flex-shrink-0">
              {result.doi && (
                <a
                  href={`https://doi.org/${result.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded text-[#5a6a80] hover:text-[#8b9ab0] transition-colors border border-[#1f2d45] hover:border-[#283d5e]"
                  title="Open DOI"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {result.openAccessPdf && (
                <a
                  href={result.openAccessPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded text-[#0d9e6e] hover:text-[#34d399] transition-colors border border-[#0d9e6e]/30 hover:border-[#0d9e6e]/50"
                  title="Open Access PDF"
                >
                  <FileText className="w-3 h-3" />
                </a>
              )}
              {onAddToReview && (
                <button
                  onClick={() => onAddToReview(result)}
                  className="p-1.5 rounded text-[#5a6a80] hover:text-[#c9952a] transition-colors border border-[#1f2d45] hover:border-[#c9952a]/40"
                  title="Add to Review"
                >
                  <BookPlus className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs text-[#8b9ab0] font-dm">
              {result.authors.slice(0, 3).join(', ')}
              {result.authors.length > 3 ? ` +${result.authors.length - 3}` : ''}
            </span>
            <span className="text-[#1f2d45]">·</span>
            <span className="text-xs text-[#8b9ab0] font-dm">{result.journal || 'Unknown Journal'}</span>
            <span className="text-[#1f2d45]">·</span>
            <span className="text-xs text-[#8b9ab0] font-dm">{result.year}</span>
            {result.citationCount !== undefined && result.citationCount > 0 && (
              <>
                <span className="text-[#1f2d45]">·</span>
                <Badge variant="dim">
                  {result.citationCount.toLocaleString()} citations
                </Badge>
              </>
            )}
            <Badge
              variant={result.source === 'pubmed' ? 'blue' : result.source === 'semantic' ? 'green' : 'amber'}
            >
              {result.source === 'pubmed' ? 'PubMed' : result.source === 'semantic' ? 'Semantic' : 'CrossRef'}
            </Badge>
          </div>

          {result.abstract && (
            <>
              <p className={`text-xs text-[#8b9ab0] font-dm leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
                {result.abstract}
              </p>
              {result.abstract.length > 150 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1 mt-1 text-xs text-[#5a6a80] hover:text-[#8b9ab0] transition-colors font-dm"
                >
                  {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {expanded ? 'Show less' : 'Show abstract'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function LiteratureSearch() {
  const [activeTab, setActiveTab] = useState<SearchTab>('freetext');
  const [query, setQuery] = useState('');
  const [picoP, setPicoP] = useState('');
  const [picoI, setPicoI] = useState('');
  const [picoC, setPicoC] = useState('');
  const [picoO, setPicoO] = useState('');
  const [activeDbs, setActiveDbs] = useState<Set<ActiveDB>>(new Set(['pubmed', 'semantic', 'crossref']));
  const [yearFrom, setYearFrom] = useState(2015);
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [selectedStudyTypes, setSelectedStudyTypes] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showSynthesis, setShowSynthesis] = useState(false);
  const [reviewItems, setReviewItems] = useState<SearchResult[]>([]);

  const { key, status } = useApiKey();
  const { addToast } = useToast();
  const {
    content: synthesisContent,
    isStreaming: isSynthesizing,
    error: synthesisError,
    startStream: startSynthesis,
    reset: resetSynthesis,
  } = useStream({
    onError: (err) => addToast({ type: 'error', title: 'Synthesis failed', message: err }),
  });

  const buildQuery = useCallback((): string => {
    if (activeTab === 'pico') {
      const parts = [];
      if (picoP) parts.push(`(${picoP})`);
      if (picoI) parts.push(`(${picoI})`);
      if (picoC) parts.push(`(${picoC})`);
      if (picoO) parts.push(`(${picoO})`);
      return parts.join(' AND ');
    }
    return query;
  }, [activeTab, query, picoP, picoI, picoC, picoO]);

  const handleSearch = useCallback(async () => {
    const q = buildQuery();
    if (!q.trim()) {
      addToast({ type: 'warning', title: 'No query', message: 'Please enter a search query.' });
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setResults([]);
    setShowSynthesis(false);
    resetSynthesis();

    try {
      const searchPromises: Promise<Response>[] = [];

      if (activeDbs.has('pubmed')) {
        searchPromises.push(fetch(`/api/search/pubmed?q=${encodeURIComponent(q)}&max=20`));
      }
      if (activeDbs.has('semantic')) {
        searchPromises.push(fetch(`/api/search/semantic?q=${encodeURIComponent(q)}&max=15`));
      }
      if (activeDbs.has('crossref')) {
        searchPromises.push(fetch(`/api/search/crossref?q=${encodeURIComponent(q)}&max=15`));
      }

      const responses = await Promise.allSettled(searchPromises);
      const allResults: SearchResult[] = [];

      for (const res of responses) {
        if (res.status === 'fulfilled' && res.value.ok) {
          const data = await res.value.json();
          if (data.results) allResults.push(...data.results);
        }
      }

      let filtered = allResults;

      if (yearFrom > 1990) {
        filtered = filtered.filter((r) => r.year >= yearFrom);
      }

      if (openAccessOnly) {
        filtered = filtered.filter((r) => r.openAccessPdf);
      }

      filtered.sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0));
      setResults(filtered);

      if (filtered.length === 0) {
        addToast({ type: 'info', title: 'No results', message: 'Try broadening your search terms.' });
      } else {
        addToast({
          type: 'success',
          title: `Found ${filtered.length} results`,
          message: `Across ${activeDbs.size} database${activeDbs.size > 1 ? 's' : ''}`,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Search failed';
      setSearchError(msg);
      addToast({ type: 'error', title: 'Search failed', message: msg });
    } finally {
      setIsSearching(false);
    }
  }, [buildQuery, activeDbs, yearFrom, openAccessOnly, addToast, resetSynthesis]);

  const handleSynthesize = useCallback(async () => {
    if (results.length === 0) return;
    setShowSynthesis(true);
    resetSynthesis();

    if (status === 'demo') {
      // Demo mode
      return;
    }

    if (!key) {
      addToast({ type: 'error', title: 'No API key', message: 'Connect your Anthropic API key to synthesize.' });
      return;
    }

    const top10 = results.slice(0, 10);
    const summaries = top10.map((r, i) =>
      `${i + 1}. ${r.title} (${r.journal || 'Unknown'}, ${r.year})\n   Authors: ${r.authors.slice(0, 3).join(', ')}\n   Abstract: ${r.abstract?.slice(0, 300) || 'N/A'}`
    ).join('\n\n');

    await startSynthesis(
      [{
        role: 'user',
        content: `Please synthesize the following ${results.length} research papers and identify key themes, evidence quality, consensus findings, contradictions, and research gaps:\n\n${summaries}`,
      }],
      `You are a systematic review expert. Synthesize the provided literature search results into a structured narrative synthesis. Use ## for main sections: Key Themes Identified, Consensus Findings, Contradictions/Uncertainties, Research Gaps, Recommended Next Steps. Be specific and cite paper numbers where relevant.`,
      key
    );
  }, [results, status, key, addToast, startSynthesis, resetSynthesis]);

  const toggleDb = (db: ActiveDB) => {
    setActiveDbs((prev) => {
      const next = new Set(prev);
      if (next.has(db)) {
        if (next.size > 1) next.delete(db);
      } else {
        next.add(db);
      }
      return next;
    });
  };

  const toggleStudyType = (type: string) => {
    setSelectedStudyTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  return (
    <div className="flex gap-6">
      {/* Left sidebar — Filters */}
      <div className="w-72 flex-shrink-0 space-y-4">
        {/* Databases */}
        <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-4">
          <h3 className="font-playfair text-sm font-semibold text-[#dde4ee] mb-3">Databases</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {ALL_DATABASES.map((db) => (
              <DatabasePill
                key={db.id}
                name={db.name}
                active={activeDbs.has(db.id)}
                onClick={() => toggleDb(db.id)}
                count={results.filter((r) => r.source === db.id).length}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {COMING_SOON.map((name) => (
              <DatabasePill key={name} name={name} active={false} comingSoon />
            ))}
          </div>
        </div>

        {/* Year range */}
        <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-playfair text-sm font-semibold text-[#dde4ee]">Publication Year</h3>
            <span className="text-xs text-[#c9952a] font-dm font-medium">{yearFrom}+</span>
          </div>
          <input
            type="range"
            min={1990}
            max={2024}
            value={yearFrom}
            onChange={(e) => setYearFrom(parseInt(e.target.value))}
            className="w-full accent-[#c9952a]"
          />
          <div className="flex justify-between text-[10px] text-[#5a6a80] font-dm mt-1">
            <span>1990</span>
            <span>2024</span>
          </div>
        </div>

        {/* Study types */}
        <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-4">
          <h3 className="font-playfair text-sm font-semibold text-[#dde4ee] mb-3">Study Types</h3>
          <div className="space-y-2">
            {STUDY_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStudyTypes.has(type)}
                  onChange={() => toggleStudyType(type)}
                  className="w-3.5 h-3.5 rounded border-[#283d5e] accent-[#c9952a]"
                />
                <span className="text-xs text-[#8b9ab0] font-dm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Open Access toggle */}
        <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm font-medium text-[#dde4ee] font-dm">Open Access Only</div>
              <div className="text-xs text-[#5a6a80] font-dm">Filter to freely accessible papers</div>
            </div>
            <div
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${openAccessOnly ? 'bg-[#c9952a]' : 'bg-[#1f2d45]'}`}
              onClick={() => setOpenAccessOnly(!openAccessOnly)}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow ${openAccessOnly ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </div>
          </label>
        </div>

        {/* Review basket */}
        {reviewItems.length > 0 && (
          <div className="rounded-xl border border-[#c9952a]/30 bg-[#c9952a]/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-[#c9952a] font-dm">Review Basket</h3>
              <span className="text-xs bg-[#c9952a]/20 text-[#c9952a] px-2 py-0.5 rounded-full font-dm">{reviewItems.length}</span>
            </div>
            <p className="text-xs text-[#8b9ab0] font-dm">Papers added for systematic review</p>
            <button
              className="mt-2 text-xs text-[#c9952a] font-dm hover:underline"
              onClick={() => setReviewItems([])}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Search panel */}
        <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5">
          {/* Tab switcher */}
          <div className="flex gap-1 mb-4 p-1 bg-[#111827] rounded-lg w-fit">
            {(['freetext', 'pico', 'boolean'] as SearchTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-xs font-dm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-[#1f2d45] text-[#dde4ee]'
                    : 'text-[#5a6a80] hover:text-[#8b9ab0]'
                }`}
              >
                {tab === 'freetext' ? 'Free Text' : tab === 'pico' ? 'PICO' : 'Boolean Builder'}
              </button>
            ))}
          </div>

          {/* Search inputs */}
          <AnimatePresence mode="wait">
            {activeTab === 'freetext' && (
              <motion.div
                key="freetext"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6a80]" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search across PubMed, Semantic Scholar, CrossRef..."
                    className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#dde4ee] font-dm placeholder:text-[#5a6a80] focus:outline-none focus:border-[#c9952a]/60 transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'pico' && (
              <motion.div
                key="pico"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { label: 'P — Population', value: picoP, setter: setPicoP, placeholder: 'e.g., adults with type 2 diabetes' },
                  { label: 'I — Intervention', value: picoI, setter: setPicoI, placeholder: 'e.g., metformin, cognitive therapy' },
                  { label: 'C — Comparator', value: picoC, setter: setPicoC, placeholder: 'e.g., placebo, standard care' },
                  { label: 'O — Outcome', value: picoO, setter: setPicoO, placeholder: 'e.g., HbA1c reduction, mortality' },
                ].map(({ label, value, setter, placeholder }) => (
                  <div key={label}>
                    <label className="block text-[10px] text-[#5a6a80] font-dm mb-1 uppercase tracking-wider">{label}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm placeholder:text-[#5a6a80] focus:outline-none focus:border-[#c9952a]/60 transition-colors"
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'boolean' && (
              <motion.div
                key="boolean"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Build complex boolean queries:\n(hypertension OR "high blood pressure") AND (metformin OR "biguanide") AND ("randomized controlled trial"[pt] OR "clinical trial"[pt])`}
                  className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2.5 text-sm text-[#dde4ee] font-mono placeholder:text-[#5a6a80] focus:outline-none focus:border-[#c9952a]/60 transition-colors resize-none"
                  rows={4}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {['AND', 'OR', 'NOT', '[MeSH]', '[tiab]', '[pt]'].map((op) => (
                    <button
                      key={op}
                      onClick={() => setQuery((q) => q + ' ' + op + ' ')}
                      className="px-2.5 py-1 text-xs font-mono text-[#c9952a] border border-[#c9952a]/30 rounded hover:bg-[#c9952a]/10 transition-colors"
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3 mt-4">
            <motion.button
              onClick={handleSearch}
              disabled={isSearching}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium font-dm disabled:opacity-60 transition-all"
              style={{ backgroundColor: '#c9952a', color: '#07090f' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Search className="w-4 h-4" />
              {isSearching ? 'Searching...' : 'Search Databases'}
            </motion.button>

            {results.length > 0 && (
              <button
                onClick={handleSynthesize}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium font-dm border border-[#c9952a]/40 text-[#c9952a] hover:bg-[#c9952a]/10 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                AI Synthesis
              </button>
            )}

            {results.length > 0 && (
              <span className="text-xs text-[#8b9ab0] font-dm ml-auto">
                {results.length} results
              </span>
            )}
          </div>
        </div>

        {/* Loading state */}
        {isSearching && (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonCard key={i} lines={4} showAvatar={false} />
            ))}
          </div>
        )}

        {/* Error state */}
        {searchError && !isSearching && (
          <div className="rounded-lg border border-[#c94040]/30 bg-[#c94040]/5 p-4 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-[#f87171] flex-shrink-0" />
            <span className="text-sm text-[#f87171] font-dm">{searchError}</span>
          </div>
        )}

        {/* AI Synthesis */}
        <AnimatePresence>
          {showSynthesis && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-[#c9952a]/25 bg-[#c9952a]/5 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#c9952a]/20">
                <Sparkles className="w-4 h-4 text-[#c9952a]" />
                <span className="text-sm font-medium text-[#c9952a] font-dm">AI Literature Synthesis</span>
                {isSynthesizing && (
                  <span className="text-xs text-[#c9952a]/60 font-dm ml-auto animate-pulse">Synthesizing...</span>
                )}
              </div>
              <div className="p-5">
                <ResultStream
                  content={status === 'demo' ? DEMO_SYNTHESIS : synthesisContent}
                  isStreaming={isSynthesizing}
                  error={synthesisError}
                  maxHeight="400px"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {!isSearching && results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-playfair text-base font-semibold text-[#dde4ee]">
                Search Results
              </h3>
              <div className="flex gap-2">
                {ALL_DATABASES.filter((db) => activeDbs.has(db.id)).map((db) => {
                  const count = results.filter((r) => r.source === db.id).length;
                  return count > 0 ? (
                    <Badge
                      key={db.id}
                      variant={db.id === 'pubmed' ? 'blue' : db.id === 'semantic' ? 'green' : 'amber'}
                    >
                      {db.name}: {count}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
            {results.map((result) => (
              <SearchResultCard
                key={result.id}
                result={result}
                onAddToReview={(r) => {
                  if (!reviewItems.find((i) => i.id === r.id)) {
                    setReviewItems((prev) => [...prev, r]);
                    addToast({ type: 'success', title: 'Added to review basket' });
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
