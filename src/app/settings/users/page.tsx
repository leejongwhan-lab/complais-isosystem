import { redirect } from "next/navigation";
import { getUserProfile, createSupabaseServerClient } from "@/lib/supabase-server";
import AppLayout from "@/components/layout/AppLayoutServer";
import UsersClientView from "@/components/settings/UsersClientView";

export default async function SettingsUsersPage() {
  const me = await getUserProfile();
  if (!me) redirect("/login");
  if (me.role !== "admin") redirect("/settings");

  const supabase = await createSupabaseServerClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, role, department, email:id")
    .eq("company_id", me.company_id ?? "")
    .order("full_name");

  // Enrich with auth emails via a join-like approach
  // profiles doesn't store email — fetch via auth.users is service-role only
  // We pass null for emails and let the client show profile data only

  return (
    <AppLayout>
      <UsersClientView users={(users ?? []) as {
        id: string;
        full_name: string;
        role: string;
        department: string | null;
      }[]} myId={me.id} />
    </AppLayout>
  );
}
