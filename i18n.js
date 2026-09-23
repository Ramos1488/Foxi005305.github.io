const translations = {
  en: {
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.blog": "Dev Blog",
    "nav.news": "Game News",
    "nav.about": "About",
    "hero.badge": "✦ Independent Roblox Studio",
    "hero.title1": "We build",
    "hero.title2": "Random Games",
    "hero.title3": "that feel alive",
    "hero.desc": "From chaotic prototypes to polished experiences. Track our projects, read the dev blog, and stay updated with the latest game news.",
    "hero.cta1": "View Projects",
    "hero.cta2": "Read Dev Blog",
    "hero.live": "Live Status",
    "stats.games": "Games",
    "stats.online": "Online",
    "stats.posts": "Blog Posts",
    "projects.title": "Our Projects",
    "projects.desc": "Paste a Roblox game link — we fetch the real data and let you set the status.",
    "projects.placeholder": "https://www.roblox.com/games/123456789/Game-Name or Place ID",
    "projects.add": "Add Game",
    "projects.hint": "Data is stored locally in your browser (demo). For production use Supabase / Vercel KV.",
    "projects.empty": "No projects yet. Add your first Roblox game above!",
    "status.in_dev": "In Development",
    "status.coming_soon": "Coming Soon",
    "status.online": "Online",
    "status.beta": "Beta",
    "status.maintenance": "Maintenance",
    "status.offline": "Offline",
    "blog.title": "Dev Blog",
    "blog.desc": "Behind the scenes, progress updates, and development thoughts.",
    "blog.add": "+ New Post",
    "blog.empty": "No blog posts yet.",
    "news.title": "Game News",
    "news.desc": "Announcements, updates and community highlights.",
    "news.add": "+ New News",
    "news.empty": "No news yet.",
    "about.title": "About Random Roblox",
    "about.p1": "We are a small independent studio creating fun, experimental and sometimes completely random Roblox experiences.",
    "about.p2": "This site is a living dashboard of our projects. Paste any Roblox game link and we pull live data (name, visits, players, thumbnail) so you always see the real status.",
    "about.p3": "Built with pure HTML, CSS & JavaScript. Ready for Vercel + database (Supabase recommended).",
    "about.stack": "Tech Stack",
    "about.db": "For Production DB",
    "about.dbHint": "Replace localStorage with Supabase / Firebase / Vercel Postgres + serverless API routes.",
    "btn.edit": "Edit",
    "btn.delete": "Delete",
    "btn.play": "Play on Roblox",
    "btn.save": "Save",
    "btn.cancel": "Cancel",
    "modal.editStatus": "Change Status",
    "modal.editBlog": "Edit Blog Post",
    "modal.newBlog": "New Blog Post",
    "modal.editNews": "Edit News",
    "modal.newNews": "New News",
    "modal.title": "Title",
    "modal.content": "Content",
    "modal.status": "Status",
    "toast.added": "Game added successfully!",
    "toast.updated": "Updated!",
    "toast.deleted": "Deleted",
    "toast.error": "Something went wrong",
    "toast.fetching": "Fetching from Roblox…",
    "toast.notFound": "Game not found. Check the link or Place ID.",
    "meta.visits": "visits",
    "meta.playing": "playing",
    "meta.creator": "by",
    "admin.login": "Admin",
    "admin.logout": "Logout",
    "admin.title": "Admin Login",
    "admin.subtitle": "Enter password to manage projects, blog and news",
    "admin.password": "Password",
    "admin.submit": "Sign in",
    "admin.error": "Wrong password",
    "admin.hint": "Default password: random2026",
    "admin.welcome": "Logged in as Admin",
    "admin.loggedOut": "Logged out",
  },
  ru: {
    "nav.home": "Главная",
    "nav.projects": "Проекты",
    "nav.blog": "Dev Блог",
    "nav.news": "Новости",
    "nav.about": "О нас",
    "hero.badge": "✦ Независимая Roblox-студия",
    "hero.title1": "Мы создаём",
    "hero.title2": "рандомные игры",
    "hero.title3": "которые живые",
    "hero.desc": "От хаотичных прототипов до отполированных проектов. Следи за нашими играми, читай dev-блог и будь в курсе новостей.",
    "hero.cta1": "Смотреть проекты",
    "hero.cta2": "Читать блог",
    "hero.live": "Живой статус",
    "stats.games": "Игр",
    "stats.online": "Онлайн",
    "stats.posts": "Постов",
    "projects.title": "Наши проекты",
    "projects.desc": "Вставь ссылку на игру Roblox — мы подтянем реальные данные и дадим поставить статус.",
    "projects.placeholder": "https://www.roblox.com/games/123456789/Название или Place ID",
    "projects.add": "Добавить игру",
    "projects.hint": "Данные хранятся локально в браузере (демо). Для продакшена — Supabase / Vercel KV.",
    "projects.empty": "Пока нет проектов. Добавь первую игру выше!",
    "status.in_dev": "В разработке",
    "status.coming_soon": "Скоро",
    "status.online": "Онлайн",
    "status.beta": "Бета",
    "status.maintenance": "Техработы",
    "status.offline": "Оффлайн",
    "blog.title": "Dev Блог",
    "blog.desc": "За кулисами, прогресс и мысли о разработке.",
    "blog.add": "+ Новый пост",
    "blog.empty": "Постов пока нет.",
    "news.title": "Новости игр",
    "news.desc": "Анонсы, обновления и новости сообщества.",
    "news.add": "+ Новая новость",
    "news.empty": "Новостей пока нет.",
    "about.title": "О Random Roblox",
    "about.p1": "Мы — небольшая независимая студия, которая создаёт весёлые, экспериментальные и иногда совсем рандомные Roblox-проекты.",
    "about.p2": "Этот сайт — живая панель наших проектов. Вставь любую ссылку на игру Roblox — мы подтянем живые данные (название, визиты, игроки, картинка), чтобы всегда был актуальный статус.",
    "about.p3": "Сделано на чистом HTML, CSS и JavaScript. Готово к деплою на Vercel + база данных (рекомендуем Supabase).",
    "about.stack": "Стек",
    "about.db": "Для продакшен БД",
    "about.dbHint": "Замени localStorage на Supabase / Firebase / Vercel Postgres + serverless API routes.",
    "btn.edit": "Изменить",
    "btn.delete": "Удалить",
    "btn.play": "Играть в Roblox",
    "btn.save": "Сохранить",
    "btn.cancel": "Отмена",
    "modal.editStatus": "Изменить статус",
    "modal.editBlog": "Редактировать пост",
    "modal.newBlog": "Новый пост",
    "modal.editNews": "Редактировать новость",
    "modal.newNews": "Новая новость",
    "modal.title": "Заголовок",
    "modal.content": "Содержание",
    "modal.status": "Статус",
    "toast.added": "Игра успешно добавлена!",
    "toast.updated": "Обновлено!",
    "toast.deleted": "Удалено",
    "toast.error": "Что-то пошло не так",
    "toast.fetching": "Загружаем из Roblox…",
    "toast.notFound": "Игра не найдена. Проверь ссылку или Place ID.",
    "meta.visits": "визитов",
    "meta.playing": "играют",
    "meta.creator": "от",
    "admin.login": "Админ",
    "admin.logout": "Выйти",
    "admin.title": "Вход администратора",
    "admin.subtitle": "Введите пароль, чтобы управлять проектами, блогом и новостями",
    "admin.password": "Пароль",
    "admin.submit": "Войти",
    "admin.error": "Неверный пароль",
    "admin.hint": "Пароль по умолчанию: random2026",
    "admin.welcome": "Вы вошли как администратор",
    "admin.loggedOut": "Вы вышли",
  }
};

let currentLang = localStorage.getItem('rr_lang') || 'en';

function t(key) {
  return translations[currentLang][key] || translations.en[key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('rr_lang', lang);
  document.documentElement.lang = lang;
  document.getElementById('langLabel').textContent = lang.toUpperCase();

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Update status select options
  const select = document.getElementById('gameStatusSelect');
  if (select) {
    Array.from(select.options).forEach(opt => {
      const key = 'status.' + opt.value;
      opt.textContent = t(key);
    });
  }

  // Re-render dynamic content + admin UI (button labels depend on lang)
  if (typeof renderAll === 'function') renderAll();
  if (typeof updateAdminUI === 'function') updateAdminUI();
}

function toggleLanguage() {
  setLanguage(currentLang === 'en' ? 'ru' : 'en');
}
