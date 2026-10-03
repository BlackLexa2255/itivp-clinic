const rateLimit = require('express-rate-limit');
const { logSecurityEvent } = require('../utils/securityLogger');

// Глобальное ограничение частоты запросов: 100 запросов за 15 минут с одного адреса
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', req);
    res.status(429).json({ error: 'Слишком много запросов, попробуйте позже' });
  }
});

module.exports = { globalLimiter };
