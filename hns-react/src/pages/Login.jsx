import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Login() {
  const { login, register } = useStore()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')

  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')

  const [regName, setRegName] = useState('')
  const [regLogin, setRegLogin] = useState('')
  const [regPass, setRegPass] = useState('')
  const [regConfirm, setRegConfirm] = useState('')

  function submitLogin(e) {
    e.preventDefault()
    if (!loginUser) { alert('Введите логин'); return }
    if (!loginPass) { alert('Введите пароль'); return }
    if (login(loginUser, loginPass)) navigate('/profile')
  }

  function submitRegister(e) {
    e.preventDefault()
    if (!regName) { alert('Укажите имя'); return }
    if (!regLogin) { alert('Придумайте логин'); return }
    if (!/^[a-z0-9._-]+$/.test(regLogin)) { alert('Логин может содержать только латинские буквы, цифры и символы . _ -'); return }
    if (regPass.length < 6) { alert('Пароль должен быть не короче 6 символов'); return }
    if (regPass !== regConfirm) { alert('Пароли не совпадают'); return }
    if (register(regName, regLogin, regPass)) navigate('/profile')
  }

  return (
    <>
      <nav className="crumb">
        <div className="container">
          <a href="/">Главная</a> <span>/</span> <span>{mode === 'login' ? 'Вход' : 'Регистрация'}</span>
        </div>
      </nav>

      <section className="profile">
        <div className="container">
          <div className="auth">
            <div className="auth__box">
              <div className="auth__tabs">
                <button className={'auth-tab' + (mode === 'login' ? ' auth-tab--active' : '')} onClick={() => setMode('login')}>Вход</button>
                <button className={'auth-tab' + (mode === 'register' ? ' auth-tab--active' : '')} onClick={() => setMode('register')}>Регистрация</button>
              </div>

              {mode === 'login' ? (
                <form className="auth__form" onSubmit={submitLogin}>
                  <h2 className="auth__title">Вход</h2>
                  <label className="field">
                    <span className="field__label">Логин</span>
                    <input type="text" className="field__input" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} placeholder="Ваш логин" />
                  </label>
                  <label className="field">
                    <span className="field__label">Пароль</span>
                    <input type="password" className="field__input" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="••••••••" />
                  </label>
                  <button type="submit" className="btn btn--primary auth__submit">Войти</button>
                </form>
              ) : (
                <form className="auth__form" onSubmit={submitRegister}>
                  <h2 className="auth__title">Регистрация</h2>
                  <label className="field">
                    <span className="field__label">Имя *</span>
                    <input type="text" className="field__input" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Иван" />
                  </label>
                  <label className="field">
                    <span className="field__label">Логин *</span>
                    <input type="text" className="field__input" value={regLogin} onChange={(e) => setRegLogin(e.target.value)} placeholder="Придумайте логин" />
                  </label>
                  <label className="field">
                    <span className="field__label">Пароль *</span>
                    <input type="password" className="field__input" value={regPass} onChange={(e) => setRegPass(e.target.value)} placeholder="Не короче 6 символов" />
                  </label>
                  <label className="field">
                    <span className="field__label">Повторите пароль *</span>
                    <input type="password" className="field__input" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} placeholder="Повторите пароль" />
                  </label>
                  <button type="submit" className="btn btn--primary auth__submit">Создать аккаунт</button>
                </form>
              )}

              <div className="auth__admin-link">
                <p className="auth__admin-note">Администратор? </p>
                <a href="#/admin" onClick={(e) => { e.preventDefault(); window.location.hash = '#/admin' }}>Вход для администратора</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}