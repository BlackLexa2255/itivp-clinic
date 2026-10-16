import { useState } from 'react'
import { useNavigate } from 'react-router'
import { errorText, login } from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/appointments')
    } catch (err) {
      setError(errorText(err))
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Вход</h2>
      <label>
        Email
        <input type="email" value={email} required onChange={e => setEmail(e.target.value)} />
      </label>
      <label>
        Пароль
        <input type="password" value={password} required onChange={e => setPassword(e.target.value)} />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? 'Вход...' : 'Войти'}</button>
    </form>
  )
}
