const Joi = require('joi');

// Пароль: не короче 8 символов, минимум одна цифра и один спецсимвол
const password = Joi.string()
  .min(8)
  .pattern(/[0-9]/, 'цифра')
  .pattern(/[^A-Za-z0-9]/, 'спецсимвол')
  .required();

const register = Joi.object({
  email: Joi.string().email().required(),
  password,
  role: Joi.string().valid('user', 'moderator', 'admin')
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const appointment = Joi.object({
  ticketCode: Joi.string().pattern(/^T-\d{4}-\d{4}$/).required(),
  patientName: Joi.string().min(3).max(100).required(),
  doctorName: Joi.string().min(3).max(100).required(),
  date: Joi.date().iso().required(),
  time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  status: Joi.string().valid('scheduled', 'completed', 'cancelled'),
  diagnosis: Joi.string().max(200).allow('')
});

// Параметр строки запроса проверяется по списку допустимых значений,
// поэтому подстановка постороннего текста отклоняется до обращения к базе
const appointmentQuery = Joi.object({
  status: Joi.string().valid('scheduled', 'completed', 'cancelled'),
  doctor: Joi.string().min(2).max(100),
  date: Joi.date().iso(),
  sort: Joi.string().valid('date', 'ticketCode')
});

const idParam = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = { register, login, appointment, appointmentQuery, idParam };
