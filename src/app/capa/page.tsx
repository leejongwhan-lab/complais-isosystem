import { Suspense } from "react";
import AppLayout from "@/components/layout/AppLayoutServer";
import CAPAClientView from "@/components/capa/CAPAClientView";
import { supabase } from "@/lib/supabase";
import { getUserProfile } from "@/lib/supabase-server";
import { canWrite } from "@/lib/permissions";
import type { Capa } from "@/types/capa";

function ContentSpinner() {
  return (
    <div
      className="flex items-center justify-center bg-[#F8F9FA]"
      style={{ height: "calc(100vh - 56px)" }}
    >
      <div className="w-8 h-8 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function CAPAContent() {
  const [{ data, error }, profile] = await Promise.all([
    supabase.from("capas").select("*").order("capa_number", { ascending: false }),
    getUserProfile(),
  ]);
  const writeOk = canWrite(profile?.role ?? "viewer");

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <p className="text-[14px] font-semibold text-[#E03131]">데이터 로드 실패</p>
        <p className="text-[12px] text-[#ADB5BD]">{error.message}</p>
      </div>
    );
  }

  return <CAPAClientView capas={(data ?? []) as Capa[]} canWrite={writeOk} currentUserName={profile?.full_name ?? ""} />;
}

export default function CAPAPage() {
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <CAPAContent />
      </Suspense>
    </AppLayout>
  );
}
