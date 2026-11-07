// ===== Скрипт главной страницы HNS =====
// Данные, избранное, корзина и утилиты — в products-data.js (window.products и др.)

// Кнопки избранного/корзины в карточке отмечены data-флажками, чтобы
// клик по ним не запускал переход на страницу товара.

// ===== Счётчики =====
function updateCounters() {
  const favEl = document.getElementById('favCount');
  const cartEl = document.getElementById('cartCount');
  favEl.hidden = window.favoritesState.length === 0;
  favEl.textContent = window.favoritesState.length;
  const cartTotal = window.cartState.reduce((s, i) => s + i.quantity, 0);
  cartEl.hidden = cartTotal === 0;
  cartEl.textContent = cartTotal;
}

// ===== Уведомление =====
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2400);
}

// ===== Рендер карточки товара =====
function createProductCard(product, index) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.style.animationDelay = (index * 70) + 'ms';

  // Клик по карточке (кроме кнопок) открывает страницу товара
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    // игнорируем клики по сердцу избранного
    if (e.target.closest('.product-card__fav')) return;
    window.location.href = 'product.html?id=' + product.id;
  });

  const isFav = isFavorite(product.id);
  const isInCart = inCart(product.id);

  const media = document.createElement('div');
  media.className = 'product-card__media';
  media.innerHTML = `
    <button class="product-card__fav ${isFav ? 'fav--active' : ''}" data-fav="${product.id}" title="В избранное">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
    </button>
    ${product.image ? `<img src="${product.image}" alt="${product.name}" class="product-card__img">` : `<span>${product.emoji}</span>`}
  `;

  const body = document.createElement('div');
  body.innerHTML = `
    <div class="product-card__category">${window.categoryNames[product.category]}</div>
    <h3 class="product-card__title">${product.name}</h3>
    <div>
      <span class="product-card__price">${formatPrice(product.price)}</span>
      ${product.oldPrice ? `<span class="product-card__old">${formatPrice(product.oldPrice)}</span>` : ''}
    </div>
  `;

  const addBtn = document.createElement('button');
  addBtn.className = 'product-card__add' + (isInCart ? ' added' : '');
  addBtn.textContent = isInCart ? 'Добавлено' : 'В корзину';

  addBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // не открываем страницу товара
    addToCart(product);
    addBtn.classList.add('added');
    addBtn.textContent = 'Добавлено';
    updateCounters();
    showToast('Товар добавлен в корзину ✓');
  });

  card.appendChild(media);
  card.appendChild(body);
  card.appendChild(addBtn);
  return card;
}

// ===== Фильтрация и рендер =====
let currentFilter = 'all';
let searchQuery = '';

function renderProducts() {
  const productsEl = document.getElementById('products');
  const emptyEl = document.getElementById('empty');
  productsEl.innerHTML = '';

  const q = searchQuery.toLowerCase().trim();
  const filtered = window.products.filter(p => {
    const okFilter = currentFilter === 'all' || p.category === currentFilter;
    const okSearch = !q || p.name.toLowerCase().includes(q);
    return okFilter && okSearch;
  });

  filtered.forEach((p, i) => {
    productsEl.appendChild(createProductCard(p, i));
  });

  emptyEl.hidden = filtered.length > 0;
  productsEl.hidden = filtered.length === 0;
}

// Обработчик сердца избранного в карточках (делегирование)
function setupCardDelegation() {
  document.getElementById('products').addEventListener('click', (e) => {
    const favBtn = e.target.closest('[data-fav]');
    if (!favBtn) return;
    const id = Number(favBtn.dataset.fav);
    toggleFavorite(id);
    const isFav = isFavorite(id);
    favBtn.classList.toggle('fav--active', isFav);
    favBtn.querySelector('svg').setAttribute('fill', isFav ? 'currentColor' : 'none');
    showToast(isFav ? 'Товар добавлен в избранное ♥' : 'Товар удалён из избранного');
    updateCounters();
    renderFavorites();
  });
}

