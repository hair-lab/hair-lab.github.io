/* ======================================================
   HAIR Lab — Projects Page JS
   Grouped by status (Active / Completed), filterable by
   division/type (National R&D · Institutional Research · Public Demonstration).
   ====================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const projects = await fetchJSON('data/projects.json');
    const sidebar = document.getElementById('project-filters');
    const main = document.getElementById('project-list');
    if (!main) return;

    // Collect divisions (types)
    const typeCounts = {};
    projects.forEach(p => { if (p.type) typeCounts[p.type] = (typeCounts[p.type] || 0) + 1; });
    const types = Object.keys(typeCounts).sort();

    if (sidebar) {
      sidebar.innerHTML = `
        <h3>Funding Division</h3>
        <div class="filter-list">
          <div class="filter-item active" data-type="all">
            <span>All</span><span class="filter-count">${projects.length}</span>
          </div>
          ${types.map(t => `
            <div class="filter-item" data-type="${t}">
              <span>${t}</span><span class="filter-count">${typeCounts[t]}</span>
            </div>`).join('')}
        </div>`;
    }

    const card = (p) => `
      <a href="project-detail.html?id=${p.id}" class="card project-card" id="proj-${p.id}">
        <div class="card-body">
          <span class="proj-type">${p.type || 'Project'}</span>
          <h3>${p.title}</h3>
          ${p.titleKo ? `<div class="card-titleko" lang="ko">${p.titleKo}</div>` : ''}
          <div class="card-meta">
            <span>${yearRange(p)}</span>
            ${p.funder ? `<span>·</span><span>${p.funder.split(' · ')[0]}</span>` : ''}
          </div>
        </div>
      </a>`;

    function render(filter) {
      const match = (p) => filter === 'all' || p.type === filter;
      const active = projects.filter(p => p.status === 'active' && match(p));
      const completed = projects.filter(p => p.status === 'completed' && match(p));

      let html = '';
      if (active.length) {
        html += `<h2 class="project-status-heading">Ongoing Projects</h2>`;
        html += `<div class="card-grid">${active.map(card).join('')}</div>`;
      }
      if (completed.length) {
        html += `<h2 class="project-status-heading" style="margin-top:48px;">Completed Projects</h2>`;
        html += `<div class="card-grid">${completed.map(card).join('')}</div>`;
      }
      if (!active.length && !completed.length) {
        html = '<p class="loading">No projects match the selected division.</p>';
      }
      main.innerHTML = html;
    }

    render('all');

    document.querySelectorAll('.filter-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.filter-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        render(item.dataset.type);
      });
    });

  } catch (err) {
    console.error('Projects error:', err);
  }
});
