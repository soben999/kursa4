import { Header } from '../components/Header'
import { products, formatPrice, categoryNames } from '../data'
import { useStore } from '../store'

export function Product({ id, go }) {
  const product = products.find(p => p.id === id) || products[0]
  const { favorites, cart, toggleFavorite, addToCart, showToast } = useStore()

  const inCart = cart.some(i => i.id === product.id)
  const isFav = favorites.includes(product.id)

  return (
    <>
      <Header current="product" />

      <nav className="crumb">
        <div className="container">
          <a href="#/">Главная</a>
          <span>/</span>
          <a href="#/catalog">{categoryNames[product.category]}</a>
          <span>/</span>
          <span>{product.name}</span>
        </div>
      </nav>

      <section className="product">
        <div className="container product__grid">
          <div className="product__media">
            {product.image
              ? <img src={product.image} alt={product.name} className="product__img" />
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
              <button
                className="btn btn--primary"
                onClick={() => { addToCart(product); showToast('Товар добавлен в корзину ✓') }}
              >
                {inCart ? 'Добавлено ✓' : 'В корзину'}
              </button>
              <button
                className={`btn--fav ${isFav ? 'btn--fav-active' : ''}`}
                onClick={() => toggleFavorite(product.id)}
              >
                {isFav ? 'В избранном ♥' : 'В избранное'}
              </button>
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
          <table className="specs__table">
            <tbody>
              {product.specs.map(([name, value], i) => (
                <tr key={i}>
                  <th>{name}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
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