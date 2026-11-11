import { useState } from 'react'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { products, categoryNames } from '../data'

const filters = [
  { id: 'all', label: 'Все' },
  { id: 'smartphones', label: 'Смартфоны' },
  { id: 'laptops', label: 'Ноутбуки' },
  { id: 'audio', label: 'Аудио' },
  { id: 'appliances', label: 'Техника' }
]

export function Catalog({ initialQuery }) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState(initialQuery || '')

  const filtered = products.filter(p => {
    const okFilter = filter === 'all' || p.category === filter
    const q = query.toLowerCase().trim()
    const okSearch = !q || p.name.toLowerCase().includes(q)
    return okFilter && okSearch
  })

  return (
    <>
      <Header current="catalog" onSearch={setQuery} />

      <nav className="crumb">
        <div className="container">
          <a href="#/">Главная</a>
          <span>/</span>
          <span>Каталог</span>
        </div>
      </nav>

      <section className="catalog">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">{query ? `Результаты поиска: "${query}"` : 'Каталог товаров'}</h2>
            <div className="filters">
              {filters.map(f => (
                <button
                  key={f.id}
                  className={`chip ${filter === f.id ? 'chip--active' : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="empty">По вашему запросу ничего не найдено.</p>
          ) : (
            <div className="products">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
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