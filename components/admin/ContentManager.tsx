"use client";

import { useState } from "react";
import type { Artist, SiteContent } from "@/types/site";
import { compressImage } from "@/components/admin/imageTools";
import { LocalizedEditor } from "@/components/admin/LocalizedEditor";

export function ContentManager({
  content,
  onSave,
}: {
  content: SiteContent;
  onSave: (content: SiteContent) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState<SiteContent>(content);
  const [status, setStatus] = useState("");

  async function save() {
    const ok = await onSave(draft);
    setStatus(ok ? "Obsah uložen." : "Obsah se nepodařilo uložit.");
  }

  function updateArtist(id: string, update: Partial<Artist>) {
    setDraft((current) => ({
      ...current,
      artists: current.artists.map((artist) =>
        artist.id === id ? { ...artist, ...update } : artist
      ),
    }));
  }

  function removeArtist(id: string) {
    setDraft((current) => ({
      ...current,
      artists: current.artists.filter((artist) => artist.id !== id),
    }));
  }

  function addArtist() {
    setDraft((current) => ({
      ...current,
      artists: [
        ...current.artists,
        {
          id: crypto.randomUUID(),
          name: "Nový interpret",
          role: { cs: "role", en: "role" },
          photos: [],
        },
      ],
    }));
  }

  async function addArtistPhotos(artistId: string, files: FileList | null) {
    if (!files?.length) return;
    setStatus("Zmenšuji fotky…");
    const photos = await Promise.all(Array.from(files).map(compressImage));

    setDraft((current) => ({
      ...current,
      artists: current.artists.map((artist) =>
        artist.id === artistId
          ? { ...artist, photos: [...artist.photos, ...photos] }
          : artist
      ),
    }));
    setStatus("Fotky připravené.");
  }

  async function setHeroImage(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setStatus("Zmenšuji hero obrázek…");
    const image = await compressImage(file);

    setDraft((current) => ({
      ...current,
      heroImage: image,
    }));

    setStatus("Hero obrázek připravený.");
  }

  return (
    <section className="admin-card admin-card-spaced">
      <h2>Obsah webu</h2>

      <LocalizedEditor
        label="O kapele"
        value={draft.about}
        onChange={(about) => setDraft((current) => ({ ...current, about }))}
      />

      <LocalizedEditor
        label="Co hrajeme"
        value={draft.repertoire}
        onChange={(repertoire) => setDraft((current) => ({ ...current, repertoire }))}
      />

      <div className="admin-subsection">
        <h3>Kontakt / hero text / SEO</h3>
        <div className="admin-form">
          <label>
            Jméno kontaktu
            <input
              value={draft.contact.name}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  contact: { ...current.contact, name: event.target.value },
                }))
              }
            />
          </label>
          <label>
            E-mail
            <input
              value={draft.contact.email}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  contact: { ...current.contact, email: event.target.value },
                }))
              }
            />
          </label>
          <label>
            Telefon
            <input
              value={draft.contact.phone}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  contact: { ...current.contact, phone: event.target.value },
                }))
              }
            />
          </label>
          <label>
            SEO keywords CZ
            <input
              value={draft.seo?.keywords?.cs || ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  seo: {
                    keywords: {
                      cs: event.target.value,
                      en: current.seo?.keywords?.en || "",
                    },
                  },
                }))
              }
              placeholder="jazz, živá hudba, Praha..."
            />
          </label>
          <label>
            SEO keywords EN
            <input
              value={draft.seo?.keywords?.en || ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  seo: {
                    keywords: {
                      cs: current.seo?.keywords?.cs || "",
                      en: event.target.value,
                    },
                  },
                }))
              }
              placeholder="jazz, live music, Prague..."
            />
          </label>
          <label>
            Hero obrázek
            <input type="file" accept="image/*" onChange={(event) => setHeroImage(event.target.files)} />
          </label>
        </div>

        {draft.heroImage?.base64 ? (
          <div className="image-preview-grid hero-image-preview">
            <div className="image-preview">
              <img src={draft.heroImage.base64} alt={draft.heroImage.name} />
              <small>
                {draft.heroImage.name}<br />
                {Math.round(draft.heroImage.sizeBytes / 1024)} kB
              </small>
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    heroImage: null,
                  }))
                }
              >
                Odebrat hero obrázek
              </button>
            </div>
          </div>
        ) : null}

        <LocalizedEditor
          label="Popis kontaktu / hero text"
          value={draft.contact.description}
          onChange={(description) =>
            setDraft((current) => ({
              ...current,
              contact: { ...current.contact, description },
            }))
          }
        />
      </div>

      <div className="admin-subsection">
        <div className="admin-section-row">
          <h3>Umělci</h3>
          <button className="button button-secondary" type="button" onClick={addArtist}>
            Přidat umělce
          </button>
        </div>

        <div className="artist-admin-list">
          {draft.artists.map((artist) => (
            <article key={artist.id} className="artist-admin-card">
              <label>
                Jméno
                <input
                  value={artist.name}
                  onChange={(event) => updateArtist(artist.id, { name: event.target.value })}
                />
              </label>

              <LocalizedEditor
                label="Role"
                value={artist.role}
                onChange={(role) => updateArtist(artist.id, { role })}
              />

              <label>
                Fotky interpreta
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => addArtistPhotos(artist.id, event.target.files)}
                />
              </label>

              {artist.photos.length ? (
                <div className="image-preview-grid">
                  {artist.photos.map((photo) => (
                    <div key={photo.id} className="image-preview">
                      <img src={photo.base64} alt={photo.name} />
                      <small>{photo.name}<br />{Math.round(photo.sizeBytes / 1024)} kB</small>
                      <button
                        type="button"
                        onClick={() =>
                          updateArtist(artist.id, {
                            photos: artist.photos.filter((item) => item.id !== photo.id),
                          })
                        }
                      >
                        Odebrat
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <button className="button button-secondary" type="button" onClick={() => removeArtist(artist.id)}>
                Smazat umělce
              </button>
            </article>
          ))}
        </div>
      </div>

      <button className="button button-primary admin-save-main" type="button" onClick={save}>
        Uložit obsah webu
      </button>

      {status ? <p className="admin-status">{status}</p> : null}
    </section>
  );
}
