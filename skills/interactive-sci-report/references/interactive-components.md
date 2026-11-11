# Interactive components

Required behaviours first, then minimal plain HTML/CSS/JS that implements them. The snippets
need no libraries and run from `file://`. Put the CSS in one `<style>` (or `assets/report.css`)
and the JS in one `<script>` at the end of the body (or `assets/report.js`).

**Ready-made versions (optional).** The skill's `assets/` folder holds the assembled form of every
snippet below: `template.html` (page skeleton with all components), `report.css`, `report.js`
and `check_report.mjs` (rendered check). Copying them saves rebuilding the page each run; edit
freely, or write your own. If you change a snippet here, keep the asset in step.

**Don't mix component systems.** In Quarto, either use its built-ins (`panel-tabset`, callouts,
its contents sidebar, which already handle deep links) or these snippets, not both in one report.

## Required behaviours

| Component | Must |
|---|---|
| Jargon tip | Show on mouse hover, keyboard focus and tap; dismiss with Esc, tap elsewhere or scroll; float above table scroll areas; `role="tooltip"` |
| Value tooltip | Every chart mark shows its exact values (label, estimate, CI, P, FDR, n) on hover |
| Chart controls | Zoom (buttons, or a pan / zoom toggle with the mouse wheel), reset and download image, in the chart's bottom-right corner, covering no mark or label |
| Values table | Every chart has a collapsible table of the numbers it shows (per-panel statistics always; point-level rows when the marks carry the information) |
| Tables | Sticky header; numbers right-aligned, tabular digits; long tables sortable (keyboard-operable) and searchable; blanks / NA sort last |
| Tabs | For parallel comparisons; counts on tab buttons; ARIA tabs with arrow-key navigation |
| Contents | Sticky sidebar with the current section highlighted; collapsible on narrow screens |
| Deep links | `#id` (including CJK ids) opens any collapsed block or tab containing the target |
| Flowchart | Action boxes; no crossing or overlapping lines; full-screen view with zoom in / out / reset; Esc closes |
| Detail panel | Clicking a chart element shows its member plots in a panel below |
| Captions | Small, left-aligned, state the encoding legend; expand abbreviations |
| Theme | Colour tokens with a dark set; entity colours from the user's palette (else colour-blind-safe) with redundant labels |
| Packaging | Single file or folder; opens offline by double-click; heavy charts render on first view |

## Action-box flowchart

Each box: bold stage title, then action lines (verb first), with counts where useful.

```
┌──────────────────────────────────────────────┐
│ Analysis data: 8,000 genes × 64 patients     │  ← title (bold)
│ Log-transformed; every model adjusts for site│  ← action line
└──────────────────────────────────────────────┘
        │ main input            ┆ partial use (dashed)
┌───────────────────────┐   ┌────────────────────────────────┐
│ Result 1 Association  │   │ Gene-set mapping               │
│ Fitted one model/gene │   │ 8,000 genes → 6,900 with IDs   │
│ Ranked genes by t     │   │ → 2,500 in any set             │
└───────────────────────┘   └────────────────────────────────┘
```

- Solid arrow = main input; dashed arrow = partial use. Say this in a legend.
- **Layout without overlaps.** Place boxes on a grid (top-down or left-to-right) and route
  connectors at right angles through the gaps between boxes. No connector crosses a box, a label
  or another connector; arrowheads stop at the box edge; arrow labels sit beside the line, not on
  it. If two connectors would cross, reorder the boxes or route around them; if a crossing still
  cannot be avoided, draw a small arc (line jump) where they cross so they clearly don't connect.
- **Check the layout after rendering**: view a screenshot at desktop and phone width if you can;
  otherwise check the SVG geometry (each connector segment against every box, label box and other
  segment). If you could do neither, say "flowchart layout not visually checked" in your reply.
- Highlight the input box (accent fill); keep others neutral.
- Numbered circles on boxes refer to numbered notes beside the chart.
- Draw it as inline SVG with `class="flowsvg"`, `role="img"` and a `<title>` summarising the flow.
  Use Mermaid only if the toolchain pre-renders it to SVG (no CDN at view time).

## CSS tokens and base

