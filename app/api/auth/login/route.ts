import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSessionCookie, isValidLegacyAdminToken } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (typeof body.token === "string" && isValidLegacyAdminToken(body.token)) {
      const response = NextResponse.json({ ok: true, email: "legacy-admin-token", mode: "legacy" });

      response.cookies.set(ADMIN_COOKIE, body.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60,
      });

      return response;
    }

    const idToken = typeof body.idToken === "string" ? body.idToken : "";

    if (!idToken) {
      return NextResponse.json({ error: "Chybí Firebase ID token." }, { status: 400 });
    }

    const session = await createAdminSessionCookie(idToken);
    const response = NextResponse.json({
      ok: true,
      email: session.email,
      mode: "firebase-google",
    });

    response.cookies.set(ADMIN_COOKIE, session.sessionCookie, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(session.expiresIn / 1000),
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Přihlášení se nezdařilo.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
