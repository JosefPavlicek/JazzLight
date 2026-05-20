export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          <span className="brand-title">JazzLight</span>
          <span className="brand-subtitle">komorní hudba pro vaše akce</span>
        </a>
        <nav className="nav-links">
          <a href="#about">O kapele</a>
          <a href="#members">Členové</a>
          <a href="#repertoire">Co hrajeme</a>
          <a href="#concerts">Koncerty</a>
          <a href="#contact">Kontakt</a>
        </nav>
        <div className="lang-badge">CZ / EN</div>
      </div>
    </header>
  );
}
