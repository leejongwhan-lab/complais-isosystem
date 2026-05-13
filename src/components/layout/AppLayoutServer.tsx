import { cookies } from "next/headers";
import { getCompany } from "@/lib/company";
import { supabase } from "@/lib/supabase";
import { getUserProfile } from "@/lib/supabase-server";
import AppLayout from "./AppLayout";

export default async function AppLayoutServer({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const consultantOriginalId = cookieStore.get("consultant_original_company")?.value;

  const [company, { count: docCount }, { count: capaOpenCount }, userProfile] = await Promise.all([
    getCompany(),
    supabase.from("documents").select("*", { count: "exact", head: true }),
    supabase.from("capas").select("*", { count: "exact", head: true }).neq("status", "completed"),
    getUserProfile(),
  ]);

  let originalCompanyName: string | null = null;
  if (consultantOriginalId) {
    try {
      const { data } = await supabase
        .from("companies")
        .select("company_name")
        .eq("id", consultantOriginalId)
        .single();
      if (data) originalCompanyName = (data as { company_name: string }).company_name;
    } catch {}
  }

  return (
    <AppLayout
      company={company}
      docCount={docCount}
      capaOpenCount={capaOpenCount}
      isConsultantMode={!!consultantOriginalId}
      originalCompanyName={originalCompanyName}
      userFullName={userProfile?.full_name ?? null}
      userRole={userProfile?.role ?? null}
    >
      {children}
    </AppLayout>
  );
}
