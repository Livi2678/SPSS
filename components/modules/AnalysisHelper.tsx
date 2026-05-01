'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Copy, CheckCircle, ChevronDown } from 'lucide-react';
import { useApiKey } from '@/hooks/useApiKey';
import { useStream } from '@/hooks/useStream';
import { ResultStream } from '@/components/ui/ResultStream';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

type AnalysisTab = 'selector' | 'codegen' | 'interpreter';

const DATA_TYPES = ['Continuous (normal)', 'Continuous (non-normal)', 'Ordinal', 'Categorical/Nominal', 'Binary', 'Count/Rate', 'Time-to-event', 'Proportions'];
const GROUP_COUNTS = ['1 group', '2 groups (independent)', '2 groups (paired)', '3+ groups (independent)', '3+ groups (repeated measures)', 'Multiple predictors'];
const STUDY_DESIGNS = ['Cross-sectional', 'Cohort (prospective)', 'Case-Control', 'Randomized Controlled Trial', 'Pre-post (one group)', 'Factorial design', 'Longitudinal', 'Diagnostic accuracy'];

const QUICK_TESTS = [
  { name: 'Student t-test', tag: 'parametric', color: '#2d6be4' },
  { name: 'Mann-Whitney U', tag: 'non-parametric', color: '#0d9e6e' },
  { name: 'ANOVA', tag: 'parametric', color: '#c9952a' },
  { name: 'Kruskal-Wallis', tag: 'non-parametric', color: '#8b5cf6' },
  { name: 'Chi-squared', tag: 'categorical', color: '#c97d2a' },
  { name: 'Fisher Exact', tag: 'categorical', color: '#ec4899' },
  { name: 'Pearson r', tag: 'correlation', color: '#06b6d4' },
  { name: 'Spearman ρ', tag: 'non-parametric', color: '#84cc16' },
  { name: 'Logistic Regression', tag: 'regression', color: '#c9952a' },
  { name: 'Cox Regression', tag: 'survival', color: '#c94040' },
  { name: 'Kaplan-Meier', tag: 'survival', color: '#c97d2a' },
  { name: 'Repeated ANOVA', tag: 'longitudinal', color: '#2d6be4' },
];

const DEMO_TEST_RESULT = `## Recommended Statistical Test

**Primary Recommendation: Independent Samples t-test**

Based on your specifications (continuous normally-distributed data, 2 independent groups, cross-sectional design), the independent samples t-test is the most appropriate analysis.

### Assumptions to Verify Before Proceeding
1. **Normality** — Test each group with Shapiro-Wilk (W, p > 0.05 indicates normality). If violated and n < 30, switch to Mann-Whitney U test.
2. **Homogeneity of variance** — Levene's test (p > 0.05). If violated, use Welch's t-test (unequal variance correction).
3. **Independence of observations** — Each participant contributes one value only. No hierarchical clustering.
4. **No extreme outliers** — Check with boxplots; consider Winsorization or removal with justification.

### Sample Size Calculation
For 80% power, α = 0.05, medium effect size (Cohen's d = 0.5):
- Required per group: **n = 64** (total N = 128)
- For large effect (d = 0.8): n = 26 per group
- For small effect (d = 0.2): n = 394 per group

Use G*Power 3.1 or the \`pwr\` package in R to customize.

### Reporting Format (APA 7th)
*t(df) = X.XX, p = .XXX, 95% CI [X.XX, X.XX], d = X.XX*

Example: "The intervention group (M = 45.2, SD = 8.4) scored significantly higher than controls (M = 38.7, SD = 9.1), t(126) = 4.23, p < .001, 95% CI [3.47, 9.53], d = 0.75."

### Alternatives to Consider
- If normality violated: **Mann-Whitney U test** (reports median, IQR; use rank-biserial correlation r for effect size)
- If 3+ groups: **One-way ANOVA** with post-hoc Tukey HSD
- If controlling for covariates: **ANCOVA**`;

