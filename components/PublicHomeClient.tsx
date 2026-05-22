"use client";

import { useEffect, useState } from "react";
import type { Concert } from "@/types/concert";
import type { SiteContent } from "@/types/site";
import { dictionary, type Lang } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { ArtistsSection } from "@/components/ArtistsSection";
import { RepertoireSection } from "@/components/RepertoireSection";
import { ConcertsSection } from "@/components/ConcertsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

type Props = {
  content: SiteContent;
  concerts: Concert[];
};

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "cs";

  const stored = window.localStorage.getItem("jazzlight-lang");
  if (stored === "en" || stored === "cs") return stored;

  const browserLang = window.navigator.language.toLowerCase();
  return browserLang.startsWith("en") ? "en" : "cs";
}

export function PublicHomeClient({ content, concerts }: Props) {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Lang>("cs");

  useEffect(() => {
    setLang(getInitialLang());
    setMounted(true);
  }, []);

  /*
    Server render a první klientský render musí být identické.
    Proto do mountu vykreslíme jen stabilní shell bez dynamického jazyka,
    WYSIWYG HTML a carouselů. Skutečný web se vykreslí až po mountu klienta.
  */
  if (!mounted) {
    return (
      <div className="site-shell">
        <header className="site-header">
          <div className="container header-inner">
            <a href="#top" className="brand">
              <span className="brand-title">JazzLight</span>
              <span className="brand-subtitle">komorní hudba pro vaše akce</span>
            </a>
          </div>
        </header>
      </div>
    );
  }

  const t = dictionary[lang];

  function toggleLang() {
    setLang((current) => {
      const next = current === "cs" ? "en" : "cs";
      window.localStorage.setItem("jazzlight-lang", next);
      return next;
    });
  }

  return (
    <div className="site-shell">
      <Header lang={lang} t={t} onToggleLang={toggleLang} />
      <main>
        <Hero t={t} contact={content.contact} lang={lang} />
        <AboutSection title={t.aboutTitle} html={content.about[lang]} />
        <ArtistsSection title={t.membersTitle} text={t.membersText} artists={content.artists} lang={lang} />
        <RepertoireSection title={t.repertoireTitle} html={content.repertoire[lang]} />
        <ConcertsSection concerts={concerts} lang={lang} t={t} />
        <ContactSection t={t} contact={content.contact} lang={lang} />
      </main>
      <Footer t={t} />
    </div>
  );
}
