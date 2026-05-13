import { cookies } from "next/headers";
import Link from "next/link";
import AppLayoutServer from "@/components/layout/AppLayoutServer";
import { supabase } from "@/lib/supabase";

type Report = {
  id: string;
  company_id: string;
  tracking_code: string;
  report_type: string;
  sub_type: string | null;
  content: string;
  status: "received" | "reviewing" | "completed";
  handler_id: string | null;
  handler_note: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  received:  { bg: "#F5F5F5", color: "#888",    label: "접수완료" },
  reviewing: { bg: "#EEF2FF", color: "#3B5BDB", label: "검토중"   },
  completed: { bg: "#EBFBEE", color: "#2F9E44", label: "처리완료" },
};

const TYPE_LABELS: Record<string, string> = {
  safety:      "🦺 안전보건",
  antibribery: "🚫 반부패",
  quality:     "⚠️ 품질",
  workplace:   "💬 직장문화",
  other:       "기타",
};

const CATEGORY_TABS = [
  { label: "전체",   value: "" },
  { label: "안전보건", value: "safety" },
  { label: "반부패",  value: "antibribery" },
  { label: "품질",   value: "quality" },
  { label: "직장문화", value: "workplace" },
];

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const companyId = (await cookies()).get("company_id")?.value;

  let reports: Report[] = [];

  try {
    let query = supabase
      .from("anonymous_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (companyId) {
      query = query.eq("company_id", companyId);
    }

    if (category) {
      query = query.eq("report_type", category);
    }

    const { data } = await query;
    reports = (data ?? []) as Report[];
  } catch {
    // Table may not exist yet
  }

  const total     = reports.length;
  const newCount  = reports.filter((r) => r.status === "received").length;
  const reviewing = reports.filter((r) => r.status === "reviewing").length;
  const completed = reports.filter((r) => r.status === "completed").length;

  const kpiCards = [
    { label: "전체 제보",    value: total,     bg: "#fff",     color: "#1a1a1a", border: "#E5E5E5" },
    { label: "신규 미처리",  value: newCount,  bg: "#FFF0F0",  color: "#E03131", border: "#FFCDD2" },
    { label: "검토중",       value: reviewing, bg: "#EEF2FF",  color: "#3B5BDB", border: "#C5CAE9" },
    { label: "처리완료",     value: completed, bg: "#EBFBEE",  color: "#2F9E44", border: "#C8E6C9" },
  ];

  return (
    <AppLayoutServer>
      <div style={{ padding: "32px 32px 64px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
            익명 제보 관리
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#888" }}>
            자사 임직원의 익명 제보를 관리합니다
          </p>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {kpiCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: card.bg,
                border: `1px solid ${card.border}`,
                borderRadius: 10,
                padding: "18px 22px",
              }}
            >
              <p style={{ margin: 0, fontSize: 12, color: "#888", marginBottom: 6 }}>{card.label}</p>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: card.color }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Category Filter Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #E5E5E5", paddingBottom: 0 }}>
          {CATEGORY_TABS.map((tab) => {
            const isActive = (category ?? "") === tab.value;
            const href = tab.value ? `/reports?category=${tab.value}` : "/reports";
            return (
              <Link
                key={tab.value}
                href={href}
                style={{
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#3B5BDB" : "#555",
                  borderBottom: isActive ? "2px solid #3B5BDB" : "2px solid transparent",
                  textDecoration: "none",
                  marginBottom: -1,
                  display: "inline-block",
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Report Table */}
        <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8F9FA", borderBottom: "1px solid #E5E5E5" }}>
                {["추적코드", "유형", "내용요약", "접수일", "상태", "담당자", ""].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#999",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}
                  >
                    접수된 제보가 없습니다.
                  </td>
                </tr>
              ) : (
                reports.map((r) => {
                  const isNew    = r.status === "received";
                  const statusCfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.received;
                  const typeLabel = TYPE_LABELS[r.report_type] ?? r.report_type;
                  const dateStr   = r.created_at
                    ? new Date(r.created_at).toLocaleDateString("ko-KR")
                    : "-";
                  const summary   = r.content
                    ? r.content.length > 60
                      ? r.content.slice(0, 60) + "…"
                      : r.content
                    : "-";

                  return (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: "1px solid #F0F0F0",
                        background: isNew ? "#F0F4FF" : "#fff",
                      }}
                    >
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#3B5BDB", fontFamily: "monospace" }}>
                        {r.tracking_code}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>
                        {typeLabel}
                        {r.sub_type && (
                          <span style={{
                            marginLeft: 6,
                            fontSize: 11,
                            padding: "2px 7px",
                            borderRadius: 8,
                            background: "#F0F0F0",
                            color: "#777",
                          }}>
                            {r.sub_type}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#444", maxWidth: 280 }}>
                        {summary}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#888", whiteSpace: "nowrap" }}>
                        {dateStr}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: statusCfg.bg,
                          color: statusCfg.color,
                        }}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#555" }}>
                        {r.handler_id ?? "-"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Link
                          href={`/reports/${r.id}`}
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#3B5BDB",
                            textDecoration: "none",
                            padding: "4px 10px",
                            border: "1px solid #C5CAE9",
                            borderRadius: 6,
                            background: "#EEF2FF",
                          }}
                        >
                          보기 →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayoutServer>
  );
}
