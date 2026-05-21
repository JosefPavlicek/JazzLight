import type { Dictionary, Lang } from "@/lib/i18n";
import type { ContactContent } from "@/types/site";

export function ContactSection({ t, contact, lang }: { t: Dictionary; contact: ContactContent; lang: Lang }) {
  return <section className="section" id="contact"><div className="container"><div className="contact-card"><div><h2 className="section-heading">{t.contactTitle}</h2><p><strong>{contact.name}</strong></p><p><a href={`mailto:${contact.email}`}>{contact.email}</a></p><p><a href={`tel:${contact.phone.replaceAll(" ", "")}`}>{contact.phone}</a></p></div><div><div className="section-text rich-text" dangerouslySetInnerHTML={{ __html: contact.description[lang] }} /></div></div></div></section>;
}
