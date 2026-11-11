# R recipe: ggiraph + Quarto / R Markdown

One way to meet the interactive rules in R. Checked against ggiraph 0.9.6, htmlwidgets 1.6.4 and
htmltools 0.5.9; check `?girafe` and `?opts_tooltip` if your versions differ. Python and plain-SVG
notes are at the end.

## Value tooltips on every mark

Use the `*_interactive` version of each geom and give every mark a `tooltip` (what to show),
a `data_id` (what to highlight together) and, where the chart drives a detail panel, an `onclick`.

```r
library(ggplot2)
library(ggiraph)

fmt_p <- function(p) ifelse(p < 1e-3, formatC(p, format = "e", digits = 1), formatC(p, format = "f", digits = 3))

res <- res |>
  dplyr::mutate(tip = sprintf(
    "<b>%s</b><br>log2FC = %.2f (95%% CI %.2f to %.2f)<br>P = %s · FDR = %s<br>n = %d vs %d",
    htmltools::htmlEscape(full_name), log2fc, lo, hi, fmt_p(p), fmt_p(fdr), n1, n2
  ))

p <- ggplot(res, aes(log2fc, -log10(p))) +
  geom_point_interactive(aes(tooltip = tip, data_id = id, colour = direction, shape = direction)) +
  scale_colour_manual(values = c(higher = "#B2182B", lower = "#2166AC")) +  # or the user's palette
  labs(x = "log2FC (treated − control)", y = "−log10 P")
```

- Short labels on the plot, full name in `tooltip`; escape names with `htmltools::htmlEscape()`.
- Use pseudonymous IDs in `data_id` and tooltips, never names or record numbers of people.
- Bars: `geom_col_interactive()`; violins / boxes: `geom_violin_interactive()`,
  `geom_boxplot_interactive()`; points over them: `geom_jitter_interactive()`.
- Build the values table from the same data frame (`res`), so chart and table can't disagree.

## girafe() options, and drop the fonts

`girafe()` attaches Liberation web-font dependencies by default; embedded, they add about 9 MB per
report. Drop them and use system fonts:

```r
as_widget <- function(p, w = 8, h = 5, png_name = "figure") {
  x <- girafe(ggobj = p, width_svg = w, height_svg = h, options = list(
    opts_tooltip(css = "background:#1d2b33;color:#fff;padding:6px 9px;border-radius:6px;font-size:12px;",
                 use_cursor_pos = TRUE, opacity = 0.95),
    opts_hover(css = "stroke:#000;stroke-width:1.5px;"),
    opts_hover_inv(css = "opacity:0.35;"),
    opts_selection(type = "none"),
    opts_toolbar(position = "bottomright", fixed = TRUE,   # always visible, bottom-right
                 saveaspng = TRUE, pngname = png_name, hidden = "selection"),
    opts_zoom(min = 1, max = 4),                           # adds the zoom buttons
    opts_sizing(rescale = TRUE)
  ))
  x$dependencies <- Filter(\(d) !grepl("^liberation", d$name, ignore.case = TRUE), x$dependencies)
  x
}
```

- The toolbar gives the chart controls, fixed in the bottom-right corner: pan / zoom on-off
  (then the mouse wheel zooms in and out), zoom to a rectangle, reset, and download as PNG.
  `hidden = "selection"` drops the lasso buttons, which do nothing outside Shiny. The "misc"
  group also shows a full-screen button; keep it, or add `"fullscreen"` to `hidden`.
- A fixed bottom-right toolbar sits over whatever is drawn there (x-axis title, legend, panel
  tag). Leave room, e.g. `+ theme(plot.margin = margin(5.5, 5.5, 28, 5.5))`, or put legends at
  the top, and check that no mark or label is hidden.
- Keep the number of widgets small: plot the top items interactively and put the rest in tables.

## Multi-panel figures (patchwork)

Combine panels with patchwork and pass the result to `girafe()` as one widget: one toolbar, and
hovering a `data_id` highlights it in every panel.

```r
library(patchwork)
fig <- (p_volcano | p_bars) + plot_annotation(tag_levels = "A")
as_widget(fig, w = 10, h = 4.5, png_name = "fig2_effects")
```

- Use the same `data_id` for the same item across panels.
- Give each panel its own encoding legend in the caption ("A: …; B: …").

## Click → detail panel

```r
geom_col_interactive(aes(
  tooltip = tip, data_id = set_id,
  onclick = "showDetailEl(this)"   # no quotes inside onclick (see Pitfalls)
))
# page: <script>window.DETAILS = {"<set_id>": {panel: "cp-A", key: "<key>", title: "…"}}</script>
```

`showDetailEl(el)` reads the mark's `data-id`, finds its entry in `window.DETAILS` and fills the
panel from lazy placeholders; see `assets/report.js` and `interactive-components.md`.

## Pitfalls

Each of these broke a real report:

