// Обработчик несуществующих маршрутов
function notFound(req, res) {
  res.status(404).json({ error: 'Маршрут не найден' });
}

// Глобальный обработчик ошибок. В продакшене клиенту отдаётся общее сообщение,
// подробности остаются только в логах сервера
function errorHandler(err, req, res, next) {
  // Для ошибок базы данных подробное описание лежит во вложенном объекте original
  const original = err.original || {};
  const detail = err.message || original.message || original.code || err.name;
  console.error('[ERROR]', err.name, detail);
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    error: isProduction ? 'Внутренняя ошибка сервера' : `${err.name}: ${detail}`
  });
}

module.exports = { notFound, errorHandler };
