import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Product() {
  const { id } = useParams()
  const { getProduct, categoryNames, formatPrice, addToCart } = useStore()
  const product = getProduct(id)

  if (!product) {
    return (
      <section className="catalog">
        <div className="container">
          <h1 className="section-title">Товар не найден</h1>
          <p className="empty">Такого товара нет в каталоге.</p>
          <div className="support__cta">
            <Link to="/catalog" className="btn btn--primary">Перейти к каталогу</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <nav className="crumb">
        <div className="container">
          <Link to="/">Главная</Link> <span>/</span>
          <Link to="/catalog">{categoryNames[product.category]}</Link> <span>/</span>
          <span>{product.name}</span>
        </div>
      </nav>

      <section className="product">
        <div className="container product__grid">
          <div className="product__media">
            {product.image ? <img src={product.image} alt={product.name} className="product__img" />
              : <span className="product__emoji">{product.emoji}</span>}
          </div>
          <div className="product__info">
            <div className="product__category">{categoryNames[product.category]}</div>
            <h1 className="product__title">{product.name}</h1>
            <div className="product__price-block">
              <span className="product__price">{formatPrice(product.price)}</span>
              {product.oldPrice ? <span className="product__old">{formatPrice(product.oldPrice)}</span> : null}
            </div>
            <p className="product__desc">{product.description}</p>
            <div className="product__actions">
              <button className="btn btn--primary" onClick={() => addToCart(product)}>В корзину</button>
            </div>
            <ul className="product__perks">
              <li>🚚 Быстрая доставка</li>
              <li>🛡️ Гарантия до 2 лет</li>
              <li>↩️ Возврат 14 дней</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="specs">
        <div className="container">
          <h2 className="section-title">Характеристики</h2>
          {product.specs && product.specs.length > 0 ? (
            <table className="specs__table">
              <tbody>
                {product.specs.map(([name, value], i) => (
                  <tr key={i}><th>{name}</th><td>{value}</td></tr>
                ))}
              </tbody>
            </table>
          ) : <p className="empty">Характеристики не указаны.</p>}
        </div>
      </section>
    </>
  )
}