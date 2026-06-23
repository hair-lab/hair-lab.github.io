/* ======================================================
   HAIR Lab — News Page JS
   ====================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const news = await fetchJSON('data/news.json');
    const container = document.getElementById('news-list');
    if (!container) return;

    const sorted = news.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = sorted.map(n => `
      <a href="news-detail.html?id=${n.id}" class="card" id="news-${n.id}">
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

  } catch (err) {
    console.error('News error:', err);
  }
});
