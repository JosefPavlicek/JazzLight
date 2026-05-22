import type { Dictionary } from "@/lib/i18n";

export function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="footer">
      <div className="container footer-inner footer-inner-rich">
        <span>{t.footerText}</span>
        <nav className="footer-links" aria-label="Related links">
          <a href="https://www.aakordy.cz" target="_blank" rel="noopener noreferrer">{t.footerMusicLessons}: www.aakordy.cz</a>
          <a href="https://www.metronom4u.cz" target="_blank" rel="noopener noreferrer">{t.footerMetronome}: www.metronom4u.cz</a>
        </nav>
      </div>
    </footer>
  );
}
