import { useState, useEffect } from 'react'
import { StoreProvider, useStore } from './store'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { Product } from './pages/Product'
import { Support } from './pages/Support'

function parseHash(hash) {
  // #/catalog, #/product/3, #/
  const h = hash.replace(/^#\/?/, '')
  const parts = h.split('/')
  if (parts[0] === 'catalog') return { page: 'catalog' }
  if (parts[0] === 'support') return { page: 'support' }
  if (parts[0] === 'product') return { page: 'product', id: Number(parts[1]) || 1 }
  return { page: 'home' }
}

function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return <div className="toast" hidden={!toast}>{toast}</div>
}

function Router() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function go(page, id) {
    window.location.hash = id ? `#/product/${id}` : `#/${page}`
  }

  return (
    <>
      {route.page === 'home' && <Home go={go} />}
      {route.page === 'catalog' && <Catalog />}
      {route.page === 'support' && <Support />}
      {route.page === 'product' && <Product id={route.id} go={go} />}
      <Toast />
    </>
  )
}

function App() {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  )
}

export default App