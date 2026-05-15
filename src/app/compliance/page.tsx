import AppLayout from "@/components/layout/AppLayoutServer";
import { getCompany } from "@/lib/company";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { KpiActual } from "@/components/compliance/ComplianceESGClient";
import type { MBItem, MBActual, EmissionFactor } from "@/components/compliance/ComplianceMBClient";
import ComplianceTabsClient from "@/components/compliance/ComplianceTabsClient";

export default async function CompliancePage() {
  const [supabase, company] = await Promise.all([
    createSupabaseServerClient(),
    getCompany(),
  ]);
  const companyId = company?.id ?? "";
  const currentYear = new Date().getFullYear();

  // ── kpi_master는 클라이언트에서 직접 조회 (서버 503 우회) ──
  // actuals + selections만 서버에서 조회
  const [kpiActualsRes, kpiSelectionsRes] = await Promise.all([
    companyId
      ? supabase.from("kpi_actuals").select("*").eq("company_id", companyId)
      : Promise.resolve({ data: [] as KpiActual[], error: null }),
    companyId
      ? supabase.from("kpi_master_selections").select("kpi_code").eq("company_id", companyId)
      : Promise.resolve({ data: [] as { kpi_code: string }[], error: null }),
  ]);
  if (kpiActualsRes.error) console.error("[compliance] kpi_actuals error:", kpiActualsRes.error.message);
  if (kpiSelectionsRes.error) console.error("[compliance] kpi_master_selections error:", kpiSelectionsRes.error.message);

  const kpiSelections = ((kpiSelectionsRes.data ?? []) as { kpi_code: string }[]).map(r => r.kpi_code);
  const kpiActuals = (kpiActualsRes.data ?? []) as KpiActual[];
  console.log('[compliance] actuals:', kpiActuals.length, 'selections:', kpiSelections.length, 'companyId:', companyId);

  // ── 물질수지 데이터 ───────────────────────────────────────
  const [mbItemsRes, mbActualsRes, efRes] = await Promise.all([
    companyId
      ? supabase.from("material_balance_items").select("*").eq("company_id", companyId).order("sort_order")
      : Promise.resolve({ data: [], error: null }),
    companyId
      ? supabase.from("material_balance_actuals").select("*").eq("company_id", companyId)
      : Promise.resolve({ data: [], error: null }),
    supabase.from("emission_factor_master").select("*"),
  ]);
  const mbItems = (mbItemsRes.data ?? []) as MBItem[];
  const mbActuals = (mbActualsRes.data ?? []) as MBActual[];
  const emissionFactors = (efRes.data ?? []) as EmissionFactor[];

  // ── ESG 자동 계산값 ───────────────────────────────────────
  const autoValues: Record<string, number> = {};

  if (companyId) {
    const [
      { count: auditTotal }, { count: auditDone },
      { count: capaTotal },  { count: capaDone },
      { count: docTotal },   { count: docActive },
      { count: trainTotal }, { count: trainDone },
      { count: supplierTotal }, { count: supplierEvaled },
    ] = await Promise.all([
      supabase.from("audits").select("*", { count: "exact", head: true }).eq("company_id", companyId),
      supabase.from("audits").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("status", "completed"),
      supabase.from("capas").select("*", { count: "exact", head: true }),
      supabase.from("capas").select("*", { count: "exact", head: true }).eq("status", "closed"),
      supabase.from("documents").select("*", { count: "exact", head: true }),
      supabase.from("documents").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("trainings").select("*", { count: "exact", head: true }),
      supabase.from("trainings").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("suppliers").select("*", { count: "exact", head: true }),
      supabase.from("suppliers").select("*", { count: "exact", head: true }).not("last_eval_date", "is", null),
    ]);

    // G-001 내부심사 실시율
    if ((auditTotal ?? 0) > 0)
      autoValues["G-001"] = Math.round(((auditDone ?? 0) / (auditTotal ?? 1)) * 100);
    // G-002 CAPA 완료율
    if ((capaTotal ?? 0) > 0)
      autoValues["G-002"] = Math.round(((capaDone ?? 0) / (capaTotal ?? 1)) * 100);
    // G-003 문서 유효율
    if ((docTotal ?? 0) > 0)
      autoValues["G-003"] = Math.round(((docActive ?? 0) / (docTotal ?? 1)) * 100);
    // G-004 공급자 평가 완료율
    if ((supplierTotal ?? 0) > 0)
      autoValues["G-004"] = Math.round(((supplierEvaled ?? 0) / (supplierTotal ?? 1)) * 100);
    // S-003 교육 이수율
    if ((trainTotal ?? 0) > 0)
      autoValues["S-003"] = Math.round(((trainDone ?? 0) / (trainTotal ?? 1)) * 100);
    // S-004 임직원 수 (company 데이터에서)
    const empTotal = (company?.employee_count_hq ?? 0) + (company?.employee_count_out ?? 0);
    if (empTotal > 0) autoValues["S-004"] = empTotal;
    // S-006 교육훈련 완료 건수 (duration_hours 컬럼 없으면 건수로 대체)
    if ((trainDone ?? 0) > 0) autoValues["S-006"] = trainDone ?? 0;
  }

  return (
    <AppLayout>
      <ComplianceTabsClient
        companyId={companyId}
        kpiActuals={kpiActuals}
        autoValues={autoValues}
        mbItems={mbItems}
        mbActuals={mbActuals}
        emissionFactors={emissionFactors}
        currentYear={currentYear}
        kpiSelections={kpiSelections}
      />
    </AppLayout>
  );
}
