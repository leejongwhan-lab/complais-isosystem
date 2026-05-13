import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const { kpi_code, action } = (await req.json()) as {
    kpi_code: string;
    action: "add" | "remove";
  };

  const cookieStore = await cookies();
  let companyId = cookieStore.get("company_id")?.value;

  if (!companyId) {
    const authClient = await createSupabaseServerClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await authClient
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();
    companyId = (profile as { company_id?: string } | null)?.company_id ?? undefined;
  }

  if (!companyId) return NextResponse.json({ error: "No company" }, { status: 400 });

  if (action === "add") {
    await supabase
      .from("kpi_master_selections")
      .insert({ company_id: companyId, kpi_code });
  } else {
    await supabase
      .from("kpi_master_selections")
      .delete()
      .eq("company_id", companyId)
      .eq("kpi_code", kpi_code);
  }

  return NextResponse.json({ ok: true });
}
