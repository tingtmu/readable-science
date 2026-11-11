---
name: interactive-sci-report
description: Conventions for turning data or statistical analysis results into an interactive HTML report (plain HTML, Quarto .qmd, or R Markdown .Rmd rendered to HTML) that readers can follow, check and trust. Use when the user asks to write up, present, report, knit or render analysis results as an HTML/Quarto/Rmd report, a results write-up or a lab-meeting report, or to revise such a report (e.g. "make v3"). Asks the audience, language and sharing mode first. Not for slide decks, Word/PDF files, dashboards, Shiny apps or websites.
---

# Interactive scientific report

Build reports where every number is traceable, every method is explained, every term the reader
may not know can be looked up in place, and every chart shows its values on hover.

## Step 0: ask before building

Ask these in one round:

1. **Audience**: PI / lab meeting · clinical or domain collaborators · methods peers
   (statistics, data analysis) · lay readers / students
2. **Language**: the report language (e.g. zh-TW or English)
3. **Sharing**: single file (default: email, chat, archived revisions) or folder (lab server,
   GitHub Pages, synced drive, or when one file would exceed ~10 MB)
4. **Revision**: new report, or a revision? For a revision, get the version tag (e.g. `v3b`) and
   the feedback to address, each with a change ID (e.g. `L1`).
5. **Terms** (optional): terms the readers use every day, or terms they want explained. Skip if
   the user has no view; the tip rule below then applies.

Skip what the request already answers. **If you cannot ask** (non-interactive run), use PI / lab,
the language of the request, single file and new report, and state these assumptions in the
report header and in your reply.

## Core rules

These always apply. Details and examples live in `references/`.

1. **Action boxes in flowcharts.** Each box has a bold stage title and lines that say what was
   done (verb first: "Fitted one model per gene"). For complex steps add input → output with counts
   ("20,000 genes → 8,000 after expression filter"). Give a legend for arrow types. Lay it out so
   no line or arrow crosses a box, a label or another line, and check the rendered result
   (visually, or by its geometry if you cannot view it).
2. **Jargon tips, sparingly.** Tip project-specific, non-standard and out-of-field terms with a
   plain-language pop-up on hover, keyboard focus and tap. For PI / lab and methods peers,
   standard statistics (correlation and rank tests, P, FDR, CI, SD, IQR, effect size) get no tip;
   lay readers get tips on all terms (see the audience matrix). When unsure, leave it out for PI /
   peers. Soft budget: about 8 tips per report and 3 per section for PI / lab; go over it when the
   terms need it, and say so in your reply. Tip the first use in a section, not every use; tip a
   table header only if it is not self-explanatory. On first use write the full name with its
   abbreviation; after that the abbreviation. The abbreviation table lists every abbreviation
   whether or not it has a tip.
3. **Formulas written out.** Show the formula or model (e.g. `y = β₀ + β_X·X + β_age·age`),
   define every symbol, then restate it in one plain sentence. Render math offline (MathML or Unicode).
4. **Interactive charts with a values table.** Pointing at any mark shows a value tooltip with its
   exact values. Short labels on the plot, full names in the tooltip. Each chart has zoom and
   download-image controls in its bottom-right corner that hide no mark or label; multi-panel
   figures are one widget. Every
   chart also has a collapsible values table, so keyboard and screen-reader users can read it and
   anyone can check it.
5. **Method cards.** Each method gets a collapsible card: problem → approach → what it improves →
   limitations → reference.
6. **Section summary.** Each results section opens with key-count tiles and 2–4 key findings. If
   nothing passed the threshold, the summary says so.
7. **Reading guide.** Define once, in the methods, what columns, signs, colours and count
   notation mean.
8. **Complete statistics.** Effect size with 95 % CI on a stated scale and unit; P and FDR, naming
   the family each FDR is computed over; covariates; thresholds; n per group; missing data and how
   it was handled. Label each analysis pre-specified or exploratory. Beside any count of unadjusted
   hits, show how many are expected by chance (tests × α). Flag small groups; no post-hoc power.
9. **Honest wording.** Direction in words ("higher in the treated group"). Association language for
   observational data; no causal verbs, no "trend toward significance". Report what was tested
   and found; add no mechanism, implication or speculation the analysis did not test. Under key
   tables and figures, a results walkthrough box says what the result shows and does not show.
   Caveats next to the result they limit. Label main vs sensitivity analyses.
10. **Traceable, computed numbers.** Every number comes from computed output (inline code or a
    generated table), never typed by hand, and can be traced through a count chain. State the
    rule for which items are shown and link the full list.
11. **No invented sources, no unsupported citations.** Cite only papers the user gave or you
    verified exist, and only after reading their text (abstract or full text) and confirming it
    states the cited claim; otherwise write `[reference needed]`. Never invent prior findings for
    the background. If your agent can start subagents, hand the source reading to one on a
    mid-tier model and keep only its verdict table. How to check: `references/report-structure.md`
    (Appendix).
12. **Portable output.** Package as chosen in Step 0: one file, or a folder (`index.html`,
    `assets/`, `figs/`, `data/`). Both must open by double-click with no server or internet: no
    `fetch`, no ES modules, no CDN, no web fonts. Include each library once; render off-screen,
    collapsed and tabbed charts on first view; support light/dark and phone width; make long tables
    sortable and searchable. Report the final size and file count.
