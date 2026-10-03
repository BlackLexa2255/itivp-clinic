const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'moderator', 'admin'),
    allowNull: false,
    defaultValue: 'user'
  },
  // Счётчик неудачных входов и время блокировки учётной записи
  failedAttempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users'
});

// Хеш пароля никогда не возвращается клиенту
User.prototype.toSafeJSON = function () {
  return { id: this.id, email: this.email, role: this.role, createdAt: this.createdAt };
};

module.exports = User;
