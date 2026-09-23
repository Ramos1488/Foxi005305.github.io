/* ===== STORAGE KEYS ===== */
const KEYS = {
  projects: 'rr_projects',
  blog: 'rr_blog',
  news: 'rr_news',
  admin: 'rr_admin_session'
};

/* ===== ADMIN AUTH ===== */
// Change this password or move to env / server later
const ADMIN_PASSWORD = 'random2026';
let isAdmin = false;

function checkAdminSession() {
  try {
    const raw = sessionStorage.getItem(KEYS.admin);
    if (!raw) return false;
    const data = JSON.parse(raw);
    // Session valid for 8 hours
    if (data && data.ok && Date.now() - data.ts < 8 * 60 * 60 * 1000) {
      return true;
    }
  } catch (_) {}
  return false;
}

function setAdminSession(ok) {
  if (ok) {
    sessionStorage.setItem(KEYS.admin, JSON.stringify({ ok: true, ts: Date.now() }));
    isAdmin = true;
  } else {
    sessionStorage.removeItem(KEYS.admin);
    isAdmin = false;
  }
  updateAdminUI();
}

function updateAdminUI() {
  document.body.classList.toggle('is-admin', isAdmin);

  // Header button
  const btn = document.getElementById('adminBtn');
  const icon = document.getElementById('adminBtnIcon');
  const label = document.getElementById('adminBtnLabel');
  if (btn) {
    btn.classList.toggle('logged-in', isAdmin);
    if (icon) icon.textContent = isAdmin ? '🔓' : '🔒';
    if (label) label.textContent = isAdmin ? t('admin.logout') : t('admin.login');
  }

  // Show/hide admin-only panels
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
  });

  // Re-render cards so edit/delete buttons appear/disappear
  renderProjects();
  renderBlog();
  renderNews();
  renderHero();
}

/* ===== HELPERS ===== */
function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function formatNumber(n) {
  if (n == null) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}
function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  setTimeout(() => el.classList.remove('show'), 3200);
}
function parsePlaceId(input) {
  if (!input) return null;
  input = input.trim();
  // Pure number
  if (/^\d+$/.test(input)) return input;
  // URL patterns
  const m = input.match(/roblox\.com\/(?:games|experiences)\/(\d+)/i)
    || input.match(/[?&]placeId=(\d+)/i)
    || input.match(/\/(\d{6,})/);
  return m ? m[1] : null;
}

/* ===== ROBLOX API (via roproxy to avoid CORS) ===== */
async function fetchRobloxGame(placeId) {
  // 1. Get universeId
  const uniRes = await fetch(`https://apis.roproxy.com/universes/v1/places/${placeId}/universe`);
  if (!uniRes.ok) throw new Error('universe');
  const uniData = await uniRes.json();
  const universeId = uniData.universeId;
  if (!universeId) throw new Error('no universe');

  // 2. Game details
  const gameRes = await fetch(`https://games.roproxy.com/v1/games?universeIds=${universeId}`);
  if (!gameRes.ok) throw new Error('game');
  const gameData = await gameRes.json();
  const game = gameData.data && gameData.data[0];
  if (!game) throw new Error('no game');

  // 3. Thumbnail (icon)
  let thumbnail = null;
  try {
    const thumbRes = await fetch(
      `https://thumbnails.roproxy.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`
    );
    if (thumbRes.ok) {
      const thumbData = await thumbRes.json();
      if (thumbData.data && thumbData.data[0] && thumbData.data[0].imageUrl) {
        thumbnail = thumbData.data[0].imageUrl;
      }
    }
  } catch (_) {}

  // Fallback thumbnail via place
  if (!thumbnail) {
    try {
      const thumbRes2 = await fetch(
        `https://thumbnails.roproxy.com/v1/places/gameicons?placeIds=${placeId}&size=512x512&format=Png&isCircular=false`
      );
      if (thumbRes2.ok) {
        const t2 = await thumbRes2.json();
        if (t2.data && t2.data[0] && t2.data[0].imageUrl) {
          thumbnail = t2.data[0].imageUrl;
        }
      }
    } catch (_) {}
  }

  return {
    placeId: String(placeId),
    universeId: String(universeId),
    name: game.name || 'Unknown Game',
    description: game.description || '',
    creator: game.creator?.name || 'Unknown',
    creatorType: game.creator?.type || 'User',
    visits: game.visits || 0,
    playing: game.playing || 0,
    maxPlayers: game.maxPlayers || 0,
    created: game.created,
    updated: game.updated,
    rootPlaceId: game.rootPlaceId || placeId,
    thumbnail: thumbnail || `https://www.roblox.com/asset-thumbnail/image?assetId=${placeId}&width=768&height=432&format=png`,
    url: `https://www.roblox.com/games/${placeId}`
  };
}

