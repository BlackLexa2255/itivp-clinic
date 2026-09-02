const express = require('express');

const appointmentsRouter = require('./routes/appointments.routes');
const patientsRouter = require('./routes/patients.routes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    service: 'Сервис записи на приём к врачу с электронной картой пациента',
    endpoints: ['/api/appointments', '/api/patients']
  });
});

app.use('/api/appointments', appointmentsRouter);
app.use('/api/patients', patientsRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Тело запроса не является корректным JSON' });
  }
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
