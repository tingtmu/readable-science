// check_report.mjs — optional rendered check for a report page. Node 22+ (global WebSocket), no packages.
// Usage: node check_report.mjs <report.html> [path-to-chrome-or-edge] [--shot out.png]
// Loads the page headless, scrolls through it, opens every <details>, clicks every tab, sorts one table,
// hovers a jargon tip, clicks the first click-to-detail mark, then checks phone width (390 px) and dark mode. Prints a JSON summary;
// exit code 1 if there are JS errors or horizontal page overflow. It does not judge layout or wording.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2), si = args.indexOf('--shot');
const shot = si >= 0 ? args.splice(si, 2)[1] : null;
const file = args[0];
if (!file || !existsSync(file)) { console.error('usage: node check_report.mjs <report.html> [browser]'); process.exit(2); }
const candidates = [args[1], process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/microsoft-edge']
  .filter(Boolean);
const browser = candidates.find(existsSync);
if (!browser) { console.error('No Chrome/Edge found; pass its path as the second argument.'); process.exit(2); }

const port = 9300 + Math.floor(Math.random() * 500);
const proc = spawn(browser, ['--headless=new', `--remote-debugging-port=${port}`, '--no-first-run', '--disable-gpu',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'isr-'))}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pageSocket() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const pg = list.find((t) => t.type === 'page');
      if (pg) return pg.webSocketDebuggerUrl;
    } catch { /* browser still starting */ }
    await sleep(200);
  }
  throw new Error('browser did not expose a page target');
}

const ws = new WebSocket(await pageSocket());
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(); const errors = [];
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map((a) => a.value ?? a.description).join(' '));
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') errors.push(m.params.entry.text + ' ' + (m.params.entry.url || ''));
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
await send('Page.navigate', { url: pathToFileURL(resolve(file)).href });
await sleep(1500);

const desktop = await evaluate(`(async () => {
  const s = (ms) => new Promise(r => setTimeout(r, ms));
  for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await s(60); }
  document.querySelectorAll('details').forEach(d => d.open = true); await s(300);
  let tabs = 0; for (const b of document.querySelectorAll('[role=tab]')) { b.click(); tabs++; await s(120); }
  const sortBtn = document.querySelector('table.sortable th button'); if (sortBtn) sortBtn.click();
  const g = document.querySelector('.gl'); let tipShown = null;
  if (g) { g.focus(); g.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));
    tipShown = !!document.querySelector('#gltip.on'); }
  const mark = document.querySelector('[onclick*="showDetail"]'); let detailOpened = null;
  if (mark) { mark.dispatchEvent(new MouseEvent('click', { bubbles: true })); await s(400);
    detailOpened = [...document.querySelectorAll('.cpanel .cp-item')].some(it => !it.hidden); }
  const figs = [...document.querySelectorAll('[data-fig]')];
  return { title: document.title, bytes: document.documentElement.outerHTML.length,
    tips: document.querySelectorAll('.gl').length, tipShown, tabs, detailOpened,
    figures: figs.length, figuresRendered: figs.filter(f => f.dataset.done).length,
    figuresNotRendered: figs.filter(f => !f.dataset.done).map(f => f.dataset.fig).slice(0, 10),
    sorted: sortBtn ? sortBtn.closest('th').getAttribute('aria-sort') : null,
    externalRefs: [...document.querySelectorAll('script[src],link[href]')].map(e => e.src || e.href).filter(u => /^https?:/.test(u)) };
})()`);

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await sleep(500);
const phone = await evaluate(`(() => {
  const w = innerWidth, wide = [...document.querySelectorAll('main *')].filter(e => {
    const r = e.getBoundingClientRect(); return r.width > 0 && r.right > w + 1 && !e.closest('.tblwrap,.chartbox,.flowwrap,pre'); });
  return { width: w, pageScrollWidth: document.documentElement.scrollWidth,
    overflowing: wide.slice(0, 5).map(e => e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).split(' ')[0] : '')) };
})()`);

await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
await sleep(300);
const dark = await evaluate(`({ bodyBackground: getComputedStyle(document.body).backgroundColor,
  bodyColor: getComputedStyle(document.body).color })`);

if (shot) { const { writeFileSync } = await import('node:fs');
  writeFileSync(shot, Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64')); }
const report = { desktop, phone, dark, errors: [...new Set(errors)] };
console.log(JSON.stringify(report, null, 2));
ws.close(); proc.kill();
process.exit(report.errors.length || phone.pageScrollWidth > phone.width || desktop.detailOpened === false ? 1 : 0);
