export function RepertoireSection({ html }: { html: string }) {
  return (
    <section className="section" id="repertoire">
      <div className="container">
        <div className="card">
          <h2 className="section-heading">Co hrajeme</h2>
          <div className="rich-text section-text" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </section>
  );
}
