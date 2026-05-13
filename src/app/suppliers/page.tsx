import { Suspense } from "react";
import AppLayout from "@/components/layout/AppLayoutServer";
import SupplierClientView from "@/components/suppliers/SupplierClientView";
import { supabase } from "@/lib/supabase";
import { getUserProfile } from "@/lib/supabase-server";
import { getCompany } from "@/lib/company";
import { canWrite } from "@/lib/permissions";
import type { Supplier } from "@/types/supplier";

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function SuppliersContent() {
  const [company, profile] = await Promise.all([getCompany(), getUserProfile()]);
  const companyId = company?.id ?? "";
  const writeOk = canWrite(profile?.role ?? "viewer");

  const { data, error } = companyId
    ? await supabase.from("suppliers").select("*").eq("company_id", companyId).order("company_name")
    : await supabase.from("suppliers").select("*").order("company_name");

  console.log('[suppliers] count:', data?.length, 'companyId:', companyId, 'error:', error?.message);

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, height: "calc(100vh - 56px)" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#E03131" }}>데이터 로드 실패</p>
        <p style={{ fontSize: 12, color: "#999" }}>{error.message}</p>
      </div>
    );
  }

  return <SupplierClientView suppliers={(data ?? []) as Supplier[]} canWrite={writeOk} />;
}

export default function SuppliersPage() {
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <SuppliersContent />
      </Suspense>
    </AppLayout>
  );
}
