import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/supabase-server";
import AppLayout from "@/components/layout/AppLayoutServer";
import ProfileClientView from "@/components/profile/ProfileClientView";

export default async function ProfilePage() {
  const profile = await getUserProfile();
  if (!profile) redirect("/login");

  return (
    <AppLayout>
      <ProfileClientView profile={profile} />
    </AppLayout>
  );
}
