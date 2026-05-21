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
  const [lang, setLang] = useState<Lang>("cs");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLang(getInitialLang());
  }, []);

  const safeLang: Lang = mounted ? lang : "cs";
  const t = dictionary[safeLang];

  function toggleLang() {
    setLang((current) => {
      const next = current === "cs" ? "en" : "cs";
      window.localStorage.setItem("jazzlight-lang", next);
      return next;
    });
  }

  return (
    <div className="site-shell">
      <Header lang={safeLang} t={t} onToggleLang={toggleLang} />
      <main>
        <Hero t={t} contact={content.contact} lang={safeLang} />
        <AboutSection title={t.aboutTitle} html={content.about[safeLang]} />
        <ArtistsSection title={t.membersTitle} text={t.membersText} artists={content.artists} lang={safeLang} />
        <RepertoireSection title={t.repertoireTitle} html={content.repertoire[safeLang]} />
        <ConcertsSection concerts={concerts} lang={safeLang} t={t} />
        <ContactSection t={t} contact={content.contact} lang={safeLang} />
      </main>
      <Footer t={t} />
    </div>
  );
}
