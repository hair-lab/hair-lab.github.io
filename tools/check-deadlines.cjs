const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/deadlines.json'), 'utf8'));
const script = fs.readFileSync(path.join(root, 'js/deadlines.js'), 'utf8');
async function render(now, conferences = data) {
  const elements = new Map();
  let boot;
  const context = {
    Date: class extends Date { static now() { return Date.parse(now); } },
    console, setInterval() {}, fetchJSON: async () => conferences,
    document: {
      addEventListener(event, callback) { boot = callback; },
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, {innerHTML:'', querySelectorAll:() => []});
        return elements.get(id);
      }
    }
  };
  vm.runInNewContext(script, context);
  await boot();
  return elements.get('dl-table').innerHTML;
}
function row(html, id) {
  const start = html.indexOf(`<div data-conference="${id}"`);
  assert(start >= 0, `Missing ${id}`);
  const next = html.indexOf('<div data-conference=', start + 1);
  return html.slice(start, next < 0 ? undefined : next);
}
(async () => {
  const html = await render('2026-10-01T00:00:00Z');
  assert(!/NaN|Invalid Date|undefined/.test(html));
  const emnlp = row(html, 'emnlp2027');
  assert(emnlp.includes('May 2027 (estimated)') && emnlp.includes('Aug 2027 (estimated)'));
  assert(emnlp.includes('based on previous year') && emnlp.includes('Previous year'));
  assert(!/days left|closed|dl-count-|is-past/.test(emnlp));
  assert(row(html, 'acl2027').includes('Jan 04, 2027'));
  assert(row(html, 'acl2027').includes('TBA'));
  assert(row(html, 'naacl2027').includes('Dec 23, 2026'));
  for (const conf of data.filter(c => c.status === 'estimated')) {
    assert(!/dl-count-|is-past/.test(row(html, conf.id)));
  }
  const later = await render('2026-11-01T00:00:00Z');
  const naacl = row(later, 'naacl2027');
  assert(naacl.indexOf('Commitment') < naacl.indexOf('Final ARR Submission'));
  assert(row(later, 'emnlp2027').includes('May 2027 (estimated)'));
  const empty = await render('2026-10-01', [{...data[0], id:'empty', deadlines:[]}]);
  assert(empty.includes('TBA') && !/NaN|Invalid Date|is-past/.test(empty));
  const expired = await render('2030-01-01');
  assert(row(expired, 'naacl2027').includes('is-past'));
  assert(!row(expired, 'acl2027').includes('is-past'), 'Pending commitment must not look closed');
  console.log('PASS: estimated months, no estimated countdowns, AoE dates, pending/empty dates and commitment rollover');
})().catch(error => { console.error(error); process.exitCode = 1; });
