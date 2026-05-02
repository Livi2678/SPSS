export const DEMO_MANUSCRIPT_EVALUATION = `## Overall Verdict

**Score: 64/100 — Major Revision Required**

This manuscript investigates the association between serum troponin I kinetics and 30-day mortality in non-ST-elevation myocardial infarction (NSTEMI) patients. While the clinical question has merit and the writing is reasonably clear, the manuscript has several critical deficiencies that would lead to desk rejection at journals such as JACC or Circulation, and significant revision requests at lower-tier cardiology journals.

SCORES: SR:58 N:68 M:52 C:74 ST:65

---

## Score Breakdown

| Domain | Score | Interpretation |
|--------|-------|----------------|
| Scientific Rigor | 58/100 | Underpowered; no sensitivity analyses |
| Novelty & Impact | 68/100 | Clinically relevant question; limited mechanistic insight |
| Methods Quality | 52/100 | Multiple statistical concerns |
| Writing Clarity | 74/100 | Generally clear; some jargon issues |
| Structure | 65/100 | Missing required sections for target journal |

---

## Desk Rejection Risks (Ordered by Severity)

### 🔴 CRITICAL — Sample Size Insufficient for Claims Made
**Exact text:** *"We enrolled 87 consecutive patients admitted with NSTEMI..."*

**Problem:** Your primary analysis uses multivariable logistic regression with 8 predictor variables. The Events Per Variable (EPV) rule requires ≥10 outcome events per variable. With n=87 and a 30-day mortality rate of ~12% (10 deaths), EPV = 10/8 = 1.25. This is catastrophically underpowered. Your regression coefficients are unstable and confidence intervals are meaninglessly wide.

**Fix:** Rewrite as: *"Given the exploratory nature of this study with 87 patients and 10 events, we conducted univariable analyses only. Our findings should be regarded as hypothesis-generating and require validation in a larger cohort (minimum n=400 to support multivariable analysis with 8 predictors at EPV=10)."* Alternatively, remove the multivariable model entirely and present adjusted OR for troponin kinetics only after reducing covariates to 1-2 pre-specified variables.

---

### 🔴 CRITICAL — No Pre-registration
**Exact text:** *"We retrospectively identified patients..."*

**Problem:** Retrospective studies with post-hoc hypothesis framing require pre-registration in PROSPERO or ClinicalTrials.gov to be accepted at JACC, Circulation, or NEJM. Without registration, editors cannot distinguish a priori from post-hoc analyses, which is a form of research misconduct.

**Fix:** If this was truly a pre-specified analysis within a registered study, include the registration number. If not, clearly frame all analyses as exploratory/hypothesis-generating. Avoid language that implies confirmatory inference (e.g., replace *"we demonstrate that"* with *"our findings suggest that"*).

---

### 🟠 HIGH — Missing Sensitivity Analyses
**Exact text:** *"We excluded patients with prior MI, renal failure, or troponin elevation from non-cardiac causes..."*

**Problem:** These exclusion criteria remove up to 35% of real-world NSTEMI patients. No sensitivity analysis is presented to assess whether findings hold in the broader population. This severely limits generalizability.

**Fix:** Add: *"We conducted a sensitivity analysis including all patients regardless of exclusion criteria to assess the robustness of findings to our eligibility criteria (Supplementary Table 2)."*

---

### 🟠 HIGH — Troponin Assay Not Specified
**Exact text:** *"Serum troponin I was measured on admission and at 6 hours..."*

**Problem:** Troponin I has >30 commercial assays with dramatically different reference ranges (99th percentile). Not specifying the assay manufacturer, generation (conventional vs. high-sensitivity), and 99th percentile URL makes your cutoffs uninterpretable and irreproducible.

**Fix:** Replace with: *"Serum troponin I was measured using the Abbott ARCHITECT high-sensitivity troponin I assay (99th percentile upper reference limit: 34 ng/L). Values ≥34 ng/L were classified as elevated per current ESC guidelines."*

---

### 🟡 MEDIUM — Inadequate Confounding Control
**Exact text:** *"We adjusted for age, sex, and TIMI risk score in the multivariable model..."*

**Problem:** TIMI risk score contains age, sex, and cardiac history as components — adjusting for TIMI AND age AND sex separately introduces multicollinearity. Additionally, no Directed Acyclic Graph (DAG) is presented to justify confounder selection, which is now expected at most high-impact journals.

**Fix:** Choose either TIMI score OR its individual components, not both. Add a DAG to supplementary materials. State: *"Confounders were selected based on a directed acyclic graph (DAG) constructed a priori (Supplementary Figure 1), following Greenland et al."*

---

### 🟡 MEDIUM — Results Reported Without Confidence Intervals
**Exact text:** *"Patients with a rising troponin pattern had significantly higher mortality (OR 4.2, p=0.03)..."*

**Problem:** Reporting only OR and p-value without confidence interval is non-compliant with CONSORT/STROBE standards and will be rejected by statistical reviewers at any Q1 journal.

**Fix:** *"Patients with a rising troponin kinetic pattern had significantly higher 30-day mortality compared to those with stable or declining patterns (OR 4.2, 95% CI 1.1–16.3; p=0.03). Note: the wide confidence interval reflects the limited sample size of this exploratory analysis."*

---

## Section-by-Section Analysis

### Abstract (Score: 70/100)
**Issues:**
- Uses "significant" without specifying statistical test — ambiguous
- Does not state the troponin assay used (critical for reproducibility)
- Conclusion overstates certainty: *"troponin kinetics predicts mortality"* should be *"troponin kinetics was associated with mortality in this small exploratory cohort"*

### Introduction (Score: 72/100)
**Issues:**
- Paragraph 2 cites 4 papers from 2008-2012 without mentioning the 2022 ESC NSTEMI guidelines that directly address this question — suggests incomplete literature review
- Research gap statement is generic: *"the prognostic role of troponin kinetics remains unclear"* — need to specify WHICH aspect is unclear and WHY existing studies disagree

### Methods (Score: 52/100)
**Issues (6 items):**
1. No sample size calculation or power justification
2. Troponin assay not specified (see above)
3. No description of how outcome (30-day mortality) was ascertained — death certificates? EMR? Follow-up calls? — this critically affects outcome misclassification risk
4. Missing data not described — how many patients had incomplete covariate data?
5. Statistical software not stated (R version X.X or SPSS version X required)
6. No ethics statement or IRB number

### Results (Score: 65/100)
**Issues:**
- Table 1: Baseline characteristics reported without p-value comparing survivors vs. non-survivors — this is standard for prognostic studies
- No Kaplan-Meier curve for 30-day survival by troponin kinetic pattern
- Missing data not reported for any variable

### Discussion (Score: 68/100)
**Issues:**
- Paragraph 3 fails to acknowledge the most important limitation: small sample size and underpowered regression analysis
- No external validity discussion — are these patients representative of the NSTEMI population in high-income settings? Low-income settings?
- Missing comparison with HIGH-SENSITIVITY troponin studies (the current standard of care)

---

## Language & Clarity Issues

| Location | Original | Problem | Corrected |
|----------|----------|---------|-----------|
| Abstract, line 3 | "We aimed to evaluate if troponin kinetics could predict outcomes" | Informal phrasing; "could" implies uncertainty about the analysis | "We aimed to determine the association between troponin I kinetics and 30-day all-cause mortality" |
| Methods, line 12 | "Patients were followed up for a month" | Vague duration; imprecise | "Patients were followed for 30 days from index admission" |
| Results, line 8 | "There was a trend toward significance" | Rejected phrase at all major journals — if p>0.05, it's not significant | "The difference did not reach statistical significance (OR 2.1, 95% CI 0.8–5.3; p=0.13)" |
| Discussion, line 4 | "Our results prove that troponin kinetics is a powerful predictor" | "Prove" is never appropriate in observational research; "powerful" is unsupported | "Our exploratory findings suggest that troponin kinetics may be an independent predictor" |

---

## Methods & Statistics Check

**Appropriate tests:**
- ✅ Mann-Whitney U for non-normally distributed continuous variables
- ✅ Chi-square for categorical comparisons

**Inappropriate or missing:**
- ❌ Logistic regression with EPV < 2 (minimum required: 10)
- ❌ No assessment of multicollinearity (VIF not reported)
- ❌ No Hosmer-Lemeshow goodness-of-fit test for logistic model
- ❌ AUC/ROC for predictive performance not reported despite predictive framing

---

## Recommended Next Steps (Action Plan)

1. **Immediately:** Remove or reframe the multivariable logistic regression — reduce to univariable analysis or adjust for only 1-2 pre-specified covariates
2. **Immediately:** Add the troponin assay specifications to Methods and Table 1
3. **Before resubmission:** Add confidence intervals to ALL effect estimates
4. **Before resubmission:** Specify how 30-day mortality was ascertained
5. **Before resubmission:** Report missing data rates for all variables
6. **Consider:** Pooling data with another center to achieve adequate sample size
7. **Consider:** Reframing as hypothesis-generating pilot study — which is honest and publishable in a lower-tier journal
8. **Target journal adjustment:** Given the sample size, consider Journal of Electrocardiology, Clinical Cardiology, or Cardiology (Karger) rather than JACC or Circulation
`;

