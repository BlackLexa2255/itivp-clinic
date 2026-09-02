const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

let appointments = [
  { id: 1, patientId: 1, doctorName: 'Петров Пётр Петрович', date: '2026-09-10', time: '10:30', status: 'scheduled' },
  { id: 2, patientId: 2, doctorName: 'Сидорова Анна Сергеевна', date: '2026-09-11', time: '09:00', status: 'completed' },
  { id: 3, patientId: 1, doctorName: 'Петров Пётр Петрович', date: '2026-09-12', time: '14:15', status: 'cancelled' }
];
let nextAppointmentId = 4;

let patients = [
  { id: 1, fullName: 'Иванов Иван Иванович', birthDate: '1990-05-14', medicalRecord: { bloodType: 'A(II) Rh+', allergies: ['пенициллин'], diagnoses: ['ОРВИ'] } },
  { id: 2, fullName: 'Ковалёва Мария Петровна', birthDate: '1985-11-02', medicalRecord: { bloodType: 'O(I) Rh-', allergies: [], diagnoses: ['гипертония'] } }
];
let nextPatientId = 3;

app.get('/api/appointments', (req, res) => {
  if (req.query.status) {
    return res.json(appointments.filter(item => item.status === req.query.status));
  }
  res.json(appointments);
});

app.get('/api/appointments/:id', (req, res) => {
  const appointment = appointments.find(item => item.id === Number(req.params.id));
  if (!appointment) {
    return res.status(404).json({ error: 'Запись на приём не найдена' });
  }
  res.json(appointment);
});

app.post('/api/appointments', (req, res) => {
  const body = req.body || {};
  if (!body.patientId || !body.doctorName || !body.date || !body.time) {
    return res.status(400).json({ error: 'Заполните поля: patientId, doctorName, date, time' });
  }
  const appointment = {
    id: nextAppointmentId++,
    patientId: body.patientId,
    doctorName: body.doctorName,
    date: body.date,
    time: body.time,
    status: 'scheduled'
  };
  appointments.push(appointment);
  res.status(201).json(appointment);
});

app.put('/api/appointments/:id', (req, res) => {
  const body = req.body || {};
  if (!body.patientId || !body.doctorName || !body.date || !body.time) {
    return res.status(400).json({ error: 'Заполните поля: patientId, doctorName, date, time' });
  }
  const appointment = appointments.find(item => item.id === Number(req.params.id));
  if (!appointment) {
    return res.status(404).json({ error: 'Запись на приём не найдена' });
  }
  appointment.patientId = body.patientId;
  appointment.doctorName = body.doctorName;
  appointment.date = body.date;
  appointment.time = body.time;
  appointment.status = body.status || 'scheduled';
  res.json(appointment);
});

app.delete('/api/appointments/:id', (req, res) => {
  const index = appointments.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Запись на приём не найдена' });
  }
  appointments.splice(index, 1);
  res.status(204).send();
});

app.get('/api/patients', (req, res) => {
  res.json(patients);
});

app.get('/api/patients/:id', (req, res) => {
  const patient = patients.find(item => item.id === Number(req.params.id));
  if (!patient) {
    return res.status(404).json({ error: 'Пациент не найден' });
  }
  res.json(patient);
});

app.post('/api/patients', (req, res) => {
  const body = req.body || {};
  if (!body.fullName || !body.birthDate) {
    return res.status(400).json({ error: 'Заполните поля: fullName, birthDate' });
  }
  const patient = {
    id: nextPatientId++,
    fullName: body.fullName,
    birthDate: body.birthDate,
    medicalRecord: body.medicalRecord || { bloodType: '', allergies: [], diagnoses: [] }
  };
  patients.push(patient);
  res.status(201).json(patient);
});

app.put('/api/patients/:id', (req, res) => {
  const body = req.body || {};
  if (!body.fullName || !body.birthDate) {
    return res.status(400).json({ error: 'Заполните поля: fullName, birthDate' });
  }
  const patient = patients.find(item => item.id === Number(req.params.id));
  if (!patient) {
    return res.status(404).json({ error: 'Пациент не найден' });
  }
  patient.fullName = body.fullName;
  patient.birthDate = body.birthDate;
  patient.medicalRecord = body.medicalRecord || { bloodType: '', allergies: [], diagnoses: [] };
  res.json(patient);
});

app.delete('/api/patients/:id', (req, res) => {
  const index = patients.findIndex(item => item.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Пациент не найден' });
  }
  patients.splice(index, 1);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
