import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/adminAuth";

export async function GET() {
  const admin = await getCurrentAdmin();
  return NextResponse.json({
    authenticated: Boolean(admin),
    email: admin?.email || null,
  });
}
