const { Sequelize } = require('sequelize');

// Подключение к PostgreSQL. Строка подключения хранится в .env и в репозиторий не попадает
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
