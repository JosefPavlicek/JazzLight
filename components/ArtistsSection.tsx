"use client";

import { useState } from "react";
import type { Artist } from "@/types/site";
import type { Lang } from "@/lib/i18n";

function ArtistCard({ artist, lang }: { artist: Artist; lang: Lang }) {
  const [index, setIndex] = useState(0);
  const photos = artist.photos || [];
  const photo = photos[index];
  return (
    <article className="member-card">
      {photo ? <img className="member-photo" src={photo.base64} alt={artist.name} /> : <img className="member-photo" src={artist.id === "josef" ? "/img/josef.svg" : "/img/singer.svg"} alt={artist.name} />}
      {photos.length > 1 ? <div className="photo-dots">{photos.map((item, itemIndex) => <button key={item.id || itemIndex} type="button" className={itemIndex === index ? "active" : ""} onClick={() => setIndex(itemIndex)} aria-label={`Foto ${itemIndex + 1}`} />)}</div> : null}
      <h3 className="member-name">{artist.name}</h3>
      <div className="member-role rich-text" dangerouslySetInnerHTML={{ __html: artist.role[lang] }} />
    </article>
  );
}
export function ArtistsSection({ title, text, artists, lang }: { title: string; text: string; artists: Artist[]; lang: Lang }) {
  return <section className="section" id="members"><div className="container"><h2 className="section-heading">{title}</h2><p className="section-text">{text}</p><div className="members-grid">{artists.map((artist) => <ArtistCard key={artist.id} artist={artist} lang={lang} />)}</div></div></section>;
}