export const DEMO_PEER_REVIEWS = {
  reviewer1: {
    persona: 'Dr. A. Mitchell',
    role: 'Associate Professor of Biostatistics',
    institution: 'Large Academic Medical Center',
    recommendation: 'Major Revision',
    confidence: 'High',
    review: `Thank you for submitting this manuscript. I have reviewed it carefully and have significant methodological concerns that must be addressed before this paper can be considered for publication.

**Major Concerns:**

My primary concern is the statistical analysis. The authors perform multivariable logistic regression with 8 predictor variables in a cohort of 87 patients with 10 outcome events. This yields an Events Per Variable ratio of 1.25, far below the accepted minimum of 10. Under these conditions, regression coefficients are highly unstable, confidence intervals are unreliable, and the model is likely to be severely overfit. The odds ratios presented cannot be interpreted meaningfully.

Second, confidence intervals are missing from several key results in the text (e.g., page 7, line 14: "OR 4.2, p=0.03"). All effect estimates must include 95% confidence intervals without exception.

Third, I note that the troponin I assay is not specified. With >30 commercially available troponin I assays having different reference ranges and analytical sensitivities, the reported 99th percentile cutoff is uninterpretable without the assay name and generation.

**Minor Concerns:**

- SPSS or R version not stated
- Multiple imputation not used for missing data (complete case analysis not justified)
- The Hosmer-Lemeshow test for model calibration is not reported

**Recommendation:** Major revision. The authors should either: (a) reduce the multivariable model to 1 variable (primary predictor only, adjusted for age and sex only), or (b) clearly label all analyses as exploratory and hypothesis-generating. The statistical interpretation requires substantial rewriting throughout.`,
  },
  reviewer2: {
    persona: 'Prof. J. Chen',
    role: 'Senior Interventional Cardiologist',
    institution: 'Tertiary Referral Cardiac Center',
    recommendation: 'Major Revision',
    confidence: 'Medium',
    review: `The authors address a clinically relevant question regarding the prognostic utility of troponin kinetic patterns in NSTEMI. The topic is of interest, though the study has important limitations that diminish its clinical impact.

**Major Concerns:**

The cohort is highly selected. Excluding patients with prior MI, renal failure, and non-cardiac troponin elevations removes a large proportion of real-world NSTEMI patients — precisely those in whom troponin interpretation is most challenging clinically. Without a sensitivity analysis including these patients, the clinical generalizability is severely limited.

The study also predates or ignores the 2022 ESC NSTEMI Guidelines' recommendation for high-sensitivity troponin (hsTnI/hsTnT) 0h/1h or 0h/2h rapid rule-out algorithms. The authors use a 0h/6h protocol, which is now substandard. This methodological decision is never justified.

Finally, the primary outcome of 30-day all-cause mortality, while objective, is arguably too blunt for this analysis. Major adverse cardiovascular events (MACE) at 30 days and 1 year would be more informative and clinically actionable.

**Minor Concerns:**

- Table 1 should compare survivors vs. non-survivors, not just present overall cohort statistics
- The clinical relevance of the finding needs to be stated more clearly: what would a clinician DO differently based on troponin kinetic pattern?
- References 4-7 are from 2009-2012 and should be updated with more recent literature

**Recommendation:** Major revision. The clinical framing and comparator literature need substantial updating. A sensitivity analysis including excluded patients is essential.`,
  },
  reviewer3: {
    persona: 'Dr. S. Park',
    role: 'Clinical Researcher / Epidemiologist',
    institution: 'Research Institute',
    recommendation: 'Reject',
    confidence: 'High',
    review: `I appreciate the authors' effort to address an important clinical question, however, I cannot recommend this manuscript for publication in its current form, and I am concerned that revision alone would not address the fundamental issues.

**Fatal Flaw — No Pre-registration:**

The authors describe a retrospective study but frame the analysis in confirmatory terms ("we demonstrate," "our results prove"). Without pre-registration, the analysis plan, endpoint selection, and covariate set cannot be verified as a priori decisions. This makes it impossible to rule out outcome reporting bias, selective analysis, and post-hoc hypothesis framing. The majority of Q2+ journals now require pre-registration for retrospective studies with pre-specified analyses, or require that all findings be explicitly framed as exploratory.

**Fundamental Methodological Issues:**

The retrospective single-center design, combined with the small sample size, means the findings have very low prior probability of replicating in other centers. The literature on troponin kinetics already contains several prospective multicenter studies (Reichlin et al. 2012, Haaf et al. 2014, Mueller et al. 2019) that are not adequately engaged with in the Discussion.

**Recommendation:** I reluctantly recommend rejection. The authors would benefit from conducting a properly powered prospective study, or alternatively, conducting an individual patient data meta-analysis of existing cohorts. If the authors wish to publish the current data, I suggest framing it explicitly as a pilot study and submitting to a journal appropriate for exploratory single-center data.`,
  },
};

