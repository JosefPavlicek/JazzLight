export function AboutSection({ title, html }: { title: string; html: string }) {
  return <section className="section" id="about"><div className="container"><div className="card"><h2 className="section-heading">{title}</h2><div className="rich-text section-text" dangerouslySetInnerHTML={{ __html: html }} /></div></div></section>;
}
