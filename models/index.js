const sequelize = require('../config/database');
const User = require('./user');
const Appointment = require('./appointment');

// Запись на приём принадлежит пользователю, который её создал
User.hasMany(Appointment, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Appointment };
