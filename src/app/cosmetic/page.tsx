import AppLayout from "@/components/layout/AppLayoutServer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function getKpiData() {
  let batchCount = 0;
  let failCount = 0;
  let complaintCount = 0;
  let stabilityCount = 0;

  try {
    const { count } = await supabase
      .from("cosmetic_batches")
      .select("*", { count: "exact", head: true })
      .gte("manufacture_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10));
    batchCount = count ?? 0;
  } catch {}

  try {
    const { count } = await supabase
      .from("cosmetic_batches")
      .select("*", { count: "exact", head: true })
      .eq("qc_result", "불합격");
    failCount = count ?? 0;
  } catch {}

  try {
    const { count } = await supabase
      .from("cosmetic_complaints")
      .select("*", { count: "exact", head: true });
    complaintCount = count ?? 0;
  } catch {}

  try {
    const { count } = await supabase
      .from("cosmetic_stability")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_progress");
    stabilityCount = count ?? 0;
  } catch {}

  return { batchCount, failCount, complaintCount, stabilityCount };
}

const thStyle: React.CSSProperties = {
  padding: "10px 16px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 600,
  color: "#999",
  background: "#FAFAFA",
  borderBottom: "1px solid #E5E5E5",
  whiteSpace: "nowrap",
};

const emptyTd: React.CSSProperties = {
  padding: "48px 16px",
  textAlign: "center",
  color: "#bbb",
  fontSize: 13,
};

export default async function CosmeticPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab = rawTab === "qc" || rawTab === "complaints" ? rawTab : "batch";

  const kpi = await getKpiData();

  const tabs = [
    { key: "batch",      label: "배치 기록" },
    { key: "qc",         label: "품질관리" },
    { key: "complaints", label: "불만·리콜" },
  ] as const;

  return (
    <AppLayout>
      <div style={{ padding: 32 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>화장품 GMP 관리</h1>
          <Link
            href="/forms/F-CG-01/new"
            style={{ background: "#E64980", color: "#fff", padding: "7px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            배치 기록 작성
          </Link>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>이번달 제조 배치</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }}>{kpi.batchCount}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>이번달 제조 배치 수</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>불합격 배치</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: kpi.failCount > 0 ? "#E03131" : "#2F9E44", lineHeight: 1.1 }}>{kpi.failCount}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>검사 불합격 배치 수</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>불만 접수</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: kpi.complaintCount > 0 ? "#E67700" : "#1a1a1a", lineHeight: 1.1 }}>{kpi.complaintCount}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>불만 접수 건수</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>안정성 시험</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#3B5BDB", lineHeight: 1.1 }}>{kpi.stabilityCount}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>진행 중인 시험</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #E5E5E5" }}>
            {tabs.map(t => (
              <Link
                key={t.key}
                href={`/cosmetic?tab=${t.key}`}
                style={{
                  padding: "12px 20px", fontSize: 13,
                  fontWeight: tab === t.key ? 600 : 400,
                  color: tab === t.key ? "#E64980" : "#666",
                  textDecoration: "none",
                  borderBottom: tab === t.key ? "2px solid #E64980" : "2px solid transparent",
                  marginBottom: -1, display: "inline-block",
                }}
              >
                {t.label}
              </Link>
            ))}
          </div>

          <div style={{ padding: 24 }}>
            {/* 배치 기록 탭 */}
            {tab === "batch" && (
              <div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <Link
                    href="/forms/F-CG-01/new"
                    style={{ fontSize: 13, fontWeight: 600, background: "#FFE3EC", color: "#E64980", padding: "6px 12px", borderRadius: 6, textDecoration: "none" }}
                  >
                    배치 기록 작성 →
                  </Link>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>배치번호</th>
                      <th style={thStyle}>제품명</th>
                      <th style={thStyle}>제조일</th>
                      <th style={thStyle}>배치규모</th>
                      <th style={thStyle}>품질검사</th>
                      <th style={thStyle}>출하결정</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colSpan={6} style={emptyTd}>등록된 배치 기록이 없습니다</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* 품질관리 탭 */}
            {tab === "qc" && (
              <div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginBottom: 16 }}>
                  <Link
                    href="/forms/F-CG-02/new"
                    style={{ fontSize: 13, fontWeight: 600, background: "#FFE3EC", color: "#E64980", padding: "6px 12px", borderRadius: 6, textDecoration: "none" }}
                  >
                    입고검사 기록 →
                  </Link>
                  <Link
                    href="/forms/F-CG-03/new"
                    style={{ fontSize: 13, fontWeight: 600, background: "#FFE3EC", color: "#E64980", padding: "6px 12px", borderRadius: 6, textDecoration: "none" }}
                  >
                    출하검사 기록 →
                  </Link>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>검사일</th>
                      <th style={thStyle}>구분</th>
                      <th style={thStyle}>원료명/제품명</th>
                      <th style={thStyle}>LOT번호</th>
                      <th style={thStyle}>검사자</th>
                      <th style={thStyle}>종합 판정</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colSpan={6} style={emptyTd}>등록된 검사 기록이 없습니다</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* 불만·리콜 탭 */}
            {tab === "complaints" && (
              <div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <Link
                    href="/forms/F-CG-06/new"
                    style={{ fontSize: 13, fontWeight: 600, background: "#FFE3EC", color: "#E64980", padding: "6px 12px", borderRadius: 6, textDecoration: "none" }}
                  >
                    불만 접수 →
                  </Link>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>불만번호</th>
                      <th style={thStyle}>접수일</th>
                      <th style={thStyle}>고객명</th>
                      <th style={thStyle}>제품명</th>
                      <th style={thStyle}>불만유형</th>
                      <th style={thStyle}>심각도</th>
                      <th style={thStyle}>리콜필요</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colSpan={7} style={emptyTd}>등록된 불만 기록이 없습니다</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
