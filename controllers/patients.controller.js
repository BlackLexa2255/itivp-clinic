// Контроллер пациентов: устроен так же, как контроллер записей на приём.
const patientsModel = require('../models/patients.model');

// Поля, без которых карточку пациента заводить нельзя
const REQUIRED_FIELDS = ['fullName', 'birthDate'];

// Список незаполненных обязательных полей. Пустое тело запроса считаем пустым объектом
function getMissingFields(body = {}) {
  return REQUIRED_FIELDS.filter(field => !body[field]);
}

// GET /api/patients — список всех пациентов
function getAll(req, res) {
  res.json(patientsModel.findAll());
}

// GET /api/patients/:id — один пациент вместе с электронной картой
function getById(req, res) {
  const patient = patientsModel.findById(Number(req.params.id));
  if (!patient) {
    return res.status(404).json({ error: `Пациент с id=${req.params.id} не найден` });
  }
  res.json(patient);
}

// POST /api/patients — добавление пациента
function create(req, res) {
  const missingFields = getMissingFields(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Не заполнены обязательные поля: ${missingFields.join(', ')}` });
  }
  const patient = patientsModel.create(req.body);
  res.status(201).json(patient);
}

// PUT /api/patients/:id — полная замена данных пациента
function update(req, res) {
  const missingFields = getMissingFields(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Не заполнены обязательные поля: ${missingFields.join(', ')}` });
  }
  const patient = patientsModel.update(Number(req.params.id), req.body);
  if (!patient) {
    return res.status(404).json({ error: `Пациент с id=${req.params.id} не найден` });
  }
  res.json(patient);
}

// DELETE /api/patients/:id — удаление пациента
function remove(req, res) {
  const isDeleted = patientsModel.remove(Number(req.params.id));
  if (!isDeleted) {
    return res.status(404).json({ error: `Пациент с id=${req.params.id} не найден` });
  }
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };
