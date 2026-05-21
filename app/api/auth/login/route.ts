import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = typeof body.token === "string" ? body.token : "";
  if (!isValidAdminToken(token)) return NextResponse.json({ error: "Neplatné heslo." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
