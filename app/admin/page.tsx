import { AdminConcertForm } from "@/components/AdminConcertForm";

export default function AdminPage() {
  return (
    <main className="admin-page">
      <div className="container">
        <section className="admin-card">
          <h1 className="section-heading">Admin sekce</h1>
          <p className="section-text">
            Přidání koncertu do Firebase Realtime Database. Koncert je jednojazyčný. Obrázky se před uložením zmenší v prohlížeči a uloží jako Base64.
          </p>
        </section>

        <section className="admin-card admin-card-spaced">
          <h2>Nový koncert</h2>
          <AdminConcertForm />
        </section>
      </div>
    </main>
  );
}
