import type { Concert } from "@/types/concert";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

function groupConcerts(concerts: Concert[]) {
  const now = new Date();
  const sorted = [...concerts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    upcoming: sorted.filter((concert) => new Date(concert.date) >= now),
    past: sorted.filter((concert) => new Date(concert.date) < now).reverse()
  };
}

function ConcertItem({ concert }: { concert: Concert }) {
  const poster = concert.images?.[0];

  return (
    <article className="concert-card">
      {poster ? <img className="concert-poster" src={poster.base64} alt={concert.title} /> : null}
      <p className="concert-date">{formatDate(concert.date)}</p>
      <h4 className="concert-title">{concert.title}</h4>
      <p className="concert-meta">{concert.venue}</p>
      {concert.description ? <p className="concert-meta">{concert.description}</p> : null}
      {concert.link ? <a className="concert-link" href={concert.link}>Detail koncertu</a> : null}
    </article>
  );
}

export function ConcertsSection({ concerts }: { concerts: Concert[] }) {
  const { upcoming, past } = groupConcerts(concerts);

  return (
    <section className="section" id="concerts">
      <div className="container">
        <h2 className="section-heading">Koncerty</h2>
        <p className="section-text">Plánované a odehrané koncerty se dělí automaticky podle data.</p>
        <div className="columns">
          <div>
            <h3 className="column-title">Plánované koncerty</h3>
            <div className="concert-list">
              {upcoming.length ? upcoming.map((concert) => <ConcertItem key={concert.id} concert={concert} />) : (
                <article className="concert-card"><p className="concert-meta">Zatím nejsou vypsané žádné termíny.</p></article>
              )}
            </div>
          </div>
          <div>
            <h3 className="column-title">Odehrané koncerty</h3>
            <div className="concert-list">
              {past.length ? past.map((concert) => <ConcertItem key={concert.id} concert={concert} />) : (
                <article className="concert-card"><p className="concert-meta">Archiv je zatím prázdný.</p></article>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
