export function AboutSection({ text }: { text: string }) {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="card">
          <h2 className="section-heading">O kapele</h2>
          <p className="section-text">{text}</p>
        </div>
      </div>
    </section>
  );
}
