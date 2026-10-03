const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { logSecurityEvent } = require('../utils/securityLogger');

// Проверка JWT из заголовка Authorization: Bearer <token>
async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    logSecurityEvent('MISSING_TOKEN', req);
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) {
      logSecurityEvent('TOKEN_USER_NOT_FOUND', req, { userId: payload.id });
      return res.status(401).json({ error: 'Требуется авторизация' });
    }
    req.user = user;
    next();
  } catch (err) {
    logSecurityEvent('INVALID_TOKEN', req, { reason: err.message });
    return res.status(401).json({ error: 'Недействительный токен' });
  }
}

module.exports = { authenticate };
