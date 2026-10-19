export default function Header() {
  return <header className="header">
    <div className="header-brand"><a className="brand" href="#">BRUTAL CUT</a><span className="brand-description">Барбершоп в центре города</span></div>
    <nav className="navigation" aria-label="Основная навигация">
      <a className="navigation-link" href="#">Услуги</a>
      <a className="navigation-link" href="#">Мастера</a>
      <a className="navigation-link" href="#">Контакты</a>
    </nav>
  </header>;
}
