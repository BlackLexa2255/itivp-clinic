const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
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