const DEMO_CODE = `## R Code

\`\`\`r
# Independent Samples t-test
# Load required packages
library(tidyverse)
library(rstatix)
library(ggpubr)

# Assumption 1: Check normality with Shapiro-Wilk
shapiro.test(group1_data)  # p > 0.05 = normal
shapiro.test(group2_data)  # p > 0.05 = normal

# Assumption 2: Levene's test for equal variances
levene_test(data, outcome ~ group)  # p > 0.05 = equal variances

# Run the t-test
result <- t.test(
  outcome ~ group,
  data = your_data,
  var.equal = TRUE,   # Change to FALSE if Levene's p < 0.05 (Welch's)
  conf.level = 0.95,
  alternative = "two.sided"
)
print(result)

# Effect size (Cohen's d)
library(effsize)
cohen.d(outcome ~ group, data = your_data)

# Visualization
ggboxplot(your_data, x = "group", y = "outcome",
  color = "group", palette = "jco",
  add = "jitter") +
  stat_compare_means(method = "t.test")
\`\`\`

## Python Code

\`\`\`python
import numpy as np
import pandas as pd
from scipy import stats
import pingouin as pg
import matplotlib.pyplot as plt
import seaborn as sns

# Assumption checks
stat_g1, p_g1 = stats.shapiro(group1_data)
stat_g2, p_g2 = stats.shapiro(group2_data)
print(f"Shapiro-Wilk: Group 1 W={stat_g1:.3f}, p={p_g1:.4f}")
print(f"Shapiro-Wilk: Group 2 W={stat_g2:.3f}, p={p_g2:.4f}")

# Levene's test
lev_stat, lev_p = stats.levene(group1_data, group2_data)
print(f"Levene's test: F={lev_stat:.3f}, p={lev_p:.4f}")
equal_var = lev_p > 0.05  # True if equal variances

# t-test
t_stat, p_val = stats.ttest_ind(
    group1_data, group2_data,
    equal_var=equal_var
)
df = len(group1_data) + len(group2_data) - 2

# Effect size using pingouin
pg_result = pg.ttest(group1_data, group2_data, equal_var=equal_var)
print(pg_result)
print(f"\\nt({df}) = {t_stat:.3f}, p = {p_val:.4f}")
print(f"Cohen's d = {pg_result['cohen-d'].values[0]:.3f}")

# Visualization
fig, ax = plt.subplots(figsize=(8, 6))
sns.boxplot(data=df_long, x='group', y='outcome', palette='Blues')
sns.stripplot(data=df_long, x='group', y='outcome',
              color='black', alpha=0.4, size=3)
ax.set_title('Group Comparison', fontsize=14)
plt.tight_layout()
plt.show()
\`\`\``;

