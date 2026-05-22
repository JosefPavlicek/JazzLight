"use client";

import Image from "next/image";
import { useState } from "react";
import type { Dictionary, Lang } from "@/lib/i18n";
import type { ContactContent, SiteImage } from "@/types/site";
import { ImageLightbox, type LightboxImage } from "@/components/ImageLightbox";

export function Hero({ t, contact, lang, heroImage }: { t: Dictionary; contact: ContactContent; lang: Lang; heroImage?: SiteImage | null }) {
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const fallbackImage = "/img/banner.svg";
  const imageSrc = heroImage?.base64 || fallbackImage;

  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">{t.heroEyebrow}</span>
          <h1 className="hero-title">{t.heroTitle}</h1>
          <div className="hero-text rich-text" dangerouslySetInnerHTML={{ __html: contact.description[lang] || `<p>${t.heroText}</p>` }} />
          <div className="hero-contact-mini">
            <strong>{contact.name}</strong><br />
            <a href={`mailto:${contact.email}`}>{contact.email}</a><br />
            <a href={`tel:${contact.phone.replaceAll(" ", "")}`}>{contact.phone}</a>
          </div>
          <div className="button-row">
            <a className="button button-primary" href="#concerts">{t.heroConcerts}</a>
            <a className="button button-secondary" href="#contact">{t.heroContact}</a>
          </div>
        </div>
        <div className="hero-card">
          <button type="button" className="hero-image-button" onClick={() => setLightboxImage({ src: imageSrc, alt: "JazzLight" })} aria-label={t.heroImageDetail} title={t.heroImageDetail}>
            {heroImage?.base64 ? (
              <img src={heroImage.base64} alt="JazzLight" />
            ) : (
              <Image src={fallbackImage} alt="JazzLight banner" width={1200} height={900} priority />
            )}
          </button>
        </div>
      </div>
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  );
}
