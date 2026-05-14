import AppLayout from "@/components/layout/AppLayoutServer";
import { getCompany } from "@/lib/company";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { KpiMaster, KpiActual } from "@/components/compliance/ComplianceESGClient";
import type { MBItem, MBActual, EmissionFactor } from "@/components/compliance/ComplianceMBClient";
import ComplianceTabsClient from "@/components/compliance/ComplianceTabsClient";

export default async function CompliancePage() {
  const [supabase, company] = await Promise.all([
    createSupabaseServerClient(),
    getCompany(),
  ]);
  const companyId = company?.id ?? "";
  const currentYear = new Date().getFullYear();

  // ── KPI 데이터 ────────────────────────────────────────────
  const [kpiMasterRes, kpiActualsRes, kpiSelectionsRes] = await Promise.all([
    supabase.from("kpi_master").select("*").order("category_esg").order("sort_order"),
    companyId
      ? supabase.from("kpi_actuals").select("*").eq("company_id", companyId)
      : Promise.resolve({ data: [], error: null }),
    companyId
      ? supabase.from("kpi_master_selections").select("kpi_code").eq("company_id", companyId)
      : Promise.resolve({ data: [], error: null }),
  ]);
  const allKpis = (kpiMasterRes.data ?? []) as KpiMaster[];
  const kpiSelections = ((kpiSelectionsRes.data ?? []) as { kpi_code: string }[]).map(r => r.kpi_code);
  const kpiMaster = kpiSelections.length > 0
    ? allKpis.filter(k => kpiSelections.includes(k.kpi_code))
    : allKpis;
  const kpiActuals = (kpiActualsRes.data ?? []) as KpiActual[];
  console.log('[compliance] kpi_master total:', allKpis.length, 'selected:', kpiMaster.length, 'actuals:', kpiActuals.length, 'companyId:', companyId);

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
    ] = await Promise.all([
      supabase.from("audits").select("*", { count: "exact", head: true }).eq("company_id", companyId),
      supabase.from("audits").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("status", "completed"),
      supabase.from("capas").select("*", { count: "exact", head: true }),
      supabase.from("capas").select("*", { count: "exact", head: true }).eq("status", "closed"),
      supabase.from("documents").select("*", { count: "exact", head: true }),
      supabase.from("documents").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("trainings").select("*", { count: "exact", head: true }),
      supabase.from("trainings").select("*", { count: "exact", head: true }).eq("status", "completed"),
    ]);

    if ((auditTotal ?? 0) > 0)
      autoValues["G-001"] = Math.round(((auditDone ?? 0) / (auditTotal ?? 1)) * 100);
    if ((capaTotal ?? 0) > 0)
      autoValues["G-002"] = Math.round(((capaDone ?? 0) / (capaTotal ?? 1)) * 100);
    if ((docTotal ?? 0) > 0)
      autoValues["G-003"] = Math.round(((docActive ?? 0) / (docTotal ?? 1)) * 100);
    if ((trainTotal ?? 0) > 0)
      autoValues["S-003"] = Math.round(((trainDone ?? 0) / (trainTotal ?? 1)) * 100);
  }

  return (
    <AppLayout>
      <ComplianceTabsClient
        companyId={companyId}
        kpiMaster={kpiMaster}
        kpiActuals={kpiActuals}
        autoValues={autoValues}
        mbItems={mbItems}
        mbActuals={mbActuals}
        emissionFactors={emissionFactors}
        currentYear={currentYear}
        allKpis={allKpis}
        kpiSelections={kpiSelections}
      />
    </AppLayout>
  );
}
