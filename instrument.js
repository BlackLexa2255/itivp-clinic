require('dotenv').config({ quiet: true });

const Sentry = require('@sentry/node');

// Подключается до express, чтобы Sentry успел встроиться в обработку запросов.
// Без SENTRY_DSN (локально и в CI) события никуда не отправляются
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  // Тело запроса, cookies и токен из заголовка в Sentry не уходят
  beforeSend(event) {
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers.authorization;
      }
    }
    return event;
  }
});