```css
:root{--bg:#f6f8fa;--surface:#fff;--surface2:#eef2f6;--fg:#1a2230;--muted:#5b6678;
 --border:#e1e6ec;--accent:#2f6f8f;--accent-soft:#e7f1f6;
 --ent1:#007A5E;--ent2:#A64D8A;            /* entities: replace with the user's palette if given */
 --up:#B2182B;--down:#2166AC;              /* direction: higher / lower */
 font-family:system-ui,"Segoe UI","Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0f141b;--surface:#161d27;
 --surface2:#1c2531;--fg:#e6ebf2;--muted:#93a0b2;--border:#28313f;--accent:#6fb4d1;--accent-soft:#14303b;
 --ent1:#3FD0A5;--ent2:#E39BC8;--up:#F4A582;--down:#92C5DE}}
body{background:var(--bg);color:var(--fg);line-height:1.65}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
.tblwrap{max-height:70vh;overflow:auto}   /* sticky header needs the scroll container here */
thead th{position:sticky;top:0;background:var(--surface2)}
figcaption,.tcap{font-size:11px;color:var(--muted);text-align:left}
details.mcard{background:var(--accent-soft);border:1px solid var(--border);border-radius:10px}
.crow{display:grid;grid-template-columns:120px minmax(0,1fr);gap:4px 14px}
@media (max-width:620px){.crow{grid-template-columns:minmax(0,1fr)}}
/* phone width: never plain 1fr (a <pre> or wide table then widens the whole page) */
.layout{display:grid;grid-template-columns:230px minmax(0,1fr)}main{min-width:0}
@media (max-width:1000px){.layout{grid-template-columns:minmax(0,1fr)}}
/* charts keep readable text on phones and pan inside their box instead of shrinking */
.chartbox{overflow-x:auto}
@media (max-width:700px){.chartbox>[data-fig]>*{min-width:640px}}
```

- System fonts only; no web fonts.
- Entity colours always come with a redundant cue (label, shape or line type).
- Charts don't read these tokens: pass the same hex values to the plotting code, and give chart
  backgrounds a fixed colour that works in both themes (or render a light and a dark version).

## Jargon tip

Markup: `<span class="gl" tabindex="0" data-tip="Plain explanation.">Score A</span>`. Which
terms get one, and the soft budget: `audience-and-language.md`. The cost is the wording, not the
code; keep each tip to one or two plain sentences.

```css
.gl{border-bottom:1px dotted var(--accent);cursor:help}
#gltip{position:fixed;z-index:2000;max-width:min(360px,86vw);background:#1d2b33;color:#fff;
 font-size:12.5px;padding:8px 11px;border-radius:8px;display:none;pointer-events:none}
#gltip.on{display:block}
```

```js
var tip=document.createElement('div');tip.id='gltip';tip.setAttribute('role','tooltip');
document.body.appendChild(tip);var tipFor=null;
function showTip(g){if(tipFor&&tipFor!==g)tipFor.removeAttribute('aria-describedby');
 tip.textContent=g.dataset.tip;tip.classList.add('on');tipFor=g;g.setAttribute('aria-describedby','gltip');
 var r=g.getBoundingClientRect(),w=tip.offsetWidth,h=tip.offsetHeight;
 var x=Math.min(Math.max(8,r.left),innerWidth-w-8),y=r.bottom+6;if(y+h>innerHeight-8)y=r.top-h-6;
 tip.style.left=x+'px';tip.style.top=y+'px';}
function hideTip(){if(tipFor)tipFor.removeAttribute('aria-describedby');tip.classList.remove('on');tipFor=null;}
function gl(e){return e.target.closest&&e.target.closest('.gl');}
document.addEventListener('pointerover',function(e){var g=gl(e);if(g&&e.pointerType==='mouse')showTip(g);});
document.addEventListener('pointerout',function(e){var g=gl(e);if(g&&e.pointerType==='mouse'&&!g.contains(e.relatedTarget))hideTip();});
document.addEventListener('focusin',function(e){var g=gl(e);if(g&&g.matches(':focus-visible'))showTip(g);});
document.addEventListener('focusout',function(e){if(gl(e))hideTip();});
document.addEventListener('click',function(e){var g=gl(e);if(!g){hideTip();return;}   // tap toggles
 e.stopPropagation();if(tipFor===g&&e.pointerType!=='mouse')hideTip();else showTip(g);},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape')hideTip();});
document.addEventListener('scroll',hideTip,{capture:true,passive:true});  // also inner scroll areas
```

In table headers, put a jargon tip (only for a header that is not self-explanatory) next to the
sort button as an `ⓘ` span, not inside it.

## Sortable and searchable tables

```html
<input class="tsearch" data-t="tbl1" type="search" aria-label="Search table" placeholder="Search…">
<div class="tblwrap"><table id="tbl1" class="sortable">
  <thead><tr><th aria-sort="none"><button type="button">Gene</button></th>
             <th class="num" aria-sort="none"><button type="button">Score A</button>
               <span class="gl" tabindex="0" data-tip="…">ⓘ</span></th></tr></thead>
  …</table></div>
```

