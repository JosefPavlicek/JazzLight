"use client";
import { useState } from "react";
import type { LocalizedHtml } from "@/types/site";
import { WysiwygEditor } from "@/components/admin/WysiwygEditor";
export function LocalizedEditor({ label, value, onChange }: { label: string; value: LocalizedHtml; onChange: (value: LocalizedHtml) => void }) { const [lang, setLang] = useState<"cs" | "en">("cs"); return <div className="localized-editor"><h3>{label}</h3><div className="lang-tabs"><button type="button" className={lang === "cs" ? "active" : ""} onClick={() => setLang("cs")}>Česká verze</button><button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>English version</button></div><WysiwygEditor key={`${label}-${lang}`} initialHtml={value[lang] || ""} onChange={(html) => onChange({ ...value, [lang]: html })} /></div>; }
