import type { Metadata } from "next";
import { PublicHomeClient } from "@/components/PublicHomeClient";
import { getSiteContent } from "@/lib/contentService";
import { listConcerts } from "@/lib/concertService";

export const dynamic = "force-dynamic";

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  const descriptionCs = stripHtml(content.contact.description.cs);
  const descriptionEn = stripHtml(content.contact.description.en);
  const keywords = [
    ...content.seo.keywords.cs.split(","),
    ...content.seo.keywords.en.split(","),
  ].map((keyword) => keyword.trim()).filter(Boolean);

  const images = content.heroImage?.base64
    ? [{ url: content.heroImage.base64, alt: "JazzLight" }]
    : undefined;

  return {
    title: "JazzLight",
    description: descriptionCs || descriptionEn,
    keywords,
    openGraph: {
      title: "JazzLight",
      description: descriptionCs || descriptionEn,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: "JazzLight",
      description: descriptionCs || descriptionEn,
      images: content.heroImage?.base64 ? [content.heroImage.base64] : undefined,
    },
  };
}

export default async function HomePage() {
  const concerts = (await listConcerts()).filter((concert) => concert.published);
  const content = await getSiteContent();

  return <PublicHomeClient content={content} concerts={concerts} />;
}
