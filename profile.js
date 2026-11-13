// ===== Скрипт страницы «Профиль» HNS =====
// Система регистрации и входа (демо): данные хранятся в localStorage,
// без сервера — подходит для учебного проекта и локального запуска.
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

// ============================================================
// ===== Система регистрации и входа =====
// ============================================================

// Хранилище пользователей: { login: { name, login, pass, createdAt } }
function getUsers() {
  try { return JSON.parse(localStorage.getItem('hns_users') || '{}'); }
  catch (e) { return {}; }
}
function saveUsers(users) {
  localStorage.setItem('hns_users', JSON.stringify(users));
}
function getSession() {
  return localStorage.getItem('hns_session'); // логин вошедшего пользователя
}
function setSession(login) {
  if (login) localStorage.setItem('hns_session', login);
  else localStorage.removeItem('hns_session');
}

// Приведение логина к единому виду (без учета регистра)
function normalizeLogin(v) {
  return (v || '').trim().toLowerCase();
}

// Переключение форм «Вход» / «Регистрация»
function switchAuthMode(mode) {
  const isLogin = mode === 'login';
  document.getElementById('authTabs').querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.toggle('auth-tab--active', tab.dataset.mode === mode);
  });
  document.getElementById('loginForm').hidden = !isLogin;
  document.getElementById('registerForm').hidden = isLogin;
  document.getElementById('authTitle').textContent = isLogin ? 'Вход' : 'Регистрация';
}

// Текущий пользователь из сессии
function currentUser() {
  const login = getSession();
  if (!login) return null;
  return getUsers()[normalizeLogin(login)] || null;
}

// Обновление интерфейса профиля в зависимости от сессии
function renderProfile() {
  const user = currentUser();
  const guestView = document.getElementById('guestView');
  const profileView = document.getElementById('profileView');

  if (!user) {
    guestView.hidden = false;
    profileView.hidden = true;
    return;
  }

  guestView.hidden = true;
  profileView.hidden = false;

  const initials = (user.name || '?').trim().charAt(0).toUpperCase();
  document.getElementById('profileInitials').textContent = initials;
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.login;

  const registered = new Date(user.createdAt).toLocaleDateString('ru-RU');
  document.getElementById('profileSince').textContent = registered;

  document.getElementById('profileFavCount').textContent = window.favoritesState.length;
  document.getElementById('profileCartCount').textContent =
    window.cartState.reduce((s, i) => s + i.quantity, 0);
}

// Регистрация
function setupRegister() {
  document.getElementById('regSubmit').addEventListener('click', () => {
    const name = document.getElementById('regName').value.trim();
    const login = normalizeLogin(document.getElementById('regLogin').value);
    const pass = document.getElementById('regPass').value;
    const confirm = document.getElementById('regConfirm').value;

    if (!name) { showToast('Укажите ваше имя'); document.getElementById('regName').focus(); return; }
    if (!login) { showToast('Придумайте логин'); document.getElementById('regLogin').focus(); return; }
    if (!/^[a-z0-9._-]+$/.test(login)) { showToast('Логин может содержать только латинские буквы, цифры и символы . _ -'); document.getElementById('regLogin').focus(); return; }
    if (login === window.ADMIN_LOGIN) { showToast('Этот логин недоступен'); document.getElementById('regLogin').focus(); return; }
    if (pass.length < 6) { showToast('Пароль должен быть не короче 6 символов'); document.getElementById('regPass').focus(); return; }
    if (pass !== confirm) { showToast('Пароли не совпадают'); document.getElementById('regConfirm').focus(); return; }

    const users = getUsers();
    if (users[login]) {
      showToast('Пользователь с таким логином уже зарегистрирован');
      document.getElementById('regLogin').focus();
      return;
    }

    users[login] = { name, login, pass, createdAt: Date.now() };
    saveUsers(users);
    setSession(login);

    showToast('Добро пожаловать, ' + name + '! 🎉');
    renderProfile();
  });
}

// Вход
function setupLogin() {
  document.getElementById('loginSubmit').addEventListener('click', () => {
    const login = normalizeLogin(document.getElementById('loginUser').value);
    const pass = document.getElementById('loginPass').value;

    if (!login) { showToast('Введите логин'); document.getElementById('loginUser').focus(); return; }
    if (!pass) { showToast('Введите пароль'); document.getElementById('loginPass').focus(); return; }

    const user = getUsers()[login];
    if (!user || user.pass !== pass) {
      showToast('Неверный логин или пароль');
      return;
    }

    setSession(login);
    showToast('С возвращением, ' + user.name + '!');
    renderProfile();
  });
}

// Переключение вкладок «Вход» / «Регистрация»
function setupAuthTabs() {
  document.getElementById('authTabs').querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAuthMode(tab.dataset.mode));
  });
}

// Выход
function setupLogout() {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    setSession(null);
    showToast('Вы вышли из аккаунта');
    renderProfile();
    switchAuthMode('login');
    document.getElementById('loginForm').querySelectorAll('input').forEach(i => i.value = '');
    document.getElementById('registerForm').querySelectorAll('input').forEach(i => i.value = '');
  });
}

// ===== Инициализация =====
updateCounters();
updateAuthBtn();
setupSearch();
setupPanels();
setupCheckout();
setupRegister();
setupLogin();
setupAuthTabs();
setupLogout();
renderProfile();