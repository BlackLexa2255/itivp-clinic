const express = require('express');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const appointmentRoutes = require('./routes/appointments.routes');
const { globalLimiter } = require('./middleware/rateLimiters');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Заголовки безопасности: X-Frame-Options, Content-Security-Policy, X-Content-Type-Options и другие
app.use(helmet());

// Ограничение размера тела запроса – защита от отправки больших объёмов данных (DoS)
app.use(express.json({ limit: '10kb' }));

app.use(globalLimiter);

app.get('/', (req, res) => {
  res.json({
    service: 'Сервис записи на приём к врачу',
    endpoints: ['/auth/register', '/auth/login', '/auth/me', '/api/appointments', '/api/users']
  });
});

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
