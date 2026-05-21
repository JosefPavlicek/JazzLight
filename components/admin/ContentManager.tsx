"use client";

import { useState } from "react";
import type { Artist, SiteContent } from "@/types/site";
import { compressImage } from "@/components/admin/imageTools";
import { LocalizedEditor } from "@/components/admin/LocalizedEditor";

export function ContentManager({ content, onSave }: { content: SiteContent; onSave: (content: SiteContent) => Promise<boolean> }) {
  const [draft, setDraft] = useState<SiteContent>(content);
  const [status, setStatus] = useState("");
  async function save() { const ok = await onSave(draft); setStatus(ok ? "Obsah uložen." : "Obsah se nepodařilo uložit."); }
  function updateArtist(id: string, update: Partial<Artist>) { setDraft((current) => ({ ...current, artists: current.artists.map((artist) => artist.id === id ? { ...artist, ...update } : artist) })); }
  function removeArtist(id: string) { setDraft((current) => ({ ...current, artists: current.artists.filter((artist) => artist.id !== id) })); }
  function addArtist() { setDraft((current) => ({ ...current, artists: [...current.artists, { id: crypto.randomUUID(), name: "Nový interpret", role: { cs: "role", en: "role" }, photos: [] }] })); }
  async function addArtistPhotos(artistId: string, files: FileList | null) { if (!files?.length) return; setStatus("Zmenšuji fotky…"); const photos = await Promise.all(Array.from(files).map(compressImage)); setDraft((current) => ({ ...current, artists: current.artists.map((artist) => artist.id === artistId ? { ...artist, photos: [...artist.photos, ...photos] } : artist) })); setStatus("Fotky připravené."); }

  return <section className="admin-card admin-card-spaced"><h2>Obsah webu</h2>
    <LocalizedEditor label="O kapele" value={draft.about} onChange={(about) => setDraft((c) => ({ ...c, about }))} />
    <LocalizedEditor label="Co hrajeme" value={draft.repertoire} onChange={(repertoire) => setDraft((c) => ({ ...c, repertoire }))} />
    <div className="admin-subsection"><h3>Kontakt</h3><div className="admin-form"><label>Jméno kontaktu<input value={draft.contact.name} onChange={(e) => setDraft((c) => ({ ...c, contact: { ...c.contact, name: e.target.value } }))} /></label><label>E-mail<input value={draft.contact.email} onChange={(e) => setDraft((c) => ({ ...c, contact: { ...c.contact, email: e.target.value } }))} /></label><label>Telefon<input value={draft.contact.phone} onChange={(e) => setDraft((c) => ({ ...c, contact: { ...c.contact, phone: e.target.value } }))} /></label></div><LocalizedEditor label="Popis kontaktu / hero text" value={draft.contact.description} onChange={(description) => setDraft((c) => ({ ...c, contact: { ...c.contact, description } }))} /></div>
    <div className="admin-subsection"><div className="admin-section-row"><h3>Umělci</h3><button className="button button-secondary" type="button" onClick={addArtist}>Přidat umělce</button></div><div className="artist-admin-list">{draft.artists.map((artist) => <article key={artist.id} className="artist-admin-card"><label>Jméno<input value={artist.name} onChange={(e) => updateArtist(artist.id, { name: e.target.value })} /></label><LocalizedEditor label="Role" value={artist.role} onChange={(role) => updateArtist(artist.id, { role })} /><label>Fotky interpreta<input type="file" accept="image/*" multiple onChange={(e) => addArtistPhotos(artist.id, e.target.files)} /></label>{artist.photos.length ? <div className="image-preview-grid">{artist.photos.map((photo) => <div key={photo.id} className="image-preview"><img src={photo.base64} alt={photo.name} /><small>{photo.name}<br />{Math.round(photo.sizeBytes / 1024)} kB</small><button type="button" onClick={() => updateArtist(artist.id, { photos: artist.photos.filter((item) => item.id !== photo.id) })}>Odebrat</button></div>)}</div> : null}<button className="button button-secondary" type="button" onClick={() => removeArtist(artist.id)}>Smazat umělce</button></article>)}</div></div>
    <button className="button button-primary admin-save-main" type="button" onClick={save}>Uložit obsah webu</button>{status ? <p className="admin-status">{status}</p> : null}</section>;
}
