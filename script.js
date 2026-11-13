// ===== Скрипт главной страницы HNS =====
// Данные, избранное, корзина и утилиты — в products-data.js (window.products и др.)

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
  const btn = document.getElementById('checkoutBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
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

// ===== Навигационные кнопки (заглушки) =====
function setupNavcards() {
  document.querySelectorAll('[data-placeholder]').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.querySelector('.navcard__title').textContent;
      showToast('Раздел "' + title + '" в разработке');
    });
  });
}

// ===== Сплэш-анимация при загрузке =====
function runSplash() {
  const splash = document.getElementById('splash');
  // Показываем сплэш ~1.5 с, затем плавно скрываем
  setTimeout(() => {
    splash.classList.add('splash--done');
    // освобождаем DOM после скрытия
    setTimeout(() => {
      splash.remove();
    }, 650);
  }, 1500);
}

// ===== Инициализация =====
updateCounters();
setupSearch();
setupPanels();
setupCheckout();
setupReveal();
setupNavcards();
renderFavorites();
renderCart();
runSplash();