export const DEMO_LITERATURE_RESULTS = [
  {
    id: 'demo-1',
    title: 'High-sensitivity troponin I in the diagnosis of acute myocardial infarction',
    authors: ['Mueller C', 'Giannitsis E', 'Christ M'],
    journal: 'European Heart Journal',
    year: 2023,
    abstract: 'Background: High-sensitivity cardiac troponin assays have transformed the diagnosis of myocardial infarction. This systematic review evaluates the diagnostic performance of the 0h/1h rapid rule-out algorithm across 8 multicenter cohorts...',
    doi: '10.1093/eurheartj/ehad123',
    citationCount: 342,
    openAccessPdf: null,
    source: 'pubmed' as const,
    pmid: '36789012',
  },
  {
    id: 'demo-2',
    title: 'Troponin kinetics and risk stratification in NSTEMI: a pooled analysis',
    authors: ['Reichlin T', 'Schindler C', 'Drexler B'],
    journal: 'Circulation',
    year: 2022,
    abstract: 'The delta troponin change between serial measurements contains important prognostic information beyond absolute peak values. In this pooled analysis of 4 prospective cohorts (n=3,247)...',
    doi: '10.1161/CIRCULATIONAHA.122.056789',
    citationCount: 187,
    openAccessPdf: null,
    source: 'pubmed' as const,
    pmid: '35124567',
  },
  {
    id: 'demo-3',
    title: 'Machine learning prediction of 30-day mortality in acute coronary syndrome',
    authors: ['Shah SJ', 'Katz DH', 'Selvaraj S'],
    journal: 'Nature Medicine',
    year: 2023,
    abstract: 'We developed and externally validated a machine learning model incorporating troponin kinetics, ECG features, and clinical variables to predict 30-day mortality in 12,456 patients with ACS...',
    doi: '10.1038/s41591-023-02345-6',
    citationCount: 89,
    openAccessPdf: 'https://doi.org/10.1038/s41591-023-02345-6',
    source: 'semantic' as const,
  },
];

