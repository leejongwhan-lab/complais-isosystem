import { Suspense } from "react";
import AppLayout from "@/components/layout/AppLayoutServer";
import AuditClientView from "@/components/audit/AuditClientView";
import { supabase } from "@/lib/supabase";
import { getUserProfile } from "@/lib/supabase-server";
import { getCompany } from "@/lib/company";
import { canWrite } from "@/lib/permissions";
import type { Audit } from "@/types/audit";

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function AuditContent() {
  const [company, profile] = await Promise.all([getCompany(), getUserProfile()]);
  const companyId = company?.id ?? "";
  const writeOk = canWrite(profile?.role ?? "viewer");

  if (!companyId) {
    return <AuditClientView audits={[]} canWrite={writeOk} />;
  }

  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("company_id", companyId)
    .order("planned_date", { ascending: false });

  console.log('[audit] count:', data?.length, 'error:', error?.message);

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, height: "calc(100vh - 56px)" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#E03131" }}>데이터 로드 실패</p>
        <p style={{ fontSize: 12, color: "#999" }}>{error.message}</p>
      </div>
    );
  }

  return <AuditClientView audits={(data ?? []) as Audit[]} canWrite={writeOk} />;
}

export default function AuditPage() {
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <AuditContent />
      </Suspense>
    </AppLayout>
  );
}
