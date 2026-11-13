import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Checkout() {
  const { cart, cartTotal, formatPrice, clearCart, showToast, currentUser } = useStore()
  const navigate = useNavigate()

  const [delivery, setDelivery] = useState('courier')
  const [payment, setPayment] = useState('card')

  function submit(e) {
    e.preventDefault()
    if (cart.length === 0) { alert('Корзина пуста'); return }
    clearCart()
    showToast('Заказ оформлен! Спасибо за покупку 🎉')
    navigate('/')
  }

  return (
    <>
      <nav className="crumb">
        <div className="container">
          <a href="/">Главная</a> <span>/</span> <span>Оформление заказа</span>
        </div>
      </nav>

      <section className="catalog">
        <div className="container">
          <h2 className="section-title">Оформление заказа</h2>
          {!currentUser && <p className="empty">Для оформления заказа необходимо <a href="#/login">войти</a>.</p>}

          <form className="gift-form" onSubmit={submit}>
            <div className="gift-form__grid">
              <label className="field">
                <span className="field__label">Имя *</span>
                <input className="field__input" defaultValue={currentUser ? currentUser.name : ''} placeholder="Ваше имя" />
              </label>
              <label className="field">
                <span className="field__label">Телефон *</span>
                <input className="field__input" placeholder="+7-900-000-00-00" />
              </label>
              <label className="field field--full">
                <span className="field__label">Адрес доставки *</span>
                <input className="field__input" placeholder="Город, улица, дом, квартира" />
              </label>
              <label className="field">
                <span className="field__label">Способ доставки</span>
                <select className="field__input" value={delivery} onChange={(e) => setDelivery(e.target.value)}>
                  <option value="courier">Курьер</option>
                  <option value="pickup">Пункт выдачи</option>
                  <option value="post">Почта</option>
                </select>
              </label>
              <label className="field">
                <span className="field__label">Способ оплаты</span>
                <select className="field__input" value={payment} onChange={(e) => setPayment(e.target.value)}>
                  <option value="card">Карта</option>
                  <option value="sbp">СБП</option>
                  <option value="cash">При получении</option>
                </select>
              </label>
            </div>
            <div className="gift-form__foot">
              <div className="gift-form__summary">К оплате: <strong>{formatPrice(cartTotal)}</strong></div>
              <button type="submit" className="btn btn--primary">Подтвердить заказ</button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}