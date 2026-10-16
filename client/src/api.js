import axios from 'axios'

// Адрес бекенда задаётся при сборке: на Vercel это переменная окружения VITE_API_URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 15000,
})

// После входа токен лежит в localStorage и добавляется к каждому запросу
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Токен истёк или не подходит – выходим из учётной записи
api.interceptors.response.use(null, err => {
  if (err.response?.status === 401) logout()
  return Promise.reject(err)
})

export const STATUS = { scheduled: 'Запланирована', completed: 'Завершена', cancelled: 'Отменена' }

export const getStats = () => api.get('/api/appointments/stats').then(res => res.data)
export const getAppointments = params => api.get('/api/appointments', { params }).then(res => res.data)
export const getAppointment = id => api.get(`/api/appointments/${id}`).then(res => res.data)
export const createAppointment = data => api.post('/api/appointments', data).then(res => res.data)
export const updateAppointment = (id, data) => api.put(`/api/appointments/${id}`, data).then(res => res.data)
export const deleteAppointment = id => api.delete(`/api/appointments/${id}`)

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))
  return data.user
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function currentUser() {
  return JSON.parse(localStorage.getItem('user') || 'null')
}

// Текст ошибки для пользователя: сообщение сервера или общий текст, если сервер не ответил
export function errorText(err) {
  const data = err.response?.data
  if (!data?.error) return 'Сервер недоступен, попробуйте позже'
  return data.details ? `${data.error}: ${data.details.join('; ')}` : data.error
}
