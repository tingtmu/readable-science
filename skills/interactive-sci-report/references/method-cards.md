# Method cards

A method card explains one method in a collapsible block placed right after the method's short
description. Readers who know the method skip it; readers who don't can open it in place.

## Template

Summary line: `ⓘ About: <method name>` (zh-TW: `ⓘ 說明:<方法>`)

| Part | zh-TW label | What goes in it |
|---|---|---|
| Problem | 遇到的問題 | The concrete problem in *this* data that the method solves (1–2 bullets) |
| Approach | 分析方式 | What the method does, step by step, with the formula written out |
| What it improves | 改善了什麼 | What is better than the naive approach, with a number if there is one |
| Limitations | 限制 | What it can't do, and what this report did about it (link the sensitivity analysis) |
| Reference | 文獻 | The original paper, linked to its DOI. Only a source checked as in `report-structure.md` (Appendix → References); otherwise `[reference needed]` |

Optional parts, placed before "Approach":

- **Why this method** (為何用 X): when a less common method was chosen over the usual one.
- **Example** (例子): a worked example with real items and numbers from this report.

Lay the parts out as a two-column grid (label | content) that stacks on narrow screens.

### Example card (illustrative)

> **ⓘ About: false discovery rate (FDR)**
>
> - **Problem**: we test 8,000 genes; at P ≤ 0.05, about 400 would pass by chance alone.
> - **Approach**: Benjamini–Hochberg. Sort the m P values; the i-th smallest gets
>   `q₍ᵢ₎ = min over j ≥ i of ( m · P₍ⱼ₎ / j )`. In words: each P is scaled up by how many tests were
>   run relative to its rank.
> - **What it improves**: among results at FDR ≤ 0.1, on average at most 10 % are false positives.
> - **Limitations**: controls the share of false positives, not the chance of any; with few true
>   effects and small samples, few results pass.
> - **Reference**: Benjamini Y, Hochberg Y. Controlling the false discovery rate. *J R Stat Soc B*
>   1995. [doi:10.1111/j.2517-6161.1995.tb02031.x](https://doi.org/10.1111/j.2517-6161.1995.tb02031.x)
>   (illustrative; still check it as in `report-structure.md`, Appendix → References)

## Formulas

- Write the model in full, in a monospace block, with subscripts:
  `y = β₀ + β_X·X + β_age·age + β_sex·sex` (one model per feature).
- Define every symbol right after the formula, not elsewhere.
- Restate it in one plain sentence: "the X effect is the association with X after holding age
  and sex fixed."
- Say what the reported number *is* in terms of the formula ("log2FC = difference in group
  means of the log2 values").

## Worked numeric examples

When a method is abstract, walk through one real case from the report with its actual numbers.
Use a concrete metaphor and keep the method's own symbols visible.

Pattern (permutation test as reshuffled labels, illustrative numbers):

> - Observed: the treated group's mean is **1.8 units** higher than the control group's.
> - Shuffle the group labels at random **B = 10,000** times and recompute the difference each time.
> - **b = 37** shuffles gave a difference at least as large as 1.8.
> - P = (b + 1) / (B + 1) = 38 / 10,001 ≈ **0.0038**.

Then say in the limitations what the example exposes about the method, using the same numbers.

## Analogies and comparison tables

When two methods are easily confused, give an everyday analogy and a side-by-side table.

Pattern (paired vs unpaired comparison):

| | Paired | Unpaired |
|---|---|---|
| Data | The same people measured twice | Two separate groups |
| Analogy | Weighing the same people before and after a diet | Weighing two different crowds |
| Compares | Each person's own change | The two group averages |
| Strength | Person-to-person variation cancels out | Needs no matching |
| Limitation | Needs complete pairs | Person-to-person variation adds noise |

End with what this means for reading the results, e.g. why the paired P can be much smaller on
the same data.

## Main vs sensitivity

In each card or method paragraph, say the method's role: **main analysis**, **sensitivity
analysis**, or **supplementary**, and where its results are.
