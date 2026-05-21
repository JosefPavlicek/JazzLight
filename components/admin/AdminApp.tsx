"use client";

import { useEffect, useState } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export function AdminApp() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("Kontroluji přihlášení…");
  async function checkAuth() { const r = await fetch("/api/auth/me", { cache: "no-store" }); const j = await r.json(); setAuthenticated(Boolean(j.authenticated)); setStatus(""); }
  useEffect(() => { checkAuth(); }, []);
  async function login(event: React.FormEvent) { event.preventDefault(); setStatus("Přihlašuji…"); const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) }); const j = await r.json(); if (!r.ok) { setStatus(j.error || "Přihlášení se nezdařilo."); return; } setAuthenticated(true); setStatus(""); }
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); setAuthenticated(false); }
  if (authenticated === null) return <main className="admin-page"><div className="container"><section className="admin-card"><p>{status}</p></section></div></main>;
  if (!authenticated) return <main className="admin-page"><div className="container admin-login-wrap"><section className="admin-card"><h1 className="section-heading">Přihlášení do administrace</h1><form className="admin-form" onSubmit={login}><label className="wide">Heslo<input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="ADMIN_TOKEN" required /></label><button className="button button-primary wide" type="submit">Přihlásit</button>{status ? <p className="admin-status wide">{status}</p> : null}</form></section></div></main>;
  return <AdminDashboard onLogout={logout} />;
}
