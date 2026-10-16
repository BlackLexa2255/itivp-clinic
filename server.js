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
}

start().catch(err => {
  logger.error('Не удалось запустить сервер', { error: err.message });
  // Пауза, чтобы сообщение успело уйти в Better Stack
  setTimeout(() => process.exit(1), 2000);
});
