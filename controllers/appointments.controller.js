const { Op } = require('sequelize');
const { Appointment } = require('../models');
const { logSecurityEvent } = require('../utils/securityLogger');

// Фильтрация по статусу и дате, поиск по части фамилии врача, сортировка
async function getAll(req, res, next) {
  try {
    const where = {};
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (req.query.date) {
      where.date = req.query.date;
    }
    if (req.query.doctor) {
      where.doctorName = { [Op.iLike]: `%${req.query.doctor}%` };
    }
    const order = req.query.sort ? [[req.query.sort, 'ASC']] : [['id', 'ASC']];
    res.json(await Appointment.findAll({ where, order }));
  } catch (err) {
    next(err);
  }
}

// Подсчёт записей по статусам
async function getStats(req, res, next) {
  try {
    const rows = await Appointment.findAll({
      attributes: ['status', [Appointment.sequelize.fn('COUNT', '*'), 'count']],
      group: ['status']
    });
    const byStatus = {};
    rows.forEach(row => {
      byStatus[row.status] = Number(row.get('count'));
    });
    res.json({ total: await Appointment.count(), byStatus });
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
    // Нарушение уникальности номера талона – это ошибка клиента, а не сервера
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Запись с таким номером талона уже существует' });
    }
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
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Запись с таким номером талона уже существует' });
    }
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

module.exports = { getAll, getStats, getById, create, update, remove };
