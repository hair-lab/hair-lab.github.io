/* ======================================================
   HAIR Lab — Home Page JS
   ====================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [news, pubs, projects] = await Promise.all([
      fetchJSON('data/news.json'),
      fetchJSON('data/publications.json'),
      fetchJSON('data/projects.json')
    ]);

    // Render latest news (3)
    const newsContainer = document.getElementById('latest-news');
    if (newsContainer) {
      const latest = news.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
      newsContainer.innerHTML = latest.map(n => `
        <a href="news-detail.html?id=${n.id}" class="card" id="news-card-${n.id}">
          <div class="card-image">
            <img src="${n.image}" alt="${n.title}" loading="lazy">
          </div>
          <div class="card-body">
            <h3>${n.title}</h3>
            <p>${n.summary}</p>
            <div class="card-meta">
              <span>By ${n.author}</span>
              <span>•</span>
              <span>${formatDate(n.date)}</span>
            </div>
          </div>
        </a>
      `).join('');
    }

    // Render recent publications (3)
    const pubContainer = document.getElementById('recent-pubs');
    if (pubContainer) {
      const recent = pubs.sort((a, b) => b.year - a.year).slice(0, 3);
      pubContainer.innerHTML = recent.map(p => `
        <div class="pub-item" id="pub-home-${p.id}">
          <div class="pub-title">${p.title}</div>
          <div class="pub-venue">${p.venueType ? `<span class="pub-type" data-type="${p.venueType}">${p.venueType}</span>` : ''}${p.venue} · ${p.year}${p.citations ? ` <span class="pub-cites">${p.citations} citations</span>` : ''}</div>
          <div class="pub-authors">${renderAuthors(p.authors)}</div>
          <div class="pub-links">
            ${Object.entries(p.links || {}).map(([k, v]) =>
              `<a href="${v}" target="_blank" rel="noopener">${k.toUpperCase()}</a>`
            ).join('')}
          </div>
        </div>
      `).join('');
    }

    // Render featured projects (4)
    const projContainer = document.getElementById('featured-projects');
    if (projContainer) {
      const active = projects.filter(p => p.status === 'active').slice(0, 3);
      projContainer.innerHTML = active.map(p => `
        <a href="project-detail.html?id=${p.id}" class="card project-card" id="proj-home-${p.id}">
          <div class="card-body">
            <span class="proj-type">${p.type || 'Project'}</span>
            <h3>${p.title}</h3>
            ${p.titleKo ? `<div class="card-titleko" lang="ko">${p.titleKo}</div>` : ''}
            <div class="card-meta"><span>${yearRange(p)}</span></div>
          </div>
        </a>
      `).join('');
    }

  } catch (err) {
    console.error('Home data load error:', err);
  }
});
