import type { Concert } from "@/types/concert";
import type { Dictionary, Lang } from "@/lib/i18n";

function formatDate(date: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === "cs" ? "cs-CZ" : "en-GB", {
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

function ConcertItem({ concert, lang, t }: { concert: Concert; lang: Lang; t: Dictionary }) {
  const poster = concert.images?.[0];

  return (
    <article className="concert-card">
      {poster ? <img className="concert-poster" src={poster.base64} alt={concert.title} /> : null}
      <p className="concert-date">{formatDate(concert.date, lang)}</p>
      <h4 className="concert-title">{concert.title}</h4>
      <p className="concert-meta">{concert.venue}</p>
      {concert.description ? <p className="concert-meta">{concert.description}</p> : null}
      {concert.link ? <a className="concert-link" href={concert.link}>{t.concertDetail}</a> : null}
    </article>
  );
}

export function ConcertsSection({ concerts, lang, t }: { concerts: Concert[]; lang: Lang; t: Dictionary }) {
  const { upcoming, past } = groupConcerts(concerts);

  return (
    <section className="section" id="concerts">
      <div className="container">
        <h2 className="section-heading">{t.concertsTitle}</h2>
        <p className="section-text">{t.concertsText}</p>

        <div className="concert-block">
          <h3 className="column-title">{t.upcomingConcerts}</h3>
          <div className="concert-list upcoming-list">
            {upcoming.length ? upcoming.map((concert) => (
              <ConcertItem key={concert.id} concert={concert} lang={lang} t={t} />
            )) : (
              <article className="concert-card">
                <p className="concert-meta">{t.noUpcomingConcerts}</p>
              </article>
            )}
          </div>
        </div>

        <div className="concert-block">
          <div className="concert-heading-row">
            <h3 className="column-title">{t.pastConcerts}</h3>
            {past.length > 1 ? (
              <p className="section-text concert-scroll-hint">
                {lang === "cs" ? "Posuňte do strany →" : "Scroll sideways →"}
              </p>
            ) : null}
          </div>

          {past.length ? (
            <div className="past-concert-carousel" aria-label={t.pastConcerts}>
              {past.map((concert) => (
                <div className="past-concert-slide" key={concert.id}>
                  <ConcertItem concert={concert} lang={lang} t={t} />
                </div>
              ))}
            </div>
          ) : (
            <article className="concert-card">
              <p className="concert-meta">{t.noPastConcerts}</p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
