import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const originalId = request.cookies.get("consultant_original_company")?.value;

  const response = NextResponse.json({ ok: true });
  if (originalId) {
    response.cookies.set("company_id", originalId, { path: "/", httpOnly: false });
  }
  response.cookies.set("consultant_original_company", "", { path: "/", maxAge: 0 });
  return response;
}
