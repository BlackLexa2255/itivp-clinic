import { useEffect, useState } from 'react'

// Адрес бекенда задаётся при сборке: на Vercel это переменная VITE_API_URL
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const STATUS = { scheduled: 'запланирована', completed: 'завершена', cancelled: 'отменена' }

function Appointments() {
  const [items, setItems] = useState([])
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/appointments`).then(r => r.json()),
      fetch(`${API}/api/appointments/stats`).then(r => r.json()),
    ])
      .then(([list, summary]) => {
        setItems(list)
        setStats(summary)
      })
      .catch(() => setError('Сервер недоступен'))
  }, [])

  if (error) return <p className="error">{error}</p>

  return (
    <>
      {stats && <p>Всего записей: {stats.total}</p>}
      <table>
        <thead>
          <tr><th>Талон</th><th>Пациент</th><th>Врач</th><th>Дата</th><th>Время</th><th>Статус</th></tr>
        </thead>
        <tbody>
          {items.map(a => (
            <tr key={a.id}>
              <td>{a.ticketCode}</td><td>{a.patientName}</td><td>{a.doctorName}</td>
              <td>{a.date}</td><td>{a.time}</td><td>{STATUS[a.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function formatUptime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return `${h} ч ${m} мин ${sec % 60} с`
}

// Дашборд метрик: данные с эндпоинта /metrics обновляются каждые 10 секунд
function Metrics() {
  const [m, setM] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = () => fetch(`${API}/metrics`)
      .then(r => r.json())
      .then(data => { setM(data); setError('') })
      .catch(() => setError('Сервер недоступен'))
    load()
    const timer = setInterval(load, 10000)
    return () => clearInterval(timer)
  }, [])

  if (error) return <p className="error">{error}</p>
  if (!m) return <p>Загрузка...</p>

  const cards = [
    ['Время работы', formatUptime(m.uptimeSeconds)],
    ['Память RSS', `${m.memoryMb.rss} МБ`],
    ['Куча (занято / всего)', `${m.memoryMb.heapUsed} / ${m.memoryMb.heapTotal} МБ`],
    ['Процессорное время', `${m.cpuMs.user + m.cpuMs.system} мс`],
    ['Нагрузка (1 / 5 / 15 мин)', m.loadAverage.join(' / ')],
    ['Запросов обработано', m.requests.total],
    ['Ошибки клиента 4xx', m.requests.clientErrors],
    ['Ошибки сервера 5xx', m.requests.serverErrors],
  ]

  return (
    <>
      <div className="cards">
        {cards.map(([title, value]) => <div className="card" key={title}>{title}<b>{value}</b></div>)}
      </div>
      <p>Сервер запущен: {new Date(m.startedAt).toLocaleString('ru-RU')}, Node.js {m.node}</p>
    </>
  )
}

export default function App() {
  const [tab, setTab] = useState('appointments')

  return (
    <main>
      <h1>Запись на приём к врачу</h1>
      <nav>
        <button className={tab === 'appointments' ? 'active' : ''} onClick={() => setTab('appointments')}>Записи</button>
        <button className={tab === 'metrics' ? 'active' : ''} onClick={() => setTab('metrics')}>Метрики</button>
        <button className="danger" onClick={() => { throw new Error('Тестовая ошибка на фронтенде') }}>
          Тестовая ошибка
        </button>
      </nav>
      {tab === 'appointments' ? <Appointments /> : <Metrics />}
    </main>
  )
}
