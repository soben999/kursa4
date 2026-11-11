import { useState } from 'react'
import { Header } from '../components/Header'

const faqItems = [
  {
    q: 'Как быстро осуществляется доставка?',
    a: 'Доставка по городу занимает 1–2 дня, по всей стране — 3–7 рабочих дней. При заказе до 12:00 товар отправляется в тот же день. Точную дату вы увидите при оформлении заказа.'
  },
  {
    q: 'Как вернуть товар, если он не подошёл?',
    a: 'Вы можете вернуть товар в течение 14 дней с момента покупки при сохранении товарного вида и упаковки. Деньги вернём тем же способом, которым была произведена оплата, в течение 3–10 дней.'
  },
  {
    q: 'Какая гарантия на технику?',
    a: 'На всю технику действует официальная гарантия производителя — от 12 до 24 месяцев. Ремонт по гарантии выполняется бесплатно в авторизованных сервисных центрах.'
  },
  {
    q: 'Какие способы оплаты доступны?',
    a: 'Принимаем банковские карты, СБП (система быстрых платежей), а также оплату при получении для заказов по городу. Возможна оплата частями при заказе от 5 000 ₽.'
  },
  {
    q: 'Можно ли изменить или отменить заказ?',
    a: 'Да, до момента передачи заказа в службу доставки. Свяжитесь с нами любым удобным способом — укажите номер заказа, и мы внесём изменения или отменим его без дополнительных комиссий.'
  },
  {
    q: 'Предоставляете ли вы гарантию на восстановленную технику?',
    a: 'Да, на восстановленную технику действует гарантия 6 месяцев. Все устройства проходят полную техническую проверку и тестирование перед продажей.'
  }
]

function FaqItem({ item, open, onToggle }) {
  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
      <button className="faq-item__q" onClick={onToggle} aria-expanded={open}>
        <span>{item.q}</span>
        <svg className="faq-item__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className="faq-item__wrap" hidden={!open}>
        <div className="faq-item__a">{item.a}</div>
      </div>
    </div>
  )
}

export function Support() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <>
      <Header current="support" />

      <nav className="crumb">
        <div className="container">
          <a href="#/">Главная</a>
          <span>/</span>
          <span>Поддержка</span>
        </div>
      </nav>

      <section className="support">
        <div className="container">
          <div className="support__head">
            <span className="support__icon">💬</span>
            <h1 className="section-title section-title--xl">Поддержка</h1>
            <p className="support__sub">
              Мы готовы помочь с вопросами о заказах, доставке, гарантии и возвратах.
              Выберите интересующий вас вопрос — ответ появится мгновенно.
            </p>
          </div>

          <h2 className="support__h2">Частые вопросы</h2>
          <div className="faq">
            {faqItems.map((item, i) => (
              <FaqItem
                key={i}
                item={item}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

          <div className="support__cta">
            <p className="support__cta-text">Не нашли ответ на свой вопрос?</p>
            <a href="mailto:support@hns.ru" className="btn btn--primary">Написать в поддержку</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <div>
            <a href="#/" className="logo">H<span className="logo__dot">N</span>S</a>
            <p className="footer__note">© 2026 HNS. Все права защищены.</p>
          </div>
          <ul className="footer__links">
            <li><a href="#">Доставка и оплата</a></li>
            <li><a href="#">Гарантия</a></li>
            <li><a href="#">Контакты</a></li>
          </ul>
        </div>
      </footer>
    </>
  )
}