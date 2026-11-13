// ===== Скрипт страницы товара HNS =====
// Данные, избранное, корзина и утилиты — в products-data.js

// Определение текущего товара по ?id=
const params = new URLSearchParams(window.location.search);
let productId = parseInt(params.get('id')) || 1;
let product = window.products.find(p => p.id === productId) || window.products[0];
productId = product.id;

// ===== Заполнение карточки =====
function renderProduct() {
  document.title = product.name + ' — HNS';
  document.getElementById('productName').textContent = product.name;
  document.getElementById('productCategory').textContent = window.categoryNames[product.category];
  const emojiEl = document.getElementById('productEmoji');
  if (product.image) {
    // Показываем фото товара вместо эмодзи
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.className = 'product__img';
    emojiEl.replaceWith(img);
  } else {
    emojiEl.textContent = product.emoji;
  }
  document.getElementById('productDesc').textContent = product.description;
  document.getElementById('crumbName').textContent = product.name;
  document.getElementById('crumbCategory').textContent = window.categoryNames[product.category];

  // Цены
  document.getElementById('productPrice').textContent = formatPrice(product.price);
  const oldEl = document.getElementById('productOld');
  if (product.oldPrice) {
    oldEl.textContent = formatPrice(product.oldPrice);
    oldEl.hidden = false;
  } else {
    oldEl.hidden = true;
  }

  // Характеристики
  const tbody = document.getElementById('specsTable');
  tbody.innerHTML = '';
  product.specs.forEach(([name, value]) => {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = name;
    const td = document.createElement('td');
    td.textContent = value;
    tr.appendChild(th);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });

  updateProductButtons();
}

// ===== Состояние кнопок на странице =====
function updateProductButtons() {
  const addBtn = document.getElementById('addCartBtn');
  const favBtn = document.getElementById('toggleFavBtn');

  // Корзина
  if (inCart(product.id)) {
    addBtn.textContent = 'Добавлено ✓';
    addBtn.disabled = true;
  } else {
    addBtn.textContent = 'В корзину';
    addBtn.disabled = false;
  }

  // Избранное
  if (isFavorite(product.id)) {
    favBtn.textContent = 'В избранном ♥';
    favBtn.classList.add('btn--fav-active');
  } else {
    favBtn.textContent = 'В избранное';
    favBtn.classList.remove('btn--fav-active');
  }
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
      updateProductButtons();
      showToast('Товар удалён из корзины');
    });
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
    item.innerHTML = `
      <div class="panel-item__media">${favMedia}</div>
      <div class="panel-item__body">
        <div class="panel-item__title">${p.name}</div>
        <div class="panel-item__price">${formatPrice(p.price)}</div>
      </div>
      <button class="panel-item__remove" data-remove-fav="${p.id}" title="Удалить">×</button>
    `;
    list.appendChild(item);
  });

  list.querySelectorAll('[data-remove-fav]').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleFavorite(Number(btn.dataset.removeFav));
      renderFavorites();
      updateProductButtons();
      updateCounters();
      showToast('Товар удалён из избранного');
    });
  });
}

// ===== Панели =====
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
  if (!document.querySelector('.panel.panel--open')) {
    document.getElementById('overlay').hidden = true;
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

// ===== Действия на странице товара =====
function setupProductActions() {
  document.getElementById('addCartBtn').addEventListener('click', () => {
    addToCart(product);
    updateCounters();
    updateProductButtons();
    showToast('Товар добавлен в корзину ✓');
  });

  document.getElementById('toggleFavBtn').addEventListener('click', () => {
    toggleFavorite(product.id);
    const isFav = isFavorite(product.id);
    updateProductButtons();
    updateCounters();
    renderFavorites();
    showToast(isFav ? 'Товар добавлен в избранное ♥' : 'Товар удалён из избранного');
  });

  // Поиск в шапке возвращает с запросом на главную
  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('searchInput').value;
    window.location.href = 'index.html?q=' + encodeURIComponent(q);
  });
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
    updateProductButtons();
    closePanel('cartPanel');
    showToast('Заказ оформлен! Спасибо за покупку 🎉');
  });
}

// ===== Инициализация =====
updateCounters();
updateAuthBtn();
renderProduct();
setupProductActions();
setupPanels();
setupCheckout();
renderFavorites();
renderCart();