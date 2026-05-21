import type { Dictionary, Lang } from "@/lib/i18n";

type HeaderProps = {
  lang: Lang;
  t: Dictionary;
  onToggleLang: () => void;
};

export function Header({ lang, t, onToggleLang }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          <span className="brand-title">JazzLight</span>
          <span className="brand-subtitle">{t.brandSubtitle}</span>
        </a>

        <nav className="nav-links">
          <a href="#about">{t.navAbout}</a>
          <a href="#members">{t.navMembers}</a>
          <a href="#repertoire">{t.navRepertoire}</a>
          <a href="#concerts">{t.navConcerts}</a>
          <a href="#contact">{t.navContact}</a>
        </nav>

        <button className="lang-badge lang-button" type="button" onClick={onToggleLang}>
          {t.langSwitchLabel}
        </button>
      </div>
    </header>
  );
}
