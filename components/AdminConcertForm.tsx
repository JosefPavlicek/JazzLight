"use client";

import { FormEvent, useMemo, useState } from "react";

type PreparedImage = {
  name: string;
  mimeType: string;
  sizeBytes: number;
  base64: string;
};

const TARGET_IMAGE_BYTES = 550_000;
const MAX_WIDTH = 1400;
const MAX_HEIGHT = 1400;

function dataUrlSizeBytes(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] || "";
  return Math.round((base64.length * 3) / 4);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Nepodařilo se načíst obrázek ${file.name}.`));
    };

    image.src = url;
  });
}

async function compressImage(file: File): Promise<PreparedImage> {
  const image = await loadImage(file);
  const ratio = Math.min(MAX_WIDTH / image.width, MAX_HEIGHT / image.height, 1);
  const width = Math.round(image.width * ratio);
  const height = Math.round(image.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas není dostupný.");

  ctx.drawImage(image, 0, 0, width, height);

  let quality = 0.88;
  let base64 = canvas.toDataURL("image/jpeg", quality);
  let sizeBytes = dataUrlSizeBytes(base64);

  while (sizeBytes > TARGET_IMAGE_BYTES && quality > 0.42) {
    quality -= 0.06;
    base64 = canvas.toDataURL("image/jpeg", quality);
    sizeBytes = dataUrlSizeBytes(base64);
  }

  return {
    name: file.name.replace(/\.[^.]+$/, ".jpg"),
    mimeType: "image/jpeg",
    sizeBytes,
    base64
  };
}

export function AdminConcertForm() {
  const [images, setImages] = useState<PreparedImage[]>([]);
  const [status, setStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const totalSize = useMemo(
    () => images.reduce((sum, image) => sum + image.sizeBytes, 0),
    [images]
  );

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setStatus("Zmenšuji obrázky…");

    try {
      const prepared = await Promise.all(Array.from(files).map(compressImage));
      setImages((current) => [...current, ...prepared]);
      setStatus("Obrázky jsou připravené.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Chyba při zpracování obrázků.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setStatus("Ukládám koncert…");

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      date: data.get("date"),
      title: data.get("title"),
      venue: data.get("venue"),
      description: data.get("description"),
      link: data.get("link"),
      published: data.get("published") === "on",
      images
    };

    try {
      const response = await fetch("/api/concerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": String(data.get("adminToken") || "")
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Koncert se nepodařilo uložit.");
      }

      form.reset();
      setImages([]);
      setStatus("Koncert byl uložen. Homepage jej zobrazí po obnovení stránky.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Neznámá chyba.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label>
        Admin token
        <input name="adminToken" type="password" required placeholder="ADMIN_TOKEN" />
      </label>

      <label>
        Datum a čas
        <input name="date" type="datetime-local" required />
      </label>

      <label>
        Název koncertu
        <input name="title" type="text" required placeholder="např. JazzLight Night" />
      </label>

      <label>
        Místo koncertu
        <input name="venue" type="text" required placeholder="např. Hotel Chotol, Horoměřice" />
      </label>

      <label className="wide">
        Popis
        <textarea name="description" rows={5} placeholder="volitelný popis koncertu" />
      </label>

      <label>
        Odkaz
        <input name="link" type="url" placeholder="https://..." />
      </label>

      <label className="checkbox-label">
        <input name="published" type="checkbox" defaultChecked />
        Publikovat
      </label>

      <label className="wide">
        Fotka / plakát
        <input type="file" accept="image/*" multiple onChange={(event) => handleFiles(event.target.files)} />
      </label>

      {images.length > 0 ? (
        <div className="image-preview-grid">
          {images.map((image, index) => (
            <div className="image-preview" key={`${image.name}-${index}`}>
              <img src={image.base64} alt={image.name} />
              <small>{image.name}<br />{Math.round(image.sizeBytes / 1024)} kB</small>
              <button type="button" onClick={() => setImages((current) => current.filter((_, i) => i !== index))}>
                Odebrat
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <p className="section-text wide">Celkem obrázky: {Math.round(totalSize / 1024)} kB</p>

      <button className="button button-primary wide" type="submit" disabled={isBusy}>
        {isBusy ? "Ukládám…" : "Uložit koncert"}
      </button>

      {status ? <p className="admin-status wide">{status}</p> : null}
    </form>
  );
}
