import { NextResponse } from "next/server";
import { isAdminCookieValid } from "@/lib/adminAuth";

export async function GET() {
  return NextResponse.json({ authenticated: isAdminCookieValid() });
}
