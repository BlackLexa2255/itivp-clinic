# Сервис записи на приём к врачу: интеграция и оптимизация (КР2)

Контрольная работа №2. React-клиент (Vite) в папке client связан с REST API
на Node.js, Express и PostgreSQL из прошлых работ. Клиент выложен на Vercel,
сервер на Render, база в Neon.

## Ссылки

Приложение: https://itivp-clinic.vercel.app

Бекенд: https://itivp-clinic.onrender.com (проверка https://itivp-clinic.onrender.com/health)

Код: ветка kr22 https://github.com/BlackLexa2255/itivp-clinic/tree/kr22

## Как связаны клиент и сервер

Все запросы идут через client/src/api.js: это axios с базовым адресом из переменной
VITE_API_URL. После входа токен лежит в localStorage, перехватчик axios добавляет
его в заголовок Authorization. Сервер принимает запросы из браузера только с адресов
из переменной CORS_ORIGINS.

Страницы:

- / – главная со статистикой записей;
- /appointments – список, поиск по фамилии врача, фильтр по статусу, удаление (только admin);
- /appointments/:id – одна запись;
- /appointments/new и /appointments/:id/edit – форма создания и изменения (после входа);
- /login – вход.

На каждой странице есть сообщение о загрузке, текст ошибки, если сервер не ответил
или вернул ошибку, и сообщение «Записей не найдено» для пустого списка.

## Оптимизации

1. Debounce поиска (client/src/useDebounce.js) – запрос уходит через 500 мс после
   последнего нажатия клавиши, а не на каждую букву.
2. Code splitting по маршрутам – React.lazy и Suspense в client/src/App.jsx, каждая
   страница собирается в отдельный файл и грузится только при переходе на неё.
3. Оптимистичное удаление – строка пропадает из списка сразу, если сервер ответил
   ошибкой, список возвращается.
4. Черновик новой записи в localStorage – форма восстанавливается после перезагрузки
   без запроса к серверу, начальное состояние читается ленивой инициализацией useState.

## Деплой

Фронтенд – Vercel, Root Directory client, production-ветка kr22. При push в kr22 Vercel
сам собирает и публикует сайт. Переменная окружения в настройках проекта:

VITE_API_URL=https://itivp-clinic.onrender.com

client/vercel.json нужен, чтобы прямые ссылки на страницы (например /appointments/3)
открывались, а не отдавали 404.

Бекенд – Render, тариф Free, тот же сервис, что в ИПР2, переключён на ветку kr22.
При push в kr22 workflow .github/workflows/deploy.yml запускает ESLint и тесты, потом
деплой через Render API и сообщение в Telegram.

Переменные окружения бекенда на Render:

DATABASE_URL — строка подключения к PostgreSQL (Neon)
JWT_SECRET — секрет для подписи токенов
NODE_ENV — production
CORS_ORIGINS — адреса, с которых можно обращаться: сайт на Vercel и сайт ИПР2 на GitHub Pages
SENTRY_DSN — проект в Sentry для ошибок и логов
HEALTHCHECKS_PING_URL — проверка в Healthchecks.io

PORT и RENDER_EXTERNAL_URL Render задаёт сам. Бесплатный Render засыпает после 15 минут
без запросов, но этот сервер раз в минуту сам запрашивает свой /health (осталось из ИПР2),
поэтому не засыпает.

## Запуск локально

Нужны Node.js 22 или новее и PostgreSQL.

```
createdb clinic_ipr21
cp .env.example .env
npm install
npm run seed
npm run dev
```

Фронтенд (без VITE_API_URL обращается к http://localhost:3000):

```
cd client
npm install
npm run dev
```

Откроется http://localhost:5173. Проверки бекенда: `npm run lint` и `npm test`.

## Тестовые пользователи

admin@clinic.by / Admin#2026 — admin, может удалять
moderator@clinic.by / Moder#2026 — moderator
user@clinic.by / User#2026 — user, может менять только свои записи

## Эндпоинты

/auth/login, /auth/register, /auth/me, /api/appointments, /api/appointments/stats,
/api/appointments/:id, /api/users, /health, /metrics. Подробнее в API.md.
