import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { ConcertsSection } from "@/components/ConcertsSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MembersSection } from "@/components/MembersSection";
import { RepertoireSection } from "@/components/RepertoireSection";
import { aboutText, members, repertoireHtml } from "@/data/site";
import { listConcerts } from "@/lib/concertService";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const concerts = (await listConcerts()).filter((concert) => concert.published);

  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero />
        <AboutSection text={aboutText} />
        <MembersSection members={members} />
        <RepertoireSection html={repertoireHtml} />
        <ConcertsSection concerts={concerts} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
