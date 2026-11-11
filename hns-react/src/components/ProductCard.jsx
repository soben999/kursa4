import { useStore } from '../store'
import { products, formatPrice, categoryNames } from '../data'

export function ProductCard({ product, index }) {
  const { favorites, cart, toggleFavorite, addToCart, showToast } = useStore()
  const isFav = favorites.includes(product.id)
  const inCart = cart.some(i => i.id === product.id)

  return (
    <article
      className="product-card"
      style={{ animationDelay: (index * 70) + 'ms', cursor: 'pointer' }}
      onClick={() => (location.hash = '#/product/' + product.id)}
    >
      <div className="product-card__media">
        <button
          className={`product-card__fav ${isFav ? 'fav--active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id) }}
          title="В избранное"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
        {product.image ? <img src={product.image} alt={product.name} className="product-card__img" /> : <span>{product.emoji}</span>}
      </div>
      <div className="product-card__category">{categoryNames[product.category]}</div>
      <h3 className="product-card__title">{product.name}</h3>
      <div>
        <span className="product-card__price">{formatPrice(product.price)}</span>
        {product.oldPrice ? <span className="product-card__old">{formatPrice(product.oldPrice)}</span> : null}
      </div>
      <button
        className={`product-card__add ${inCart ? 'added' : ''}`}
        onClick={(e) => { e.stopPropagation(); addToCart(product); showToast('Товар добавлен в корзину ✓') }}
      >
        {inCart ? 'Добавлено' : 'В корзину'}
      </button>
    </article>
  )
}