# readable-science

Agent skills for writing scientific analysis reports that readers can follow, check and trust.
The conventions come from prior interactive HTML reports and are written so that any
agent that reads `SKILL.md` files (Claude Code, Codex, Cursor, Gemini CLI and others) can use them.

## Skills

| Skill | Use it when |
|---|---|
| [`interactive-sci-report`](skills/interactive-sci-report/SKILL.md) | Writing up data or statistical analysis results as an HTML, Quarto or R Markdown → HTML report |

What `interactive-sci-report` makes the agent do:

- ask which audience the report is for, and in which language, before building anything
- write flowchart boxes as actions ("what was done"), with input and output where useful, and
  lay out arrows so they never cross boxes, labels or each other
- give a plain-language pop-up explanation for every term outside the reader's own field
- write formulas out, then say them again in plain words
- make charts interactive, so pointing at a mark shows its values, with zoom and download
  controls and a values table under each
- report effect sizes with confidence intervals in neutral wording, describing results without
  reading more into them than was tested
- never invent numbers or references, and check that each cited paper actually states the claim
- package the report as one file or a light folder that opens offline
- explain each method in a fixed card: problem, approach, what it improves, limitations, reference
- report covariates, thresholds, P and FDR, effect sizes, group sizes and caveats every time

Terms used across the skills are defined in [GLOSSARY.md](GLOSSARY.md).

## Install

Install with the [`skills` CLI](https://github.com/vercel-labs/skills):

```bash
npx skills add tingtmu/readable-science
```

Or copy it by hand into your agent's skills folder, e.g. for Claude Code at project level:

```bash
cp -r skills/interactive-sci-report .claude/skills/
```

## Layout

```
skills/
└── interactive-sci-report/
    ├── SKILL.md              workflow, core rules, audience matrix, self-check
    └── references/           loaded only when needed
```

## Contributing

Keep each `SKILL.md` short and move detail into `references/`. Do not put study data, cohort
details or unpublished results in examples; use illustrative numbers.
