const patientsModel = require('../models/patients.model');

const REQUIRED_FIELDS = ['fullName', 'birthDate'];

function getMissingFields(body = {}) {
  return REQUIRED_FIELDS.filter(field => !body[field]);
}

function getAll(req, res) {
  res.json(patientsModel.findAll());
}

function getById(req, res) {
  const patient = patientsModel.findById(Number(req.params.id));
  if (!patient) {
    return res.status(404).json({ error: `Пациент с id=${req.params.id} не найден` });
  }
  res.json(patient);
}

function create(req, res) {
  const missingFields = getMissingFields(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Не заполнены обязательные поля: ${missingFields.join(', ')}` });
  }
  const patient = patientsModel.create(req.body);
  res.status(201).json(patient);
}

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

function remove(req, res) {
  const isDeleted = patientsModel.remove(Number(req.params.id));
  if (!isDeleted) {
    return res.status(404).json({ error: `Пациент с id=${req.params.id} не найден` });
  }
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };
