import AppLayout from "@/components/layout/AppLayoutServer";
import { getCompany } from "@/lib/company";
import { getUserProfile, createSupabaseServerClient } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";
import SettingsTabsClient from "@/components/settings/SettingsTabsClient";
import type { Branch } from "@/components/settings/SettingsBranchClient";

export default async function SettingsPage() {
  const [company, profile] = await Promise.all([getCompany(), getUserProfile()]);

  const isAdmin = profile?.role === "admin";

  const branches: Branch[] = company
    ? ((await supabase
        .from("company_branches")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at")).data ?? []) as Branch[]
    : [];

  let users: { id: string; full_name: string; role: string; department: string | null }[] = [];
  if (isAdmin && profile?.company_id) {
    const authClient = await createSupabaseServerClient();
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
