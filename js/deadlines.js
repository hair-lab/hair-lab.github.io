/* ======================================================
   HAIR Lab — Deadlines Page JS
   Open 3-column table (Conference · Next Deadline · Recent History),
   horizontal category filter, monospace dates + live countdown.
   ====================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  let CONFS = [];
  try {
    CONFS = await fetchJSON('data/deadlines.json');
  } catch (err) {
    console.error('Deadlines error:', err);
    const t = document.getElementById('dl-table');
    if (t) t.innerHTML = '<p class="loading">Could not load deadlines.</p>';
    return;
  }

  const table = document.getElementById('dl-table');
  const filterBar = document.getElementById('dl-filter');
  const metaEl = document.getElementById('dl-meta');
  if (!table) return;

  const MS = { m: 60000, h: 3600000, d: 86400000 };
  const CAT_ORDER = ['AI', 'ML', 'NLP', 'Vision', 'HCI', 'Graphics', 'Web', 'Data', 'DB', 'Security', 'Systems', 'Arch', 'Network', 'PL', 'SE', 'Theory', 'Bio'];
  let activeFilter = 'All';

  const ts = (d) => new Date(d.date).getTime();

  function nextDeadline(conf, now) {
    return conf.deadlines.map(d => ({ ...d, ts: ts(d) }))
      .filter(d => d.ts >= now).sort((a, b) => a.ts - b.ts)[0] || null;
  }

  function fmtDate(t) {
    return new Date(t).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  }

  function countdown(t, now) {
    const diff = t - now;
    if (diff < 0) {
      const days = Math.floor(-diff / MS.d);
      return { text: days === 0 ? 'closed today' : `closed ${days}d ago`, cls: 'past' };
    }
    const days = Math.floor(diff / MS.d);
    const hours = Math.floor((diff % MS.d) / MS.h);
    let text;
    if (days >= 2) text = `${days} days left`;
    else if (days === 1) text = `1 day ${hours}h left`;
    else if (hours >= 1) text = `${hours}h left`;
    else text = `${Math.floor((diff % MS.h) / MS.m)}m left`;
    const cls = diff <= 3 * MS.d ? 'urgent' : diff <= 14 * MS.d ? 'soon' : 'open';
    return { text, cls };
  }

  const CLOCK = '<svg class="dl-clock" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>';

  /* ---- filter bar ---- */
  function renderFilter() {
    const counts = {};
    CONFS.forEach(c => c.categories.forEach(cat => { counts[cat] = (counts[cat] || 0) + 1; }));
    const cats = ['All', ...CAT_ORDER.filter(c => counts[c])];
    filterBar.innerHTML = `<span class="dl-filter-label">Filter</span>` +
      cats.map(c => `<button class="dl-chip${c === activeFilter ? ' active' : ''}" data-cat="${c}">${c}</button>`).join('');
    filterBar.querySelectorAll('.dl-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.cat;
        renderFilter();
        renderTable();
      });
    });
  }

  function renderMeta() {
    if (metaEl) metaEl.innerHTML = `<strong>${CONFS.length}</strong> conferences tracked · sorted by nearest deadline`;
  }

  /* ---- a single conference row ---- */
  function rowHTML(conf, now) {
    const next = nextDeadline(conf, now);
    const edition = `${conf.name} ${conf.confDate.slice(0, 4)}`;
    const tags = conf.categories.map(c => `<span class="dl-tag">${c}</span>`).join('');

    // ordered deadlines; the nearest upcoming one is the "primary"
    const ds = conf.deadlines.map(d => ({ ...d, ts: ts(d) })).sort((a, b) => a.ts - b.ts);
    const primary = next || ds[ds.length - 1];

    const primaryCd = countdown(primary.ts, now);
    const secondary = ds.filter(d => d.ts !== primary.ts).map(d => {
      const cd = countdown(d.ts, now);
      return `
        <div class="dl-sub">
          <span class="dl-sub-label">${d.label}</span>
          <span class="dl-date-sm">${fmtDate(d.ts)}</span>
          <span class="dl-count dl-count-${cd.cls}">${CLOCK}${cd.text}</span>
        </div>`;
    }).join('');

    const venue = conf.venue && conf.venue !== 'TBD'
      ? `${conf.flag ? conf.flag + ' ' : ''}${conf.venue}`
      : `<span class="dl-tbd">venue TBD</span>`;

    const history = (conf.history || []).map(h =>
      `<span class="dl-hist">'${h.year} ${h.flag ? h.flag + ' ' : ''}${h.city}</span>`
    ).join('');

    return `
      <div class="dl-row${next ? '' : ' is-past'}">
        <div class="dl-col-conf">
          <div class="dl-conf-head"><span class="dl-name">${conf.name}</span>${tags}</div>
          <div class="dl-fullname">${conf.fullName}</div>
        </div>

        <div class="dl-col-next">
          <div class="dl-next-top">
            <span class="dl-edition">${edition}</span>
            <span class="dl-venue">${venue}</span>
            <a href="${conf.link}" target="_blank" rel="noopener" class="dl-site">Site ↗</a>
          </div>
          <div class="dl-primary">
            <span class="dl-label-lead">${primary.label}</span>
            <span class="dl-date">${fmtDate(primary.ts)}</span>
            <span class="dl-count dl-count-${primaryCd.cls}">${CLOCK}${primaryCd.text}</span>
          </div>
          ${secondary}
        </div>

        <div class="dl-col-hist">${history || '<span class="dl-tbd">—</span>'}</div>
      </div>`;
  }

  /* ---- table ---- */
  function renderTable() {
    const now = Date.now();
    let list = CONFS.filter(c => activeFilter === 'All' || c.categories.includes(activeFilter));
    list.sort((a, b) => {
      const na = nextDeadline(a, now), nb = nextDeadline(b, now);
      if (na && nb) return na.ts - nb.ts;
      if (na) return -1;
      if (nb) return 1;
      return Math.max(...b.deadlines.map(ts)) - Math.max(...a.deadlines.map(ts));
    });

    if (!list.length) { table.innerHTML = '<p class="loading">No conferences in this category.</p>'; return; }

    table.innerHTML = `
      <div class="dl-row dl-thead">
        <span>Conference</span><span>Next Deadline</span><span>Recent History</span>
      </div>` + list.map(c => rowHTML(c, now)).join('');
  }

  renderMeta();
  renderFilter();
  renderTable();
  setInterval(renderTable, 60000);
});
