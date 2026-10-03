const { Appointment } = require('../models');
const { logSecurityEvent } = require('../utils/securityLogger');

async function getAll(req, res, next) {
  try {
    const where = req.query.status ? { status: req.query.status } : {};
    res.json(await Appointment.findAll({ where, order: [['id', 'ASC']] }));
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Запись на приём не найдена' });
    }
    res.json(appointment);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const appointment = await Appointment.create({ ...req.body, userId: req.user.id });
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Запись на приём не найдена' });
    }
    // Обычный пользователь может изменять только свои записи
    if (req.user.role === 'user' && appointment.userId !== req.user.id) {
      logSecurityEvent('FOREIGN_RESOURCE_ACCESS', req, { appointmentId: appointment.id, ownerId: appointment.userId });
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    await appointment.update(req.body);
    res.json(appointment);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Запись на приём не найдена' });
    }
    await appointment.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
