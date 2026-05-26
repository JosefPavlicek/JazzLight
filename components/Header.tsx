import type { Dictionary, Lang } from "@/lib/i18n";
import Image from "next/image";

const INSTAGRAM_URL = "https://www.instagram.com/";

export function Header({ lang, t, onToggleLang }: { lang: Lang; t: Dictionary; onToggleLang: () => void }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          <Image
            src="/img/logo-jazzlight.png"
            alt="JazzLight"
            width={400}
            height={450}
            priority
            className="brand-logo"
          />
          <span className="brand-subtitle">{t.brandSubtitle}</span>
        </a>

        <nav className="nav-links">
          <a href="#about">{t.navAbout}</a>
          <a href="#members">{t.navMembers}</a>
          <a href="#repertoire">{t.navRepertoire}</a>
          <a href="#concerts">{t.navConcerts}</a>
          <a href="#contact">{t.navContact}</a>
        </nav>

        <div className="header-actions">
          <a className="instagram-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={t.instagramLabel} title={t.instagramLabel}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" />
            </svg>
          </a>
          <button
            className="lang-badge lang-button lang-button-with-flag"
            type="button"
            onClick={onToggleLang}
            title={t.langSwitchTooltip}
            aria-label={t.langSwitchTooltip}
          >
            <span className="lang-flag" aria-hidden="true">{t.langSwitchFlag}</span>
            <span>{t.langSwitchLabel}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
