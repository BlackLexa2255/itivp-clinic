require('./instrument');

const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

async function start() {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(PORT, () => {
    logger.info('Сервер запущен', { port: Number(PORT), env: process.env.NODE_ENV });
  });
  startHeartbeat();
}

// Раз в минуту сервер сообщает Healthchecks.io, что он жив. Если сигналы перестают
// приходить, Healthchecks.io присылает уведомление о падении в Telegram
function startHeartbeat() {
  const url = process.env.HEALTHCHECKS_PING_URL;
  if (!url) return;
  const ping = () => fetch(url).catch(err => logger.warn('Healthchecks.io недоступен', { error: err.message }));
  ping();
  setInterval(ping, 60 * 1000);
}

start().catch(err => {
  logger.error('Не удалось запустить сервер', { error: err.message });
  // Пауза, чтобы сообщение успело уйти в Better Stack
  setTimeout(() => process.exit(1), 2000);
});
