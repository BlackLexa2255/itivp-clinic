import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { STATUS, errorText, getAppointment } from '../api'

export default function AppointmentDetails() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getAppointment(id).then(setItem).catch(err => setError(errorText(err)))
  }, [id])

  if (error) return <p className="error">{error}</p>
  if (!item) return <p className="loading">Загрузка записи...</p>

  return (
    <>
      <h2>Талон {item.ticketCode}</h2>
      <dl className="details">
        <dt>Пациент</dt><dd>{item.patientName}</dd>
        <dt>Врач</dt><dd>{item.doctorName}</dd>
        <dt>Дата и время</dt><dd>{item.date}, {item.time}</dd>
        <dt>Статус</dt><dd>{STATUS[item.status]}</dd>
        <dt>Диагноз</dt><dd>{item.diagnosis || '–'}</dd>
        <dt>Создана</dt><dd>{new Date(item.createdAt).toLocaleString('ru-RU')}</dd>
      </dl>
      <p className="actions">
        <Link to={`/appointments/${id}/edit`}>Изменить</Link>
        <Link to="/appointments">К списку</Link>
      </p>
    </>
  )
}
