const appointmentsModel = require('../models/appointments.model');

const REQUIRED_FIELDS = ['patientId', 'doctorName', 'date', 'time'];

function getMissingFields(body = {}) {
  return REQUIRED_FIELDS.filter(field => !body[field]);
}

function getAll(req, res) {
  res.json(appointmentsModel.findAll(req.query.status));
}

function getById(req, res) {
  const appointment = appointmentsModel.findById(Number(req.params.id));
  if (!appointment) {
    return res.status(404).json({ error: `Запись на приём с id=${req.params.id} не найдена` });
  }
  res.json(appointment);
}

function create(req, res) {
  const missingFields = getMissingFields(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Не заполнены обязательные поля: ${missingFields.join(', ')}` });
  }
  const appointment = appointmentsModel.create(req.body);
  res.status(201).json(appointment);
}

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

function remove(req, res) {
  const isDeleted = appointmentsModel.remove(Number(req.params.id));
  if (!isDeleted) {
    return res.status(404).json({ error: `Запись на приём с id=${req.params.id} не найдена` });
  }
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };
