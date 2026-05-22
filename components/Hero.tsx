import Image from "next/image";
import type { Dictionary, Lang } from "@/lib/i18n";
import type { ContactContent } from "@/types/site";

export function Hero({
  t,
  contact,
  lang,
}: {
  t: Dictionary;
  contact: ContactContent;
  lang: Lang;
}) {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">{t.heroEyebrow}</span>
          <h1 className="hero-title">{t.heroTitle}</h1>

          <div
            className="hero-text rich-text"
            dangerouslySetInnerHTML={{
              __html: contact.description[lang] || `<p>${t.heroText}</p>`,
            }}
          />

          <div className="hero-contact-mini">
            <strong>{contact.name}</strong>
            <br />
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <br />
            <a href={`tel:${contact.phone.replaceAll(" ", "")}`}>{contact.phone}</a>
          </div>

          <div className="button-row">
            <a className="button button-primary" href="#concerts">
              {t.heroConcerts}
            </a>
            <a className="button button-secondary" href="#contact">
              {t.heroContact}
            </a>
          </div>
        </div>

        <div className="hero-card">
          <Image
            src="/img/banner.svg"
            alt="JazzLight banner"
            width={1200}
            height={900}
            priority
          />
        </div>
      </div>
    </section>
  );
}
