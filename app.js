const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const Sentry = require('@sentry/node');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const appointmentRoutes = require('./routes/appointments.routes');
const { globalLimiter } = require('./middleware/rateLimiters');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { countRequests, getMetrics } = require('./utils/metrics');

const app = express();

// На Render перед приложением три прокси (Cloudflare и два внутренних узла Render):
// без этой настройки req.ip был бы адресом прокси, и ограничитель частоты считал бы всех клиентов одним
app.set('trust proxy', 3);

// Заголовки безопасности: X-Frame-Options, Content-Security-Policy, X-Content-Type-Options и другие
app.use(helmet());

// Запросы с браузерной страницы разрешены только с адресов из белого списка
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : false }));

app.use(countRequests);

// Служебные маршруты объявлены до ограничителя частоты: их регулярно опрашивают
// UptimeRobot и страница метрик. В базу данных они не обращаются
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/metrics', (req, res) => {
  res.json(getMetrics());
});

// Ограничение размера тела запроса – защита от отправки больших объёмов данных (DoS)
app.use(express.json({ limit: '10kb' }));

app.use(globalLimiter);

app.get('/', (req, res) => {
  res.json({
    service: 'Сервис записи на приём к врачу',
    endpoints: ['/auth/register', '/auth/login', '/auth/me', '/api/appointments', '/api/users', '/health', '/metrics']
  });
});

// Искусственная ошибка для проверки Sentry
app.get('/debug-sentry', () => {
  throw new Error('Тестовая ошибка для проверки Sentry');
});

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use(notFound);
// Sentry получает ошибку раньше общего обработчика, который отвечает клиенту
Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);

module.exports = app;
