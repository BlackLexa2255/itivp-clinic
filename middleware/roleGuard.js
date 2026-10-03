const { logSecurityEvent } = require('../utils/securityLogger');

// Иерархия ролей: администратор включает права модератора, модератор – права пользователя
const ROLE_LEVEL = { user: 1, moderator: 2, admin: 3 };

function roleGuard(requiredRole) {
  return (req, res, next) => {
    if (ROLE_LEVEL[req.user.role] < ROLE_LEVEL[requiredRole]) {
      logSecurityEvent('FORBIDDEN_ROLE', req, { role: req.user.role, requiredRole });
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    next();
  };
}

module.exports = { roleGuard, ROLE_LEVEL };
