import { lazy, Suspense } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router'
import { currentUser, logout } from './api'

// Каждая страница собирается в отдельный JS-файл и загружается только при переходе на неё
const Home = lazy(() => import('./pages/Home.jsx'))
const AppointmentList = lazy(() => import('./pages/AppointmentList.jsx'))
const AppointmentDetails = lazy(() => import('./pages/AppointmentDetails.jsx'))
const AppointmentForm = lazy(() => import('./pages/AppointmentForm.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))

export default function App() {
  // Меню перерисовывается при каждом переходе, поэтому после входа и выхода оно актуально
  useLocation()
  const navigate = useNavigate()
  const user = currentUser()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <main>
      <h1>Запись на приём к врачу</h1>
      <nav>
        <NavLink to="/" end>Главная</NavLink>
        <NavLink to="/appointments" end>Записи</NavLink>
        <NavLink to="/appointments/new">Новая запись</NavLink>
        {user ? (
          <span className="user">
            {user.email} ({user.role}) <button onClick={handleLogout}>Выйти</button>
          </span>
        ) : (
          <NavLink to="/login">Вход</NavLink>
        )}
      </nav>
      <Suspense fallback={<p className="loading">Загрузка страницы...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/appointments/new" element={<AppointmentForm key="new" />} />
          <Route path="/appointments/:id" element={<AppointmentDetails />} />
          <Route path="/appointments/:id/edit" element={<AppointmentForm key="edit" />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<p className="error">Страница не найдена</p>} />
        </Routes>
      </Suspense>
    </main>
  )
}
