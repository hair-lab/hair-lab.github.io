/* ======================================================
   HAIR Lab — Member Detail Page JS
   ====================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  const memberId = getParam('id');
  if (!memberId) { window.location.href = 'members.html'; return; }

  try {
    const [members, pubs, projects, news] = await Promise.all([
      fetchJSON('data/members.json'),
      fetchJSON('data/publications.json'),
      fetchJSON('data/projects.json'),
      fetchJSON('data/news.json')
    ]);

    const member = members.find(m => m.id === memberId);
    if (!member) {
      document.getElementById('member-detail').innerHTML = '<p class="loading">Member not found.</p>';
      return;
    }

    // Page title
    document.title = `${member.name} | HAIR Lab`;

    // Profile section
    const profileEl = document.getElementById('member-profile');
    profileEl.innerHTML = `
      <div class="member-hero">
        <div class="member-avatar-lg">${monogram(member.name)}</div>
        <div class="member-info">
          <h1>${member.name}${member.nameKo ? ` <span style="color:var(--text-muted);font-weight:400;font-size:.62em;">${member.nameKo}</span>` : ''}</h1>
          <div class="role-text">${member.title || member.role}</div>
          <div class="dept-text">${member.affil ? member.affil + ' · ' : ''}${member.department || ''}</div>
          <div class="member-bio">${member.bio}</div>
          <div class="member-interests">
            ${(member.interests || []).map(i => `<span class="interest-tag">${i}</span>`).join('')}
          </div>
          <div class="member-links">
            ${member.email ? `<a href="mailto:${member.email}">✉ Email</a>` : ''}
            ${member.website ? `<a href="${member.website}" target="_blank" rel="noopener">🌐 Website</a>` : ''}
            ${member.scholar ? `<a href="${member.scholar}" target="_blank" rel="noopener">📚 Scholar</a>` : ''}
            ${member.linkedin ? `<a href="${member.linkedin}" target="_blank" rel="noopener">💼 LinkedIn</a>` : ''}
          </div>
        </div>
      </div>`;

    // CV (full listing — for the PI or anyone with a cv block)
    const cvEl = document.getElementById('member-cv');
    if (cvEl && member.cv) {
      const rows = (arr) => arr.map(it => {
        const text = typeof it === 'string' ? it : it.text;
        const date = (typeof it === 'object' && it.date) ? `<span class="cv-date">${it.date}</span>` : '';
        return `<div class="cv-row"><span class="cv-text">${text}</span>${date}</div>`;
      }).join('');
      const group = (title, arr) => (arr && arr.length) ? `
        <div class="cv-group">
          <h3>${title}</h3>
          <div class="cv-list">${rows(arr)}</div>
        </div>` : '';
      const t = member.cv.teaching;
      const teaching = t ? `
        <div class="cv-group">
          <h3>Teaching</h3>
          ${t.graduate && t.graduate.length ? `<h4 class="cv-sub">Graduate</h4><div class="cv-list">${rows(t.graduate)}</div>` : ''}
          ${t.undergraduate && t.undergraduate.length ? `<h4 class="cv-sub">Undergraduate</h4><div class="cv-list">${rows(t.undergraduate)}</div>` : ''}
        </div>` : '';
      cvEl.innerHTML = `
        <h2 class="section-title">Curriculum Vitae</h2>
        <div class="accent-line"></div>
        ${group('Specialization &amp; Affiliations', member.cv.specializations)}
        ${group('Administrative Positions', member.cv.positions)}
        ${group('Selected Career History', member.cv.career)}
        ${group('Awards', member.cv.awards)}
        ${teaching}`;
    }

    // Related projects
    const memberProjects = projects.filter(p => (p.members || []).includes(memberId));
    const projEl = document.getElementById('member-projects');
    if (memberProjects.length > 0) {
      projEl.innerHTML = `
        <h2 class="section-title">Projects</h2>
        <div class="accent-line"></div>
        <div class="card-grid" style="grid-template-columns: repeat(2, 1fr);">
          ${memberProjects.map(p => `
            <a href="project-detail.html?id=${p.id}" class="card project-card">
              <div class="card-body">
                <span class="proj-type">${p.type || 'Project'}</span>
                <h3>${p.title}</h3>
                ${p.titleKo ? `<div class="card-titleko" lang="ko">${p.titleKo}</div>` : ''}
                <div class="card-meta"><span>${yearRange(p)}</span></div>
              </div>
            </a>
          `).join('')}
        </div>`;
    }

    // Related publications
    const memberPubs = pubs.filter(p => p.authors.some(a => a.memberId === memberId))
      .sort((a, b) => b.year - a.year);
    const pubEl = document.getElementById('member-publications');
    if (memberPubs.length > 0) {
      pubEl.innerHTML = `
        <h2 class="section-title">Publications</h2>
        <div class="accent-line"></div>
        ${memberPubs.map(p => `
          <div class="pub-item">
            <div class="pub-title">${p.title}</div>
            <div class="pub-venue">${p.venueType ? `<span class="pub-type" data-type="${p.venueType}">${p.venueType}</span>` : ''}${p.venue} · ${p.year}${p.citations ? ` <span class="pub-cites">${p.citations} citations</span>` : ''}</div>
            <div class="pub-authors">${renderAuthors(p.authors)}</div>
            <div class="pub-links">
              ${Object.entries(p.links || {}).map(([k, v]) =>
                `<a href="${v}" target="_blank" rel="noopener">${k.toUpperCase()}</a>`
              ).join('')}
            </div>
          </div>
        `).join('')}`;
    }

    // Related news (sidebar)
    const memberNews = news.filter(n => (n.relatedMembers || []).includes(memberId));
    const newsEl = document.getElementById('member-news');
    if (memberNews.length > 0) {
      newsEl.innerHTML = `
        <h4>Related News</h4>
        ${memberNews.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(n => `
          <a href="news-detail.html?id=${n.id}" class="related-news-item">
            <div class="related-news-thumb"><img src="${n.image}" alt="${n.title}" loading="lazy"></div>
            <div class="related-news-info">
              <h5>${n.title}</h5>
              <span>${formatDate(n.date)}</span>
            </div>
          </a>
        `).join('')}`;
    }

  } catch (err) {
    console.error('Member detail error:', err);
  }
});
