import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import * as admin from "firebase-admin";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

export const ADMIN_COOKIE = "jazzlight_admin_session";

function getAllowedEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAllowed(email: string | null | undefined) {
  if (!email) return false;
  return getAllowedEmails().includes(email.toLowerCase());
}

export function isValidLegacyAdminToken(token: string | undefined | null) {
  return Boolean(process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);
}

export async function createAdminSessionCookie(idToken: string) {
  const app = getFirebaseAdminApp();
  if (!app) throw new Error("Firebase Admin není nakonfigurovaný.");

  const decoded = await admin.auth(app).verifyIdToken(idToken);

  if (!isEmailAllowed(decoded.email)) {
    throw new Error("Tento Google účet nemá povolený přístup do administrace.");
  }

  const expiresIn = 1000 * 60 * 60 * 8;
  const sessionCookie = await admin.auth(app).createSessionCookie(idToken, { expiresIn });

  return {
    sessionCookie,
    expiresIn,
    email: decoded.email || "",
  };
}

export async function verifyAdminSession(sessionCookie: string | undefined | null) {
  if (!sessionCookie) return null;

  if (isValidLegacyAdminToken(sessionCookie)) {
    return { uid: "legacy", email: "legacy-admin-token" };
  }

  const app = getFirebaseAdminApp();
  if (!app) return null;

  try {
    const decoded = await admin.auth(app).verifySessionCookie(sessionCookie, true);
    if (!isEmailAllowed(decoded.email)) return null;

    return {
      uid: decoded.uid,
      email: decoded.email || "",
    };
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const sessionCookie = cookies().get(ADMIN_COOKIE)?.value;
  return verifyAdminSession(sessionCookie);
}

export async function isAdminRequest(request: NextRequest) {
  const headerToken = request.headers.get("x-admin-token");

  if (isValidLegacyAdminToken(headerToken)) return true;

  const sessionCookie = request.cookies.get(ADMIN_COOKIE)?.value;
  const adminUser = await verifyAdminSession(sessionCookie);

  return Boolean(adminUser);
}
