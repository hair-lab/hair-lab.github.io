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

  const ts = (d) => d.date ? new Date(d.date).getTime() : NaN;
  const confirmed = (conf, d) => conf.status === 'confirmed' &&
    !['estimated', 'tba'].includes(d.status) && Number.isFinite(ts(d));
  const month = (d) => d.estimatedMonth || (d.date || '').slice(0, 7);
  const monthText = (d) => /^\d{4}-\d{2}$/.test(month(d))
    ? new Date(`${month(d)}-01T00:00:00Z`).toLocaleDateString('en-US', {year:'numeric', month:'short', timeZone:'UTC'})
    : 'TBA';

  function nextDeadline(conf, now) {
    return conf.deadlines.filter(d => confirmed(conf, d)).map(d => ({ ...d, ts: ts(d) }))
      .filter(d => d.ts >= now).sort((a, b) => a.ts - b.ts)[0] || null;
  }

  function fmtDate(t) {
    // Display the original AoE calendar day consistently across visitor time zones.
    return new Date(t).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit', timeZone: 'Etc/GMT+12' });
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
    if (metaEl) metaEl.innerHTML = `<strong>${CONFS.length}</strong> conferences tracked · confirmed upcoming dates first`;
  }

  /* ---- a single conference row ---- */
  function rowHTML(conf, now) {
    const next = nextDeadline(conf, now);
    const edition = `${conf.name} ${conf.confDate.slice(0, 4)}`;
    const tags = conf.categories.map(c => `<span class="dl-tag">${c}</span>`).join('');

    // ordered deadlines; the nearest upcoming one is the "primary"
    const ds = conf.deadlines.map(d => ({ ...d, ts: ts(d) }))
      .sort((a, b) => (a.date || a.estimatedMonth || '9999').localeCompare(b.date || b.estimatedMonth || '9999'));
    const primary = (next && ds.find(d => d.ts === next.ts)) ||
      ds.find(d => !confirmed(conf, d)) || ds[ds.length - 1] || {label:'Submission', status:'tba'};
    const dateHTML = (d, main) => {
      const exact = confirmed(conf, d);
      const text = exact ? fmtDate(d.ts) : d.status === 'tba' ? 'TBA' : monthText(d);
      const cd = exact ? countdown(d.ts, now) : null;
      const estimate = !exact && text !== 'TBA';
      return `<span class="${main ? 'dl-date' : 'dl-date-sm'}">${text}${estimate ? ' (estimated)' : ''}</span>` +
        (cd ? `<span class="dl-count dl-count-${cd.cls}">${CLOCK}${cd.text}</span>` : '');
    };
    const secondary = ds.filter(d => d !== primary).map(d => {
      return `
        <div class="dl-sub">
          <span class="dl-sub-label">${d.label}</span>
          ${dateHTML(d, false)}
        </div>`;
    }).join('');

    const venue = conf.venue && conf.venue !== 'TBD'
      ? `${conf.flag ? conf.flag + ' ' : ''}${conf.venue}`
      : `<span class="dl-tbd">venue TBD</span>`;

    const history = (conf.history || []).map(h =>
      `<span class="dl-hist">'${h.year} ${h.flag ? h.flag + ' ' : ''}${h.city}</span>`
    ).join('');

    return `
      <div data-conference="${conf.id}" class="dl-row${ds.length && ds.every(d => confirmed(conf, d) && d.ts < now) ? ' is-past' : ''}">
        <div class="dl-col-conf">
          <div class="dl-conf-head"><span class="dl-name">${conf.name}</span>${tags}</div>
          <div class="dl-fullname">${conf.fullName}</div>
          ${conf.status !== 'confirmed' ? `<span class="dl-estimate">${conf.estimateSource ? 'Estimated · based on previous year' : 'Estimated · not confirmed'}</span>` : ''}
        </div>

        <div class="dl-col-next">
          <div class="dl-next-top">
            <span class="dl-edition">${edition}</span>
            <span class="dl-venue">${venue}</span>
            <a href="${conf.link}" target="_blank" rel="noopener" class="dl-site">Site ↗</a>
          </div>
          <div class="dl-primary">
            <span class="dl-label-lead">${primary.label}</span>
            ${dateHTML(primary, true)}
          </div>
          ${secondary}
          ${conf.estimateBasis ? `<p class="dl-basis">${conf.estimateBasis} <a href="${conf.estimateSource}" target="_blank" rel="noopener">Previous year's schedule ↗</a></p>` : ''}
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
      const uncertain = c => !c.deadlines.length || c.deadlines.some(d => !confirmed(c, d));
      if (uncertain(a) !== uncertain(b)) return uncertain(a) ? -1 : 1;
      if (uncertain(a)) {
        const firstMonth = c => c.deadlines.map(month).filter(Boolean).sort()[0] || '9999';
        return firstMonth(a).localeCompare(firstMonth(b)) || a.name.localeCompare(b.name);
      }
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
