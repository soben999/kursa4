import { useEffect } from 'react'
import { Header } from '../components/Header'

export function Home({ go }) {
  useEffect(() => {
    // Сплэш-анимация при загрузке главной
    const el = document.querySelector('.splash')
    if (el) {
      const t = setTimeout(() => el.classList.add('splash--done'), 1500)
      return () => clearTimeout(t)
    }
  }, [])

  const navcards = [
    { id: 'catalog', icon: '🛍️', title: 'Каталог', text: 'Смартфоны, ноутбуки и техника', action: () => go('catalog') },
    { id: 'support', icon: '💬', title: 'Поддержка', text: 'Помощь и ответы на вопросы', action: () => go('support') },
    { id: 'gift', icon: '🎁', title: 'Подарочные сертификаты', text: 'Подарите технику близким' },
    { id: 'profile', icon: '👤', title: 'Профиль', text: 'Заказы, настройки и данные' }
  ]

  return (
    <>
      <div className="splash" id="splash">
        <div className="splash__inner">
          <span className="splash__letter" style={{ '--i': 1 }}>H</span>
          <span className="splash__letter" style={{ '--i': 2 }}>N</span>
          <span className="splash__letter" style={{ '--i': 3 }}>S</span>
        </div>
        <div className="splash__ring"></div>
      </div>

      <Header current="home" />

      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text reveal">
            <span className="hero__tag">Новая коллекция 2026</span>
            <h1 className="hero__title">Техника, которая<br />работает на вас</h1>
            <p className="hero__sub">Смартфоны, ноутбуки и бытовая техника по честным ценам. Доставка по всей стране.</p>
            <button className="btn btn--primary" onClick={() => go('catalog')}>Смотреть каталог</button>
          </div>
          <div className="hero__visual">
            <div className="hero__orb"></div>
            <span className="hero__emoji">💻</span>
          </div>
        </div>
      </section>

      <section className="welcome">
        <div className="container welcome__inner reveal">
          <h2 className="welcome__title">Что вы хотите сделать?</h2>
          <p className="welcome__sub">Выберите раздел, чтобы продолжить</p>
        </div>
      </section>

      <section className="navgrid">
        <div className="container navgrid__grid">
          {navcards.map(c => (
            <button key={c.id} className="navcard reveal" onClick={c.action ? c.action : undefined} data-placeholder={!c.action}>
              <span className="navcard__icon">{c.icon}</span>
              <span className="navcard__title">{c.title}</span>
              <span className="navcard__text">{c.text}</span>
              <span className="navcard__arrow">→</span>
            </button>
          ))}
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