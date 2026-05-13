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

export default async function FoodSafetyPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab =
    rawTab === "prp" || rawTab === "team" ? rawTab : "haccp";

  let ccpCount = 0;
  let monitoringCount = 0;
  const prpRate = 0;
  let meetingCount = 0;

  try {
    const { count } = await supabase
      .from("ccp_records")
      .select("*", { count: "exact", head: true });
    ccpCount = count ?? 0;
  } catch {
    ccpCount = 0;
  }

  try {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const { count } = await supabase
      .from("ccp_monitoring")
      .select("*", { count: "exact", head: true })
      .gte("monitor_date", `${ym}-01`);
    monitoringCount = count ?? 0;
  } catch {
    monitoringCount = 0;
  }

  try {
    const { count } = await supabase
      .from("food_safety_meetings")
      .select("*", { count: "exact", head: true });
    meetingCount = count ?? 0;
  } catch {
    meetingCount = 0;
  }

  let haccpRows: { ccp_no: string; process_step: string; hazard: string; critical_limit: string; monitoring_method: string; created_at: string }[] = [];
  try {
    const { data } = await supabase
      .from("ccp_records")
      .select("ccp_no, process_step, hazard, critical_limit, monitoring_method, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    haccpRows = (data ?? []) as typeof haccpRows;
  } catch {
    haccpRows = [];
  }

  let prpRows: { check_date: string; inspector: string; area: string; result: string }[] = [];
  try {
    const { data } = await supabase
      .from("prp_checks")
      .select("check_date, inspector, area, result")
      .order("check_date", { ascending: false })
      .limit(50);
    prpRows = (data ?? []) as typeof prpRows;
  } catch {
    prpRows = [];
  }

  let teamRows: { meeting_date: string; chairperson: string; attendees: string; agenda: string }[] = [];
  try {
    const { data } = await supabase
      .from("food_safety_meetings")
      .select("meeting_date, chairperson, attendees, agenda")
      .order("meeting_date", { ascending: false })
      .limit(50);
    teamRows = (data ?? []) as typeof teamRows;
  } catch {
    teamRows = [];
  }

  return (
    <AppLayout>
      <div style={{ padding: 32 }}>
        <ModulePageHeader
          title="식품안전 관리 (ISO 22000)"
          actionHref="/forms/F-FS-01/new"
          actionLabel="새 위해요소 분석"
        />

        <ModuleKpiGrid
          items={[
            { label: "CCP 등록 수", value: ccpCount, description: "중요관리점" },
            { label: "이번달 모니터링 기록 수", value: monitoringCount, description: "이번달 기준" },
            { label: "PRP 점검 완료율", value: `${prpRate}%`, description: "선행요건 프로그램" },
            { label: "식품안전팀 회의 횟수", value: meetingCount, description: "누적 회의 횟수" },
          ]}
        />

        <ModulePanel>
          <ModuleTabs
            basePath="/food-safety"
            activeValue={tab}
            items={[
              { value: "haccp", label: "HACCP 관리" },
              { value: "prp", label: "PRP 점검" },
              { value: "team", label: "식품안전팀 회의" },
            ]}
          />

          <div style={{ padding: 24 }}>
            {tab === "haccp" && (
              <>
                <ModulePanelAction href="/forms/F-FS-01/new" label="새 위해요소 분석 →" />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={MODULE_TABLE_HEADER_STYLE}>CCP번호</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>공정단계</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>위해요소</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>한계기준</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>모니터링방법</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>등록일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {haccpRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 CCP가 없습니다
                        </td>
                      </tr>
                    ) : (
                      haccpRows.map((row, i) => (
                        <tr key={i}>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.ccp_no}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.process_step}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.hazard}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.critical_limit}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.monitoring_method}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.created_at?.slice(0, 10)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}

            {tab === "prp" && (
              <>
                <ModulePanelAction href="/forms/F-FS-05/new" label="PRP 점검 기록 →" />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={MODULE_TABLE_HEADER_STYLE}>점검일</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>점검자</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>점검구역</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>결과</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prpRows.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 PRP 점검 기록이 없습니다
                        </td>
                      </tr>
                    ) : (
                      prpRows.map((row, i) => (
                        <tr key={i}>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.check_date}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.inspector}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.area}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.result}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}

            {tab === "team" && (
              <>
                <ModulePanelAction href="/forms/F-FS-09/new" label="회의록 작성 →" />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={MODULE_TABLE_HEADER_STYLE}>회의일</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>주재자</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>참석자</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>주요안건</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamRows.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 회의록이 없습니다
                        </td>
                      </tr>
                    ) : (
                      teamRows.map((row, i) => (
                        <tr key={i}>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.meeting_date}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.chairperson}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.attendees}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.agenda}</td>
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
