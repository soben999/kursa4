import { useStore } from '../context/StoreContext'

export default function Profile() {
  const { currentUser, logout, favorites, cartCount } = useStore()

  return (
    <>
      <nav className="crumb">
        <div className="container">
          <a href="/">Главная</a> <span>/</span> <span>Профиль</span>
        </div>
      </nav>

      <section className="profile">
        <div className="container">
          <div className="profile-card" style={{ margin: '0 auto' }}>
            <div className="profile-card__top">
              <div className="profile-card__avatar">{(currentUser.name || '?').charAt(0).toUpperCase()}</div>
              <div className="profile-card__info">
                <h2 className="profile-card__name">{currentUser.name}</h2>
                <div className="profile-card__email">{currentUser.login}</div>
                <div className="profile-card__since">В магазине с {new Date(currentUser.createdAt).toLocaleDateString('ru-RU')}</div>
              </div>
              <button className="btn btn--ghost" onClick={logout}>Выйти</button>
            </div>
            <div className="profile-card__stats">
              <div className="stat">
                <span className="stat__num">{favorites.length}</span>
                <span className="stat__label">В избранном</span>
              </div>
              <div className="stat">
                <span className="stat__num">{cartCount}</span>
                <span className="stat__label">Товаров в корзине</span>
              </div>
            </div>
            <div className="profile-card__note">
              💡 Ваши избранное и корзина сохраняются в этом браузере.
            </div>
          </div>
        </div>
      </section>
    </>
  )
}