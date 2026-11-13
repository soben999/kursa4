import { Navigate, useLocation } from 'react-router-dom'

// Защищённый маршрут: доступен только авторизованным пользователям.
// При отсутствии доступа перенаправляет на страницу входа,
// сохраняя исходный адрес для возврата после авторизации.
export default function ProtectedRoute({ user, admin, children }) {
  const location = useLocation()

  if (admin) {
    // Требуется роль администратора
    if (!user.isAdmin) {
      return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children
  }

  // Требуется авторизация
  if (!user.currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}