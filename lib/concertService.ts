import { mockConcerts } from "@/data/site";
import { getDatabase } from "@/lib/firebaseAdmin";
import type { Concert } from "@/types/concert";

const PATH = "concerts";

export async function listConcerts(): Promise<Concert[]> {
  const db = getDatabase();
  if (!db) return mockConcerts;

  const snapshot = await db.ref(PATH).once("value");
  const value = snapshot.val();
  return value ? (Object.values(value) as Concert[]) : [];
}

export async function createConcert(input: Omit<Concert, "id" | "createdAt" | "updatedAt">) {
  const db = getDatabase();
  if (!db) {
    throw new Error("Firebase není nakonfigurovaný. Doplň FIREBASE_DATABASE_URL a FIREBASE_SERVICE_ACCOUNT_BASE64.");
  }

  const ref = db.ref(PATH).push();
  const now = new Date().toISOString();

  const concert: Concert = {
    ...input,
    id: ref.key!,
    createdAt: now,
    updatedAt: now
  };

  await ref.set(concert);
  return concert;
}