/* ===== STATE ===== */
let projects = load(KEYS.projects);
let blogPosts = load(KEYS.blog);
let newsItems = load(KEYS.news);

/* ===== RENDER PROJECTS ===== */
function statusLabel(s) {
  return t('status.' + s) || s;
}

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  const empty = document.getElementById('projectsEmpty');
  grid.innerHTML = '';

  if (projects.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  projects.forEach(p => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-thumb">
        <img src="${p.thumbnail}" alt="${escapeHtml(p.name)}" loading="lazy"
             onerror="this.src='https://tr.rbxcdn.com/180DAY-placeholder/512/512/Image/Png/noFilter'">
        <span class="project-status status-${p.status}">${statusLabel(p.status)}</span>
      </div>
      <div class="project-body">
        <h3 class="project-name">${escapeHtml(p.name)}</h3>
        <p class="project-desc">${escapeHtml(p.description || '')}</p>
        <div class="project-meta">
          <span>👁 ${formatNumber(p.visits)} ${t('meta.visits')}</span>
          <span>🟢 ${formatNumber(p.playing)} ${t('meta.playing')}</span>
          <span>${t('meta.creator')} ${escapeHtml(p.creator)}</span>
        </div>
        <div class="project-actions">
          <a href="${p.url}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">${t('btn.play')}</a>
          ${isAdmin ? `
          <button class="btn btn-ghost btn-sm" data-action="edit-status" data-id="${p.id}">${t('btn.edit')}</button>
          <button class="btn btn-danger btn-sm" data-action="delete-project" data-id="${p.id}">${t('btn.delete')}</button>
          ` : ''}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ===== RENDER BLOG ===== */
function renderBlog() {
  const list = document.getElementById('blogList');
  const empty = document.getElementById('blogEmpty');
  list.innerHTML = '';

  if (blogPosts.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  // newest first
  [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(post => {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.innerHTML = `
      <div class="blog-meta">
        <span>${formatDate(post.date)}</span>
      </div>
      <h3 class="blog-title">${escapeHtml(post.title)}</h3>
      <div class="blog-excerpt">${escapeHtml(post.content)}</div>
      ${isAdmin ? `
      <div class="blog-actions-row">
        <button class="btn btn-ghost btn-sm" data-action="edit-blog" data-id="${post.id}">${t('btn.edit')}</button>
        <button class="btn btn-danger btn-sm" data-action="delete-blog" data-id="${post.id}">${t('btn.delete')}</button>
      </div>` : ''}
    `;
    list.appendChild(card);
  });
}

/* ===== RENDER NEWS ===== */
function renderNews() {
  const grid = document.getElementById('newsGrid');
  const empty = document.getElementById('newsEmpty');
  grid.innerHTML = '';

  if (newsItems.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  [...newsItems].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(item => {
    const card = document.createElement('article');
    card.className = 'news-card';
    card.innerHTML = `
      <div class="news-date">${formatDate(item.date)}</div>
      <h3 class="news-title">${escapeHtml(item.title)}</h3>
      <div class="news-body">${escapeHtml(item.content)}</div>
      ${isAdmin ? `
      <div class="blog-actions-row">
        <button class="btn btn-ghost btn-sm" data-action="edit-news" data-id="${item.id}">${t('btn.edit')}</button>
        <button class="btn btn-danger btn-sm" data-action="delete-news" data-id="${item.id}">${t('btn.delete')}</button>
      </div>` : ''}
    `;
    grid.appendChild(card);
  });
}

/* ===== HERO LIVE + STATS ===== */
function renderHero() {
  const live = document.getElementById('heroLive');
  live.innerHTML = '';

  const online = projects.filter(p => p.status === 'online' || p.status === 'beta');
  const show = online.length ? online.slice(0, 4) : projects.slice(0, 3);

  if (show.length === 0) {
    live.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;">${t('projects.empty')}</p>`;
  } else {
    show.forEach(p => {
      const item = document.createElement('div');
      item.className = 'live-item';
      item.innerHTML = `
        <img src="${p.thumbnail}" alt="" onerror="this.style.display='none'">
        <span class="name">${escapeHtml(p.name)}</span>
        <span class="project-status status-${p.status}" style="position:static;font-size:0.65rem;">${statusLabel(p.status)}</span>
      `;
      live.appendChild(item);
    });
  }

  document.getElementById('statGames').textContent = projects.length;
  document.getElementById('statOnline').textContent = projects.filter(p => p.status === 'online').length;
  document.getElementById('statPosts').textContent = blogPosts.length;
}

function renderAll() {
  renderProjects();
  renderBlog();
  renderNews();
  renderHero();
}

/* ===== ADD GAME ===== */
async function addGame() {
  const input = document.getElementById('gameUrlInput');
  const statusSelect = document.getElementById('gameStatusSelect');
  const placeId = parsePlaceId(input.value);

  if (!placeId) {
    toast(t('toast.notFound'), 'error');
    return;
  }

  // prevent duplicates
  if (projects.some(p => p.placeId === placeId)) {
    toast(currentLang === 'ru' ? 'Эта игра уже добавлена' : 'Game already added', 'error');
    return;
  }

  const btn = document.getElementById('addGameBtn');
  btn.disabled = true;
  btn.textContent = '…';
  toast(t('toast.fetching'));

  try {
    const data = await fetchRobloxGame(placeId);
    const project = {
      id: uid(),
      status: statusSelect.value,
      addedAt: new Date().toISOString(),
      ...data
    };
    projects.unshift(project);
    save(KEYS.projects, projects);
    input.value = '';
    renderAll();
    toast(t('toast.added'));
  } catch (err) {
    console.error(err);
    toast(t('toast.notFound'), 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = t('projects.add');
  }
}

/* ===== MODAL ===== */
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');

function openModal(html) {
  modalContent.innerHTML = html;
  modal.classList.add('open');
}
function closeModal() {
  modal.classList.remove('open');
}

document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

/* ===== EDIT STATUS ===== */
function openEditStatus(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;

  const options = ['in_dev', 'coming_soon', 'online', 'beta', 'maintenance', 'offline']
    .map(s => `<option value="${s}" ${p.status === s ? 'selected' : ''}>${statusLabel(s)}</option>`)
    .join('');

  openModal(`
    <h3>${t('modal.editStatus')}</h3>
    <p style="margin-bottom:16px;color:var(--text-muted);">${escapeHtml(p.name)}</p>
    <label>${t('modal.status')}</label>
    <select id="editStatusSelect">${options}</select>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="modalCancel">${t('btn.cancel')}</button>
      <button class="btn btn-primary" id="modalSaveStatus">${t('btn.save')}</button>
    </div>
  `);

  document.getElementById('modalCancel').onclick = closeModal;
  document.getElementById('modalSaveStatus').onclick = () => {
    p.status = document.getElementById('editStatusSelect').value;
    save(KEYS.projects, projects);
    closeModal();
    renderAll();
    toast(t('toast.updated'));
  };
}

/* ===== BLOG / NEWS CRUD ===== */
function openBlogModal(id = null) {
  const post = id ? blogPosts.find(x => x.id === id) : null;
  openModal(`
    <h3>${post ? t('modal.editBlog') : t('modal.newBlog')}</h3>
    <label>${t('modal.title')}</label>
    <input type="text" id="blogTitle" value="${post ? escapeHtml(post.title) : ''}">
    <label>${t('modal.content')}</label>
    <textarea id="blogContent">${post ? escapeHtml(post.content) : ''}</textarea>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="modalCancel">${t('btn.cancel')}</button>
      <button class="btn btn-primary" id="modalSaveBlog">${t('btn.save')}</button>
    </div>
  `);
  document.getElementById('modalCancel').onclick = closeModal;
  document.getElementById('modalSaveBlog').onclick = () => {
    const title = document.getElementById('blogTitle').value.trim();
    const content = document.getElementById('blogContent').value.trim();
    if (!title) return;
    if (post) {
      post.title = title;
      post.content = content;
    } else {
      blogPosts.unshift({
        id: uid(),
        title,
        content,
        date: new Date().toISOString()
      });
    }
    save(KEYS.blog, blogPosts);
    closeModal();
    renderAll();
    toast(t('toast.updated'));
  };
}

function openNewsModal(id = null) {
  const item = id ? newsItems.find(x => x.id === id) : null;
  openModal(`
    <h3>${item ? t('modal.editNews') : t('modal.newNews')}</h3>
    <label>${t('modal.title')}</label>
    <input type="text" id="newsTitle" value="${item ? escapeHtml(item.title) : ''}">
    <label>${t('modal.content')}</label>
    <textarea id="newsContent">${item ? escapeHtml(item.content) : ''}</textarea>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="modalCancel">${t('btn.cancel')}</button>
      <button class="btn btn-primary" id="modalSaveNews">${t('btn.save')}</button>
    </div>
  `);
  document.getElementById('modalCancel').onclick = closeModal;
  document.getElementById('modalSaveNews').onclick = () => {
    const title = document.getElementById('newsTitle').value.trim();
    const content = document.getElementById('newsContent').value.trim();
    if (!title) return;
    if (item) {
      item.title = title;
      item.content = content;
    } else {
      newsItems.unshift({
        id: uid(),
        title,
        content,
        date: new Date().toISOString()
      });
    }
    save(KEYS.news, newsItems);
    closeModal();
    renderAll();
    toast(t('toast.updated'));
  };
}

/* ===== DELEGATED CLICKS ===== */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  if (!isAdmin) {
    toast(t('admin.title'), 'error');
    openLoginModal();
    return;
  }
  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === 'edit-status') openEditStatus(id);
  if (action === 'delete-project') {
    if (confirm(currentLang === 'ru' ? 'Удалить игру?' : 'Delete this game?')) {
      projects = projects.filter(p => p.id !== id);
      save(KEYS.projects, projects);
      renderAll();
      toast(t('toast.deleted'));
    }
  }
  if (action === 'edit-blog') openBlogModal(id);
  if (action === 'delete-blog') {
    if (confirm(currentLang === 'ru' ? 'Удалить пост?' : 'Delete this post?')) {
      blogPosts = blogPosts.filter(p => p.id !== id);
      save(KEYS.blog, blogPosts);
      renderAll();
      toast(t('toast.deleted'));
    }
  }
  if (action === 'edit-news') openNewsModal(id);
  if (action === 'delete-news') {
    if (confirm(currentLang === 'ru' ? 'Удалить новость?' : 'Delete this news?')) {
      newsItems = newsItems.filter(n => n.id !== id);
      save(KEYS.news, newsItems);
      renderAll();
      toast(t('toast.deleted'));
    }
  }
});

/* ===== NAV ===== */
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');
menuBtn.addEventListener('click', () => nav.classList.toggle('open'));

document.querySelectorAll('[data-nav]').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const target = link.getAttribute('data-nav') || link.getAttribute('href')?.slice(1);
    document.querySelectorAll(`.nav-link[data-nav="${target}"]`).forEach(l => l.classList.add('active'));
  });
});

