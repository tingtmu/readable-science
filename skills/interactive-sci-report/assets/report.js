/* report.js — optional behaviours for an interactive-sci-report page. No libraries; runs from file://.
   Load once, last in <body> (single file: paste into one <script>). Each block is independent:
   delete the ones the page does not use. Exposes renderLazy, registerFig, showTab, showDetail, showDetailEl. */
(function(){
'use strict';

/* jargon tip: hover, keyboard focus, tap; Esc, tap elsewhere or scroll closes */
var tip=document.createElement('div');tip.id='gltip';tip.setAttribute('role','tooltip');document.body.appendChild(tip);var tipFor=null;
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
document.addEventListener('click',function(e){var g=gl(e);if(!g){hideTip();return;}
 e.stopPropagation();if(tipFor===g&&e.pointerType!=='mouse')hideTip();else showTip(g);},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape')hideTip();});
document.addEventListener('scroll',hideTip,{capture:true,passive:true});

/* sortable + searchable tables; blanks / NA / — sort last, numbers before text */
document.querySelectorAll('table.sortable th button').forEach(function(btn){btn.addEventListener('click',function(){
 var th=btn.closest('th'),t=th.closest('table'),i=[].indexOf.call(th.parentNode.children,th),
     tb=t.tBodies[0],rows=[].slice.call(tb.rows),asc=th.getAttribute('aria-sort')!=='ascending';
 t.querySelectorAll('th[aria-sort]').forEach(function(x){x.setAttribute('aria-sort','none');});
 th.setAttribute('aria-sort',asc?'ascending':'descending');
 function key(r){var s=((r.cells[i]||{}).textContent||'').trim().replace(/−/g,'-'),
   m=s.replace(/^[<≤>≥+]\s*/,'').replace(/,/g,'');
  if(s===''||/^(—|-|NA|n\/a)$/i.test(s))return null;
  return /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(m)?parseFloat(m):s.toLowerCase();}
 rows.sort(function(a,b){var x=key(a),y=key(b);
  if(x===null||y===null)return (x===null)-(y===null);
  if(typeof x!==typeof y)return typeof x==='number'?-1:1;
  var c=typeof x==='number'?x-y:x.localeCompare(y);return asc?c:-c;});
 rows.forEach(function(r){tb.appendChild(r);});});});
document.querySelectorAll('input.tsearch').forEach(function(inp){inp.addEventListener('input',function(){
 var q=inp.value.toLowerCase(),t=document.getElementById(inp.dataset.t);if(!t)return;
 t.querySelectorAll('tbody tr').forEach(function(r){r.hidden=r.textContent.toLowerCase().indexOf(q)<0;});});});

/* lazy charts: <div data-fig="id"><template>…</template></div> (single file) or figs/fig-<id>.js (folder) */
function figDone(ph){ph.dataset.done=1;ph.style.minHeight='';               // clear placeholder height (phones)
 if(window.HTMLWidgets)HTMLWidgets.staticRender();dispatchEvent(new Event('resize'));}
function loadFig(ph){if(ph.dataset.done||ph.dataset.loading||ph.offsetParent===null)return;
 var tpl=ph.querySelector(':scope>template');
 if(tpl){ph.replaceChildren(tpl.content.cloneNode(true));figDone(ph);return;}
 ph.dataset.loading=1;var s=document.createElement('script');s.src='figs/fig-'+ph.dataset.fig+'.js';document.head.appendChild(s);}
window.registerFig=function(id,html){var ph=document.querySelector('[data-fig="'+id+'"]');if(ph){ph.innerHTML=html;figDone(ph);}};
window.renderLazy=function(root){root.querySelectorAll('[data-fig]').forEach(loadFig);};
var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){
 if(e.isIntersecting){io.unobserve(e.target);loadFig(e.target);}});},{rootMargin:'400px'}):null;
document.querySelectorAll('[data-fig]').forEach(function(ph){if(io)io.observe(ph);else loadFig(ph);});
document.addEventListener('toggle',function(e){if(e.target.open)window.renderLazy(e.target);},true);

/* tabs: ARIA, arrow keys, render charts in the shown panel */
function tabsOf(t){return [].slice.call(t.querySelectorAll(':scope>.tabbar>[role=tab]'));}
function showTab(t,i){var bs=tabsOf(t),ps=t.querySelectorAll(':scope>.tabpanel');
 bs.forEach(function(b,j){b.setAttribute('aria-selected',j===i);b.tabIndex=j===i?0:-1;});
 ps.forEach(function(p,j){p.hidden=j!==i;});
 if(ps[i])window.renderLazy(ps[i]);dispatchEvent(new Event('resize'));}
window.showTab=showTab;
document.querySelectorAll('.tabs').forEach(function(t){var bs=tabsOf(t);bs.forEach(function(b,i){
 b.addEventListener('click',function(){showTab(t,i);});
 b.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
  if(!d)return;var k=(i+d+bs.length)%bs.length;showTab(t,k);bs[k].focus();});});});

