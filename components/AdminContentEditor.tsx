"use client";

import { FormEvent, useEffect, useState } from "react";
import { WysiwygEditor } from "@/components/WysiwygEditor";

type RepertoireContent = {
  cs: string;
  en: string;
};

const emptyContent: RepertoireContent = {
  cs: "",
  en: "",
};

export function AdminContentEditor() {
  const [adminToken, setAdminToken] = useState("");
  const [activeLang, setActiveLang] = useState<"cs" | "en">("cs");
  const [content, setContent] = useState<RepertoireContent>(emptyContent);
  const [status, setStatus] = useState("Načítám obsah…");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Obsah se nepodařilo načíst.");
        }

        setContent(result.repertoire || emptyContent);
        setStatus("Obsah načten.");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Chyba při načítání obsahu.");
      }
    }

    loadContent();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setStatus("Ukládám obsah…");

    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify(content),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Obsah se nepodařilo uložit.");
      }

      setStatus("Obsah byl uložen. Homepage použije novou verzi po obnovení.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Neznámá chyba.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <form className="admin-form content-editor-form" onSubmit={handleSubmit}>
      <label className="wide">
        Admin token
        <input
          type="password"
          value={adminToken}
          onChange={(event) => setAdminToken(event.target.value)}
          required
          placeholder="ADMIN_TOKEN"
        />
      </label>

      <div className="wide lang-tabs">
        <button
          type="button"
          className={activeLang === "cs" ? "active" : ""}
          onClick={() => setActiveLang("cs")}
        >
          Česká verze
        </button>
        <button
          type="button"
          className={activeLang === "en" ? "active" : ""}
          onClick={() => setActiveLang("en")}
        >
          English version
        </button>
      </div>

      <div className="wide">
        <WysiwygEditor
          key={activeLang}
          initialHtml={content[activeLang]}
          onChange={(html) => setContent((current) => ({ ...current, [activeLang]: html }))}
        />
      </div>

      <button className="button button-primary wide" type="submit" disabled={isBusy}>
        {isBusy ? "Ukládám…" : "Uložit obsah"}
      </button>

      {status ? <p className="admin-status wide">{status}</p> : null}
    </form>
  );
}
