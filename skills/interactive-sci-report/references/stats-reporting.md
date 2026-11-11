# Statistical reporting

How to write numbers so that readers can check them and don't over-read them.

## Always state

For every test or model result:

- **Effect size with 95 % CI**, on a stated scale and unit, with its **sign convention**:
  "log2FC = treated − control (log2 units); positive = higher in the treated group".
  Define once in the reading guide, repeat in jargon tips.
- **P and FDR** together. Format: `4.1e-05`, `0.012`, `0.038`; labels "P ≤ .05" / "n.s." in flag columns.
- **FDR family**: which set of tests each FDR was computed over ("BH across all 8,000 genes, per
  comparison"). Multiple outcomes or comparisons: say whether they share one family.
- **Threshold**: the exact cut-off and correction, using the report's own thresholds.
- **Covariates**: "adjusted for age and site" every time, not only in the methods.
- **n per group**, in headings: "Treated vs control (22 vs 41)".
- **Missing data**: how many values were missing per variable or group, and how they were handled
  (complete case, imputation and method).
- **Pre-specified or exploratory**: label each analysis where it is introduced.
- **Test name** in table captions or headings when more than one test is used.

## Every number is computed

- Numbers in text, tiles and tables come from the analysis output: inline code
  (`` `r n_sig` ``, `{python} n_sig`) or generated tables. Never retype a number.
- If a number must be written by hand, regenerate it before each render and check it against the output.

## Robustness row

When a covariate could explain the result, show the estimate with and without it:

| Unadjusted | + site | + site + baseline score |
|---|---|---|
| β = 2.1 (95 % CI 0.8–3.4) | β = 2.0 (0.7–3.3) | β = 1.6 (0.2–3.0) |

Then say in words how the estimate changes as covariates are added, and any reason the
comparison is not independent evidence (e.g. the covariates were already used when building the
score).

## Count notation

Define once in the reading guide, then use everywhere, with the report's own thresholds:

> **58 | 4 | 1** = genes at unadjusted P ≤ 0.05 | at FDR ≤ 0.1 | at FDR ≤ 0.05.
> Expected by chance at P ≤ 0.05: 8,000 × 0.05 = 400.

- Always show the chance expectation (tests × α) beside an unadjusted count, and label it
  "unadjusted". When the unadjusted count is near or below the expectation, say so in words.
- Headline tiles lead with the FDR-controlled count.
- Show "—" when a threshold doesn't apply to an analysis, and say why in a note.

## Direction in words

Never leave direction to a sign alone.

- Write "higher in the treated group", "rises with the score", "lower in the control group".
- In tables, add a direction column or split tables by direction.
- For agreement between analyses, define it in words: "consistent = same direction in both
  analyses, e.g. a positive correlation and a higher mean in the treated group".

## Honest wording

- Observational data: "associated with", "higher in"; never "causes", "drives", "leads to".
- No "trend toward significance", "borderline significant" or "almost reached significance".
- Not significant ≠ no effect: give the CI and say what effects it rules out.
- If nothing passes the threshold, say so plainly in the section summary.

## Small groups and power

- When a group is small, say so next to every result that depends on it: "The control group has
  only 7 people, so the CI is wide."
- No post-hoc "observed power". Report the CI width, or the minimum detectable effect computed
  before the analysis.

## Results walkthrough box

Under key tables and figures, 2–4 bullets in neutral wording (zh-TW label 結果導讀):

- What the result shows, with the key number and its CI.
- What it does not show.
- Any reason the number is optimistic or pessimistic (model setup, selection, small n).

Describe, don't extend: no mechanism, clinical or practical implication, or recommendation that
the analysis did not test. Prefer "was higher in" over "suggests", "indicates" or "plays a role".

## Caveats

Put each caveat next to the result it limits, and collect the global ones in the summary.
Common ones:

- **Cross-sectional data**: group differences at one time point are not change over time.
- **Colour shows direction of the difference, not a mechanism.**
- **Item identity and grouping can be uncertain**: say how items were named or grouped, and
  whether that can inflate counts.
- **Relative measures**: parts of a whole move together.
- **Design imbalance**: groups that differ in batch, site or timing; point to the sensitivity analysis.

## Main vs sensitivity analyses

- Label each analysis as main, sensitivity or supplementary where it is introduced.
- Base conclusions on the main analysis; report whether sensitivity analyses agree ("11 of 14
  gene sets remain at FDR ≤ 0.1 when low-quality samples are excluded").
- Put sensitivity details in supplements, with a side-by-side column for the main result.
- A sensitivity analysis that changes the conclusion goes in the main text for every audience.

## Traceable counts

- **Count chain** (first supplement): one row per step with the count after it, e.g.
  measured items → passing QC → annotated → included in the analysis.
  Note any step where counts can grow, and why.
- **Overview count matrix** in the methods: analyses × thresholds.
- Every number in the summary must appear in a results section.

## Shown vs full list

When only some items are plotted or tabled, state the rule where they appear:

> "Up-regulated: 240 genes (180 with names); showing the 15 named genes with the smallest P.
> Full list: download `data/up_regulated.csv`."

Link to the full list (collapsible block, supplement or CSV). Mark items that pass extra
criteria with a symbol defined in the reading guide (★, bold).

## Highlighting

When rows are highlighted to cross-reference other results, show a swatch legend under the table
saying what each background colour means.

## Reproducibility appendix

Every report ends with a short block (shorter for lay readers):

- R / Python version and key package versions (`sessionInfo()`, `pip freeze` subset)
- random seeds and number of permutations or resamples
- input data file names with date or hash (not the data itself)
- code commit or script version; render date