/* deep links (also CJK ids) open the <details> and tabs that contain the target */
function openFor(el){for(var d=el.closest('details');d;d=d.parentElement.closest('details'))d.open=true;
 var chain=[];for(var p=el.closest('.tabpanel');p;p=p.parentElement.closest('.tabpanel'))chain.unshift(p);
 chain.forEach(function(pn){var t=pn.parentElement;showTab(t,[].indexOf.call(t.querySelectorAll(':scope>.tabpanel'),pn));});}
function byHash(h){try{return document.getElementById(decodeURIComponent(h.slice(1)));}catch(_){return null;}}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');
 var t=a&&byHash(a.getAttribute('href'));if(t)openFor(t);},true);
function goHash(){var t=location.hash&&byHash(location.hash);if(t){openFor(t);setTimeout(function(){t.scrollIntoView();},50);}}
addEventListener('hashchange',goHash);goHash();

/* contents sidebar scroll-spy: <nav class="toc" id="toc"> */
var toc=document.getElementById('toc');
if(toc){var map={},targets=[],cur=null,tk=false;
 toc.querySelectorAll('a[href^="#"]').forEach(function(a){var el=byHash(a.getAttribute('href'));if(el){map[el.id]=a;targets.push(el);}});
 var spy=function(){if(!targets.length)return;var y=innerHeight*0.25,best=targets[0];
  targets.forEach(function(t){if(t.offsetParent&&t.getBoundingClientRect().top-y<=0)best=t;});
  var a=map[best.id];if(!a||a===cur)return;if(cur)cur.removeAttribute('aria-current');a.setAttribute('aria-current','location');cur=a;};
 addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(function(){spy();tk=false;});}},{passive:true});spy();}

/* click-to-detail panel. Panel: <div class="cpanel" id="P"><div class="cp-head"></div><p class="cp-empty">…</p>
   <div class="cp-item" data-key="K" hidden><div data-fig="…">…</div></div></div>.
   Chart marks: onclick="showDetailEl(this)" (no quotes: some tools rewrite them) + window.DETAILS[data-id]={panel,key,title}. */
window.showDetail=function(panelId,key,title){var p=document.getElementById(panelId);if(!p)return;
 var h=p.querySelector('.cp-head'),em=p.querySelector('.cp-empty');if(h)h.textContent=title||key;if(em)em.hidden=true;
 p.querySelectorAll('.cp-item').forEach(function(it){it.hidden=it.dataset.key!==key;});
 var it=p.querySelector('.cp-item[data-key="'+key+'"]');if(it)window.renderLazy(it);
 p.scrollIntoView({behavior:'smooth',block:'start'});};
window.showDetailEl=function(el){var d=(window.DETAILS||{})[el.getAttribute('data-id')];if(d)window.showDetail(d.panel,d.key,d.title);};

/* flowchart full screen: button#fsbtn over .flowsvg; zoom 0.4–4x; Esc closes and returns focus */
var fsb=document.getElementById('fsbtn');
if(fsb)fsb.addEventListener('click',function(){
 var src=document.querySelector('.flowsvg');if(!src)return;var ov=document.createElement('div'),z=1;
 ov.id='flowov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Flowchart, full screen');
 ov.innerHTML='<div class="bar"><button class="sm" data-a="in">＋</button><button class="sm" data-a="out">－</button>'+
  '<button class="sm" data-a="rst">Reset</button><button class="sm" data-a="x">✕ Esc</button></div><div class="body"></div>';
 var svg=src.cloneNode(true);ov.querySelector('.body').appendChild(svg);document.body.appendChild(ov);
 function fit(){svg.style.height=(Math.min(innerHeight-90,innerWidth*1.2)*z)+'px';svg.style.width='auto';}fit();
 function close(){ov.remove();document.removeEventListener('keydown',esc);fsb.focus();}
 function esc(e){if(e.key==='Escape')close();}document.addEventListener('keydown',esc);
 ov.addEventListener('click',function(e){var a=e.target.dataset&&e.target.dataset.a;if(!a)return;
  if(a==='x')close();else{z=a==='in'?Math.min(4,z*1.25):a==='out'?Math.max(0.4,z/1.25):1;fit();}});
 ov.querySelector('[data-a="x"]').focus();});

/* theme toggle (auto / light / dark): button#themebtn; choice kept per viewer if storage works */
var tb=document.getElementById('themebtn'),modes=['auto','light','dark'],mi=0;
try{var sv=localStorage.getItem('isr-theme');if(modes.indexOf(sv)>=0)mi=modes.indexOf(sv);}catch(_){}
function applyTheme(){var m=modes[mi];if(m==='auto')document.documentElement.removeAttribute('data-theme');
 else document.documentElement.setAttribute('data-theme',m);if(tb)tb.textContent='◐ '+m;}
applyTheme();
if(tb)tb.addEventListener('click',function(){mi=(mi+1)%3;applyTheme();try{localStorage.setItem('isr-theme',modes[mi]);}catch(_){}});
})();