const DEMO_INTERPRETATION = `## Results Interpretation

### What Your Output Means

**Test Statistics Decoded:**

| Statistic | Your Value | Interpretation |
|-----------|-----------|----------------|
| t(58) = 3.42 | Test statistic | Observed difference is 3.42 standard errors from zero |
| p = .001 | Probability | 0.1% chance of this result if null hypothesis were true |
| 95% CI [2.14, 8.86] | Confidence interval | True population difference likely between 2.14 and 8.86 |
| d = 0.88 | Cohen's d | Large effect (d ≥ 0.8 = large by convention) |

### How to Report This (APA 7th Edition)
"An independent samples t-test revealed that the intervention group (M = 52.3, SD = 7.8, n = 30) scored significantly higher than the control group (M = 46.8, SD = 8.2, n = 30), t(58) = 3.42, p = .001, 95% CI [2.14, 8.86]. The effect was large (d = 0.88, 95% CI [0.35, 1.40])."

### Caveats to Include in Your Paper
1. Confidence interval is relatively wide (6.72 units), suggesting moderate precision — consider a larger replication study
2. Effect size d = 0.88 is unusually large for psychological/clinical research — ensure no outliers are inflating the result
3. Cross-sectional design prevents causal inference — use "associated with" not "caused" language
4. Multiple comparisons: if this is one of several outcomes, apply Bonferroni or FDR correction (adjusted α = 0.05/k)

### Clinical vs Statistical Significance
Statistical significance (p < .05) does NOT equal clinical importance. For your specific outcome, consider:
- Is a difference of 5.5 units on this scale clinically meaningful?
- What is the Minimal Clinically Important Difference (MCID) for this measure?
- Number Needed to Treat (NNT) or Absolute Risk Reduction may be more clinically relevant`;

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-[#1f2d45] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#111827] border-b border-[#1f2d45]">
        <span className="text-xs font-mono text-[#8b9ab0]">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-[#5a6a80] hover:text-[#8b9ab0] transition-colors font-dm"
        >
          {copied ? <CheckCircle className="w-3 h-3 text-[#0d9e6e]" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto bg-[#0d1117]">
        <code className="text-xs font-mono text-[#8b9ab0] leading-relaxed">{code}</code>
      </pre>
    </div>
  );
}

export function AnalysisHelper() {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('selector');
  const [dataType, setDataType] = useState('');
  const [groupCount, setGroupCount] = useState('');
  const [studyDesign, setStudyDesign] = useState('');
  const [codeQuery, setCodeQuery] = useState('');
  const [interpretQuery, setInterpretQuery] = useState('');

  const { key, status } = useApiKey();
  const { addToast } = useToast();
  const { content, isStreaming, error, startStream, reset } = useStream({
    onError: (err) => addToast({ type: 'error', title: 'AI error', message: err }),
  });

  const handleTestSelection = useCallback(async () => {
    if (!dataType || !groupCount) {
      addToast({ type: 'warning', title: 'Incomplete selection', message: 'Please select data type and group count.' });
      return;
    }
    reset();
    if (status === 'demo') return;
    if (!key) { addToast({ type: 'error', title: 'No API key' }); return; }
    await startStream(
      [{
        role: 'user',
        content: `Recommend the best statistical test for:
- Data type: ${dataType}
- Comparison: ${groupCount}
- Study design: ${studyDesign || 'Not specified'}

Provide: recommended test, assumptions, sample size calculation, reporting format, and alternatives.`,
      }],
      'You are a biostatistician. Recommend appropriate statistical tests with clear explanations. Use ## for sections: Recommended Test, Assumptions to Verify, Sample Size Calculation, Reporting Format, Alternatives.',
      key
    );
  }, [dataType, groupCount, studyDesign, status, key, reset, startStream, addToast]);

  const handleCodeGen = useCallback(async () => {
    if (!codeQuery.trim()) {
      addToast({ type: 'warning', title: 'No query', message: 'Describe what statistical analysis you need.' });
      return;
    }
    reset();
    if (status === 'demo') return;
    if (!key) { addToast({ type: 'error', title: 'No API key' }); return; }
    await startStream(
      [{
        role: 'user',
        content: `Generate complete R AND Python code for: ${codeQuery}\n\nInclude: data loading, assumption checks, main analysis, effect sizes, visualization code, and interpretation of output.`,
      }],
      'You are a statistical programming expert. Generate complete, production-ready R and Python code with comments. Include assumption checks, main analysis, and publication-quality visualizations. Use code blocks.',
      key
    );
  }, [codeQuery, status, key, reset, startStream, addToast]);

  const handleInterpret = useCallback(async () => {
    if (!interpretQuery.trim()) {
      addToast({ type: 'warning', title: 'No output to interpret', message: 'Paste your statistical output first.' });
      return;
    }
    reset();
    if (status === 'demo') return;
    if (!key) { addToast({ type: 'error', title: 'No API key' }); return; }
    await startStream(
      [{
        role: 'user',
        content: `Please interpret this statistical output in plain English for a research paper:\n\n${interpretQuery}`,
      }],
      'You are a statistician helping researchers understand their output. Explain: what each statistic means, how to report it in APA/Vancouver format, clinical vs statistical significance, limitations, and caveats. Create a table showing statistic → interpretation.',
      key
    );
  }, [interpretQuery, status, key, reset, startStream, addToast]);

  const getDisplayContent = () => {
    if (status === 'demo') {
      if (activeTab === 'selector') return DEMO_TEST_RESULT;
      if (activeTab === 'codegen') return DEMO_CODE;
      return DEMO_INTERPRETATION;
    }
    return content;
  };

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-[#0d1117] rounded-xl border border-[#1f2d45] w-fit">
        {([
          { id: 'selector', label: 'Test Selector' },
          { id: 'codegen', label: 'Code Generator' },
          { id: 'interpreter', label: 'Results Interpreter' },
        ] as { id: AnalysisTab; label: string }[]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); reset(); }}
            className={`px-5 py-2 rounded-lg text-sm font-dm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#111827] text-[#dde4ee] border border-[#1f2d45]'
                : 'text-[#5a6a80] hover:text-[#8b9ab0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Test Selector */}
        {activeTab === 'selector' && (
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5">
                <h3 className="font-playfair text-base font-semibold text-[#dde4ee] mb-4">Statistical Decision Tree</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#5a6a80] font-dm mb-2 uppercase tracking-wider">1. Data Type / Scale</label>
                    <div className="relative">
                      <select
                        value={dataType}
                        onChange={(e) => setDataType(e.target.value)}
                        className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm appearance-none focus:outline-none focus:border-[#c9952a]/60"
                      >
                        <option value="">Select data type...</option>
                        {DATA_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6a80] pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#5a6a80] font-dm mb-2 uppercase tracking-wider">2. Groups / Comparison</label>
                    <div className="relative">
                      <select
                        value={groupCount}
                        onChange={(e) => setGroupCount(e.target.value)}
                        className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm appearance-none focus:outline-none focus:border-[#c9952a]/60"
                      >
                        <option value="">Select comparison type...</option>
                        {GROUP_COUNTS.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6a80] pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#5a6a80] font-dm mb-2 uppercase tracking-wider">3. Study Design</label>
                    <div className="relative">
                      <select
                        value={studyDesign}
                        onChange={(e) => setStudyDesign(e.target.value)}
                        className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2 text-sm text-[#dde4ee] font-dm appearance-none focus:outline-none focus:border-[#c9952a]/60"
                      >
                        <option value="">Select design (optional)...</option>
                        {STUDY_DESIGNS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6a80] pointer-events-none" />
                    </div>
                  </div>

                  <motion.button
                    onClick={handleTestSelection}
                    disabled={isStreaming || !dataType || !groupCount}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium font-dm disabled:opacity-60"
                    style={{ backgroundColor: '#c9952a', color: '#07090f' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Play className="w-4 h-4" />
                    Find Best Test
                  </motion.button>
                </div>
              </div>

              {/* Quick access buttons */}
              <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-4">
                <h4 className="text-xs text-[#5a6a80] font-dm uppercase tracking-wider mb-3">Quick Access Tests</h4>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TESTS.map((test) => (
                    <button
                      key={test.name}
                      onClick={() => {
                        reset();
                        if (status === 'demo') return;
                        if (!key) return;
                        startStream(
                          [{ role: 'user', content: `Explain when to use ${test.name}, its assumptions, and how to report it in APA format.` }],
                          'You are a biostatistician. Explain the statistical test clearly with: when to use it, key assumptions, sample code concept, reporting format.',
                          key
                        );
                      }}
                      className="text-xs font-dm px-2.5 py-1.5 rounded-full border transition-all hover:opacity-80"
                      style={{
                        borderColor: test.color + '40',
                        backgroundColor: test.color + '10',
                        color: test.color,
                      }}
                    >
                      {test.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <ResultStream
              content={getDisplayContent()}
              isStreaming={isStreaming}
              error={error}
              placeholder="Select your data characteristics above to receive a personalized statistical test recommendation with sample size calculation and reporting guidelines."
              maxHeight="600px"
            />
          </motion.div>
        )}

        {/* Code Generator */}
        {activeTab === 'codegen' && (
          <motion.div
            key="codegen"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5 space-y-4">
              <h3 className="font-playfair text-base font-semibold text-[#dde4ee]">Code Generator</h3>
              <div>
                <label className="block text-xs text-[#5a6a80] font-dm mb-2 uppercase tracking-wider">Describe Your Analysis</label>
                <textarea
                  value={codeQuery}
                  onChange={(e) => setCodeQuery(e.target.value)}
                  placeholder="e.g., 'Run a mixed-effects logistic regression with random intercepts by hospital site, comparing intervention vs control groups, adjusting for age, sex, and comorbidity score'"
                  className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2.5 text-sm text-[#dde4ee] font-dm placeholder:text-[#5a6a80] focus:outline-none focus:border-[#c9952a]/60 resize-none"
                  rows={5}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Kaplan-Meier survival curve',
                  'ROC curve with AUC',
                  'Forest plot for meta-analysis',
                  'Bland-Altman agreement plot',
                  'Multiple imputation for missing data',
                  'Propensity score matching',
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setCodeQuery(example)}
                    className="text-xs font-dm px-2.5 py-1 rounded-full border border-[#1f2d45] text-[#8b9ab0] hover:border-[#283d5e] hover:text-[#dde4ee] transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
              <motion.button
                onClick={handleCodeGen}
                disabled={isStreaming || !codeQuery.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium font-dm disabled:opacity-60"
                style={{ backgroundColor: '#c9952a', color: '#07090f' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Play className="w-4 h-4" />
                Generate R + Python Code
              </motion.button>
            </div>

            <ResultStream
              content={getDisplayContent()}
              isStreaming={isStreaming}
              error={error}
              placeholder="Describe your statistical analysis above to receive complete R and Python code with assumption checks, visualizations, and effect size calculations."
              maxHeight="600px"
            />
          </motion.div>
        )}

        {/* Results Interpreter */}
        {activeTab === 'interpreter' && (
          <motion.div
            key="interpreter"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="rounded-xl border border-[#1f2d45] bg-[#0d1117] p-5 space-y-4">
              <h3 className="font-playfair text-base font-semibold text-[#dde4ee]">Results Interpreter</h3>
              <div>
                <label className="block text-xs text-[#5a6a80] font-dm mb-2 uppercase tracking-wider">Paste Statistical Output</label>
                <textarea
                  value={interpretQuery}
                  onChange={(e) => setInterpretQuery(e.target.value)}
                  placeholder={`Paste your R/SPSS/Stata output here:\n\n  Welch Two Sample t-test\n  t = 3.4221, df = 57.834, p-value = 0.001138\n  95% CI: 2.139 to 8.861\n  mean of x: 52.3  mean of y: 46.8`}
                  className="w-full bg-[#111827] border border-[#1f2d45] rounded-lg px-3 py-2.5 text-sm text-[#dde4ee] font-mono placeholder:text-[#5a6a80] focus:outline-none focus:border-[#c9952a]/60 resize-none"
                  rows={8}
                />
              </div>
              <motion.button
                onClick={handleInterpret}
                disabled={isStreaming || !interpretQuery.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium font-dm disabled:opacity-60"
                style={{ backgroundColor: '#8b5cf6', color: '#fff' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Play className="w-4 h-4" />
                Interpret Results
              </motion.button>
              <div className="space-y-2">
                <p className="text-xs text-[#5a6a80] font-dm">Supported outputs:</p>
                {['R output (t.test, lm, glm, coxph)', 'SPSS tables', 'Stata output', 'Python scipy/statsmodels', 'GraphPad Prism output'].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#5a6a80]" />
                    <span className="text-xs text-[#5a6a80] font-dm">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <ResultStream
              content={getDisplayContent()}
              isStreaming={isStreaming}
              error={error}
              placeholder="Paste your statistical output above for plain-English interpretation, APA reporting format, effect sizes, and caveats."
              maxHeight="600px"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
