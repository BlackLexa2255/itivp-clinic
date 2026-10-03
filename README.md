# Безопасное REST API (ИПР1)

Сервис записи на приём к врачу. Node.js, Express, PostgreSQL через Sequelize.
Вход по JWT, три роли, валидация через Joi, helmet и ограничение частоты запросов.

## Запуск

Нужны установленные Node.js и PostgreSQL.

```
createdb clinic_ipr21
cp .env.example .env
npm install
npm run seed
npm run dev
```

Сервер стартует на http://localhost:3000.
В .env надо прописать свою строку подключения к базе и секрет для токенов.

## Тестовые пользователи

admin@clinic.by / Admin#2026 — admin
moderator@clinic.by / Moder#2026 — moderator
user@clinic.by / User#2026 — user

## Эндпоинты

POST /auth/register — регистрация
POST /auth/login — вход, возвращает токен
GET /auth/me — текущий пользователь (нужен токен)

GET /api/appointments — список записей, есть фильтр ?status=
GET /api/appointments/:id — одна запись
POST /api/appointments — создать (нужен токен)
PUT /api/appointments/:id — обновить (свою запись, модератор или админ)
DELETE /api/appointments/:id — удалить (только админ)

GET /api/users — список пользователей (модератор, админ)
DELETE /api/users/:id — удалить пользователя (только админ)

Подробнее про тела запросов и коды ответов — в API.md.

## Защита

- пароли хранятся как хеш bcrypt;
- токен JWT живёт 1 час, передаётся в заголовке Authorization;
- проверка сложности пароля: от 8 символов, цифра, спецсимвол;
- после 5 неудачных входов аккаунт блокируется на 15 минут;
- ограничение 100 запросов за 15 минут;
- размер тела запроса ограничен 10 КБ;
- в продакшене ошибки отдаются без подробностей;
- подозрительные события пишутся в logs/security.log.

## Тесты

Коллекция для Postman лежит в postman/clinic-ipr21.postman_collection.json.
Запрос «Вход» сам сохраняет токен в переменную, дальше можно щёлкать остальные запросы.
