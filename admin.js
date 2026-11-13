// ===== Скрипт админ-панели HNS =====
// Общие данные, избранное, корзина и утилиты — в products-data.js.
// Доступ к панели — по логину/паролю администратора (window.ADMIN_LOGIN/ADMIN_PASS).
// Изменения товаров сохраняются в localStorage и применяются по всему сайту.

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
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
}

// ===== Панель избранного =====
function renderFavorites() {
  const list = document.getElementById('favoritesList');
  list.innerHTML = '';
  list.className = 'panel__body';
  const products = window.getProducts();

  if (window.favoritesState.length === 0) {
    list.classList.add('panel__body--empty');
    list.innerHTML = '<span>В избранном пока пусто</span>';
    return;
  }

  window.favoritesState.forEach(id => {
    const p = products.find(x => x.id === id);
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
        <div class="panel-item__price">${window.formatPrice(p.price)}</div>
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
  const products = window.getProducts();

  if (window.cartState.length === 0) {
    list.classList.add('panel__body--empty');
    list.innerHTML = '<span>Корзина пуста</span>';
    totalEl.textContent = '0 ₽';
    return;
  }

  let total = 0;
  window.cartState.forEach(item => {
    total += item.price * item.quantity;
    const p = products.find(x => x.id === item.id);
    const media = p && p.image
      ? `<img src="${p.image}" alt="${p.name}" class="panel-item__img">`
      : item.emoji;
    const el = document.createElement('div');
    el.className = 'panel-item';
    el.innerHTML = `
      <div class="panel-item__media">${media}</div>
      <div class="panel-item__body">
        <div class="panel-item__title">${item.name}</div>
        <div class="panel-item__price">${window.formatPrice(item.price)} × ${item.quantity}</div>
      </div>
      <button class="panel-item__remove" data-remove-cart="${item.id}" title="Удалить">×</button>
    `;
    list.appendChild(el);
  });

  totalEl.textContent = window.formatPrice(total);

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

// ============================================================
// ===== Аутентификация администратора =====
// ============================================================
// Сессия админа хранится отдельно от сессии пользователя (hns_admin_session),
// чтобы вход администратора не смешивался с обычным аккаунтом магазина.

function isAdminLoggedIn() {
  return localStorage.getItem('hns_admin_session') === '1';
}

function requireAdmin() {
  const loginEl = document.getElementById('adminLogin');
  const panelEl = document.getElementById('adminPanel');
  const loggedIn = isAdminLoggedIn();
  loginEl.hidden = loggedIn;
  panelEl.hidden = !loggedIn;
  if (loggedIn) renderProductsTable();
}

function setupAdminAuth() {
  document.getElementById('adminLoginBtn').addEventListener('click', () => {
    const login = document.getElementById('adminLoginInput').value.trim();
    const pass = document.getElementById('adminPassInput').value;

    if (login !== window.ADMIN_LOGIN || pass !== window.ADMIN_PASS) {
      showToast('Неверный логин или пароль администратора');
      return;
    }
    localStorage.setItem('hns_admin_session', '1');
    requireAdmin();
    showToast('Добро пожаловать, администратор!');
  });

  document.getElementById('adminLogout').addEventListener('click', () => {
    localStorage.removeItem('hns_admin_session');
    document.getElementById('adminLoginInput').value = '';
    document.getElementById('adminPassInput').value = '';
    requireAdmin();
    showToast('Вы вышли из админ-панели');
  });
}

// ============================================================
// ===== Управление товарами (CRUD) =====
// ============================================================

// Рендер таблицы товаров
function renderProductsTable() {
  const products = window.getProducts();
  const tbody = document.getElementById('adminTableBody');
  const emptyEl = document.getElementById('adminEmpty');
  tbody.innerHTML = '';

  emptyEl.hidden = products.length > 0;

  products.forEach(p => {
    const tr = document.createElement('tr');
    const icon = p.image
      ? `<img src="${p.image}" alt="${p.name}" class="admin-tbl__img">`
      : (p.emoji || '❓');
    tr.innerHTML = `
      <td class="admin-tbl__id">${p.id}</td>
      <td>
        <div class="admin-tbl__name">
          <span class="admin-tbl__icon">${icon}</span>
          <span>${p.name}</span>
        </div>
      </td>
      <td>${window.categoryNames[p.category] || p.category}</td>
      <td>${window.formatPrice(p.price)}</td>
      <td>
        <div class="admin-tbl__actions">
          <button class="btn btn--ghost btn--sm" data-edit="${p.id}">Редактировать</button>
          <button class="btn btn--danger btn--sm" data-del="${p.id}">Удалить</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Обработчики (делегирование)
  tbody.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => openEditForm(Number(btn.dataset.edit)));
  });
  tbody.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(Number(btn.dataset.del)));
  });
}

// Показать форму добавления товара
function openAddForm() {
  document.getElementById('adminFormTitle').textContent = 'Добавление товара';
  document.getElementById('pId').value = '';
  ['pName', 'pPrice', 'pOldPrice', 'pEmoji', 'pImage', 'pDescription'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('pCategory').value = 'smartphones';
  document.getElementById('adminForm').hidden = false;
}

// Показать форму редактирования товара
function openEditForm(id) {
  const p = window.getProducts().find(x => x.id === id);
  if (!p) return;
  document.getElementById('adminFormTitle').textContent = 'Редактирование товара #' + p.id;
  document.getElementById('pId').value = p.id;
  document.getElementById('pName').value = p.name;
  document.getElementById('pCategory').value = p.category;
  document.getElementById('pPrice').value = p.price;
  document.getElementById('pOldPrice').value = p.oldPrice || '';
  document.getElementById('pEmoji').value = p.emoji || '';
  document.getElementById('pImage').value = p.image || '';
  document.getElementById('pDescription').value = p.description || '';
  document.getElementById('adminForm').hidden = false;
  document.getElementById('adminForm').scrollIntoView({ behavior: 'smooth' });
}

// Собрать товар из формы и сохранить
function submitProductForm() {
  const products = window.getProducts();
  const idField = Number(document.getElementById('pId').value) || 0;
  const name = document.getElementById('pName').value.trim();
  const category = document.getElementById('pCategory').value;
  const price = window.fmtNumberInput(document.getElementById('pPrice').value);
  const oldRaw = document.getElementById('pOldPrice').value.trim();
  const oldPrice = oldRaw ? window.fmtNumberInput(oldRaw) : 0;
  const emoji = document.getElementById('pEmoji').value.trim();
  const image = document.getElementById('pImage').value.trim();
  const description = document.getElementById('pDescription').value.trim();

  if (!name) { showToast('Укажите название товара'); return; }
  if (!price) { showToast('Укажите цену товара'); return; }

  if (!idField) {
    // Добавление нового товара
    const newId = products.length ? Math.max(...products.map(x => x.id)) + 1 : 1;
    products.push({ id: newId, name, category, price, oldPrice, emoji, image, description, specs: [] });
    window.saveProducts(products);
    showToast('Товар добавлен ✓');
  } else {
    // Редактирование существующего
    const idx = products.findIndex(x => x.id === idField);
    if (idx >= 0) {
      products[idx] = Object.assign({}, products[idx], {
        name, category, price, oldPrice, emoji, image, description
      });
      window.saveProducts(products);
      showToast('Товар обновлён ✓');
    }
  }

  document.getElementById('adminForm').hidden = true;
  renderProductsTable();
}

// Удаление товара с подтверждением
function deleteProduct(id) {
  const products = window.getProducts();
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (!confirm('Удалить товар «' + p.name + '» из каталога?')) return;

  const remaining = products.filter(x => x.id !== id);
  window.saveProducts(remaining);
  window.cleanCartAndFavByIds([id]);
  updateCounters();
  renderProductsTable();
  showToast('Товар удалён');
}

// Сброс каталога к базовому списку
function resetCatalog() {
  if (!confirm('Сбросить каталог к исходному набору товаров? Все правки будут потеряны.')) return;
  localStorage.removeItem('hns_products');
  window.products = window.loadProducts();
  window.cleanCartAndFavByIds([]);
  updateCounters();
  renderProductsTable();
  showToast('Каталог сброшен к исходному виду');
}

function setupAdminCrud() {
  document.getElementById('adminAddBtn').addEventListener('click', () => {
    openAddForm();
    document.getElementById('adminForm').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('adminResetBtn').addEventListener('click', resetCatalog);
  document.getElementById('pSave').addEventListener('click', submitProductForm);
  document.getElementById('pCancel').addEventListener('click', () => {
    document.getElementById('adminForm').hidden = true;
  });
}

// ===== Инициализация =====
updateCounters();
updateAuthBtn();
setupSearch();
setupPanels();
setupCheckout();
setupAdminAuth();
setupAdminCrud();
renderFavorites();
renderCart();
requireAdmin();
// Если админ уже вошёл — показываем таблицу корректно
if (isAdminLoggedIn()) renderProductsTable();