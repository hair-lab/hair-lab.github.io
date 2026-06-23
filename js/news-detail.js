/* ======================================================
   HAIR Lab — News Detail Page JS
   ====================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  const newsId = getParam('id');
  if (!newsId) { window.location.href = 'news.html'; return; }

  try {
    const [allNews, members] = await Promise.all([
      fetchJSON('data/news.json'),
      fetchJSON('data/members.json')
    ]);

    const item = allNews.find(n => n.id === newsId);
    if (!item) {
      document.getElementById('news-detail').innerHTML = '<p class="loading">News not found.</p>';
      return;
    }

    document.title = `${item.title} | HAIR Lab`;

    // Main content
    const mainEl = document.getElementById('news-main');
    const author = members.find(m => m.id === item.authorId);
    mainEl.innerHTML = `
      <h1 style="font-size:2rem;margin-bottom:16px;">${item.title}</h1>
      <div class="news-meta">
        <div class="news-author-avatar">
          <img src="${author ? author.image : 'images/default_profile.svg'}" alt="${item.author}">
        </div>
        <div>
          <div style="font-weight:600;">${author ? `<a href="member-detail.html?id=${author.id}">${item.author}</a>` : item.author}</div>
          <div style="font-size:.85rem;color:var(--text-muted);">${formatDate(item.date)}</div>
        </div>
      </div>
      <div class="news-content">
        <img src="${item.image}" alt="${item.title}" style="width:100%;border-radius:var(--radius-md);margin-bottom:24px;">
        <p>${item.content}</p>
      </div>`;

    // Sidebar: related people
    const sidebarEl = document.getElementById('news-sidebar');
    let sidebarHTML = '';

    // Related members
    const relatedMembers = (item.relatedMembers || []).map(id => members.find(m => m.id === id)).filter(Boolean);
    if (relatedMembers.length) {
      sidebarHTML += `<h4>More About</h4>`;
      relatedMembers.forEach(m => {
        sidebarHTML += `
          <a href="member-detail.html?id=${m.id}" class="sidebar-member" style="text-decoration:none;">
            <div class="sidebar-member-avatar"><img src="${m.image}" alt="${m.name}"></div>
            <div>
              <div style="font-weight:600;font-size:.9rem;color:var(--text-primary);">${m.name}</div>
              <div style="font-size:.78rem;color:var(--text-muted);">${m.role}</div>
            </div>
          </a>`;
      });
    }

    // Related news
    const otherNews = allNews.filter(n => n.id !== newsId).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    if (otherNews.length) {
      sidebarHTML += `<h4 style="margin-top:32px;">Latest News</h4>`;
      otherNews.forEach(n => {
        sidebarHTML += `
          <a href="news-detail.html?id=${n.id}" class="related-news-item" style="text-decoration:none;">
            <div class="related-news-thumb"><img src="${n.image}" alt="${n.title}" loading="lazy"></div>
            <div class="related-news-info">
              <h5>${n.title}</h5>
              <span>${formatDate(n.date)}</span>
            </div>
          </a>`;
      });
    }
    sidebarEl.innerHTML = sidebarHTML;

  } catch (err) {
    console.error('News detail error:', err);
  }
});
