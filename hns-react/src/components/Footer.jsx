import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <Link to="/" className="logo">H<span className="logo__dot">N</span>S</Link>
          <p className="footer__note">© 2026 HNS. Все права защищены.</p>
        </div>
        <ul className="footer__links">
          <li><a href="#">Доставка и оплата</a></li>
          <li><Link to="/support">Гарантия</Link></li>
          <li><a href="#">Контакты</a></li>
        </ul>
      </div>
    </footer>
  )
}