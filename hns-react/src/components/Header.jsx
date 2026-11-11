import { useStore } from '../store'
import { useState } from 'react'
import { formatPrice } from '../data'

function HeartIcon({ filled }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  )
}

export function Panels({ panel, setPanel }) {
  const { favorites, cart, cartCount, products, formatPrice: fp, toggleFavorite, removeFromCart, clearCart, showToast } = useStore()

  function close() { setPanel(null) }

  return (
    <>
      <div className={`overlay ${panel ? '' : 'is-closed'}`} hidden={!panel} onClick={close} />
      <aside className={`panel ${panel === 'favorites' ? 'panel--open' : ''}`} aria-hidden={panel !== 'favorites'}>
        <div className="panel__head">
          <h3>Избранное</h3>
          <button className="panel__close" onClick={close}>×</button>
        </div>
        <div className={`panel__body ${favorites.length === 0 ? 'panel__body--empty' : ''}`}>
          {favorites.length === 0 ? (
            <span>В избранном пока пусто</span>
          ) : favorites.map(id => {
            const p = products.find(x => x.id === id)
            if (!p) return null
            return (
              <div className="panel-item" key={id}>
                <div className="panel-item__media">{p.image ? <img src={p.image} alt={p.name} className="panel-item__img" /> : p.emoji}</div>
                <div className="panel-item__body">
                  <div className="panel-item__title">{p.name}</div>
                  <div className="panel-item__price">{formatPrice(p.price)}</div>
                </div>
                <button className="panel-item__remove" onClick={() => toggleFavorite(id)}>×</button>
              </div>
            )
          })}
        </div>
      </aside>

      <aside className={`panel ${panel === 'cart' ? 'panel--open' : ''}`} aria-hidden={panel !== 'cart'}>
        <div className="panel__head">
          <h3>Корзина</h3>
          <button className="panel__close" onClick={close}>×</button>
        </div>
        <div className={`panel__body ${cart.length === 0 ? 'panel__body--empty' : ''}`}>
          {cart.length === 0 ? (
            <span>Корзина пуста</span>
          ) : cart.map(item => {
            const p = products.find(x => x.id === item.id)
            const media = p && p.image ? <img src={p.image} className="panel-item__img" alt={p.name} /> : item.emoji
            return (
              <div className="panel-item" key={item.id}>
                <div className="panel-item__media">{media}</div>
                <div className="panel-item__body">
                  <div className="panel-item__title">{item.name}</div>
                  <div className="panel-item__price">{formatPrice(item.price)} × {item.quantity}</div>
                </div>
                <button className="panel-item__remove" onClick={() => removeFromCart(item.id)}>×</button>
              </div>
            )
          })}
        </div>
        <div className="panel__foot">
          <div className="panel__total">Итого: <strong>{formatPrice(cart.reduce((s, i) => s + i.price * i.quantity, 0))}</strong></div>
          <button className="btn btn--primary panel__checkout" onClick={() => { clearCart(); close(); showToast('Заказ оформлен! Спасибо за покупку 🎉') }}>
            Оформить заказ
          </button>
        </div>
      </aside>
    </>
  )
}

export function Header({ onSearch, current }) {
  const { favorites, cartCount } = useStore()
  const [panel, setPanel] = useState(null)
  const [query, setQuery] = useState('')

  function submit(e) {
    e.preventDefault()
    if (onSearch) onSearch(query)
  }

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <a href="#/" className="logo">H<span className="logo__dot">N</span>S</a>
          {current !== 'home' && (
            <form className="search" onSubmit={submit}>
              <svg className="search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <input className="search__input" placeholder="Поиск: смартфоны, ноутбуки, техника..." value={query} onChange={e => setQuery(e.target.value)} />
            </form>
          )}
          <div className="header__actions">
            <button className="icon-btn" title="Избранное" onClick={() => setPanel('favorites')}>
              <HeartIcon filled={false} />
              <span className="badge" hidden={favorites.length === 0}>{favorites.length}</span>
            </button>
            <button className="icon-btn icon-btn--cart" title="Корзина" onClick={() => setPanel('cart')}>
              <CartIcon />
              <span className="badge" hidden={cartCount === 0}>{cartCount}</span>
            </button>
          </div>
        </div>
      </header>
      <Panels panel={panel} setPanel={setPanel} />
    </>
  )
}