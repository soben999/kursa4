import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'

const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'smartphones', label: 'Смартфоны' },
  { id: 'laptops', label: 'Ноутбуки' },
  { id: 'audio', label: 'Аудио' },
  { id: 'appliances', label: 'Техника' }
]

export default function Catalog() {
  const { products } = useStore()
  const [searchParams] = useSearchParams()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const q = query.toLowerCase().trim()
  const filtered = products.filter(p => {
    const okFilter = filter === 'all' || p.category === filter
    const okSearch = !q || p.name.toLowerCase().includes(q)
    return okFilter && okSearch
  })

  return (
    <>
      <nav className="crumb">
        <div className="container">
          <a href="/">Главная</a> <span>/</span> <span>Каталог</span>
        </div>
      </nav>

      <section className="catalog">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">{q ? 'Результаты поиска: "' + q + '"' : 'Каталог товаров'}</h2>
            <div className="filters">
              {CATEGORIES.map(c => (
                <button key={c.id}
                  className={'chip' + (filter === c.id ? ' chip--active' : '')}
                  onClick={() => setFilter(c.id)}>
                  {c.label}
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
    </>
  )
}