const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'security.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

// Запись подозрительного действия в файл и в общий лог (консоль и Better Stack)
function logSecurityEvent(event, req, details = {}) {
  const entry = {
    time: new Date().toISOString(),
    event,
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    user: req.user ? req.user.email : null,
    ...details
  };
  const line = JSON.stringify(entry);
  fs.appendFileSync(LOG_FILE, line + '\n');
  logger.warn('Событие безопасности', entry);
}

module.exports = { logSecurityEvent };
