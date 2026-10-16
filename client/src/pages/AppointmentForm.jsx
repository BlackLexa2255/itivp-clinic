import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { STATUS, createAppointment, currentUser, errorText, getAppointment, updateAppointment } from '../api'

const EMPTY = { ticketCode: '', patientName: '', doctorName: '', date: '', time: '', status: 'scheduled', diagnosis: '' }
const DRAFT_KEY = 'appointmentDraft'

const FIELDS = [
  ['ticketCode', 'Номер талона', 'text', 'T-2026-0011'],
  ['patientName', 'Пациент (ФИО)', 'text', 'Иванов Иван Иванович'],
  ['doctorName', 'Врач (ФИО)', 'text', 'Петров Пётр Петрович'],
  ['date', 'Дата', 'date'],
  ['time', 'Время', 'time'],
  ['diagnosis', 'Диагноз', 'text', 'необязательно'],
]

// Из ответа сервера берутся только поля формы
const toForm = a => Object.fromEntries(Object.keys(EMPTY).map(key => [key, a[key] ?? '']))

export default function AppointmentForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  // Ленивая инициализация: черновик читается из localStorage один раз, при первом рендере
  const [form, setForm] = useState(() => (!isEdit && JSON.parse(localStorage.getItem(DRAFT_KEY))) || EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    getAppointment(id)
      .then(a => setForm(toForm(a)))
      .catch(err => setError(errorText(err)))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  // Черновик новой записи сохраняется в браузере: после перезагрузки страницы
  // введённые данные не теряются, и для этого не нужен запрос к серверу
  useEffect(() => {
    if (!isEdit) localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
  }, [form, isEdit])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const saved = isEdit ? await updateAppointment(id, form) : await createAppointment(form)
      if (!isEdit) localStorage.removeItem(DRAFT_KEY)
      navigate(`/appointments/${saved.id}`)
    } catch (err) {
      setError(errorText(err))
      setSaving(false)
    }
  }

  if (!currentUser()) {
    return <p>Создавать и изменять записи можно после <Link to="/login">входа</Link>.</p>
  }
  if (loading) return <p className="loading">Загрузка записи...</p>

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{isEdit ? `Изменение записи ${form.ticketCode}` : 'Новая запись'}</h2>
      {FIELDS.map(([name, label, type, placeholder]) => (
        <label key={name}>
          {label}
          <input
            type={type}
            value={form[name]}
            placeholder={placeholder}
            required={name !== 'diagnosis'}
            onChange={e => setForm({ ...form, [name]: e.target.value })}
          />
        </label>
      ))}
      <label>
        Статус
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          {Object.entries(STATUS).map(([key, title]) => <option key={key} value={key}>{title}</option>)}
        </select>
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
      {!isEdit && <button type="button" className="secondary" onClick={() => setForm(EMPTY)}>Очистить</button>}
    </form>
  )
}
