"use client";

import { useEffect, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getFirebaseAuth, getGoogleProvider } from "@/lib/firebaseClient";

export function AdminApp() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [status, setStatus] = useState("Kontroluji přihlášení…");
  const [legacyToken, setLegacyToken] = useState("");
  const [showLegacyLogin, setShowLegacyLogin] = useState(false);

  async function checkAuth() {
    const response = await fetch("/api/auth/me", { cache: "no-store" });
    const result = await response.json();
    setAuthenticated(Boolean(result.authenticated));
    setAdminEmail(result.email || null);
    setStatus("");
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function loginWithGoogle() {
    setStatus("Přihlašuji přes Google…");

    try {
      const auth = getFirebaseAuth();
      const provider = getGoogleProvider();
      const credential = await signInWithPopup(auth, provider);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        await signOut(auth);
        setStatus(result.error || "Přihlášení se nezdařilo.");
        return;
      }

      setAuthenticated(true);
      setAdminEmail(result.email || credential.user.email || null);
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Přihlášení přes Google se nezdařilo.");
    }
  }

  async function loginWithLegacyToken(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Přihlašuji nouzovým heslem…");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: legacyToken }),
    });

    const result = await response.json();

    if (!response.ok) {
      setStatus(result.error || "Přihlášení se nezdařilo.");
      return;
    }

    setAuthenticated(true);
    setAdminEmail(result.email || "legacy-admin-token");
    setStatus("");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    try {
      await signOut(getFirebaseAuth());
    } catch {}
    setAuthenticated(false);
    setAdminEmail(null);
  }

  if (authenticated === null) {
    return (
      <main className="admin-page">
        <div className="container">
          <section className="admin-card">
            <p>{status}</p>
          </section>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="admin-page">
        <div className="container admin-login-wrap">
          <section className="admin-card">
            <h1 className="section-heading">Přihlášení do administrace</h1>
            <p className="section-text">
              Přihlaste se Google účtem povoleným v ADMIN_EMAILS.
            </p>

            <div className="admin-login-actions">
              <button className="button button-primary" type="button" onClick={loginWithGoogle}>
                Přihlásit přes Google
              </button>

              <button className="button button-secondary" type="button" onClick={() => setShowLegacyLogin((value) => !value)}>
                Nouzové heslo
              </button>
            </div>

            {showLegacyLogin ? (
              <form className="admin-form" onSubmit={loginWithLegacyToken}>
                <label className="wide">
                  Nouzové heslo ADMIN_TOKEN
                  <input type="password" value={legacyToken} onChange={(event) => setLegacyToken(event.target.value)} required />
                </label>
                <button className="button button-primary wide" type="submit">
                  Přihlásit nouzovým heslem
                </button>
              </form>
            ) : null}

            {status ? <p className="admin-status">{status}</p> : null}
          </section>
        </div>
      </main>
    );
  }

  return <AdminDashboard onLogout={logout} adminEmail={adminEmail} />;
}
