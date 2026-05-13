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

export default async function BcmsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab = rawTab === "drill" ? rawTab : "bcp";

  let bcpCount = 0;
  let lastDrillDate = "-";
  const rtoRate = 0;
  const contactUpdated = "-";

  try {
    const { count } = await supabase
      .from("bcp_documents")
      .select("*", { count: "exact", head: true });
    bcpCount = count ?? 0;
  } catch {
    bcpCount = 0;
  }

  try {
    const { data } = await supabase
      .from("bcms_drills")
      .select("drill_date")
      .order("drill_date", { ascending: false })
      .limit(1);
    lastDrillDate = data?.[0]?.drill_date ?? "-";
  } catch {
    lastDrillDate = "-";
  }

  let bcpRows: { plan_name: string; version: string; established_date: string; owner: string; status: string }[] = [];
  try {
    const { data } = await supabase
      .from("bcp_documents")
      .select("plan_name, version, established_date, owner, status")
      .order("established_date", { ascending: false })
      .limit(50);
    bcpRows = (data ?? []) as typeof bcpRows;
  } catch {
    bcpRows = [];
  }

  let drillRows: { drill_date: string; drill_type: string; participants: number; rto_achieved: string; evaluator: string }[] = [];
  try {
    const { data } = await supabase
      .from("bcms_drills")
      .select("drill_date, drill_type, participants, rto_achieved, evaluator")
      .order("drill_date", { ascending: false })
      .limit(50);
    drillRows = (data ?? []) as typeof drillRows;
  } catch {
    drillRows = [];
  }

  return (
    <AppLayout>
      <div style={{ padding: 32 }}>
        <ModulePageHeader
          title="사업연속성 관리 (ISO 22301)"
          actionHref="/forms/F-BC-02/new"
          actionLabel="BCP 작성"
        />

        <ModuleKpiGrid
          items={[
            { label: "BCP 문서 수", value: bcpCount, description: "등록된 계획서" },
            { label: "최근 훈련일", value: lastDrillDate, description: "비상훈련 최근 수행일" },
            { label: "RTO 달성률", value: `${rtoRate}%`, description: "목표복구시간 달성률" },
            { label: "비상연락망 최신화일", value: contactUpdated, description: "최근 갱신일" },
          ]}
        />

        <ModulePanel>
          <ModuleTabs
            basePath="/bcms"
            activeValue={tab}
            items={[
              { value: "bcp", label: "BCP 계획서" },
              { value: "drill", label: "비상훈련" },
            ]}
          />

          <div style={{ padding: 24 }}>
            {tab === "bcp" && (
              <>
                <ModulePanelAction href="/forms/F-BC-02/new" label="BCP 작성 →" />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={MODULE_TABLE_HEADER_STYLE}>계획서명</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>버전</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>수립일</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>책임자</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bcpRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 BCP 계획서가 없습니다
                        </td>
                      </tr>
                    ) : (
                      bcpRows.map((row, i) => (
                        <tr key={i}>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.plan_name}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.version}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.established_date}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.owner}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}

            {tab === "drill" && (
              <>
                <ModulePanelAction href="/forms/F-BC-06/new" label="비상훈련 기록 →" />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={MODULE_TABLE_HEADER_STYLE}>훈련일</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>훈련유형</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>참가인원</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>RTO달성</th>
                      <th style={MODULE_TABLE_HEADER_STYLE}>평가자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drillRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 훈련 기록이 없습니다
                        </td>
                      </tr>
                    ) : (
                      drillRows.map((row, i) => (
                        <tr key={i}>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.drill_date}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.drill_type}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.participants}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.rto_achieved}</td>
                          <td style={MODULE_TABLE_CELL_STYLE}>{row.evaluator}</td>
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
