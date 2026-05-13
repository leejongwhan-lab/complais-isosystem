import AppLayout from "@/components/layout/AppLayoutServer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function NuclearPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab =
    rawTab === "safety" || rawTab === "audit" ? rawTab : "itns";

  let itnsCount = 0;
  let q1Count = 0;
  let tamperProofCount = 0;
  let supplierCount = 0;

  try {
    const { count } = await supabase
      .from("nuclear_itns")
      .select("*", { count: "exact", head: true });
    itnsCount = count ?? 0;
  } catch { itnsCount = 0; }

  try {
    const { count } = await supabase
      .from("nuclear_itns")
      .select("*", { count: "exact", head: true })
      .eq("quality_grade", "Q1");
    q1Count = count ?? 0;
  } catch { q1Count = 0; }

  try {
    const { count } = await supabase
      .from("nuclear_itns")
      .select("*", { count: "exact", head: true })
      .eq("tamper_proof", true);
    tamperProofCount = count ?? 0;
  } catch { tamperProofCount = 0; }

  try {
    const { count } = await supabase
      .from("nuclear_suppliers")
      .select("*", { count: "exact", head: true })
      .eq("certified", true);
    supplierCount = count ?? 0;
  } catch { supplierCount = 0; }

  let itnsRows: { item_code: string; item_name: string; quality_grade: string; safety_class: string; supplier: string }[] = [];
  try {
    const { data } = await supabase
      .from("nuclear_itns")
      .select("item_code, item_name, quality_grade, safety_class, supplier")
      .order("item_code", { ascending: true })
      .limit(50);
    itnsRows = (data ?? []) as typeof itnsRows;
  } catch { itnsRows = []; }

  let safetyRows: { eval_date: string; evaluator: string; eval_period: string; total_score: number | null; overall_eval: string }[] = [];
  try {
    const { data } = await supabase
      .from("nuclear_safety_culture")
      .select("eval_date, evaluator, eval_period, total_score, overall_eval")
      .order("eval_date", { ascending: false })
      .limit(50);
    safetyRows = (data ?? []) as typeof safetyRows;
  } catch { safetyRows = []; }

  let auditRows: { audit_no: string; audit_date: string; audit_scope: string; lead_auditor: string; follow_up: string }[] = [];
  try {
    const { data } = await supabase
      .from("nuclear_quality_audits")
      .select("audit_no, audit_date, audit_scope, lead_auditor, follow_up")
      .order("audit_date", { ascending: false })
      .limit(50);
    auditRows = (data ?? []) as typeof auditRows;
  } catch { auditRows = []; }

  const buttonStyle: React.CSSProperties = {
    background: "#3B5BDB",
    color: "#fff",
    padding: "7px 14px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
  };

  const thStyle: React.CSSProperties = {
    padding: "10px 16px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 600,
    color: "#999",
    background: "#FAFAFA",
    borderBottom: "1px solid #E5E5E5",
  };

  const actionLinkStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    background: "#EEF2FF",
    color: "#3B5BDB",
    padding: "6px 12px",
    borderRadius: 6,
    textDecoration: "none",
  };

  const tabLink = (value: string, label: string) => (
    <Link
      href={`/nuclear?tab=${value}`}
      style={{
        padding: "12px 20px",
        fontSize: 13,
        fontWeight: tab === value ? 600 : 400,
        color: tab === value ? "#3B5BDB" : "#666",
        textDecoration: "none",
        borderBottom: tab === value ? "2px solid #3B5BDB" : "2px solid transparent",
        marginBottom: -1,
        display: "inline-block",
      }}
    >
      {label}
    </Link>
  );

  return (
    <AppLayout>
      <div style={{ padding: 32 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
            원자력 품질 관리 (ISO 19443)
          </h1>
          <Link href="/forms/F-NQ-01/new" style={buttonStyle}>
            ITNS 등록
          </Link>
        </div>

        {/* KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>ITNS 품목 수</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }}>{itnsCount}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>등록된 ITNS 품목</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>품질등급 Q1 수</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }}>{q1Count}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Q1 등급 품목</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>위변조 방지 관리 품목</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }}>{tamperProofCount}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>위변조 방지 품목 수</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>원자력 공급자 인정 수</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }}>{supplierCount}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>인정된 공급자 수</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #E5E5E5" }}>
            {tabLink("itns", "ITNS 품목")}
            {tabLink("safety", "안전문화 평가")}
            {tabLink("audit", "품질감사")}
          </div>

          <div style={{ padding: 24 }}>
            {tab === "itns" && (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <Link href="/forms/F-NQ-01/new" style={actionLinkStyle}>ITNS 등록 →</Link>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>품목코드</th>
                      <th style={thStyle}>품목/용역명</th>
                      <th style={thStyle}>품질등급</th>
                      <th style={thStyle}>안전분류</th>
                      <th style={thStyle}>공급자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itnsRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 ITNS 품목이 없습니다
                        </td>
                      </tr>
                    ) : (
                      itnsRows.map((row, i) => (
                        <tr key={i}>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.item_code}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.item_name}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.quality_grade}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.safety_class}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.supplier}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}

            {tab === "safety" && (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <Link href="/forms/F-NQ-02/new" style={actionLinkStyle}>안전문화 평가 →</Link>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>평가일</th>
                      <th style={thStyle}>평가자</th>
                      <th style={thStyle}>평가기간</th>
                      <th style={thStyle}>총점</th>
                      <th style={thStyle}>종합평가</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safetyRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 안전문화 평가가 없습니다
                        </td>
                      </tr>
                    ) : (
                      safetyRows.map((row, i) => (
                        <tr key={i}>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.eval_date}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.evaluator}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.eval_period}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.total_score ?? "-"}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.overall_eval}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}

            {tab === "audit" && (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <Link href="/forms/F-NQ-07/new" style={actionLinkStyle}>품질감사 기록 →</Link>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>감사번호</th>
                      <th style={thStyle}>감사일</th>
                      <th style={thStyle}>감사범위</th>
                      <th style={thStyle}>주임감사원</th>
                      <th style={thStyle}>후속조치</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 품질감사 기록이 없습니다
                        </td>
                      </tr>
                    ) : (
                      auditRows.map((row, i) => (
                        <tr key={i}>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.audit_no}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.audit_date}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.audit_scope}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.lead_auditor}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.follow_up}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
