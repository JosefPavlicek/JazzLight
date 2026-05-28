"use client";

import { useEffect, useState } from "react";
import type { Artist, SiteContent } from "@/types/site";
import { compressImage, type PreparedImage } from "@/components/admin/imageTools";
import { LocalizedEditor } from "@/components/admin/LocalizedEditor";

const ARTIST_PHOTO_OPTIONS = {
  targetBytes: 180_000,
  maxWidth: 900,
  maxHeight: 900,
  initialQuality: 0.78,
  minQuality: 0.34,
};

const HERO_IMAGE_OPTIONS = {
  targetBytes: 350_000,
  maxWidth: 1200,
  maxHeight: 900,
  initialQuality: 0.8,
  minQuality: 0.36,
};

export function ContentManager({
  content,
  onSave,
}: {
  content: SiteContent;
  onSave: (content: SiteContent) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState<SiteContent>(content);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);

  useEffect(() => {
    if (!isSaving) return;

    setSaveProgress(8);

    const interval = window.setInterval(() => {
      setSaveProgress((current) => {
        if (current >= 92) return current;
        return current + Math.max(2, Math.round((92 - current) * 0.12));
      });
    }, 250);

    return () => window.clearInterval(interval);
  }, [isSaving]);

  async function save() {
    if (isSaving) return;

    if (isProcessingImages) {
      const confirmed = window.confirm(
        "Obrázky se ještě zpracovávají. Chceš uložit obsah bez nedokončených obrázků?"
      );

      if (!confirmed) return;
    }

    setIsSaving(true);
    setSaveProgress(8);
    setStatus("Ukládám obsah webu…");

    try {
      const ok = await onSave(draft);

      if (ok) {
        setSaveProgress(100);
        setStatus("Obsah uložen.");
      } else {
        setStatus("Obsah se nepodařilo uložit.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Obsah se nepodařilo uložit.");
    } finally {
      window.setTimeout(() => {
        setIsSaving(false);
        setSaveProgress(0);
      }, 700);
    }
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

    const fileArray = Array.from(files);
    setIsProcessingImages(true);
    setImageProgress(0);
    setStatus("Zmenšuji fotky…");

    try {
      const photos: PreparedImage[] = [];

      for (let index = 0; index < fileArray.length; index += 1) {
        const photo = await compressImage(fileArray[index], ARTIST_PHOTO_OPTIONS);
        photos.push(photo);
        setImageProgress(Math.round(((index + 1) / fileArray.length) * 100));
      }

      setDraft((current) => ({
        ...current,
        artists: current.artists.map((artist) =>
          artist.id === artistId
            ? { ...artist, photos: [...(artist.photos || []), ...photos] }
            : artist
        ),
      }));

      const totalKb = Math.round(photos.reduce((sum, photo) => sum + photo.sizeBytes, 0) / 1024);
      setStatus(`Fotky připravené. Celkem přibližně ${totalKb} kB.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Fotky se nepodařilo zpracovat.");
    } finally {
      setIsProcessingImages(false);
      window.setTimeout(() => setImageProgress(0), 700);
    }
  }

  async function setHeroImage(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setIsProcessingImages(true);
    setImageProgress(10);
    setStatus("Zmenšuji hero obrázek…");

    try {
      const image = await compressImage(file, HERO_IMAGE_OPTIONS);

      setDraft((current) => ({
        ...current,
        heroImage: image,
      }));

      setImageProgress(100);
      setStatus(`Hero obrázek připravený. Přibližně ${Math.round(image.sizeBytes / 1024)} kB.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Hero obrázek se nepodařilo zpracovat.");
    } finally {
      setIsProcessingImages(false);
      window.setTimeout(() => setImageProgress(0), 700);
    }
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
            <input
              type="file"
              accept="image/*"
              disabled={isSaving || isProcessingImages}
              onChange={(event) => setHeroImage(event.target.files)}
            />
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
                disabled={isSaving}
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
          <button
            className="button button-secondary"
            type="button"
            disabled={isSaving || isProcessingImages}
            onClick={addArtist}
          >
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
                  disabled={isSaving}
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
                  disabled={isSaving || isProcessingImages}
                  onChange={(event) => addArtistPhotos(artist.id, event.target.files)}
                />
              </label>

              {(artist.photos || []).length ? (
                <div className="image-preview-grid">
                  {(artist.photos || []).map((photo) => (
                    <div key={photo.id} className="image-preview">
                      <img src={photo.base64} alt={photo.name} />
                      <small>
                        {photo.name}<br />
                        {Math.round(photo.sizeBytes / 1024)} kB
                      </small>
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() =>
                          updateArtist(artist.id, {
                            photos: (artist.photos || []).filter((item) => item.id !== photo.id),
                          })
                        }
                      >
                        Odebrat
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <button
                className="button button-secondary"
                type="button"
                disabled={isSaving}
                onClick={() => removeArtist(artist.id)}
              >
                Smazat umělce
              </button>
            </article>
          ))}
        </div>
      </div>

      {isProcessingImages ? (
        <div className="upload-progress-box admin-save-progress">
          <div className="upload-progress-label">Zpracovávám obrázky… {imageProgress}%</div>
          <div className="upload-progress-track">
            <div className="upload-progress-bar" style={{ width: `${imageProgress}%` }} />
          </div>
        </div>
      ) : null}

      {isSaving ? (
        <div className="upload-progress-box admin-save-progress">
          <div className="upload-progress-label">Ukládám obsah webu… {saveProgress}%</div>
          <div className="upload-progress-track">
            <div className="upload-progress-bar" style={{ width: `${saveProgress}%` }} />
          </div>
        </div>
      ) : null}

      <button
        className="button button-primary admin-save-main"
        type="button"
        disabled={isSaving}
        onClick={save}
      >
        {isSaving ? "Ukládám obsah webu…" : "Uložit obsah webu"}
      </button>

      {status ? <p className="admin-status">{status}</p> : null}
    </section>
  );
}
