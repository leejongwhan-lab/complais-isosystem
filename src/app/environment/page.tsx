import { Suspense } from "react";
import AppLayout from "@/components/layout/AppLayoutServer";
import EnvironmentClientView from "@/components/environment/EnvironmentClientView";
import { supabase } from "@/lib/supabase";
import type {
  EnvAspect, HazardAssessment, MaterialBalance, LegalRequirement,
  ProcessHazardAssessment,
} from "@/types/environment";

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function EnvironmentContent() {
  const [aspectsRes, hazardsRes, materialsRes, lawsRes, phasRes] = await Promise.all([
    supabase.from("env_aspects").select("*").order("created_at", { ascending: false }),
    supabase.from("hazard_assessments").select("*").order("risk_score", { ascending: false }),
    supabase.from("material_balances").select("*").order("record_month", { ascending: false }),
    supabase.from("legal_requirements").select("*").order("law_number"),
    supabase.from("process_hazard_assessments").select("*").order("risk_score", { ascending: false }),
  ]);

  const err = aspectsRes.error ?? hazardsRes.error ?? materialsRes.error ?? lawsRes.error ?? phasRes.error;
  if (err) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, height: "calc(100vh - 56px)" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#E03131" }}>데이터 로드 실패</p>
        <p style={{ fontSize: 12, color: "#999" }}>{err.message}</p>
      </div>
    );
  }

  return (
    <EnvironmentClientView
      aspects={   (aspectsRes.data   ?? []) as EnvAspect[]}
      hazards={   (hazardsRes.data   ?? []) as HazardAssessment[]}
      materials={ (materialsRes.data ?? []) as MaterialBalance[]}
      laws={      (lawsRes.data      ?? []) as LegalRequirement[]}
      phas={      (phasRes.data      ?? []) as ProcessHazardAssessment[]}
    />
  );
}

export default function EnvironmentPage() {
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <EnvironmentContent />
      </Suspense>
    </AppLayout>
  );
}
