import type { Dictionary } from "@/lib/i18n";

export function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© 2026 JazzLight</span>
        <span>{t.footerText}</span>
      </div>
    </footer>
  );
}
