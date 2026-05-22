"use client";

import { useState } from "react";
import type { Artist } from "@/types/site";
import type { Lang } from "@/lib/i18n";
import { ImageLightbox, type LightboxImage } from "@/components/ImageLightbox";

function ArtistCard({
  artist,
  lang,
  onOpenImage,
}: {
  artist: Artist;
  lang: Lang;
  onOpenImage: (image: LightboxImage) => void;
}) {
  const [index, setIndex] = useState(0);
  const photos = artist.photos || [];
  const photo = photos[index];
  const fallbackSrc = artist.id === "josef" ? "/img/josef.svg" : "/img/singer.svg";
  const src = photo?.base64 || fallbackSrc;

  return (
    <article className="member-card">
      <button
        className="member-photo-button"
        type="button"
        onClick={() => onOpenImage({ src, alt: artist.name })}
        aria-label={lang === "cs" ? "Zobrazit fotku" : "View photo"}
      >
        <img className="member-photo" src={src} alt={artist.name} />
      </button>

      {photos.length > 1 ? (
        <div className="photo-dots">
          {photos.map((item, itemIndex) => (
            <button
              key={item.id || itemIndex}
              type="button"
              className={itemIndex === index ? "active" : ""}
              onClick={() => setIndex(itemIndex)}
              aria-label={`Foto ${itemIndex + 1}`}
            />
          ))}
        </div>
      ) : null}

      <h3 className="member-name">{artist.name}</h3>
      <div className="member-role rich-text" dangerouslySetInnerHTML={{ __html: artist.role[lang] }} />
    </article>
  );
}

export function ArtistsSection({
  title,
  text,
  artists,
  lang,
}: {
  title: string;
  text: string;
  artists: Artist[];
  lang: Lang;
}) {
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  return (
    <section className="section" id="members">
      <div className="container">
        <h2 className="section-heading">{title}</h2>
        <p className="section-text">{text}</p>

        <div className="members-grid">
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              lang={lang}
              onOpenImage={setLightboxImage}
            />
          ))}
        </div>
      </div>

      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  );
}
