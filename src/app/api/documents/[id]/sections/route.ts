import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, getUserProfile } from "@/lib/supabase-server";
import type { Section } from "@/types/sections";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const profile = await getUserProfile();

  if (!profile?.id) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json() as { sections: Section[] };
  const { error } = await supabase
    .from("documents")
    .update({ sections: body.sections, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
