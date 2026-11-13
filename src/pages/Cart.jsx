import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Cart() {
  const { cart, cartTotal, formatPrice, changeQuantity, removeFromCart, clearCart } = useStore()

  if (cart.length === 0) {
    return (
      <>
        <nav className="crumb">
          <div className="container">
            <Link to="/">Главная</Link> <span>/</span> <span>Корзина</span>
          </div>
        </nav>
        <section className="catalog">
          <div className="container">
            <h2 className="section-title">Корзина</h2>
            <p className="empty">Корзина пуста.</p>
            <div className="support__cta">
              <Link to="/catalog" className="btn btn--primary">Перейти в каталог</Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <nav className="crumb">
        <div className="container">
          <Link to="/">Главная</Link> <span>/</span> <span>Корзина</span>
        </div>
      </nav>

      <section className="catalog">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Корзина</h2>
            <button className="btn btn--ghost" onClick={clearCart}>Очистить корзину</button>
          </div>

          <div className="cart-list">
            {cart.map(item => (
              <div className="cart-row" key={item.id}>
                <div className="cart-row__media">{item.emoji}</div>
                <div className="cart-row__body">
                  <div className="cart-row__title">{item.name}</div>
                  <div className="cart-row__price">{formatPrice(item.price)}</div>
                </div>
                <div className="cart-row__qty">
                  <button className="btn btn--ghost btn--sm" onClick={() => changeQuantity(item.id, -1)}>−</button>
                  <span className="cart-row__num">{item.quantity}</span>
                  <button className="btn btn--ghost btn--sm" onClick={() => changeQuantity(item.id, 1)}>+</button>
                </div>
                <div className="cart-row__total">{formatPrice(item.price * item.quantity)}</div>
                <button className="panel-item__remove" onClick={() => removeFromCart(item.id)}>×</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="panel__total">Итого: <strong>{formatPrice(cartTotal)}</strong></div>
            <Link to="/checkout" className="btn btn--primary">Оформить заказ</Link>
          </div>
        </div>
      </section>
    </>
  )
}