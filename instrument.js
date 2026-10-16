require('dotenv').config({ quiet: true });

const Sentry = require('@sentry/node');

// Подключается до express, чтобы Sentry успел встроиться в обработку запросов.
// Необработанные ошибки попадают в Sentry Issues, вызовы console – в Sentry Logs.
// Без SENTRY_DSN (локально и в CI) ничего не отправляется
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  integrations: [Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] })]
});
