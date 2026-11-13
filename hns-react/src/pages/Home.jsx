import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text reveal">
            <span className="hero__tag">Новая коллекция 2026</span>
            <h1 className="hero__title">Техника, которая<br />работает на вас</h1>
            <p className="hero__sub">Смартфоны, ноутбуки и бытовая техника по честным ценам. Доставка по всей стране.</p>
            <Link to="/catalog" className="btn btn--primary">Смотреть каталог</Link>
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
          <Link to="/catalog" className="navcard navcard--catalog reveal">
            <span className="navcard__icon">🛍️</span>
            <span className="navcard__title">Каталог</span>
            <span className="navcard__text">Смартфоны, ноутбуки и техника</span>
            <span className="navcard__arrow">→</span>
          </Link>
          <Link to="/support" className="navcard navcard--support reveal">
            <span className="navcard__icon">💬</span>
            <span className="navcard__title">Поддержка</span>
            <span className="navcard__text">Помощь и ответы на вопросы</span>
            <span className="navcard__arrow">→</span>
          </Link>
          <Link to="/gifts" className="navcard navcard--gift reveal">
            <span className="navcard__icon">🎁</span>
            <span className="navcard__title">Подарочные сертификаты</span>
            <span className="navcard__text">Подарите технику близким</span>
            <span className="navcard__arrow">→</span>
          </Link>
          <Link to="/profile" className="navcard navcard--profile reveal">
            <span className="navcard__icon">👤</span>
            <span className="navcard__title">Профиль</span>
            <span className="navcard__text">Заказы, настройки и данные</span>
            <span className="navcard__arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}