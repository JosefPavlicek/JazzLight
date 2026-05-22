"use client";

import { useEffect, useState } from "react";
import type { Concert } from "@/types/concert";
import { compressImagesWithProgress, type PreparedImage } from "@/components/admin/imageTools";

const emptyConcert = {
  id: "",
  date: "",
  title: "",
  venue: "",
  description: "",
  link: "",
  published: true,
  images: [] as PreparedImage[],
};

export function ConcertManager() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [draft, setDraft] = useState(emptyConcert);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingImageCount, setPendingImageCount] = useState(0);

  async function loadConcerts() {
    const response = await fetch("/api/concerts?all=1", { cache: "no-store" });
    const result = await response.json();
    setConcerts(result.concerts || []);
  }

  useEffect(() => {
    loadConcerts();
  }, []);

  function startEdit(concert: Concert) {
    setEditingId(concert.id);
    setDraft({
      id: concert.id,
      date: concert.date ? concert.date.slice(0, 16) : "",
      title: concert.title || "",
      venue: concert.venue || "",
      description: concert.description || "",
      link: concert.link || "",
      published: Boolean(concert.published),
      images: (concert.images || []) as PreparedImage[],
    });
  }

  function resetForm() {
    setEditingId(null);
    setDraft(emptyConcert);
    setUploadProgress(0);
    setPendingImageCount(0);
    setIsProcessingImages(false);
  }

  async function addImages(files: FileList | null) {
    if (!files?.length) return;

    const fileArray = Array.from(files);
    setPendingImageCount(fileArray.length);
    setIsProcessingImages(true);
    setUploadProgress(0);
    setStatus("Zmenšuji plakáty…");

    try {
      const images = await compressImagesWithProgress(fileArray, setUploadProgress);
      setDraft((current) => ({
        ...current,
        images: [...(current.images || []), ...images],
      }));
      setStatus("Plakáty připravené.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Obrázky se nepodařilo zpracovat.");
    } finally {
      setIsProcessingImages(false);
      setPendingImageCount(0);
    }
  }

  async function saveConcert(event: React.FormEvent) {
    event.preventDefault();

    if (isProcessingImages) {
      const confirmed = window.confirm(
        "Obrázky se ještě zpracovávají. Chceš koncert uložit bez nedokončených obrázků?"
      );

      if (!confirmed) return;
    }

    setStatus("Ukládám koncert…");

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/concerts/${editingId}` : "/api/concerts";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, images: draft.images || [] }),
    });

    const result = await response.json();

    if (!response.ok) {
      setStatus(result.error || "Koncert se nepodařilo uložit.");
      return;
    }

    setStatus("Koncert uložen.");
    resetForm();
    await loadConcerts();
  }

  async function removeConcert(id: string) {
    if (!window.confirm("Opravdu smazat koncert?")) return;

    const response = await fetch(`/api/concerts/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      setStatus(result.error || "Koncert se nepodařilo smazat.");
      return;
    }

    setStatus("Koncert smazán.");
    await loadConcerts();
  }

  const draftImages = draft.images || [];

  return (
    <section className="admin-card admin-card-spaced">
      <h2>{editingId ? "Editace koncertu" : "Nový koncert"}</h2>

      <form className="admin-form" onSubmit={saveConcert}>
        <label>
          Datum a čas
          <input type="datetime-local" value={draft.date} onChange={(e) => setDraft((c) => ({ ...c, date: e.target.value }))} required />
        </label>

        <label>
          Název koncertu
          <input value={draft.title} onChange={(e) => setDraft((c) => ({ ...c, title: e.target.value }))} required />
        </label>

        <label>
          Místo koncertu
          <input value={draft.venue} onChange={(e) => setDraft((c) => ({ ...c, venue: e.target.value }))} required />
        </label>

        <label>
          Odkaz
          <input type="url" value={draft.link} onChange={(e) => setDraft((c) => ({ ...c, link: e.target.value }))} />
        </label>

        <label className="wide">
          Popis
          <textarea rows={5} value={draft.description} onChange={(e) => setDraft((c) => ({ ...c, description: e.target.value }))} />
        </label>

        <label className="checkbox-label">
          <input type="checkbox" checked={draft.published} onChange={(e) => setDraft((c) => ({ ...c, published: e.target.checked }))} />
          Publikovat
        </label>

        <label className="wide">
          Fotka / plakát
          <input type="file" accept="image/*" multiple onChange={(e) => addImages(e.target.files)} />
        </label>

        {isProcessingImages ? (
          <div className="wide upload-progress-box">
            <div className="upload-progress-label">
              Zmenšuji plakáty… {uploadProgress}% {pendingImageCount ? `(${pendingImageCount} souborů)` : ""}
            </div>
            <div className="upload-progress-track">
              <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        ) : null}

        {draftImages.length ? (
          <div className="image-preview-grid">
            {draftImages.map((image) => (
              <div className="image-preview" key={image.id}>
                <img src={image.base64} alt={image.name} />
                <small>{image.name}<br />{Math.round(image.sizeBytes / 1024)} kB</small>
                <button type="button" onClick={() => setDraft((c) => ({ ...c, images: (c.images || []).filter((item) => item.id !== image.id) }))}>
                  Odebrat
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <button className="button button-primary wide" type="submit">
          {editingId ? "Uložit změny koncertu" : "Přidat koncert"}
        </button>

        {editingId ? (
          <button className="button button-secondary wide" type="button" onClick={resetForm}>
            Zrušit editaci
          </button>
        ) : null}
      </form>

      {status ? <p className="admin-status">{status}</p> : null}

      <h3 className="admin-list-title">Existující koncerty</h3>
      <div className="admin-concert-list">
        {concerts.map((concert) => (
          <article key={concert.id} className="admin-concert-item">
            <div>
              <strong>{concert.title}</strong><br />
              <span>{concert.date} · {concert.venue}</span>
            </div>
            <div className="admin-concert-actions">
              <button type="button" onClick={() => startEdit(concert)}>Editovat</button>
              <button type="button" onClick={() => removeConcert(concert.id)}>Smazat</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