13. **Privacy.** Use pseudonymous IDs in tooltips and tables; embed nothing beyond what is
    displayed; hide code (`echo: false`) unless the audience is methods peers. Ask before
    row-level data leaves the team.
14. **Fixed colour per entity.** One colour per group or outcome across the report: from the
    user's own palette if they give one (in their order), otherwise a colour-blind-safe palette.
    Replace the example hex values in the references with the palette in use; direction colours
    (higher / lower) follow the same rule. If the user's palette is not colour-blind-safe or lacks
    dark-mode contrast, keep it, use a lighter variant of each colour in dark mode, and tell the
    user. Always add a redundant shape or label and an encoding legend on every figure.

## Audience matrix

| | PI / lab | Collaborators | Methods peers | Lay / students |
|---|---|---|---|---|
| Method cards | collapsed, complete | collapsed, analogy first | open, with parameters | 1–2 key methods only |
| Formulas | yes | yes + plain sentence | yes + parameters, software | plain sentence only |
| Analogies, worked examples | where confusable | many | rare | many |
| Jargon tips | project-specific and out-of-field terms; not standard statistics (~8, soft) | statistical and method terms, plainer; not their subject-area terms | domain and non-standard terms; not standard methods | all terms, plainest |
| Sensitivity analyses | supplement, complete | summary line + supplement | main text | one line* |
| Full lists, count chains | supplement | supplement | supplement | omit |
| Code shown | no | no | folded | no |
| Reproducibility appendix | yes | yes | yes, detailed | yes, short |

\* Never drop a sensitivity analysis that changes the conclusion, for any audience.
Details in `references/audience-and-language.md`.

## Workflow

1. Confirm Step 0 (or state the defaults you assumed). Test the toolchain before planning the
   pipeline: run R / Python and load the packages you need. If a build script the user gave does
   not run, ask once; then reuse only its data and statistics parts and rebuild the rest.
2. Read the reference files you need (index below).
3. Outline the skeleton (`references/report-structure.md`) and fill it from computed output.
4. Build: text, method cards, tables, interactive charts with values tables, flowchart. Optional
   starting point: `assets/template.html`, `assets/report.css`, `assets/report.js` (copy and edit,
   or write your own). Measure the file size after the first heavy chart.
5. Check the rendered page (`assets/check_report.mjs` if Node and Chrome or Edge are available,
   otherwise by screenshots or reading the DOM), then run the self-check and fix every miss.
6. For a revision: name the file with the version tag and add the changelog block.
7. Tell the user the output size and file count, every citation not confirmed as "supports"
   (reworded, `[reference needed]` or not accessed), and what you could not check (e.g. flowchart
   layout, phone view).

## Self-check

**Must fix**

- [ ] Audience, language and sharing mode confirmed (or defaults stated)
- [ ] Every number comes from computed output and is traceable through the count chain
- [ ] Effect sizes with CIs; P and FDR with FDR families named; unadjusted counts with the chance
  expectation; n per group, missing data, pre-specified vs exploratory, main vs sensitivity stated
- [ ] No causal wording for observational results; nothing beyond what was tested; caveats next to
  the results they limit; walkthrough boxes only describe
- [ ] Every citation exists and its text was read and supports the claim; gaps reworded, marked
  `[reference needed]` and reported
- [ ] Opens by double-click offline; no CDN, fetch, ES modules or web fonts; size reported
- [ ] Only displayed data is embedded; IDs pseudonymous; code hidden unless audience is peers

**Polish**

- [ ] Flowchart boxes say what was done, with counts where useful; layout checked (no crossings),
  or the unchecked layout is reported
- [ ] Every chart (multi-panel = one widget) shows exact values on hover, has bottom-right controls
  that hide no mark or label, and a values table
- [ ] Every method has a five-part card; every formula is written out, defined and restated
- [ ] Every results section opens with a section summary, including "nothing passed" cases; the
  reading guide defines columns, signs, colours and count notation
- [ ] Non-standard and out-of-field terms have tips (near the budget), working on hover, focus
  and tap; standard terms for this audience have none
- [ ] Readable in dark mode and at phone width (no horizontal page scroll); user's palette (or
  colour-blind-safe default) with redundant cues

## Reference index

| File | Read when |
|---|---|
| `references/report-structure.md` | Planning the skeleton, summary, supplements, appendix, revisions |
| `references/method-cards.md` | Explaining a method: card template, formulas, worked examples, analogies |
| `references/stats-reporting.md` | Writing numbers, CIs, thresholds, directions, caveats, reproducibility |
| `references/interactive-components.md` | Jargon tips, tables, tabs, contents, flowchart, packaging and lazy loading |
| `references/audience-and-language.md` | Tuning depth to the audience; bilingual term rules; writing style |
| `references/r-ggiraph-recipe.md` | Building the report in R (ggiraph, Quarto / R Markdown), pitfalls, size budget; Python / SVG notes |
| `assets/` (optional) | `template.html`, `report.css`, `report.js`: a ready page with every component; `check_report.mjs`: rendered check |
