import { createContext, useContext, useState, useEffect } from 'react'
import { defaultProducts, categoryNames, formatPrice } from '../data'

// ===== Глобальное состояние приложения (Context API) =====
// Включает: корзину (CartContext), авторизацию (AuthContext),
// уведомления (UIContext) и товары с хранением в localStorage.

const StoreContext = createContext(null)

const ADMIN_LOGIN = 'admin'
const ADMIN_PASS = 'admin123'

function loadProducts() {
  try {
    const raw = localStorage.getItem('hns_products')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) { /* поврежденные данные — базовый список */ }
  return defaultProducts.map(p => JSON.parse(JSON.stringify(p)))
}

function loadCart() {
  try { return JSON.parse(localStorage.getItem('hns_cart') || '[]') }
  catch (e) { return [] }
}

function loadFavorites() {
  try { return JSON.parse(localStorage.getItem('hns_favorites') || '[]') }
  catch (e) { return [] }
}

export function StoreProvider({ children }) {
  // Товары
  const [products, setProducts] = useState(loadProducts)

  // Корзина (CartContext)
  const [cart, setCart] = useState(loadCart)

  // Избранное
  const [favorites, setFavorites] = useState(loadFavorites)

  // Авторизация (AuthContext): обычный пользователь и администратор
  const [currentUser, setCurrentUser] = useState(() => {
    const email = localStorage.getItem('hns_session')
    if (!email) return null
    try {
      const users = JSON.parse(localStorage.getItem('hns_users') || '{}')
      return users[String(email).toLowerCase()] || null
    } catch (e) { return null }
  })
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('hns_admin_session') === '1')

  // Уведомления (UIContext)
  const [toast, setToast] = useState(null)

  // Персистентность товаров
  useEffect(() => {
    localStorage.setItem('hns_products', JSON.stringify(products))
  }, [products])

  // Персистентность корзины и избранного
  useEffect(() => {
    localStorage.setItem('hns_cart', JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    localStorage.setItem('hns_favorites', JSON.stringify(favorites))
  }, [favorites])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2400)
  }

  // ===== Товары =====
  const getProduct = (id) => products.find(p => p.id === Number(id))

  const saveProduct = (product) => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === product.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], ...product }
        return next
      }
      const newId = prev.length ? Math.max(...prev.map(p => p.id)) + 1 : 1
      return [...prev, { ...product, id: newId }]
    })
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== Number(id)))
    setCart(prev => prev.filter(i => i.id !== Number(id)))
    setFavorites(prev => prev.filter(f => f !== Number(id)))
  }

  const resetCatalog = () => {
    setProducts(defaultProducts.map(p => JSON.parse(JSON.stringify(p))))
  }

  // ===== Корзина =====
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { id: product.id, name: product.name, price: product.price, emoji: product.emoji, quantity: 1 }]
    })
    showToast('Товар добавлен в корзину ✓')
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== Number(id)))
  }

  const changeQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id !== Number(id)) return i
      const q = Math.max(1, i.quantity + delta)
      return { ...i, quantity: q }
    }))
  }

  const clearCart = () => setCart([])
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  // ===== Избранное =====
  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(Number(id)) ? prev.filter(f => f !== Number(id)) : [...prev, Number(id)])
  }
  const isFavorite = (id) => favorites.includes(Number(id))

  // ===== Авторизация =====
  const register = (name, login, pass) => {
    if (login === ADMIN_LOGIN) { showToast('Этот логин недоступен'); return false }
    const key = String(login).toLowerCase()
    const users = JSON.parse(localStorage.getItem('hns_users') || '{}')
    if (users[key]) { showToast('Пользователь с таким логином уже зарегистрирован'); return false }
    users[key] = { name, login: key, pass, createdAt: Date.now() }
    localStorage.setItem('hns_users', JSON.stringify(users))
    localStorage.setItem('hns_session', key)
    setCurrentUser(users[key])
    showToast('Добро пожаловать, ' + name + '! 🎉')
    return true
  }

  const login = (login, pass) => {
    const key = String(login).toLowerCase()
    const users = JSON.parse(localStorage.getItem('hns_users') || '{}')
    const user = users[key]
    if (!user || user.pass !== pass) { showToast('Неверный логин или пароль'); return false }
    localStorage.setItem('hns_session', key)
    setCurrentUser(user)
    showToast('С возвращением, ' + user.name + '!')
    return true
  }

  const logout = () => {
    localStorage.removeItem('hns_session')
    setCurrentUser(null)
    showToast('Вы вышли из аккаунта')
  }

  // ===== Администратор =====
  const adminLogin = (login, pass) => {
    if (login === ADMIN_LOGIN && pass === ADMIN_PASS) {
      localStorage.setItem('hns_admin_session', '1')
      setIsAdmin(true)
      showToast('Добро пожаловать, администратор!')
      return true
    }
    showToast('Неверный логин или пароль администратора')
    return false
  }

  const adminLogout = () => {
    localStorage.removeItem('hns_admin_session')
    setIsAdmin(false)
    showToast('Вы вышли из админ-панели')
  }

  const value = {
    products,
    getProduct,
    saveProduct,
    deleteProduct,
    resetCatalog,
    categoryNames,
    formatPrice,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    changeQuantity,
    clearCart,
    favorites,
    toggleFavorite,
    isFavorite,
    currentUser,
    register,
    login,
    logout,
    isAdmin,
    adminLogin,
    adminLogout,
    toast,
    showToast
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}