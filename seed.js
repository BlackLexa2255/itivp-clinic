require('dotenv').config();

const bcrypt = require('bcrypt');
const { sequelize, User, Appointment } = require('./models');

// Тестовые учётные записи для проверки ролевой модели
const USERS = [
  { email: 'admin@clinic.by', password: 'Admin#2026', role: 'admin' },
  { email: 'moderator@clinic.by', password: 'Moder#2026', role: 'moderator' },
  { email: 'user@clinic.by', password: 'User#2026', role: 'user' }
];

async function seed() {
  await sequelize.sync({ force: true });

  const created = {};
  for (const item of USERS) {
    const passwordHash = await bcrypt.hash(item.password, 10);
    created[item.role] = await User.create({ email: item.email, passwordHash, role: item.role });
  }

  await Appointment.create({
    patientName: 'Иванов Иван Иванович', doctorName: 'Петров Пётр Петрович',
    date: '2026-10-12', time: '10:30', status: 'scheduled', diagnosis: 'ОРВИ',
    userId: created.user.id
  });
  await Appointment.create({
    patientName: 'Ковалёва Мария Петровна', doctorName: 'Сидорова Анна Сергеевна',
    date: '2026-10-13', time: '09:00', status: 'completed', diagnosis: 'Гипертония',
    userId: created.moderator.id
  });

  console.log('База заполнена тестовыми данными');
  await sequelize.close();
}

seed().catch(err => {
  console.error(err.message);
  process.exit(1);
});
