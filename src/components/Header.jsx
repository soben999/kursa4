import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

function SearchForm() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  return (
    <form className="search" onSubmit={(e) => {
      e.preventDefault()
      navigate('/catalog?q=' + encodeURIComponent(query))
    }}>
      <svg className="search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
      <input className="search__input" placeholder="Поиск: смартфоны, ноутбуки, техника..." value={query} onChange={(e) => setQuery(e.target.value)} />
    </form>
  )
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>
  )
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></svg>
  )
}

export default function Header() {
  const { favorites, cartCount, cart, cartTotal, isAdmin, currentUser, removeFromCart, clearCart, formatPrice } = useStore()
  const [panel, setPanel] = useState(null) // 'favorites' | 'cart' | null
  const [cartOpen, setCartOpen] = useState(false)

  function close() { setPanel(null); setCartOpen(false) }

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="logo">H<span className="logo__dot">N</span>S</Link>
          <SearchForm />
          <nav className="header__nav">
            <NavLink to="/catalog" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Каталог</NavLink>
            <NavLink to="/support" className="nav-link">Поддержка</NavLink>
            <NavLink to="/gifts" className="nav-link">Сертификаты</NavLink>
          </nav>
          <div className="header__actions">
            <button className="icon-btn" title="Избранное" onClick={() => { setPanel('favorites'); setCartOpen(true) }}>
              <HeartIcon />
              <span className="badge" hidden={favorites.length === 0}>{favorites.length}</span>
            </button>
            <button className="icon-btn icon-btn--cart" title="Корзина" onClick={() => { setPanel('cart'); setCartOpen(true) }}>
              <CartIcon />
              <span className="badge" hidden={cartCount === 0}>{cartCount}</span>
            </button>
            {isAdmin ? (
              <Link to="/admin" className="btn btn--auth btn--auth-admin">Админ</Link>
            ) : currentUser ? (
              <Link to="/profile" className="btn btn--auth btn--auth-user">{currentUser.login}</Link>
            ) : (
              <Link to="/login" className="btn btn--auth">Войти</Link>
            )}
          </div>
        </div>
      </header>

      {/* Оверлей и панели */}
      <div className={`overlay ${cartOpen ? '' : ''}`} hidden={!cartOpen} onClick={close} />
      <aside className={`panel ${panel === 'favorites' ? 'panel--open' : ''}`} aria-hidden={panel !== 'favorites'}>
        <div className="panel__head">
          <h3>Избранное</h3>
          <button className="panel__close" onClick={close}>×</button>
        </div>
        <div className={`panel__body ${favorites.length === 0 ? 'panel__body--empty' : ''}`}>
          {favorites.length === 0 ? 'В избранном пока пусто' : (
            favorites.map(id => {
              const p = window.__products?.find?.(x => x.id === id)
              if (!p) return null
              return (
                <div className="panel-item" key={id}>
                  <div className="panel-item__media">{p.image ? <img src={p.image} className="panel-item__img" alt={p.name} /> : p.emoji}</div>
                  <div className="panel-item__body">
                    <div className="panel-item__title">{p.name}</div>
                    <div className="panel-item__price">{formatPrice(p.price)}</div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </aside>

      <aside className={`panel ${panel === 'cart' ? 'panel--open' : ''}`} aria-hidden={panel !== 'cart'}>
        <div className="panel__head">
          <h3>Корзина</h3>
          <button className="panel__close" onClick={close}>×</button>
        </div>
        <div className={`panel__body ${cart.length === 0 ? 'panel__body--empty' : ''}`}>
          {cart.length === 0 ? 'Корзина пуста' : cart.map(item => (
            <div className="panel-item" key={item.id}>
              <div className="panel-item__media">{item.emoji}</div>
              <div className="panel-item__body">
                <div className="panel-item__title">{item.name}</div>
                <div className="panel-item__price">{formatPrice(item.price)} × {item.quantity}</div>
              </div>
              <button className="panel-item__remove" onClick={() => removeFromCart(item.id)}>×</button>
            </div>
          ))}
        </div>
        <div className="panel__foot">
          <div className="panel__total">Итого: <strong>{formatPrice(cartTotal)}</strong></div>
          <Link to="/cart" className="btn btn--primary panel__checkout" onClick={close}>Оформить заказ</Link>
        </div>
      </aside>
    </>
  )
}