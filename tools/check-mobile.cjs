// Read-only layout audit against an isolated Chrome instance on port 9227.
// Run: node tools/check-mobile.cjs
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');
const pages = ['index.html', 'members.html', 'member-detail.html?id=kim-minje',
  'member-detail.html?id=prof-kim', 'publications.html', 'projects.html',
  'project-detail.html?id=decision-intelligence', 'news.html',
  'news-detail.html?id=news-chi-2026', 'deadlines.html', 'contact.html'];
(async () => {
  const target = await fetch('http://127.0.0.1:9227/json/new?about:blank', { method: 'PUT' }).then(r => r.json());
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let next = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const response = JSON.parse(event.data);
    if (pending.has(response.id)) {
      const {resolve, reject} = pending.get(response.id);
      pending.delete(response.id);
      response.error ? reject(response.error) : resolve(response.result);
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++next; pending.set(id, {resolve, reject});
    socket.send(JSON.stringify({id, method, params}));
  });
  const evaluate = async expression => {
    const r = await send('Runtime.evaluate', {expression, awaitPromise: true, returnByValue: true});
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };
  await send('Page.enable');
  let failures = 0;
  const widths = process.env.PREVIEW_DIR ? [390] : [320, 360, 390, 414, 768, 820, 1024, 1440];
  for (const width of widths) {
    await send('Emulation.setDeviceMetricsOverride', {width, height: 900, deviceScaleFactor: 1, mobile: width < 769});
    for (const page of pages) {
      const [file, query] = page.split('?');
      await send('Page.navigate', {url: pathToFileURL(path.join(root, file)).href + (query ? '?' + query : '')});
      await new Promise(resolve => setTimeout(resolve, 180));
      await evaluate('document.fonts.ready.then(() => true)');
      const result = await evaluate(`(() => {
        document.querySelectorAll('.reveal').forEach(e => { e.style.transition='none'; e.style.opacity='1'; e.style.transform='none'; });
        const width = innerWidth;
        const overflow = [...document.querySelectorAll('body *')].filter(e => {
          if (e.closest('.nav-links:not(.open), .hero-canvas, .mv-icon')) return false;
          const s = getComputedStyle(e), r = e.getBoundingClientRect();
          return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && (r.right > width + 1 || r.left < -1);
        }).slice(0, 8).map(e => ({tag:e.tagName, class:e.className, width:Math.round(e.getBoundingClientRect().width)}));
        return {width, overflow};
      })()`);
      if (result.overflow.length) { failures++; console.log(JSON.stringify({page, ...result})); }
      if (process.env.PREVIEW_DIR && width === 390 && ['index.html', 'member-detail.html?id=kim-minje'].includes(page)) {
        const shot = await send('Page.captureScreenshot', {format:'png'});
        fs.writeFileSync(path.join(process.env.PREVIEW_DIR, file.replace('.html','.png')), Buffer.from(shot.data,'base64'));
      }
    }
  }
  await send('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send('Page.navigate', {url:pathToFileURL(path.join(root,'index.html')).href});
  await new Promise(resolve => setTimeout(resolve,250));
  const menu = await evaluate(`(() => { document.getElementById('nav-toggle').click(); return document.getElementById('nav-links').classList.contains('open'); })()`);
  console.log(JSON.stringify({layouts:pages.length*widths.length, overflowingLayouts:failures, mobileMenuOpens:menu}));
  await send('Page.close'); socket.close();
  if(failures || !menu) process.exitCode = 1;
})().catch(e => {console.error(e);process.exit(1);});
