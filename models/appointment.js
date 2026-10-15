const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  // Номер талона уникален: две записи с одним номером в базу не попадут
  ticketCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { is: /^T-\d{4}-\d{4}$/ }
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  doctorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'scheduled'
  },
  diagnosis: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'appointments'
});

module.exports = Appointment;
