// ===== Скрипт страницы «Подарочные сертификаты» HNS =====
// Данные, избранное, корзина и утилиты — в products-data.js

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

// ===== Поиск: перенаправляет на страницу каталога =====
function setupSearch() {
  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('searchInput').value;
    window.location.href = 'catalog.html?q=' + encodeURIComponent(q);
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
    closePanel('cartPanel');
    showToast('Заказ оформлен! Спасибо за покупку 🎉');
  });
}

// ===== Выбор номинала =====
let selectedNominal = 0;

function formatNominal(v) {
  return v.toLocaleString('ru-RU') + ' ₽';
}

function setupGiftCards() {
  const summary = document.getElementById('giftSummary');
  document.querySelectorAll('.gift-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.gift-card').forEach(c => c.classList.remove('gift-card--selected'));
      card.classList.add('gift-card--selected');
      selectedNominal = Number(card.dataset.price);
      summary.textContent = formatNominal(selectedNominal);
    });
  });
}

// ===== Отправка формы сертификата =====
function setupGiftForm() {
  document.getElementById('giftSubmit').addEventListener('click', () => {
    const recipient = document.getElementById('recipient').value.trim();
    const from = document.getElementById('from').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!selectedNominal) {
      showToast('Выберите номинал сертификата');
      return;
    }
    if (!recipient) {
      showToast('Укажите, кому дарите сертификат');
      document.getElementById('recipient').focus();
      return;
    }
    if (!from) {
      showToast('Укажите, от кого сертификат');
      document.getElementById('from').focus();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Введите корректный email');
      document.getElementById('email').focus();
      return;
    }

    // Нормировка полей формы
    showToast('🎉 Сертификат на ' + formatNominal(selectedNominal) + ' будет отправлен на ' + email);
  });
}

// ===== Инициализация =====
updateCounters();
updateAuthBtn();
setupSearch();
setupPanels();
setupCheckout();
setupGiftCards();
setupGiftForm();
renderFavorites();
renderCart();