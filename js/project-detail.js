/* ======================================================
   HAIR Lab — Project Detail Page JS
   ====================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  const projectId = getParam('id');
  if (!projectId) { window.location.href = 'projects.html'; return; }

  try {
    const [projects, members, pubs] = await Promise.all([
      fetchJSON('data/projects.json'),
      fetchJSON('data/members.json'),
      fetchJSON('data/publications.json')
    ]);

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      document.getElementById('project-detail').innerHTML = '<p class="loading">Project not found.</p>';
      return;
    }

    document.title = `${project.title} | HAIR Lab`;

    // Main content
    const mainEl = document.getElementById('project-main');
    const relPubs = pubs.filter(p => (project.publications || []).includes(p.id));

    mainEl.innerHTML = `
      <span class="proj-type">${project.type || 'Project'}</span>
      <h1 style="font-size:1.9rem;margin:14px 0 6px;letter-spacing:-.02em;">${project.title}</h1>
      ${project.titleKo ? `<p lang="ko" style="font-size:1rem;color:var(--text-muted);margin-bottom:24px;">${project.titleKo}</p>` : ''}
      <div style="font-size:1.05rem;line-height:1.8;color:var(--text-secondary);margin-bottom:32px;">
        ${project.description}
      </div>
      ${relPubs.length ? `
        <h2 class="section-title">Related Publications</h2>
        <div class="accent-line"></div>
        ${relPubs.map(p => `
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
        `).join('')}
      ` : ''}`;

    // Sidebar
    const sidebarEl = document.getElementById('project-sidebar');
    const projectMembers = (project.members || []).map(id => members.find(m => m.id === id)).filter(Boolean);
    const relatedProjects = projects.filter(p => p.id !== projectId && (p.categories || []).some(c => (project.categories || []).includes(c))).slice(0, 3);

    let sidebarHTML = `
      <div class="sidebar-section">
        <h4>Status</h4>
        <p style="font-size:.95rem;color:var(--text-secondary);">${project.status === 'active' ? 'Ongoing' : 'Completed'} · ${yearRange(project)}</p>
      </div>
      <div class="sidebar-section">
        <h4>Division</h4>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          <span class="interest-tag">${project.type || 'Project'}</span>
        </div>
      </div>
      ${project.funder ? `
      <div class="sidebar-section">
        <h4>Funding / Organizer</h4>
        <p style="font-size:.9rem;color:var(--text-secondary);line-height:1.5;">${project.funder}</p>
      </div>` : ''}`;

    if (project.website && project.website !== '#') {
      sidebarHTML += `
        <div class="sidebar-section">
          <h4>Website</h4>
          <a href="${project.website}" target="_blank" rel="noopener" style="font-size:.9rem;">${project.website}</a>
        </div>`;
    }

    // Principal Investigator (actual lead; link only if a lab member)
    if (project.leadPI) {
      const piMember = project.leadPIId ? members.find(m => m.id === project.leadPIId) : null;
      sidebarHTML += `<div class="sidebar-section"><h4>Principal Investigator</h4>`;
      if (piMember) {
        sidebarHTML += `
          <a href="member-detail.html?id=${piMember.id}" class="sidebar-member" style="text-decoration:none;">
            <div class="sidebar-member-avatar">${monogram(piMember.name)}</div>
            <div><div style="font-weight:600;font-size:.9rem;color:var(--text-primary);">${piMember.name}</div></div>
          </a>`;
      } else {
        sidebarHTML += `<p style="font-size:.92rem;color:var(--text-secondary);">${project.leadPI}</p>`;
      }
      sidebarHTML += `</div>`;
    }

    // HAIR Lab members involved (excluding the lead PI)
    const labMembers = projectMembers.filter(m => m.id !== project.leadPIId);
    if (labMembers.length) {
      sidebarHTML += `
        <div class="sidebar-section">
          <h4>HAIR Lab</h4>
          ${labMembers.map(m => `
            <a href="member-detail.html?id=${m.id}" class="sidebar-member" style="text-decoration:none;">
              <div class="sidebar-member-avatar">${monogram(m.name)}</div>
              <div>
                <div style="font-weight:600;font-size:.9rem;color:var(--text-primary);">${m.name}</div>
                <div style="font-size:.78rem;color:var(--text-muted);">${m.role}</div>
              </div>
            </a>
          `).join('')}
        </div>`;
    }

    if (relatedProjects.length) {
      sidebarHTML += `
        <div class="sidebar-section">
          <h4>Related Projects</h4>
          ${relatedProjects.map(p => `
            <a href="project-detail.html?id=${p.id}" style="display:flex;gap:10px;padding:8px 0;text-decoration:none;border-bottom:1px solid var(--border-color);">
              <div style="width:60px;height:42px;min-width:60px;border-radius:var(--radius-sm);overflow:hidden;background:var(--bg-secondary);">
                <img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">
              </div>
              <div>
                <div style="font-weight:600;font-size:.85rem;color:var(--text-primary);line-height:1.3;">${p.title}</div>
                <div style="font-size:.75rem;color:var(--text-muted);">${p.startYear} – ${p.endYear || 'Present'}</div>
              </div>
            </a>
          `).join('')}
        </div>`;
    }

    sidebarEl.innerHTML = sidebarHTML;

  } catch (err) {
    console.error('Project detail error:', err);
  }
});
