import { PublicHomeClient } from "@/components/PublicHomeClient";
import { getSiteContent } from "@/lib/contentService";
import { listConcerts } from "@/lib/concertService";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const concerts = (await listConcerts()).filter((concert) => concert.published);
  const content = await getSiteContent();
  return <PublicHomeClient content={content} concerts={concerts} />;
}
