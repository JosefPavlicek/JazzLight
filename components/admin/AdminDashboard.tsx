"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/types/site";
import { ContentManager } from "@/components/admin/ContentManager";
import { ConcertManager } from "@/components/admin/ConcertManager";

async function safeReadResponse(response: Response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      error:
        response.status === 413
          ? "Data jsou příliš velká pro Vercel request. Odeber některé fotky nebo je ulož v menším rozlišení."
          : text || `Server vrátil chybu ${response.status}.`,
    };
  }
}

export function AdminDashboard({
  onLogout,
  adminEmail,
}: {
  onLogout: () => void;
  adminEmail?: string | null;
}) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [status, setStatus] = useState("Načítám obsah…");

  async function loadContent() {
    const response = await fetch("/api/content", { cache: "no-store" });
    const result = await safeReadResponse(response);

    if (!response.ok) {
      setStatus(result.error || "Obsah se nepodařilo načíst.");
      return;
    }

    setContent(result.content);
    setStatus("");
  }

  useEffect(() => {
    loadContent();
  }, []);

  async function saveContent(nextContent: SiteContent) {
    setStatus("Ukládám obsah…");

    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextContent),
    });

    const result = await safeReadResponse(response);

    if (!response.ok) {
      setStatus(result.error || "Obsah se nepodařilo uložit.");
      return false;
    }

    setContent(result.content);
    setStatus("Obsah byl uložen.");
    return true;
  }

  return (
    <main className="admin-page">
      <div className="container">
        <section className="admin-card admin-header-card">
          <div>
            <h1 className="section-heading">Admin sekce</h1>
            <p className="section-text">
              Správa obsahu, umělců a koncertů.
              {adminEmail ? <> Přihlášen: <strong>{adminEmail}</strong></> : null}
            </p>
          </div>
          <button className="button button-secondary" type="button" onClick={onLogout}>
            Odhlásit
          </button>
        </section>

        {status ? <p className="admin-status admin-status-top">{status}</p> : null}

        {content ? <ContentManager content={content} onSave={saveContent} /> : null}

        <ConcertManager />
      </div>
    </main>
  );
}
