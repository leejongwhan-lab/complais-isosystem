import AppLayout from "@/components/layout/AppLayoutServer";
import {
  MODULE_TABLE_CELL_STYLE,
  MODULE_TABLE_HEADER_STYLE,
  ModuleKpiGrid,
  ModulePageHeader,
  ModulePanel,
  ModulePanelAction,
  ModuleTabs,
} from "@/components/ui/module-page";
import { supabase } from "@/lib/supabase";

export default async function AiMgmtPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab =
    rawTab === "impact" || rawTab === "monitoring" ? rawTab : "systems";

  let systemCount = 0;
  let highRiskCount = 0;
  const impactRate = 0;
  let monitoringCount = 0;

  try {
    const { count } = await supabase
      .from("ai_systems")
      .select("*", { count: "exact", head: true });
    systemCount = count ?? 0;
  } catch {
    systemCount = 0;
  }

  try {
    const { count } = await supabase
      .from("ai_systems")
      .select("*", { count: "exact", head: true })
      .eq("risk_level", "고위험");
    highRiskCount = count ?? 0;
  } catch {
    highRiskCount = 0;
  }

  try {
    const { count } = await supabase
      .from("ai_monitoring_records")
      .select("*", { count: "exact", head: true });
    monitoringCount = count ?? 0;
  } catch {
    monitoringCount = 0;
  }

  let systemRows: { system_id: string; system_name: string; ai_type: string; risk_level: string; owner: string; status: string }[] = [];
  try {
    const { data } = await supabase
      .from("ai_systems")
      .select("system_id, system_name, ai_type, risk_level, owner, status")
      .order("system_id", { ascending: true })
      .limit(50);
    systemRows = (data ?? []) as typeof systemRows;
  } catch {
    systemRows = [];
  }

  let impactRows: { system_name: string; eval_date: string; evaluator: string; overall_risk: string; approved: string }[] = [];
  try {
    const { data } = await supabase
      .from("ai_impact_assessments")
      .select("system_name, eval_date, evaluator, overall_risk, approved")
      .order("eval_date", { ascending: false })
      .limit(50);
    impactRows = (data ?? []) as typeof impactRows;
  } catch {
    impactRows = [];
  }

  let monitorRows: { record_month: string; system_name: string; manager: string; drift_detected: string; overall_eval: string }[] = [];
  try {
    const { data } = await supabase
      .from("ai_monitoring_records")
      .select("record_month, system_name, manager, drift_detected, overall_eval")
      .order("record_month", { ascending: false })
      .limit(50);
    monitorRows = (data ?? []) as typeof monitorRows;
  } catch {
    monitorRows = [];
  }

  return (
    <AppLayout>
      <div style={{ padding: 32 }}>
        <ModulePageHeader
          title="AI 관리 시스템 (ISO 42001)"
          actionHref="/forms/F-AI-01/new"
          actionLabel="AI 시스템 등록"
        />

        <ModuleKpiGrid
          items={[
            { label: "AI 시스템 등록 수", value: systemCount, description: "등록된 AI 시스템" },
            { label: "고위험 AI 수", value: highRiskCount, description: "고위험 등급 시스템" },
            { label: "영향평가 완료율", value: `${impactRate}%`, description: "영향평가 완료 비율" },
            { label: "모니터링 기록 수", value: monitoringCount, description: "누적 모니터링 기록" },
          ]}
        />

        <ModulePanel>
          <ModuleTabs
            basePath="/ai-mgmt"
            activeValue={tab}
            items={[
              { value: "systems", label: "AI 시스템" },
              { value: "impact", label: "영향평가" },
              { value: "monitoring", label: "모니터링" },
            ]}
          />

          <div style={{ padding: 24 }}>
            {tab === "systems" && (
              <>
                <ModulePanelAction href="/forms/F-AI-01/new" label="AI 시스템 등록 →" />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={MODULE_TABLE_HEADER_STYLE}>시스템ID</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>AI시스템명</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>AI유형</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>위험등급</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>책임자</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 AI 시스템이 없습니다
                        </td>
                      </tr>
                    ) : (
                      systemRows.map((row, i) => (
                        <tr key={i}>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.system_id}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.system_name}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.ai_type}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.risk_level}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.owner}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}

            {tab === "impact" && (
              <>
                <ModulePanelAction href="/forms/F-AI-02/new" label="영향평가 작성 →" />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={MODULE_TABLE_HEADER_STYLE}>시스템명</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>평가일</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>평가자</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>전체위험</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>승인여부</th>
                    </tr>
                  </thead>
                  <tbody>
                    {impactRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 영향평가가 없습니다
                        </td>
                      </tr>
                    ) : (
                      impactRows.map((row, i) => (
                        <tr key={i}>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.system_name}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.eval_date}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.evaluator}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.overall_risk}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.approved}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}

            {tab === "monitoring" && (
              <>
                <ModulePanelAction href="/forms/F-AI-05/new" label="모니터링 기록 →" />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={MODULE_TABLE_HEADER_STYLE}>기록월</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>시스템명</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>담당자</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>드리프트감지</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>종합평가</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monitorRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 모니터링 기록이 없습니다
                        </td>
                      </tr>
                    ) : (
                      monitorRows.map((row, i) => (
                        <tr key={i}>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.record_month}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.system_name}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.manager}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.drift_detected}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.overall_eval}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </ModulePanel>
      </div>
    </AppLayout>
  );
}
