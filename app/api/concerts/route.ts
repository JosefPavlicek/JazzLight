import { NextRequest, NextResponse } from "next/server";
import { createConcert, listConcerts } from "@/lib/concertService";
import type { ConcertImage } from "@/types/concert";

export const dynamic = "force-dynamic";
const MAX_IMAGE_BYTES = 700_000;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isAdmin(request: NextRequest) {
  const token = process.env.ADMIN_TOKEN;
  return Boolean(token) && request.headers.get("x-admin-token") === token;
}

function validateImages(images: unknown): ConcertImage[] {
  if (!Array.isArray(images)) return [];

  return images.map((img, index) => {
    const item = img as Record<string, unknown>;
    const base64 = clean(item.base64);
    const sizeBytes = Number(item.sizeBytes || 0);

    if (!base64.startsWith("data:image/")) {
      throw new Error(`Obrázek ${index + 1} není validní obrázek.`);
    }

    if (sizeBytes > MAX_IMAGE_BYTES) {
      throw new Error(`Obrázek ${index + 1} je po zmenšení pořád příliš velký.`);
    }

    return {
      id: crypto.randomUUID(),
      name: clean(item.name) || `poster-${index + 1}.jpg`,
      mimeType: clean(item.mimeType) || "image/jpeg",
      sizeBytes,
      base64
    };
  });
}

export async function GET() {
  const concerts = await listConcerts();

  return NextResponse.json({
    concerts: concerts
      .filter((concert) => concert.published)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  });
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Neplatný admin token." }, { status: 401 });
  }

  try {
    const body = await request.json();

    const date = clean(body.date);
    const title = clean(body.title);
    const venue = clean(body.venue);

    if (!date || !title || !venue) {
      return NextResponse.json(
        { error: "Vyplň datum, název koncertu a místo." },
        { status: 400 }
      );
    }

    const concert = await createConcert({
      date,
      title,
      venue,
      description: clean(body.description),
      link: clean(body.link),
      published: Boolean(body.published),
      images: validateImages(body.images)
    });

    return NextResponse.json({ concert }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Neznámá chyba.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
