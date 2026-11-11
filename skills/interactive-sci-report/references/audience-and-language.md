# Audience and language

## Audience profiles

Ask the audience in Step 0. Each profile changes how much is explained, not what is true:
every audience gets the same numbers, thresholds and caveats.

Jargon tips follow one rule: no tip for terms of the reader's own field, a tip for everything
else. Each profile below says what its own field is. If you don't know whether a term is in the
reader's field, give it a tip; if the user named terms the readers use every day, skip those.

### PI / lab meeting

Readers who know the project and the methods in broad terms, and will decide what to do next.

- Full skeleton, all results sections, complete supplements.
- Method cards collapsed but complete; analogies only for methods that are easily confused.
- Formulas in every card.
- Jargon tips on all terms except the lab's routine ones (its domain and the methods it uses often).
- Emphasise decisions: what is robust, what is fragile. Put suggested next analyses only in the
  Summary, labelled as proposals, never in results walkthrough boxes.
- Keep the revision changelog visible (collapsed block at the end).

### Clinical or domain collaborators

Readers who know the subject area well but not the statistics.

- Background and summary carry the most weight; lead each section with its plain-language finding.
- Method cards collapsed, analogy and worked example first, formula after.
- Jargon tips on every statistical and method term, in plain wording (plainer than for PI);
  none on terms of their own subject area (e.g. clinical terms for clinicians).
- One-line summary of each sensitivity analysis in the text ("results hold when outliers are excluded"), details in supplements.
- Attach no domain meaning the analysis did not test; repeat the caveats that stop over-reading
  (e.g. colour shows direction, not mechanism; cross-sectional data).

### Methods peers (statistics, data analysis)

Readers who will check or reproduce the analysis.

- Method cards open by default, with parameters (α, folds, repeats, permutations, seeds), software and version.
- Fewer analogies; keep formulas, definitions and thresholds exact.
- Sensitivity analyses in the main text next to the main result.
- Full lists, count chains and code or file pointers in supplements.
- Jargon tips on domain terms and on project-specific or non-standard terms; none on standard
  statistical methods.

### Lay readers / students

Readers new to the field.

- Story first: background steps, then the 2–3 most important findings, then caveats.
- Keep only the methods needed to understand those findings; each as a short analogy with one worked example.
- Formulas as a plain sentence; show the symbol form only if it helps.
- Jargon tips on every term, including field terms.
- Omit full lists and most supplements; keep one line on what was checked. Never omit a
  sensitivity analysis that changes the conclusion.

## Language

Ask the report language in Step 0. Write the whole report in that language, but keep standard
statistical symbols and widely used abbreviations (P, FDR, r, log2FC, n).

### Term introduction

| Report language | First use | After |
|---|---|---|
| zh-TW | 中文名(English full name, ABBR), e.g. 偽發現率(false discovery rate, FDR) | ABBR, e.g. FDR |
| English | English full name (ABBR), e.g. false discovery rate (FDR) | ABBR |
| Other | native name (English full name, ABBR), as for zh-TW | ABBR |

- Every introduced term also gets a jargon tip (unless it is in the reader's own field) and a row in the abbreviation table.
- Use one term per concept across the whole report; don't alternate synonyms.
- Database and method names stay in their original form (KEGG, GSEA, Wilcoxon).

### zh-TW labels

When the report is in zh-TW, use these labels for recurring parts:

| Part | zh-TW |
|---|---|
| Background | 研究脈絡 |
| Methods / Analysis overview | 方法 / 分析總覽 |
| Reading guide | 讀法說明 |
| Section summary | 本節摘要 |
| Results walkthrough | 結果導讀 |
| Summary | 總結 |
| Supplements | 補充資料 |
| Appendix: abbreviations / references | 附錄 縮寫與名詞 / 附錄 參考文獻 |
| Method card parts | 遇到的問題 / 分析方式 / 改善了什麼 / 限制 / 文獻 (為何用 X / 例子) |
| About X (card summary) | ⓘ 說明:X |

## Writing style

- Short bullets, with nested sub-bullets for detail; avoid long paragraphs.
- Lead with the finding, then the number: "Risk score tracks the outcome: r = 0.52 (P = 3e-05)".
- Bold the key number or entity in a bullet, not whole sentences.
- Put units in headers ("Mean change (weeks)") and n in headings ("(22 vs 41)").
- Use the entity colour on entity names in text (e.g. outcome A always in its colour).
- Plain verbs over nominalisations: "we compared", not "a comparison was performed".
