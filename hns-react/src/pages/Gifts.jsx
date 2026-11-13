import { useState } from 'react'
import { useStore } from '../context/StoreContext'

const NOMINALS = [
  { value: 1000, hint: 'Бонус к покупке аксессуаров' },
  { value: 3000, hint: 'На наушники и колонки' },
  { value: 5000, hint: 'На аксессуары и гарнитуры' },
  { value: 10000, hint: 'На смартфоны и смарт-часы', popular: true },
  { value: 25000, hint: 'На ноутбуки и технику' }
]

export default function Gifts() {
  const { formatPrice, showToast } = useStore()
  const [selected, setSelected] = useState(null)

  const [recipient, setRecipient] = useState('')
  const [from, setFrom] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!selected) { alert('Выберите номинал сертификата'); return }
    if (!recipient.trim()) { alert('Укажите, кому дарите сертификат'); return }
    if (!from.trim()) { alert('Укажите, от кого сертификат'); return }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Введите корректный email'); return }
    showToast('🎉 Сертификат на ' + formatPrice(selected) + ' будет отправлен на ' + email)
  }

  return (
    <>
      <nav className="crumb">
        <div className="container">
          <a href="/">Главная</a> <span>/</span> <span>Подарочные сертификаты</span>
        </div>
      </nav>

      <section className="gifts">
        <div className="container">
          <div className="gifts__head">
            <span className="gifts__icon">🎁</span>
            <h1 className="page-title">Подарочные сертификаты</h1>
            <p className="gifts__sub">Идеальный подарок — техника, которую человек выберет сам. Оформите сертификат за пару минут.</p>
          </div>

          <h2 className="gifts__h2">Выберите номинал</h2>
          <form className="gift-cards" onSubmit={(e) => e.preventDefault()}>
            {NOMINALS.map(n => (
              <button type="button" key={n.value}
                className={'gift-card' + (selected === n.value ? ' gift-card--selected' : '') + (n.popular ? ' gift-card--popular' : '')}
                onClick={() => setSelected(n.value)}>
                {n.popular ? <span className="gift-card__badge">Популярный</span> : null}
                <span className="gift-card__value">{formatPrice(n.value)}</span>
                <span className="gift-card__hint">{n.hint}</span>
              </button>
            ))}
          </form>

          <form className="gift-form" onSubmit={submit}>
            <h2 className="gifts__h2">Персонализируйте сертификат</h2>
            <div className="gift-form__grid">
              <label className="field">
                <span className="field__label">Кому дарите *</span>
                <input className="field__input" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Имя получателя" />
              </label>
              <label className="field">
                <span className="field__label">От кого *</span>
                <input className="field__input" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Ваше имя" />
              </label>
              <label className="field field--full">
                <span className="field__label">Поздравление</span>
                <textarea className="field__input field__input--area" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Пара тёплых слов..."></textarea>
              </label>
              <label className="field field--full">
                <span className="field__label">Ваш email *</span>
                <input type="email" className="field__input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </label>
            </div>
            <div className="gift-form__foot">
              <div className="gift-form__summary">Номинал: <strong>{selected ? formatPrice(selected) : '—'}</strong></div>
              <button type="submit" className="btn btn--primary">Купить сертификат</button>
            </div>
          </form>

          <h2 className="gifts__h2">Как это работает</h2>
          <div className="gift-steps">
            <div className="gift-step">
              <span className="gift-step__num">1</span>
              <h3 className="gift-step__title">Выберите номинал</h3>
              <p className="gift-step__text">Определите сумму сертификата и оплатите его.</p>
            </div>
            <div className="gift-step">
              <span className="gift-step__num">2</span>
              <h3 className="gift-step__title">Добавьте поздравление</h3>
              <p className="gift-step__text">Укажите, кому вы дарите, и добавите слова.</p>
            </div>
            <div className="gift-step">
              <span className="gift-step__num">3</span>
              <h3 className="gift-step__title">Отправьте сертификат</h3>
              <p className="gift-step__text">Пришлём красивый сертификат на email получателя.</p>
            </div>
          </div>

          <div className="gifts__note">✨ Сертификат бессрочный, его можно использовать частями при любых покупках в HNS.</div>
        </div>
      </section>
    </>
  )
}