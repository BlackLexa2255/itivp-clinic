require('./instrument');

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function start() {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    setInterval(heartbeat, 60 * 1000);
  });
}

// Раз в минуту сервер запрашивает свой /health по внешнему адресу и, если тот отвечает,
// отправляет сигнал в Healthchecks.io. Когда сигналы перестают приходить, Healthchecks.io
// присылает уведомление о падении в Telegram. Внешний запрос заодно не даёт Render
// усыпить бесплатный сервис после 15 минут без входящих запросов
async function heartbeat() {
  const selfUrl = process.env.RENDER_EXTERNAL_URL;
  const pingUrl = process.env.HEALTHCHECKS_PING_URL;
  if (!selfUrl || !pingUrl) return;
  try {
    const res = await fetch(`${selfUrl}/health`);
    if (res.ok) await fetch(pingUrl);
  } catch (err) {
    console.warn('Не удалось отправить сигнал в Healthchecks.io:', err.message);
  }
}

start().catch(err => {
  console.error('Не удалось запустить сервер:', err.message);
  process.exit(1);
});