| Problem | Fix |
|---|---|
| `onclick` containing `'` is turned into curly quotes in some pipelines: JS SyntaxError, the click does nothing | Put no quotes in `onclick`: `onclick = "showDetailEl(this)"`, and look the target up from the element's `data-id` in a `window.DETAILS` map (see `assets/report.js`) |
| After dropping the Liberation font dependency the SVG text falls back to a serif font | Set a system font in the plot (`theme(text = element_text(family = "sans"))`) or rewrite `font-family='Liberation Sans'` in the widget HTML to a system font stack |
| `dep$src$file` is already absolute after `copyDependencyToDir()` | Don't prepend the package path again; call `makeDependencyRelative()` next |
| The widget div has a fixed pixel width and overflows phones | CSS override: `.girafe{width:100%!important;height:auto!important}` inside the chart box |
| A placeholder `min-height` leaves a blank area after the chart loads on phones | Clear it on load (`ph.style.minHeight=''`), as the lazy loader in `assets/report.js` does |

## Size budget

A single file over ~10 MB is slow to open and hard to email, and dense charts reach it fast
(every point is one SVG element carrying its own tooltip).

- **Measure early**: build one heavy chart, check the output size, extrapolate, then decide.
- **Dense charts** (scatter grids, many points): plain-text tooltips, no HTML; HTML tags in
  tooltips are escaped several times over and grow quickly.
- **Cap** the points per chart and the members per click-to-detail panel (e.g. top 4); link the
  full list as a table or CSV.
- **Share** one detail widget between chart elements that have the same members.
- Over budget after this: switch to folder mode (Step 0 sharing) and tell the user.

## Quarto (single file or folder)

```yaml
---
title: "…"
lang: zh-TW               # or en; "zh-Hant" gives Simplified UI labels
format:
  html:
    embed-resources: true # single file; false = folder mode, libraries in a shared folder
    html-math-method: mathml   # formulas render offline
    toc: true
    toc-location: left
execute:
  echo: false             # show code only for methods peers (then code-fold: true)
---
```

- Each printed girafe object becomes a widget.
- Use Quarto's `::: {.panel-tabset}` and `::: {.callout-note collapse="true"}` for tabs and method
  cards, or the snippets from `interactive-components.md` in ```` ```{=html} ```` blocks, not both.
- Inline numbers from computed objects: `` `r n_fdr` ``.

## R Markdown

```yaml
output:
  html_document:
    self_contained: true   # false = folder mode
    mathjax: null          # MathJax loads from a CDN; write formulas as Unicode or MathML instead
    toc: true
    toc_float: true
```

## Hand-built page with lazy charts (folder mode)

Tested pattern: each widget becomes `figs/fig-<id>.js`, libraries go once into `assets/`, and
the page's `report.js` (from `interactive-components.md`) loads each figure on first view.

```r
library(htmltools)
out <- "report_v3"
dir.create(file.path(out, "figs"), recursive = TRUE); dir.create(file.path(out, "assets"))

deps <- list()
for (id in names(widgets)) {                      # widgets: named list from as_widget()
  rt <- renderTags(widgets[[id]])                 # widget div + JSON; dependencies separate
  deps <- c(deps, rt$dependencies)
  writeLines(sprintf("registerFig(%s,%s);",
                     jsonlite::toJSON(id, auto_unbox = TRUE),
                     jsonlite::toJSON(as.character(rt$html), auto_unbox = TRUE)),
             file.path(out, "figs", paste0("fig-", id, ".js")), useBytes = TRUE)
}
deps <- resolveDependencies(deps)                 # each library once
deps <- lapply(deps, copyDependencyToDir, outputDir = file.path(out, "assets"))
deps <- lapply(deps, makeDependencyRelative, basepath = out)
head_html <- renderDependencies(deps, srcType = "file", encodeFunc = identity, hrefFilter = identity)
# page: tags$head(HTML(head_html), …), placeholders tags$div(`data-fig` = id, style = "min-height:420px"),
# then tags$script(src = "assets/report.js") last; save_html(page, file.path(out, "index.html"))
```

**Single-file variant:** inline the libraries (`renderDependencies(..., srcType = "file")` then
read each file into `<script>` / `<style>`), and put each widget's `as.character(rt$html)` inside
`<div data-fig="id"><template>…</template></div>` instead of a `figs/` file.

## Widgets in hidden tabs or collapsed blocks

Widgets rendered while hidden get zero size. The lazy loader renders them when shown; if you
don't use it, fire `window.dispatchEvent(new Event('resize'))` after showing a tab or opening a
`<details>`.

## Python and plain SVG

- **Plotly (Python)**: `fig.to_html(full_html=False, include_plotlyjs=False)` per figure, with
  `plotly.min.js` copied once into `assets/` (folder) or inlined once (single file); values via
  `hovertemplate`. Same placeholder / `registerFig` pattern; call `Plotly.newPlot` on mount instead
  of `HTMLWidgets.staticRender()`. The modebar gives zoom, reset and PNG download (move it to the
  bottom-right with CSS); use `make_subplots` so a multi-panel figure is one widget.
- **Plain SVG**: give each mark a `<title>` with its values (native tooltip) and, for jargon,
  `class="gl" tabindex="0" data-tip="…"` on the SVG element; the jargon-tip script works on SVG too.
  For chart controls, reuse the flowchart's full-screen zoom overlay and add a "Download SVG" link
  built from a Blob URL (works under `file://`).
