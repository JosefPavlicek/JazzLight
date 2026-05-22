import { NextRequest, NextResponse } from "next/server";
import { createConcert, listConcerts } from "@/lib/concertService";
import { isAdminRequest } from "@/lib/adminAuth";
import type { ConcertImage } from "@/types/concert";

export const dynamic = "force-dynamic";
const MAX_IMAGE_BYTES = 700_000;

function clean(value: unknown) { return typeof value === "string" ? value.trim() : ""; }

function validateImages(images: unknown): ConcertImage[] {
  if (!Array.isArray(images)) return [];
  return images.map((img, index) => {
    const item = img as Record<string, unknown>;
    const base64 = clean(item.base64);
    const sizeBytes = Number(item.sizeBytes || 0);
    if (!base64.startsWith("data:image/")) throw new Error(`Obrázek ${index + 1} není validní obrázek.`);
    if (sizeBytes > MAX_IMAGE_BYTES) throw new Error(`Obrázek ${index + 1} je po zmenšení pořád příliš velký.`);
    return { id: clean(item.id) || crypto.randomUUID(), name: clean(item.name) || `poster-${index + 1}.jpg`, mimeType: clean(item.mimeType) || "image/jpeg", sizeBytes, base64 };
  });
}

function buildConcertInput(body: any) {
  const date = clean(body.date);
  const title = clean(body.title);
  const venue = clean(body.venue);
  if (!date || !title || !venue) throw new Error("Vyplň datum, název koncertu a místo.");
  return { date, title, venue, description: clean(body.description), link: clean(body.link), published: Boolean(body.published), images: validateImages(body.images) };
}

export async function GET(request: NextRequest) {
  const concerts = await listConcerts();
  const all = request.nextUrl.searchParams.get("all") === "1";
  return NextResponse.json({ concerts: concerts.filter((c) => all || c.published).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ error: "Nepřihlášený administrátor." }, { status: 401 });
  try {
    const body = await request.json();
    const concert = await createConcert(buildConcertInput(body));
    return NextResponse.json({ concert }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Neznámá chyba.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