// Active section on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('data-nav') === current);
  });
});

/* ===== LOGIN MODAL ===== */
const loginModal = document.getElementById('loginModal');

function openLoginModal() {
  document.getElementById('loginError').style.display = 'none';
  document.getElementById('adminPassword').value = '';
  loginModal.classList.add('open');
  setTimeout(() => document.getElementById('adminPassword').focus(), 100);
}
function closeLoginModal() {
  loginModal.classList.remove('open');
}

document.getElementById('loginModalClose').addEventListener('click', closeLoginModal);
document.getElementById('loginCancel').addEventListener('click', closeLoginModal);
loginModal.addEventListener('click', e => { if (e.target === loginModal) closeLoginModal(); });

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const pass = document.getElementById('adminPassword').value;
  if (pass === ADMIN_PASSWORD) {
    setAdminSession(true);
    closeLoginModal();
    toast(t('admin.welcome'));
  } else {
    document.getElementById('loginError').style.display = 'block';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminPassword').focus();
  }
});

document.getElementById('adminBtn').addEventListener('click', () => {
  if (isAdmin) {
    setAdminSession(false);
    toast(t('admin.loggedOut'));
  } else {
    openLoginModal();
  }
});

/* ===== INIT ===== */
document.getElementById('addGameBtn').addEventListener('click', () => {
  if (!isAdmin) { openLoginModal(); return; }
  addGame();
});
document.getElementById('gameUrlInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (!isAdmin) { openLoginModal(); return; }
    addGame();
  }
});
document.getElementById('addBlogBtn').addEventListener('click', () => {
  if (!isAdmin) { openLoginModal(); return; }
  openBlogModal();
});
document.getElementById('addNewsBtn').addEventListener('click', () => {
  if (!isAdmin) { openLoginModal(); return; }
  openNewsModal();
});
document.getElementById('langToggle').addEventListener('click', toggleLanguage);

// Restore session
isAdmin = checkAdminSession();

setLanguage(currentLang);
updateAdminUI();

/* ===== simple particles ===== */
(function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      width:${2 + Math.random() * 3}px;
      height:${2 + Math.random() * 3}px;
      background:rgba(255,255,255,${0.1 + Math.random() * 0.25});
      border-radius:50%;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation: float ${6 + Math.random() * 10}s ease-in-out infinite;
      animation-delay:-${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
})();
