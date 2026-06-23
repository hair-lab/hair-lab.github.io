/* ======================================================
   HAIR Lab — Publications Page JS
   ====================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const pubs = await fetchJSON('data/publications.json');
    const sidebar = document.getElementById('pub-year-nav');
    const main = document.getElementById('pub-list');
    if (!main) return;

    // Group by year
    const byYear = {};
    pubs.forEach(p => {
      if (!byYear[p.year]) byYear[p.year] = [];
      byYear[p.year].push(p);
    });
    const years = Object.keys(byYear).sort((a, b) => b - a);

    // Year sidebar
    if (sidebar) {
      sidebar.innerHTML = `
        <h3>Browse by Year</h3>
        <ul class="pub-year-list">
          ${years.map(y => `<li><a href="#year-${y}" data-year="${y}">${y} <span style="color:var(--text-muted);font-size:.8rem;">(${byYear[y].length})</span></a></li>`).join('')}
        </ul>`;
    }

    // Publications list
    main.innerHTML = years.map(y => `
      <div class="pub-year-group" id="year-${y}">
        <h2 class="pub-year-heading">${y}</h2>
        ${byYear[y].map(p => `
          <div class="pub-item" id="pub-${p.id}">
            <div class="pub-title">${p.title}</div>
            <div class="pub-venue">${p.venueType ? `<span class="pub-type" data-type="${p.venueType}">${p.venueType}</span>` : ''}${p.venue} · ${p.year}${p.citations ? ` <span class="pub-cites">${p.citations} citations</span>` : ''}</div>
            <div class="pub-authors">${renderAuthors(p.authors)}</div>
            ${p.abstract ? `<p style="font-size:.88rem;color:var(--text-muted);margin:8px 0;line-height:1.5;">${p.abstract}</p>` : ''}
            <div class="pub-links">
              ${Object.entries(p.links || {}).map(([k, v]) =>
                `<a href="${v}" target="_blank" rel="noopener">${k.toUpperCase()}</a>`
              ).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');

    // Highlight active year on scroll
    const yearSections = years.map(y => document.getElementById(`year-${y}`));
    const yearLinks = document.querySelectorAll('.pub-year-list a');
    window.addEventListener('scroll', () => {
      let current = years[0];
      yearSections.forEach(s => {
        if (s && s.getBoundingClientRect().top < 120) current = s.id.replace('year-', '');
      });
      yearLinks.forEach(a => a.classList.toggle('active', a.dataset.year === current));
    });

  } catch (err) {
    console.error('Publications error:', err);
  }
});