```css
table.sortable th button{all:unset;cursor:pointer}
table.sortable th button:focus-visible{outline:2px solid var(--accent)}
table.sortable th[aria-sort=ascending] button::after{content:" ▲";font-size:9px}
table.sortable th[aria-sort=descending] button::after{content:" ▼";font-size:9px}
```

```js
document.querySelectorAll('table.sortable th button').forEach(function(btn){btn.addEventListener('click',function(){
 var th=btn.closest('th'),t=th.closest('table'),i=[].indexOf.call(th.parentNode.children,th),
     tb=t.tBodies[0],rows=[].slice.call(tb.rows),asc=th.getAttribute('aria-sort')!=='ascending';
 t.querySelectorAll('th[aria-sort]').forEach(function(x){x.setAttribute('aria-sort','none')});
 th.setAttribute('aria-sort',asc?'ascending':'descending');
 function key(r){var s=((r.cells[i]||{}).textContent||'').trim().replace(/−/g,'-'),
   m=s.replace(/^[<≤>≥]\s*/,'').replace(/,/g,'');
  if(s===''||/^(—|-|NA|n\/a)$/i.test(s))return null;
  return /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(m)?parseFloat(m):s.toLowerCase();}
 rows.sort(function(a,b){var x=key(a),y=key(b);
  if(x===null||y===null)return (x===null)-(y===null);        // blanks, NA, — always last
  if(typeof x!==typeof y)return typeof x==='number'?-1:1;     // numbers before text
  var c=typeof x==='number'?x-y:x.localeCompare(y);return asc?c:-c;});
 rows.forEach(function(r){tb.appendChild(r)});});});
document.querySelectorAll('input.tsearch').forEach(function(inp){inp.addEventListener('input',function(){
 var q=inp.value.toLowerCase();document.getElementById(inp.dataset.t).querySelectorAll('tbody tr').forEach(function(r){
  r.hidden=r.textContent.toLowerCase().indexOf(q)<0;});});});
```

## Values table under each chart

```html
<figure>
  <div data-fig="volcano">…chart…</div>
  <figcaption>…encoding legend…</figcaption>
  <details class="vtable"><summary>Values table</summary><div class="tblwrap"><table class="sortable">…</table></div></details>
</figure>
```

What goes in the table:

- **Always** the statistics the chart shows per panel (estimate, CI, P, FDR, n).
- **Also point-level rows** when the marks themselves carry the information (a scatter of named
  items, a volcano plot): nest them as a second collapsed table. Skip them when the points are
  only a cloud behind a summary (e.g. raw values behind a box plot).

## Tabs

```html
<div class="tabs">
  <div class="tabbar" role="tablist">
    <button role="tab" id="t1a" aria-controls="p1a" aria-selected="true">Outcome A <span class="cnt">12</span></button>
    <button role="tab" id="t1b" aria-controls="p1b" aria-selected="false" tabindex="-1">Outcome B <span class="cnt">3</span></button>
  </div>
  <div class="tabpanel" role="tabpanel" id="p1a" aria-labelledby="t1a">…</div>
  <div class="tabpanel" role="tabpanel" id="p1b" aria-labelledby="t1b" hidden>…</div>
</div>
```

```js
function tabsOf(t){return [].slice.call(t.querySelectorAll(':scope>.tabbar>[role=tab]'));}
function showTab(t,i){var bs=tabsOf(t),ps=t.querySelectorAll(':scope>.tabpanel');
 bs.forEach(function(b,j){b.setAttribute('aria-selected',j===i);b.tabIndex=j===i?0:-1;});
 ps.forEach(function(p,j){p.hidden=j!==i;});
 if(ps[i]&&typeof renderLazy==='function')renderLazy(ps[i]);
 dispatchEvent(new Event('resize'));}            // lets widgets in the shown tab size themselves
document.querySelectorAll('.tabs').forEach(function(t){var bs=tabsOf(t);bs.forEach(function(b,i){
 b.addEventListener('click',function(){showTab(t,i)});
 b.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
  if(!d)return;var k=(i+d+bs.length)%bs.length;showTab(t,k);bs[k].focus();});});});
```

## Deep links open collapsed content

```js
function openFor(el){for(var d=el.closest('details');d;d=d.parentElement.closest('details'))d.open=true;
 var chain=[];for(var p=el.closest('.tabpanel');p;p=p.parentElement.closest('.tabpanel'))chain.unshift(p);
 chain.forEach(function(pn){var t=pn.parentElement;showTab(t,[].indexOf.call(t.querySelectorAll(':scope>.tabpanel'),pn));});}
function byHash(h){try{return document.getElementById(decodeURIComponent(h.slice(1)));}catch(_){return null;}}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');
 var t=a&&byHash(a.getAttribute('href'));if(t)openFor(t);},true);
function goHash(){var t=location.hash&&byHash(location.hash);if(t){openFor(t);setTimeout(function(){t.scrollIntoView()},50);}}
addEventListener('hashchange',goHash);goHash();
```

