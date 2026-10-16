import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { STATUS, currentUser, deleteAppointment, errorText, getAppointments } from '../api'
import { useDebounce } from '../useDebounce'

export default function AppointmentList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [doctor, setDoctor] = useState('')
  const [status, setStatus] = useState('')
  // Запрос к серверу уходит, только когда пользователь перестал печатать на 500 мс
  const search = useDebounce(doctor.trim(), 500)
  const isAdmin = currentUser()?.role === 'admin'

  useEffect(() => {
    let ignore = false
    const params = { sort: 'date' }
    if (search.length >= 2) params.doctor = search
    if (status) params.status = status
    setLoading(true)
    setError('')
    getAppointments(params)
      .then(data => { if (!ignore) setItems(data) })
      .catch(err => {
        if (ignore) return
        setItems([])
        setError(errorText(err))
      })
      .finally(() => { if (!ignore) setLoading(false) })
    // Ответ на устаревший запрос не перезапишет более новый
    return () => { ignore = true }
  }, [search, status])

  // Оптимистичное удаление: строка исчезает сразу, не дожидаясь ответа сервера.
  // Если сервер вернул ошибку, список восстанавливается
  async function handleDelete(id) {
    if (!window.confirm('Удалить запись?')) return
    const previous = items
    setItems(items.filter(a => a.id !== id))
    try {
      await deleteAppointment(id)
    } catch (err) {
      setItems(previous)
      setError(errorText(err))
    }
  }

  return (
    <>
      <div className="filters">
        <input
          type="search"
          placeholder="Поиск по фамилии врача"
          value={doctor}
          onChange={e => setDoctor(e.target.value)}
        />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Все статусы</option>
          {Object.entries(STATUS).map(([key, title]) => <option key={key} value={key}>{title}</option>)}
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Загрузка записей...</p>}
      {!loading && !error && items.length === 0 && <p className="empty">Записей не найдено</p>}
      {!loading && items.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Талон</th><th>Пациент</th><th>Врач</th><th>Дата</th><th>Время</th><th>Статус</th>
              {isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {items.map(a => (
              <tr key={a.id}>
                <td><Link to={`/appointments/${a.id}`}>{a.ticketCode}</Link></td>
                <td>{a.patientName}</td>
                <td>{a.doctorName}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{STATUS[a.status]}</td>
                {isAdmin && <td><button className="danger" onClick={() => handleDelete(a.id)}>Удалить</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