// ===== Панель избранного =====
function renderFavorites() {
  const list = document.getElementById('favoritesList');
  list.innerHTML = '';
  list.className = 'panel__body';

  if (window.favoritesState.length === 0) {
    list.classList.add('panel__body--empty');
    list.innerHTML = '<span>В избранном пока пусто</span>';
    return;
  }

  window.favoritesState.forEach(id => {
    const p = window.products.find(x => x.id === id);
    if (!p) return;
    const favMedia = p.image
      ? `<img src="${p.image}" alt="${p.name}" class="panel-item__img">`
      : p.emoji;
    const item = document.createElement('div');
    item.className = 'panel-item';
    item.style.cursor = 'pointer';
    item.innerHTML = `
      <div class="panel-item__media">${favMedia}</div>
      <div class="panel-item__body">
        <div class="panel-item__title">${p.name}</div>
        <div class="panel-item__price">${formatPrice(p.price)}</div>
      </div>
      <button class="panel-item__remove" data-remove-fav="${p.id}" title="Удалить">×</button>
    `;
    // переход на товар по клику в элементе
    item.addEventListener('click', (e) => {
      if (e.target.closest('[data-remove-fav]')) return;
      window.location.href = 'product.html?id=' + p.id;
    });
    list.appendChild(item);
  });

  list.querySelectorAll('[data-remove-fav]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(Number(btn.dataset.removeFav));
      renderFavorites();
      renderProducts();
      updateCounters();
      showToast('Товар удалён из избранного');
    });
  });
}

// ===== Панель корзины =====
function renderCart() {
  const list = document.getElementById('cartList');
  const totalEl = document.getElementById('cartTotal');
  list.innerHTML = '';
  list.className = 'panel__body';

  if (window.cartState.length === 0) {
    list.classList.add('panel__body--empty');
    list.innerHTML = '<span>Корзина пуста</span>';
    totalEl.textContent = '0 ₽';
    return;
  }

  let total = 0;
  window.cartState.forEach(item => {
    total += item.price * item.quantity;
    const p = window.products.find(x => x.id === item.id);
    const media = p && p.image
      ? `<img src="${p.image}" alt="${p.name}" class="panel-item__img">`
      : item.emoji;
    const el = document.createElement('div');
    el.className = 'panel-item';
    el.innerHTML = `
      <div class="panel-item__media">${media}</div>
      <div class="panel-item__body">
        <div class="panel-item__title">${item.name}</div>
        <div class="panel-item__price">${formatPrice(item.price)} × ${item.quantity}</div>
      </div>
      <button class="panel-item__remove" data-remove-cart="${item.id}" title="Удалить">×</button>
    `;
    list.appendChild(el);
  });

  totalEl.textContent = formatPrice(total);

  list.querySelectorAll('[data-remove-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.cartState.splice(window.cartState.findIndex(x => x.id === Number(btn.dataset.removeCart)), 1);
      saveState();
      updateCounters();
      renderCart();
      renderProducts();
      showToast('Товар удалён из корзины');
    });
  });
}

// ===== Открытие/закрытие панелей =====
function openPanel(id, renderFn) {
  renderFn();
  document.getElementById('overlay').hidden = false;
  document.getElementById(id).classList.add('panel--open');
  document.getElementById(id).setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePanel(id) {
  document.getElementById(id).classList.remove('panel--open');
  document.getElementById(id).setAttribute('aria-hidden', 'true');
  const overlay = document.getElementById('overlay');
  if (!document.querySelector('.panel.panel--open')) {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }
}

function setupPanels() {
  document.getElementById('favBtn').addEventListener('click', () => openPanel('favoritesPanel', renderFavorites));
  document.getElementById('cartBtn').addEventListener('click', () => openPanel('cartPanel', renderCart));

  document.querySelectorAll('.panel__close').forEach(btn => {
    btn.addEventListener('click', () => closePanel(btn.dataset.close));
  });

  document.getElementById('overlay').addEventListener('click', () => {
    closePanel('favoritesPanel');
    closePanel('cartPanel');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePanel('favoritesPanel');
      closePanel('cartPanel');
    }
  });
}

// ===== Фильтры =====
function setupFilters() {
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
      chip.classList.add('chip--active');
      currentFilter = chip.dataset.filter;
      renderProducts();
    });
  });
}

// ===== Поиск =====
function setupSearch() {
  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = document.getElementById('searchInput').value;
    renderProducts();
  });
}

// ===== Появление при скролле =====
function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== Оформление заказа =====
function setupCheckout() {
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (window.cartState.length === 0) {
      showToast('Корзина пуста');
      return;
    }
    window.cartState.length = 0;
    saveState();
    updateCounters();
    renderCart();
    renderProducts();
    closePanel('cartPanel');
    showToast('Заказ оформлен! Спасибо за покупку 🎉');
  });
}

// ===== Инициализация =====
updateCounters();
setupFilters();
setupSearch();
setupCardDelegation();
setupPanels();
setupCheckout();
setupReveal();
renderProducts();
renderFavorites();
renderCart();