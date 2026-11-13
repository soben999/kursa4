import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function ProductCard({ product, index }) {
  const { categoryNames, formatPrice, addToCart, favorites, toggleFavorite } = useStore()
  const isFav = favorites.includes(product.id)

  return (
    <article className="product-card" style={{ animationDelay: (index * 70) + 'ms', cursor: 'pointer' }}>
      <Link to={'/product/' + product.id} className="product-card__link">
        <div className="product-card__media">
          <button className={`product-card__fav ${isFav ? 'fav--active' : ''}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product.id) }}
            title="В избранное">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>
          </button>
          {product.image ? <img src={product.image} alt={product.name} className="product-card__img" /> : <span>{product.emoji}</span>}
        </div>
        <div className="product-card__category">{categoryNames[product.category]}</div>
        <h3 className="product-card__title">{product.name}</h3>
        <div>
          <span className="product-card__price">{formatPrice(product.price)}</span>
          {product.oldPrice ? <span className="product-card__old">{formatPrice(product.oldPrice)}</span> : null}
        </div>
      </Link>
      <button className="product-card__add" onClick={() => addToCart(product)}>В корзину</button>
    </article>
  )
}