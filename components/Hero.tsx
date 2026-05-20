import Image from "next/image";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">Jazz · Pop · Filmové melodie</span>
          <h1 className="hero-title">JazzLight</h1>
          <p className="hero-text">
            Elegantní hudební doprovod pro koncerty, hotelové večery, slavnosti i komorní setkání.
          </p>
          <div className="button-row">
            <a className="button button-primary" href="#concerts">Plánované koncerty</a>
            <a className="button button-secondary" href="#contact">Kontakt</a>
          </div>
        </div>
        <div className="hero-card">
          <Image src="/img/banner.svg" alt="JazzLight banner" width={1200} height={900} priority />
        </div>
      </div>
    </section>
  );
}
