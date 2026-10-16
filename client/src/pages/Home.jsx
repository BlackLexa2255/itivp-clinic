import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { STATUS, errorText, getStats } from '../api'

export default function Home() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getStats().then(setStats).catch(err => setError(errorText(err)))
  }, [])

  return (
    <>
      <p>
        Сервис записи на приём к врачу: список талонов с поиском по врачу, карточка записи,
        создание и изменение записей после входа.
      </p>
      {error && <p className="error">{error}</p>}
      {!stats && !error && <p className="loading">Загрузка статистики...</p>}
      {stats && (
        <div className="cards">
          <div className="card">Всего записей<b>{stats.total}</b></div>
          {Object.entries(STATUS).map(([key, title]) => (
            <div className="card" key={key}>{title}<b>{stats.byStatus[key] || 0}</b></div>
          ))}
        </div>
      )}
      <p><Link to="/appointments">Перейти к списку записей</Link></p>
    </>
  )
}
