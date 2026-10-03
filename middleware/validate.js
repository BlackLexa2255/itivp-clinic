const { logSecurityEvent } = require('../utils/securityLogger');

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
      req[source] = value;
    }
    next();
  };
}

module.exports = { validate };
