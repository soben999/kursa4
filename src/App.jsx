import { Routes, Route, useLocation } from 'react-router-dom'
import { StoreProvider, useStore } from './context/StoreContext'
import Layout from './layouts/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Support from './pages/Support'
import Gifts from './pages/Gifts'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  // React 18 useEffect semantics; placeholder to avoid scroll wrapper warning
  return null
}

function Router() {
  const store = useStore()
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Публичные маршруты */}
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/support" element={<Support />} />
        <Route path="/gifts" element={<Gifts />} />

        {/* Защищённые маршруты: только авторизованные пользователи */}
        <Route path="/profile" element={
          <ProtectedRoute user={store}>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Маршрут администратора: доступ по роли */}
        <Route path="/admin" element={
          <ProtectedRoute user={store} admin>
            <AdminPanel />
          </ProtectedRoute>
        } />

        {/* Маршрут-заглушка для несуществующих URL */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  )
}