"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/types/site";
import { ContentManager } from "@/components/admin/ContentManager";
import { ConcertManager } from "@/components/admin/ConcertManager";

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState("Načítám obsah…");
  async function loadContent() { const r = await fetch("/api/content", { cache: "no-store" }); const j = await r.json(); if (!r.ok) { setStatus(j.error || "Obsah se nepodařilo načíst."); return; } setContent(j.content); setStatus(""); }
  useEffect(() => { loadContent(); }, []);
  async function saveContent(nextContent: SiteContent) { setStatus("Ukládám obsah…"); const r = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nextContent) }); const j = await r.json(); if (!r.ok) { setStatus(j.error || "Obsah se nepodařilo uložit."); return false; } setContent(j.content); setStatus("Obsah byl uložen."); return true; }
  return <main className="admin-page"><div className="container"><section className="admin-card admin-header-card"><div><h1 className="section-heading">Admin sekce</h1><p className="section-text">Správa obsahu, umělců a koncertů.</p></div><button className="button button-secondary" type="button" onClick={onLogout}>Odhlásit</button></section>{status ? <p className="admin-status admin-status-top">{status}</p> : null}{content ? <ContentManager content={content} onSave={saveContent} /> : null}<ConcertManager /></div></main>;
}
