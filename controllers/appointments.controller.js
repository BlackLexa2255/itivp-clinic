// Контроллер записей на приём: проверяет данные запроса, обращается к модели и формирует ответ.
const appointmentsModel = require('../models/appointments.model');

// Поля, без которых запись на приём не имеет смысла
const REQUIRED_FIELDS = ['patientId', 'doctorName', 'date', 'time'];

// Список незаполненных обязательных полей. Пустое тело запроса считаем пустым объектом
function getMissingFields(body = {}) {
  return REQUIRED_FIELDS.filter(field => !body[field]);
}

// GET /api/appointments — список; необязательный фильтр ?status=scheduled
function getAll(req, res) {
  res.json(appointmentsModel.findAll(req.query.status));
}

// GET /api/appointments/:id — одна запись
function getById(req, res) {
  const appointment = appointmentsModel.findById(Number(req.params.id));
  if (!appointment) {
    return res.status(404).json({ error: `Запись на приём с id=${req.params.id} не найдена` });
  }
  res.json(appointment);
}

// POST /api/appointments — создание новой записи
function create(req, res) {
  const missingFields = getMissingFields(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Не заполнены обязательные поля: ${missingFields.join(', ')}` });
  }
  const appointment = appointmentsModel.create(req.body);
  res.status(201).json(appointment);
}

// PUT /api/appointments/:id — полная замена записи
function update(req, res) {
  const missingFields = getMissingFields(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Не заполнены обязательные поля: ${missingFields.join(', ')}` });
  }
  const appointment = appointmentsModel.update(Number(req.params.id), req.body);
  if (!appointment) {
    return res.status(404).json({ error: `Запись на приём с id=${req.params.id} не найдена` });
  }
  res.json(appointment);
}

// DELETE /api/appointments/:id — удаление записи
function remove(req, res) {
  const isDeleted = appointmentsModel.remove(Number(req.params.id));
  if (!isDeleted) {
    return res.status(404).json({ error: `Запись на приём с id=${req.params.id} не найдена` });
  }
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };
