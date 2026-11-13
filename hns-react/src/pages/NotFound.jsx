import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <>
      <nav className="crumb">
        <div className="container">
          <Link to="/">Главная</Link> <span>/</span> <span>Страница не найдена</span>
        </div>
      </nav>

      <section className="catalog">
        <div className="container" style={{ textAlign: 'center', padding: '40px 0' }}>
          <h1 className="section-title" style={{ fontSize: '64px' }}>404</h1>
          <p className="empty">Такой страницы не существует. Возможно, она была перемещена или удалена.</p>
          <div className="support__cta">
            <Link to="/" className="btn btn--primary">Вернуться на главную</Link>
            <Link to="/catalog" className="btn btn--ghost" style={{ marginLeft: '10px' }}>Перейти в каталог</Link>
          </div>
        </div>
      </section>
    </>
  )
}