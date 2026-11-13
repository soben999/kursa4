import { useState } from 'react'

const FAQ_ITEMS = [
  { q: 'Как быстро осуществляется доставка?', a: 'Доставка по городу занимает 1–2 дня, по всей стране — 3–7 рабочих дней. При заказе до 12:00 товар отправляется в тот же день.' },
  { q: 'Как вернуть товар, если он не подошёл?', a: 'Вы можете вернуть товар в течение 14 дней с момента покупки при сохранении товарного вида и упаковки. Деньги вернём тем же способом оплаты.' },
  { q: 'Какая гарантия на технику?', a: 'На всю технику действует официальная гарантия производителя — от 12 до 24 месяцев. Ремонт по гарантии выполняется бесплатно.' },
  { q: 'Какие способы оплаты доступны?', a: 'Принимаем банковские карты, СБП, а также оплату при получении для заказов по городу. Возможна оплата частями при заказе от 5 000 ₽.' },
  { q: 'Можно ли изменить или отменить заказ?', a: 'Да, до момента передачи заказа в службу доставки. Свяжитесь с нами — укажите номер заказа, и мы внесём изменения.' },
  { q: 'Предоставляете ли вы гарантию на восстановленную технику?', a: 'Да, на восстановленную технику действует гарантия 6 месяцев. Все устройства проходят полную проверку перед продажей.' }
]

export default function Support() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <>
      <nav className="crumb">
        <div className="container">
          <a href="/">Главная</a> <span>/</span> <span>Поддержка</span>
        </div>
      </nav>

      <section className="support">
        <div className="container">
          <div className="support__head">
            <span className="support__icon">💬</span>
            <h1 className="section-title section-title--xl">Поддержка</h1>
            <p className="support__sub">
              Мы готовы помочь с вопросами о заказах, доставке, гарантии и возвратах. Выберите вопрос — ответ появится мгновенно.
            </p>
          </div>

          <h2 className="support__h2">Частые вопросы</h2>
          <div className="faq">
            {FAQ_ITEMS.map((item, i) => (
              <div className={'faq-item' + (openIndex === i ? ' faq-item--open' : '')} key={i}>
                <button className="faq-item__q" onClick={() => setOpenIndex(openIndex === i ? null : i)} aria-expanded={openIndex === i}>
                  <span>{item.q}</span>
                  <svg className="faq-item__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <div className="faq-item__wrap" hidden={openIndex !== i}>
                  <div className="faq-item__a">{item.a}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="support__cta">
            <p className="support__cta-text">Не нашли ответ на свой вопрос?</p>
            <a href="mailto:support@hns.ru" className="btn btn--primary">Написать в поддержку</a>
          </div>
        </div>
      </section>
    </>
  )
}