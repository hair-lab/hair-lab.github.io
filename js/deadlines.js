/* ======================================================
   HAIR Lab — Deadlines Page JS
   Card grid (matching Projects) grouped into Upcoming / Passed,
   filterable by research area, with a live countdown per deadline.
   ====================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  let CONFS = [];
  try {
    CONFS = await fetchJSON('data/deadlines.json');
  } catch (err) {
    console.error('Deadlines error:', err);
    const main = document.getElementById('dl-main');
    if (main) main.innerHTML = '<p class="loading">Could not load deadlines.</p>';
    return;
  }

  const sidebar = document.getElementById('dl-filters');
  const main = document.getElementById('dl-main');
  if (!main) return;

  const MS = { m: 60000, h: 3600000, d: 86400000 };
  const CAT_ORDER = ['AI', 'ML', 'NLP', 'HCI', 'CSS', 'Data', 'Web'];

  let activeFilter = 'all';

  /* ---- helpers ---- */
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
    if (days >= 1) text = `${days}d left`;
    else if (hours >= 1) text = `${hours}h left`;
    else text = `${Math.floor((diff % MS.h) / MS.m)}m left`;
    const cls = diff <= 3 * MS.d ? 'urgent' : diff <= 14 * MS.d ? 'soon' : 'open';
    return { text, cls };
  }

  /* ---- sidebar ---- */
  function renderSidebar() {
    if (!sidebar) return;
    const counts = {};
    CONFS.forEach(c => c.categories.forEach(cat => { counts[cat] = (counts[cat] || 0) + 1; }));
    const cats = CAT_ORDER.filter(c => counts[c]);
    sidebar.innerHTML = `
      <h3>Research Area</h3>
      <div class="filter-list">
        <div class="filter-item${activeFilter === 'all' ? ' active' : ''}" data-cat="all">
          <span>All</span><span class="filter-count">${CONFS.length}</span>
        </div>
        ${cats.map(c => `
          <div class="filter-item${activeFilter === c ? ' active' : ''}" data-cat="${c}">
            <span>${c}</span><span class="filter-count">${counts[c]}</span>
          </div>`).join('')}
      </div>`;
    sidebar.querySelectorAll('.filter-item').forEach(item => {
      item.addEventListener('click', () => {
        activeFilter = item.dataset.cat;
        renderSidebar();
        renderMain();
      });
    });
  }

  /* ---- row ---- */
  function row(conf, now) {
    const next = nextDeadline(conf, now);
    const tags = conf.categories.map(c => `<span class="dl-tag">${c}</span>`).join('');
    const lines = conf.deadlines.map(d => ({ ...d, ts: ts(d) }))
      .sort((a, b) => a.ts - b.ts)
      .map(d => {
        const cd = countdown(d.ts, now);
        const isNext = next && d.ts === next.ts;
        return `
          <div class="dl-line${cd.cls === 'past' ? ' is-past' : ''}${isNext ? ' is-next' : ''}">
            <span class="dl-line-label">${d.label}</span>
            <span class="dl-line-date">${fmtDate(d.ts)}</span>
            <span class="dl-count dl-count-${cd.cls}">${cd.text}</span>
          </div>`;
      }).join('');
    const est = conf.status === 'estimated' ? ' <span class="dl-est">est.</span>' : '';
    return `
      <a href="${conf.link}" target="_blank" rel="noopener" class="dl-row${next ? '' : ' is-past'}">
        <div class="dl-row-info">
          <div class="dl-row-head">
            <span class="dl-name">${conf.name}</span>
            ${tags}
          </div>
          <div class="dl-fullname">${conf.fullName}</div>
          <div class="dl-when">${conf.location || 'TBD'} · ${conf.confDate}${est}</div>
        </div>
        <div class="dl-dates">${lines}</div>
        <span class="dl-row-site">Site ↗</span>
      </a>`;
  }

  /* ---- main ---- */
  function renderMain() {
    const now = Date.now();
    const match = (c) => activeFilter === 'all' || c.categories.includes(activeFilter);
    const shown = CONFS.filter(match);

    const upcoming = shown.filter(c => nextDeadline(c, now))
      .sort((a, b) => nextDeadline(a, now).ts - nextDeadline(b, now).ts);
    const passed = shown.filter(c => !nextDeadline(c, now))
      .sort((a, b) => Math.max(...b.deadlines.map(ts)) - Math.max(...a.deadlines.map(ts)));

    let html = '';
    if (upcoming.length) {
      html += `<h2 class="project-status-heading">Upcoming Deadlines</h2>`;
      html += `<div class="dl-list">${upcoming.map(c => row(c, now)).join('')}</div>`;
    }
    if (passed.length) {
      html += `<h2 class="project-status-heading" style="margin-top:48px;">Passed</h2>`;
      html += `<div class="dl-list">${passed.map(c => row(c, now)).join('')}</div>`;
    }
    if (!shown.length) {
      html = '<p class="loading">No conferences match the selected area.</p>';
    } else {
      html += `<p class="dl-note">Dates are estimates for planning — always confirm on each conference's official site. Times follow Anywhere-on-Earth (UTC−12).</p>`;
    }
    main.innerHTML = html;
  }

  renderSidebar();
  renderMain();
  // Keep countdowns fresh.
  setInterval(renderMain, 60000);
});
