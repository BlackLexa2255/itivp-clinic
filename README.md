# Сервис записи на приём к врачу: деплой и мониторинг (ИПР2)

Индивидуальная практическая работа №2. Бекенд из КР1 (Node.js, Express,
PostgreSQL) и простой фронтенд на React выложены в облако. Настроены CI/CD,
мониторинг, сбор ошибок и логов, уведомления в Telegram.

Ветки ipr2 и ipr22 одинаковые: в условии встречаются оба названия. Рабочая – ipr22,
из неё идёт деплой, ipr2 – копия на том же коммите.

## Ссылки

Фронтенд: https://blacklexa2255.github.io/itivp-clinic/

Бекенд: https://itivp-clinic.onrender.com
(проверка https://itivp-clinic.onrender.com/health, метрики https://itivp-clinic.onrender.com/metrics)

CI/CD: https://github.com/BlackLexa2255/itivp-clinic/actions

Мониторинг: дашборд Healthchecks.io https://healthchecks.io/, проверка clinic-backend.
Текущий статус: ![статус](https://healthchecks.io/b/2/f80a8f4b-e28d-4f08-b8c0-bcc36459319b.svg)

Ошибки и логи: дашборд Sentry https://sentry.io/, проект clinic, разделы Issues и Logs.

Дашборды открываются только из аккаунта владельца, их скриншоты есть в отчёте.

Уведомления в Telegram: бот @ITIVPBOT пишет о результате каждой сборки,
@HealthchecksBot пишет, когда сервер падает и когда снова поднимается.

## Что где развёрнуто

- бекенд – Render, тариф Free, регион Frankfurt;
- база данных – Neon (PostgreSQL), тариф Free;
- фронтенд – GitHub Pages;
- ошибки и логи – Sentry, один проект на бекенд и фронтенд. Логи – это вызовы console на сервере;
- мониторинг – Healthchecks.io. Сервер раз в минуту запрашивает свой /health по внешнему адресу и,
  если тот ответил, шлёт сигнал в Healthchecks.io. Нет сигнала 3 минуты – приходит сообщение в Telegram.
  Этот же запрос не даёт бесплатному Render засыпать.

## CI/CD

Файл .github/workflows/deploy.yml. Запускается при push в ipr22 или main и вручную.

1. test – npm ci, ESLint, тесты Jest;
2. deploy-backend – запуск деплоя на Render через Render API (автодеплой в самом Render выключен);
3. deploy-frontend – сборка Vite и публикация на GitHub Pages;
4. notify – сообщение в Telegram с результатом, запускается всегда.

Деплои запускаются только если test прошёл.

Секреты GitHub: RENDER_API_KEY, RENDER_SERVICE_ID, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
Переменные GitHub: VITE_API_URL, VITE_SENTRY_DSN.

## Запуск локально

Нужны Node.js и PostgreSQL.

```
createdb clinic_ipr21
cp .env.example .env
npm install
npm run seed
npm run dev
```

Фронтенд (обращается к http://localhost:3000, если не задан VITE_API_URL):

```
cd client
npm install
npm run dev
```

Проверки: `npm run lint` и `npm test`.

## Переменные окружения бекенда

DATABASE_URL — строка подключения к PostgreSQL
JWT_SECRET — секрет для подписи токенов
NODE_ENV — production на Render
CORS_ORIGINS — с каких адресов можно обращаться (на Render https://blacklexa2255.github.io)
SENTRY_DSN — проект в Sentry, без него ошибки и логи никуда не отправляются
HEALTHCHECKS_PING_URL — адрес проверки в Healthchecks.io

RENDER_EXTERNAL_URL Render задаёт сам, по нему сервер проверяет свой /health.

## Тестовые пользователи

admin@clinic.by / Admin#2026 — admin
moderator@clinic.by / Moder#2026 — moderator
user@clinic.by / User#2026 — user

## Эндпоинты

GET /health — сервер жив (для мониторинга)
GET /metrics — время работы, память, процессор, счётчик запросов
GET /debug-sentry — тестовая ошибка для Sentry

Остальные как в КР1: /auth/register, /auth/login, /auth/me, /api/appointments, /api/users.
Подробнее в API.md.
