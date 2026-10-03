const { logSecurityEvent } = require('../utils/securityLogger');

// Санитизация: из строковых значений удаляются HTML-теги, чтобы разметка не попала
// в базу данных и не выполнилась при выводе на клиенте. Пароль не изменяется
function stripTags(value, key) {
  if (key === 'password') {
    return value;
  }
  if (typeof value === 'string') {
    return value.replace(/<[^>]*>/g, '').trim();
  }
  if (Array.isArray(value)) {
    return value.map(item => stripTags(item));
  }
  if (value && typeof value === 'object') {
    Object.keys(value).forEach(name => {
      value[name] = stripTags(value[name], name);
    });
  }
  return value;
}

// Проверка тела запроса или параметров маршрута по схеме Joi.
// stripUnknown удаляет поля, которых нет в схеме, – защита от массового присвоения
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
    if (error) {
      logSecurityEvent('VALIDATION_FAILED', req, { details: error.details.map(d => d.message) });
      return res.status(400).json({
        error: 'Некорректные данные запроса',
        details: error.details.map(d => d.message)
      });
    }
    // В Express 5 объект req.query доступен только для чтения, поэтому он не перезаписывается
    if (source !== 'query') {
      req[source] = stripTags(value);
    }
    next();
  };
}

module.exports = { validate };
