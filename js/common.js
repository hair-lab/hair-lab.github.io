/* ======================================================
   HAIR Lab — Common JS (Navigation, Footer, Utilities)
   ====================================================== */

/** Fetch JSON utility.
 *  Reads from the embedded dataset (js/data.js) first so the site works
 *  when opened directly from disk (file://), where browsers block fetch()
 *  of local JSON. Falls back to a network fetch when served over http(s). */
async function fetchJSON(url) {
  if (window.HAIR_DATA) {
    const key = url.replace(/^.*\//, '').replace(/\.json$/, '');
    if (window.HAIR_DATA[key]) {
      return JSON.parse(JSON.stringify(window.HAIR_DATA[key])); // deep copy
    }
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

/** Format date string to readable format */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

/** Get URL search parameter */
function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/** Human-friendly year range for a project. */
function yearRange(p) {
  if (!p.startYear && !p.endYear) return p.status === 'active' ? 'Ongoing' : '—';
  return `${p.startYear} – ${p.endYear || 'Present'}`;
}

/** Monogram (initials) avatar — used instead of photos for people. */
function initials(name) {
  if (!name) return '?';
  const parts = name.replace(/\(.*?\)/g, '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `hsl(${h} 42% 52%)`;
}
function monogram(name) {
  return `<span class="mono" style="background:${avatarColor(name)}">${initials(name)}</span>`;
}

/** Inject navigation */
function renderNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const links = [
    { href: 'index.html', label: 'Home' },
    { href: 'news.html', label: 'News' },
    { href: 'members.html', label: 'People' },
    { href: 'projects.html', label: 'Projects' },
    { href: 'publications.html', label: 'Publications' },
    { href: 'contact.html', label: 'Contact' },
  ];

  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.setAttribute('role', 'navigation');
  nav.innerHTML = `
    <div class="container">
      <a href="index.html" class="nav-brand" aria-label="HAIR Lab — Human Artificial Intelligence Research Lab — home">
        <img src="images/logo.png" alt="HAIR Lab — Human Artificial Intelligence Research Lab" class="brand-full">
      </a>
      <div class="nav-links" id="nav-links">
        ${links.map(l => `<a href="${l.href}" class="${currentPage === l.href || (currentPage === '' && l.href === 'index.html') ? 'active' : ''}">${l.label}</a>`).join('')}
      </div>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
    </div>`;
  document.body.prepend(nav);

  // Hamburger
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Glass nav: add shadow/opacity once the page is scrolled
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/** Inject footer */
function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <img src="images/logo-white.png" alt="HAIR Lab" class="footer-logo">
          <p><span lang="ko">연세대학교 인간과인공지능연구실</span><br>
          Human Artificial Intelligence Research Lab<br>
          Yonsei University, International Campus</p>
          <p style="margin-top:12px;font-size:.85rem;">
            Veritas Hall B 310, 85 Songdogwahak-ro,<br>
            Yeonsu-gu, Incheon, Republic of Korea
          </p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul class="footer-links">
            <li><a href="index.html">›  Home</a></li>
            <li><a href="news.html">›  News</a></li>
            <li><a href="members.html">›  People</a></li>
            <li><a href="projects.html">›  Projects</a></li>
            <li><a href="publications.html">›  Publications</a></li>
            <li><a href="contact.html">›  Contact</a></li>
          </ul>
        </div>
        <div>
          <h3>Connect</h3>
          <ul class="footer-links">
            <li><a href="https://yonsei.ac.kr" target="_blank" rel="noopener">›  Yonsei University</a></li>
            <li><a href="https://scholar.google.com/citations?user=DM09eoQAAAAJ&hl=ko&oi=ao" target="_blank" rel="noopener">›  Google Scholar</a></li>
            <li><a href="https://github.com/hair-lab" target="_blank" rel="noopener">›  GitHub</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        © ${new Date().getFullYear()} HAIR Lab, Yonsei University. All rights reserved.
      </div>
    </div>`;
  document.body.appendChild(footer);
}

/** Scroll-to-top button */
function renderScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/** Build author HTML with cross-links */
function renderAuthors(authors) {
  return authors.map(a => {
    if (a.isMember && a.memberId) {
      return `<a href="member-detail.html?id=${a.memberId}">${a.name}</a>`;
    }
    return `<span>${a.name}</span>`;
  }).join(', ');
}

const prefersReducedMotion =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scroll-reveal: fade + rise elements as they enter the viewport.
 *  Auto-targets common content blocks so no HTML changes are needed.
 *  Re-run after async content loads via window.HAIR.revealScan(). */
function initScrollReveal() {
  const SELECTOR = [
    '.kicker', '.section-title', '.accent-line', '.section-subtitle',
    '.about-lead', '.about-body', '.mission-item',
    '.focus-card', '.card', '.person-card', '.pub-item', '.see-all-link',
    '.role-group-heading', '.contact-info-item', '.contact-map',
    '.pub-year-heading', '.project-status-heading'
  ].join(',');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll(SELECTOR).forEach(el => el.classList.add('reveal', 'in-view'));
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  const scan = () => {
    document.querySelectorAll(SELECTOR).forEach(el => {
      if (el.dataset.revealReady) return;
      el.dataset.revealReady = '1';
      el.classList.add('reveal');
      // stagger siblings inside the same grid for a cascading effect
      const parent = el.parentElement;
      if (parent && /card-grid|news-grid|people-grid|focus-areas/.test(parent.className)) {
        const idx = Array.prototype.indexOf.call(parent.children, el);
        el.setAttribute('data-reveal-delay', String(Math.min(idx, 5)));
      }
      observer.observe(el);
    });
  };
  scan();

  // Async page scripts inject cards/members after load — re-scan on DOM changes.
  let scanTimer;
  const mo = new MutationObserver(() => {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scan, 80);
  });
  mo.observe(document.body, { childList: true, subtree: true });
  return scan;
}

/** Count-up animation for hero stat numbers (e.g. "6+", "8+", "7"). */
function initCounters() {
  const nums = document.querySelectorAll('.hero-stat .number');
  if (!nums.length) return;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

  const animate = (el) => {
    const raw = el.textContent.trim();
    const target = parseInt(raw, 10);
    if (isNaN(target)) return;
    const suffix = raw.replace(/[0-9]/g, '');
    const duration = 1400;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
}

/** Hero neural-network particle field — the "AI" motif.
 *  Nodes drift slowly; nearby nodes link with fading lines; gently
 *  reacts to the cursor. Lightweight and capped for performance. */
function initHeroCanvas() {
  const hero = document.getElementById('hero');
  if (!hero || prefersReducedMotion) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  hero.insertBefore(canvas, hero.firstChild);
  const ctx = canvas.getContext('2d');

  let w, h, dpr, nodes = [];
  const mouse = { x: -9999, y: -9999 };

  const setup = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth; h = hero.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const density = Math.min(Math.round((w * h) / 16000), 90);
    nodes = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.8
    }));
  };

  const LINK = 132;
  const draw = () => {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;

      // subtle cursor attraction
      const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
      const md = Math.hypot(mdx, mdy);
      if (md < 150) { a.x += (mdx / md) * 0.5; a.y += (mdy / md) * 0.5; }

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK) {
          const o = (1 - dist / LINK) * 0.22;
          ctx.strokeStyle = `rgba(150,196,255,${o})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180,212,255,.65)';
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };

  let raf;
  setup();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 200);
  });
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
}

/* Boot */
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
  renderScrollTop();
  initHeroCanvas();
  initCounters();
  const rescan = initScrollReveal();
  // Expose a hook so page scripts can re-reveal async-loaded content.
  window.HAIR = { revealScan: rescan };
});
