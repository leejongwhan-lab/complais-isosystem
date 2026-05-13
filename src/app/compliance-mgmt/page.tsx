import { Suspense } from "react";
import AppLayout from "@/components/layout/AppLayoutServer";
import ComplianceClientView from "@/components/compliance/ComplianceClientView";
import type { ComplianceObligation } from "@/components/compliance/ComplianceClientView";
import { supabase } from "@/lib/supabase";

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function ComplianceMgmtContent() {
  let obligations: ComplianceObligation[] = [];
  try {
    const { data } = await supabase
      .from("compliance_obligations")
      .select("id, obligation_number, category, law_name, article, requirement, applicable_dept, compliance_status, next_review_date, owner_name, likelihood, impact")
      .order("created_at", { ascending: false });
    obligations = (data ?? []) as ComplianceObligation[];
  } catch {
    obligations = [];
  }
  return <ComplianceClientView obligations={obligations} />;
}

export default function ComplianceMgmtPage() {
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <ComplianceMgmtContent />
      </Suspense>
    </AppLayout>
  );
}
