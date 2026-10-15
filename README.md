# REST API сервиса записи на приём к врачу (КР1)

Контрольная работа №1. Node.js, Express, PostgreSQL через Sequelize.
Регистрация и вход по JWT, роли, CRUD для записей на приём, фильтрация, поиск,
сортировка и статистика.

## Запуск

Нужны Node.js и PostgreSQL.

```
createdb clinic_ipr21
cp .env.example .env
npm install
npm run seed
npm run dev
```

Сервер стартует на http://localhost:3000.
В .env надо указать строку подключения к базе, секрет для токенов и список
разрешённых адресов для CORS.

## Тестовые пользователи

admin@clinic.by / Admin#2026 — admin
moderator@clinic.by / Moder#2026 — moderator
user@clinic.by / User#2026 — user

## Эндпоинты

POST /auth/register — регистрация
POST /auth/login — вход, возвращает токен
GET /auth/me — текущий пользователь (нужен токен)

GET /api/appointments — список записей
GET /api/appointments?status=scheduled — фильтр по статусу
GET /api/appointments?doctor=козлов — поиск по части фамилии врача
GET /api/appointments?date=2026-10-20 — фильтр по дате
GET /api/appointments?sort=ticketCode — сортировка
GET /api/appointments/stats — количество записей по статусам
GET /api/appointments/:id — одна запись
POST /api/appointments — создать (нужен токен)
PUT /api/appointments/:id — обновить (автор записи, модератор или админ)
DELETE /api/appointments/:id — удалить (только админ)

GET /api/users — список пользователей (модератор, админ)
DELETE /api/users/:id — удалить пользователя (только админ)

Подробнее про тела запросов и коды ответов — в API.md.

## Сущность «Запись на приём»

ticketCode — номер талона, уникальный, формат T-ГГГГ-НННН
patientName — ФИО пациента
doctorName — ФИО врача
date — дата приёма
time — время приёма
status — scheduled, completed или cancelled
diagnosis — диагноз из электронной карты (необязательно)
userId — кто создал запись

## Защита

- пароли хранятся как хеш bcrypt;
- токен JWT живёт 1 час, передаётся в заголовке Authorization;
- проверка сложности пароля: от 8 символов, цифра, спецсимвол;
- после 5 неудачных входов аккаунт блокируется на 15 минут;
- ограничение 100 запросов за 15 минут;
- размер тела запроса ограничен 10 КБ;
- CORS только для адресов из CORS_ORIGINS;
- подозрительные события пишутся в logs/security.log.

## Тесты

Коллекция: postman/clinic-kr21.postman_collection.json — 24 запроса, у каждого
проверка кода ответа.

Можно импортировать в Postman или прогнать из терминала:

```
npm run seed
npx newman run postman/clinic-kr21.postman_collection.json
```

Перед прогоном нужен npm run seed: часть запросов рассчитана на исходные данные
(например, регистрация patient@clinic.by ожидает код 201).
