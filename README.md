# Random Roblox — Game Development Studio Site

Красивый сайт-дашборд для Roblox-студии с:

- **Projects** — вставь ссылку на игру Roblox → автоматически подтягиваются название, описание, визиты, онлайн, thumbnail и статус
- **Dev Blog** — посты о разработке
- **Game News** — новости и анонсы
- **RU / EN** — полная поддержка двух языков
- Чистый **HTML + CSS + JS** (без фреймворков)
- Готов к деплою на **Vercel**

## Быстрый старт

```bash
# просто открой index.html в браузере
# или залей папку на Vercel
```

### Деплой на Vercel

1. Залей папку `random-roblox-site` в GitHub / GitLab
2. В Vercel → New Project → Import
3. Framework Preset: **Other**
4. Deploy

## Как работает добавление игр

1. Вставь URL вида `https://www.roblox.com/games/123456789/...` или просто Place ID
2. Сайт через **roproxy** (публичный прокси Roblox API) получает:
   - Universe ID
   - Название, описание, creator
   - Visits / Playing
   - Иконку игры
3. Ты выбираешь статус: In Development / Coming Soon / Online / Beta / Maintenance / Offline
4. Можно менять статус и удалять в любой момент

Данные хранятся в **localStorage** браузера (демо).

## Подключение настоящей БД (рекомендуется)

Для продакшена замени localStorage на одну из схем:

### Вариант 1 — Supabase (самый простой)

1. Создай проект на [supabase.com](https://supabase.com)
2. Таблицы: `projects`, `blog_posts`, `news`
3. В `app.js` замени `load` / `save` на вызовы Supabase JS Client
4. Добавь anon key в env

### Вариант 2 — Vercel + Postgres / KV

- Используй Vercel Postgres или Vercel KV
- Добавь API Routes (`/api/projects` и т.д.) через Next.js или Vercel Serverless Functions
- Фронт ходит в свои API

### Вариант 3 — Firebase Realtime / Firestore

Аналогично Supabase.

## Структура

```
random-roblox-site/
├── index.html
├── css/style.css
├── js/
│   ├── i18n.js      # переводы EN/RU
│   └── app.js       # вся логика + Roblox API
└── README.md
```

## Статусы игр

| Key           | EN            | RU           |
|---------------|---------------|--------------|
| in_dev        | In Development| В разработке |
| coming_soon   | Coming Soon   | Скоро        |
| online        | Online        | Онлайн       |
| beta          | Beta          | Бета         |
| maintenance   | Maintenance   | Техработы    |
| offline       | Offline       | Оффлайн      |

## Админ-вход

В шапке кнопка **Admin / Админ**.

- Пароль по умолчанию: **`random2026`**
- Сессия в `sessionStorage` (до 8 часов, сбрасывается при закрытии вкладки)
- Без входа нельзя добавлять / редактировать / удалять проекты, посты и новости
- Сменить пароль: в `js/app.js` константа `ADMIN_PASSWORD`

## Примечания

- Roblox API вызывается через `*.roproxy.com` чтобы обойти CORS в браузере.
- Если roproxy недоступен — можно поднять свой прокси или использовать серверные API routes.
- Это клиентская защита (для демо). Для продакшена лучше серверная авторизация + БД.

Сделано с ❤️ для Roblox-сообщества.
