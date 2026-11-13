import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useStore } from '../context/StoreContext'

function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  return <div className="toast">{toast}</div>
}

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </>
  )
}