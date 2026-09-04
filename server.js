const express = require('express');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

const requestLog = [];

app.use((req, res, next) => {
  requestLog.push({ Время: new Date().toLocaleTimeString(), Метод: req.method, URL: req.url });
  console.clear();
  console.table(requestLog);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  req.user = req.query.auth === '1' ? { name: 'Врач' } : { name: 'Гость' };
  res.locals.user = req.user;
  next();
});

let appointments = [
  { id: 1, patientName: 'Иванов Иван Иванович', doctorName: 'Петров Пётр Петрович', date: '2026-09-10', time: '10:30', diagnosis: 'ОРВИ' },
  { id: 2, patientName: 'Ковалёва Мария Петровна', doctorName: 'Сидорова Анна Сергеевна', date: '2026-09-11', time: '09:00', diagnosis: 'Гипертония' },
  { id: 3, patientName: 'Смирнов Алексей Викторович', doctorName: 'Петров Пётр Петрович', date: '2026-09-12', time: '14:15', diagnosis: 'Профосмотр' }
];
let nextId = 4;

app.get('/', (req, res) => {
  res.render('index', { appointments });
});

app.get('/item/:id', (req, res) => {
  const appointment = appointments.find(item => item.id === Number(req.params.id));
  if (!appointment) {
    return res.status(404).render('404');
  }
  res.render('item', { appointment });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  appointments.push({
    id: nextId++,
    patientName: req.body.patientName,
    doctorName: req.body.doctorName,
    date: req.body.date,
    time: req.body.time,
    diagnosis: req.body.diagnosis
  });
  res.redirect('/');
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).render('500');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
