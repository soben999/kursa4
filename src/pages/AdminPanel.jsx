import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function AdminPanel() {
  const { products, saveProduct, deleteProduct, resetCatalog, categoryNames, formatPrice, adminLogout } = useStore()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(null) // null = скрыта форма
  const [form, setForm] = useState(null)

  function openAdd() {
    setEditing('new')
    setForm({ id: null, name: '', category: 'smartphones', price: '', oldPrice: '', emoji: '', image: '', description: '' })
  }

  function openEdit(p) {
    setEditing(p.id)
    setForm({ id: p.id, name: p.name, category: p.category, price: p.price, oldPrice: p.oldPrice || '', emoji: p.emoji || '', image: p.image || '', description: p.description || '' })
  }

  function submit(e) {
    e.preventDefault()
    const price = parseInt(String(form.price).replace(/\s|₽/g, ''), 10) || 0
    if (!form.name.trim()) { alert('Укажите название товара'); return }
    if (!price) { alert('Укажите цену товара'); return }
    const oldPrice = form.oldPrice ? (parseInt(String(form.oldPrice).replace(/\s|₽/g, ''), 10) || 0) : 0
    saveProduct({ ...form, price, oldPrice })
    setEditing(null)
  }

  function onExit() {
    adminLogout()
    navigate('/')
  }

  return (
    <>
      <nav className="crumb">
        <div className="container">
          <a href="/">Главная</a> <span>/</span> <span>Админ-панель</span>
        </div>
      </nav>

      <section className="admin">
        <div className="container">
          <div className="admin__head">
            <div>
              <h1 className="page-title">Управление товарами</h1>
              <p className="admin__sub">Добавление, редактирование и удаление товаров каталога.</p>
            </div>
            <button className="btn btn--ghost" onClick={onExit}>Выйти</button>
          </div>

          <div className="admin__actions">
            <button className="btn btn--primary" onClick={openAdd}>+ Добавить товар</button>
            <button className="btn btn--ghost" onClick={() => { if (confirm('Сбросить каталог к исходному набору?')) resetCatalog() }}>Сбросить каталог</button>
          </div>

          {editing && (
            <form className="admin-form" onSubmit={submit}>
              <h2 className="admin-form__title">{editing === 'new' ? 'Добавление товара' : 'Редактирование товара #' + form.id}</h2>
              <div className="admin-form__grid">
                <label className="field">
                  <span className="field__label">Название *</span>
                  <input className="field__input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Название товара" />
                </label>
                <label className="field">
                  <span className="field__label">Категория</span>
                  <select className="field__input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="smartphones">Смартфоны</option>
                    <option value="laptops">Ноутбуки</option>
                    <option value="audio">Аудио</option>
                    <option value="appliances">Техника</option>
                  </select>
                </label>
                <label className="field">
                  <span className="field__label">Цена *</span>
                  <input className="field__input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Например: 49990" />
                </label>
                <label className="field">
                  <span className="field__label">Старая цена</span>
                  <input className="field__input" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} placeholder="Например: 59990" />
                </label>
                <label className="field">
                  <span className="field__label">Эмодзи</span>
                  <input className="field__input" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="Например: 📱" />
                </label>
                <label className="field">
                  <span className="field__label">Картинка</span>
                  <input className="field__input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/img/nazvanie.webp" />
                </label>
                <label className="field field--full">
                  <span className="field__label">Описание *</span>
                  <textarea className="field__input field__input--area" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Описание товара"></textarea>
                </label>
              </div>
              <div className="admin-form__actions">
                <button type="submit" className="btn btn--primary">Сохранить</button>
                <button type="button" className="btn btn--ghost" onClick={() => setEditing(null)}>Отмена</button>
              </div>
            </form>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>Товар</th><th>Категория</th><th>Цена</th><th>Действия</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="admin-tbl__id">{p.id}</td>
                    <td>
                      <div className="admin-tbl__name">
                        <span className="admin-tbl__icon">{p.image ? <img src={p.image} className="admin-tbl__img" alt={p.name} /> : p.emoji}</span>
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td>{categoryNames[p.category] || p.category}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>
                      <div className="admin-tbl__actions">
                        <button className="btn btn--ghost btn--sm" onClick={() => openEdit(p)}>Редактировать</button>
                        <button className="btn btn--danger btn--sm" onClick={() => { if (confirm('Удалить товар «' + p.name + '»?')) deleteProduct(p.id) }}>Удалить</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}