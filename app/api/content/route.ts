import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/lib/contentService";
import { isAdminRequest } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({ content, repertoire: content.repertoire });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ error: "Nepřihlášený administrátor." }, { status: 401 });
  try {
    const body = await request.json();
    const content = await saveSiteContent(body);
    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Neznámá chyba.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
