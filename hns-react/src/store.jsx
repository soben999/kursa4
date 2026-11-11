import { createContext, useContext, useState, useEffect } from 'react'
import { products } from './data'

const StoreContext = createContext()

export function StoreProvider({ children }) {
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('hns_favorites') || '[]'))
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('hns_cart') || '[]'))
  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem('hns_favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('hns_cart', JSON.stringify(cart))
  }, [cart])

  function showToast(message) {
    setToast(message)
    setTimeout(() => setToast(null), 2400)
  }

  function toggleFavorite(id) {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, emoji: product.emoji, quantity: 1 }]
    })
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  function clearCart() {
    setCart([])
  }

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  const value = {
    products,
    favorites,
    cart,
    cartCount,
    toast,
    showToast,
    toggleFavorite,
    addToCart,
    removeFromCart,
    clearCart
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}