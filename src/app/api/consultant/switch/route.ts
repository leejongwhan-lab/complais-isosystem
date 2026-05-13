import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { companyId } = await request.json();
  if (!companyId) return NextResponse.json({ error: "companyId required" }, { status: 400 });

  const originalId = request.cookies.get("company_id")?.value;

  const response = NextResponse.json({ ok: true });
  // Save consultant's own company so we can restore it later
  if (originalId) {
    response.cookies.set("consultant_original_company", originalId, { path: "/", httpOnly: false });
  }
  response.cookies.set("company_id", companyId, { path: "/", httpOnly: false });
  return response;
}
