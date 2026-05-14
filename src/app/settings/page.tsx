import AppLayout from "@/components/layout/AppLayoutServer";
import { getCompany } from "@/lib/company";
import { getUserProfile, createSupabaseServerClient } from "@/lib/supabase-server";
import SettingsTabsClient from "@/components/settings/SettingsTabsClient";
import type { Branch } from "@/components/settings/SettingsBranchClient";

export default async function SettingsPage() {
  const [rawCompany, profile, authClient] = await Promise.all([
    getCompany(),
    getUserProfile(),
    createSupabaseServerClient(),
  ]);

  // company_code 없으면 name_en 또는 company_name 앞 영문 3자리로 자동 생성
  let company = rawCompany;
  if (company && !company.company_code) {
    const src = company.name_en || company.company_name || "";
    const code = src.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3) || "COM";
    await authClient.from("companies").update({ company_code: code }).eq("id", company.id);
    company = { ...company, company_code: code };
  }

  console.log('[settings] company:', company?.company_name, '| code:', company?.company_code, '| id:', company?.id);

  const isAdmin = profile?.role === "admin";

  const branches: Branch[] = company
    ? ((await authClient
        .from("company_branches")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at")).data ?? []) as Branch[]
    : [];

  let users: { id: string; full_name: string; role: string; department: string | null }[] = [];
  if (isAdmin && profile?.company_id) {
    const { data } = await authClient
      .from("profiles")
      .select("id, full_name, role, department")
      .eq("company_id", profile.company_id)
      .order("full_name");
    users = (data ?? []) as typeof users;
  }

  return (
    <AppLayout>
      <SettingsTabsClient
        company={company}
        branches={branches}
        users={users}
        myId={profile?.id ?? ""}
        isAdmin={isAdmin}
      />
    </AppLayout>
  );
}
