/* ======================================================
   HAIR Lab — People Page JS (current members + alumni)
   ====================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [members, alumni] = await Promise.all([
      fetchJSON('data/members.json'),
      fetchJSON('data/alumni.json').catch(() => [])
    ]);
    const container = document.getElementById('members-container');
    if (!container) return;

    const roleOrder = ['Professor', 'Lab Manager', 'Ph.D. Student', 'Researcher', 'M.S. Student', 'Undergraduate Researcher', 'Intern'];
    const heading = {
      'Professor': 'Director',
      'Lab Manager': 'Lab Management',
      'Ph.D. Student': 'Ph.D. Students',
      'Researcher': 'Researchers (M.S.)',
      'M.S. Student': 'M.S. Students',
      'Undergraduate Researcher': 'Undergraduate Researchers',
      'Intern': 'Interns'
    };

    const grouped = {};
    roleOrder.forEach(r => grouped[r] = []);
    members.forEach(m => {
      if (grouped[m.role]) grouped[m.role].push(m);
      else (grouped['Other'] = grouped['Other'] || []).push(m);
    });

    let html = '';
    for (const [role, list] of Object.entries(grouped)) {
      if (!list.length) continue;
      html += `<h2 class="role-group-heading">${heading[role] || role}</h2>`;
      html += `<div class="people-grid">`;
      list.forEach(m => {
        html += `
          <a href="member-detail.html?id=${m.id}" class="person-card" id="person-${m.id}">
            <div class="person-avatar">${monogram(m.name)}</div>
            <div class="person-name">${m.name}</div>
            ${m.nameKo ? `<div class="person-ko">${m.nameKo}</div>` : ''}
            <div class="person-role">${m.title || m.role}</div>
            <div class="person-dept">${m.affil || (m.department ? m.department.split(',')[0] : '')}</div>
          </a>`;
      });
      html += `</div>`;
    }

    // Alumni
    if (alumni && alumni.length) {
      html += `<h2 class="role-group-heading" style="margin-top:56px;">Alumni</h2>`;
      html += `<div class="alumni-list">`;
      alumni.forEach(a => {
        html += `
          <div class="alumni-item">
            <div class="alumni-head">
              <span class="alumni-name">${a.name}</span>
              ${a.nameKo ? `<span class="alumni-ko">${a.nameKo}</span>` : ''}
              ${a.cohort ? `<span class="alumni-cohort">${a.cohort}</span>` : ''}
            </div>
            ${a.now ? `<div class="alumni-now">${a.now}</div>` : ''}
          </div>`;
      });
      html += `</div>`;
    }

    container.innerHTML = html;

  } catch (err) {
    console.error('Members load error:', err);
    document.getElementById('members-container').innerHTML = '<p class="loading">Failed to load members.</p>';
  }
});