## Contents sidebar with scroll-spy

Layout: a two-column grid (`nav.toc` sticky on the left, content on the right); below ~1000px
hide the sidebar and show a `<details class="mtoc">` contents block at the top instead.

```js
var toc=document.getElementById('toc'),map={},targets=[],cur=null;
toc.querySelectorAll('a[href^="#"]').forEach(function(a){var el=byHash(a.getAttribute('href'));
 if(el){map[el.id]=a;targets.push(el);}});
function spy(){var y=innerHeight*0.25,best=targets[0];
 targets.forEach(function(t){if(t.offsetParent&&t.getBoundingClientRect().top-y<=0)best=t;});
 var a=map[best.id];if(a===cur)return;if(cur)cur.removeAttribute('aria-current');
 a.setAttribute('aria-current','location');cur=a;}
var tk=false;addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(function(){spy();tk=false;});}},{passive:true});spy();
```

Style the current link with `.toc a[aria-current]`.

## Flowchart full screen

A button `⛶ Full screen` over the flowchart clones `.flowsvg` into a fixed overlay
(`role="dialog"`, `aria-modal="true"`) with `＋ － Reset ✕` buttons; zoom changes the SVG height
(0.4×–4×); Esc closes and returns focus to the button.

## Packaging and lazy loading

Chosen in Step 0. Both modes open by double-click (`file://`) with no server or internet.

| Mode | When | Layout |
|---|---|---|
| Single file | Email or chat attachments, archived revisions, document-system previews | Everything inline; heavy charts inside `<template>` |
| Folder | Lab server, GitHub Pages, synced drive, or a single file over ~10 MB (zip it for email) | See below |

```
report_v3/
  index.html          text, tables, small inline CSS and page JS
  assets/             each library once (widget JS, report.css, report.js)
  figs/fig-<id>.js    one heavy chart each: registerFig("<id>", "<html>")
  data/<list>.csv     full lists, linked with <a href="data/x.csv" download>
```

- Under `file://` classic `<script src>` and `<link>` work; `fetch`/XHR of local files and ES
  modules are blocked, so never use them. No CDN, no web fonts, math as MathML or Unicode.
- Every library is included once, however many charts use it.
- Charts render on first view: when scrolled near, when their `<details>` opens, or when their
  tab is shown. This also fixes zero-size widgets in hidden tabs.

Placeholder: `<div data-fig="volcano"></div>` (folder) or
`<div data-fig="volcano"><template>…chart HTML…</template></div>` (single file).

```js
function figDone(ph){ph.dataset.done=1;if(window.HTMLWidgets)HTMLWidgets.staticRender();}
function loadFig(ph){if(ph.dataset.done||ph.dataset.loading||ph.offsetParent===null)return;
 var tpl=ph.querySelector(':scope>template');
 if(tpl){ph.replaceChildren(tpl.content.cloneNode(true));figDone(ph);return;}
 ph.dataset.loading=1;var s=document.createElement('script');
 s.src='figs/fig-'+ph.dataset.fig+'.js';document.head.appendChild(s);}
function registerFig(id,html){var ph=document.querySelector('[data-fig="'+id+'"]');if(ph){ph.innerHTML=html;figDone(ph);}}
function renderLazy(root){root.querySelectorAll('[data-fig]').forEach(loadFig);}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);loadFig(e.target);}});},{rootMargin:'400px'});
document.querySelectorAll('[data-fig]').forEach(function(ph){io.observe(ph);});
document.addEventListener('toggle',function(e){if(e.target.open)renderLazy(e.target);},true);
```

Give placeholders a `min-height` close to the chart height so the page doesn't jump, and clear
it once the chart is in (`ph.style.minHeight=''`), or phones keep a large blank area. A hidden
placeholder is skipped and loaded later by `showTab` / `toggle`.

## Click-to-detail panel

For charts where each element stands for a group of items (gene-set bars, clusters): clicking an
element puts that element's member plots into a panel below the chart, sets the panel heading to
the element's name, and scrolls the panel into view. Before any click, the empty panel says what
to do ("Click a bar above to see its member genes here"). Use the lazy-loading placeholders for
the member plots, so only clicked ones are rendered.

## Captions and legends

- Caption = what is plotted + the encoding legend, e.g. "Point size = number of patients;
  colour = treatment arm; dashed line = no effect; open circles = exploratory outcomes."
- Expand abbreviations used in the figure on a separate caption line.
- Say what interaction is available: "Hover a point for the estimate, its 95 % CI and P."