export const DEMO_AI_SYNTHESIS = `## AI Literature Synthesis

Based on analysis of the retrieved papers, here is a synthesis of the current evidence on troponin kinetics in NSTEMI:

### State of the Evidence

The literature on troponin kinetics in NSTEMI has evolved substantially since 2020. Three key themes emerge:

**1. The 0h/1h algorithm has replaced 0h/6h as the standard**
Multiple prospective multicenter studies (APACE, TRAPID-AMI, HIGH-STEACS) have validated the ESC 0h/1h high-sensitivity troponin algorithm with >98% negative predictive value for ruling out MI at 1 hour. The 6-hour protocol used in older studies is now considered substandard practice.

**2. Delta troponin adds prognostic value beyond peak values**
The change in troponin between timepoints (Δ troponin) — not just the peak — contains independent prognostic information. Rising patterns (even from low baseline) are associated with 2-4x higher MACE rates at 30 days in adjusted analyses.

**3. Machine learning models incorporating troponin kinetics outperform TIMI/GRACE scores**
Recent ML-based risk scores using troponin kinetics + ECG + demographics achieve AUC 0.85-0.91 for 30-day mortality prediction, compared to 0.72-0.78 for TIMI/GRACE.

### Key Research Gaps
- Prospective validation of kinetic patterns with point-of-care hsTnI assays
- Optimal Δ troponin thresholds for specific patient subgroups (CKD, elderly, women)
- Cost-effectiveness of troponin kinetic-guided management vs. standard protocols

### Recommended Search Extensions
Try: "high-sensitivity troponin" AND "risk stratification" AND "NSTEMI" AND "cohort"
Additional databases: EMBASE (adds ~40% additional European studies not in PubMed)`;
