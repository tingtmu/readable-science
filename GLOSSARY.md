# Readable Science

Shared language for the skills in this repo, which help agents turn data analyses into reports that readers can follow, check and trust.

## Reports and readers

**Report**:
A document that presents the results of one analysis project to people, delivered as a single file or a folder.
_Avoid_: dashboard, notebook, page

**Audience**:
The group of readers a report is written for, which sets how much is explained and how much is shown.
_Avoid_: user, reader type, persona

**Revision**:
One delivered version of a report, named by its version tag (e.g. v3b).
_Avoid_: draft, iteration

**Change ID**:
A short code (e.g. L1) naming one piece of reader feedback that a revision addresses.
_Avoid_: ticket, issue number

## Report parts

**Section summary**:
The opening block of a results section: the key counts as tiles plus a few key findings.
_Avoid_: abstract, TL;DR, highlights

**Reading guide**:
The part of the methods that defines, once, what columns, signs, colours and count notation mean.
_Avoid_: legend, key, notes

**Method card**:
A collapsible explanation of one analysis method, always in the order problem, approach, what it improves, limitations, reference.
_Avoid_: info box, method note

**Results walkthrough box**:
A short block under a key table or figure saying, in neutral wording, what the result shows and what it does not, without interpretation beyond what was tested.
_Avoid_: interpretation box, comment, discussion

**Supplement**:
A collapsible part at the end holding sensitivity analyses, count chains and full lists.
_Avoid_: appendix (reserved for the abbreviation table and references)

**Abbreviation table**:
The appendix table listing each abbreviation with its full name and a plain-language explanation.
_Avoid_: glossary (reserved for this file)

## Explaining and encoding

**Action box**:
A flowchart box whose text says what was done at that step, optionally with its input and output.
_Avoid_: node, step box

**Jargon tip**:
A plain-language explanation that appears when the reader points at, focuses or taps a technical term.
_Avoid_: tooltip (that word is kept for chart value pop-ups), popover

**Chart controls**:
The zoom, reset and download-image buttons in the bottom-right corner of every chart.
_Avoid_: toolbar (the plotting library's name for it), menu

**Values table**:
The collapsible table under a chart listing the numbers the chart shows.
_Avoid_: data table, raw data

**Value tooltip**:
The pop-up showing the exact values behind a chart mark when the reader points at it.
_Avoid_: hover label, jargon tip

**Encoding legend**:
The statement of what each visual channel (colour, size, shape, border, fill) means in a figure or table.
_Avoid_: key

## Statistical reporting

**Main analysis**:
The analysis whose results the report's conclusions rest on.
_Avoid_: primary result, default analysis

**Sensitivity analysis**:
A re-run with a changed assumption, shown to check whether the main analysis holds.
_Avoid_: robustness check, extra analysis

**Count notation**:
The compact form "58 | 4 | 1": items passing the unadjusted threshold | the first FDR threshold | the second FDR threshold.
_Avoid_: hit counts

**Count chain**:
The table tracing how many items remain after each filtering or mapping step, from raw data to final list.
_Avoid_: funnel, flow numbers

**Reproducibility appendix**:
The closing block listing software versions, seeds, input files and code version behind a report.
_Avoid_: session info, methods details

**Caveat**:
An explicit statement of what a result cannot show, written next to the result it limits.
_Avoid_: disclaimer, limitation note
