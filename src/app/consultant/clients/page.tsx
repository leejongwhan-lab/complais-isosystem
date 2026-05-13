import ConsultantLayout from "@/components/consultant/ConsultantLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const STD_BADGES = [
  { key: "std_iso9001",  label: "9001",  color: "#3B5BDB", bg: "#EEF2FF" },
  { key: "std_iso14001", label: "14001", color: "#2F9E44", bg: "#EBFBEE" },
  { key: "std_iso45001", label: "45001", color: "#E67700", bg: "#FFF9DB" },
  { key: "std_iso50001", label: "50001", color: "#E67700", bg: "#FFF9DB" },
  { key: "std_iso37301", label: "37301", color: "#1098AD", bg: "#E3FAFC" },
  { key: "std_iso27001", label: "27001", color: "#7048E8", bg: "#F3F0FF" },
  { key: "std_iso37001", label: "37001", color: "#2F9E44", bg: "#EBFBEE" },
] as const;

type BadgeKey = (typeof STD_BADGES)[number]["key"];

type ClientRow = {
  id: string;
  company_id: string;
  assigned_at: string | null;
  status: string;
  company_name: string;
  industry: string | null;
  std_iso9001: boolean;
  std_iso14001: boolean;
  std_iso45001: boolean;
  std_iso50001: boolean;
  std_iso37001: boolean;
  std_iso37301: boolean;
  std_iso27001: boolean;
  openCapaCount: number;
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default async function ConsultantClientsPage() {
  let rows: ClientRow[] = [];

  try {
    const { data: ccRows } = await supabase
      .from("consultant_clients")
      .select("id, company_id, assigned_at, status")
      .eq("status", "active");

    if (ccRows && ccRows.length > 0) {
      const companyIds = ccRows.map((r: { company_id: string }) => r.company_id);

      const { data: companies } = await supabase
        .from("companies")
        .select(
          "id, company_name, industry, " +
          "std_iso9001, std_iso14001, std_iso45001, std_iso50001, std_iso37001, std_iso37301, std_iso27001"
        )
        .in("id", companyIds);

      if (companies) {
        const companyMap = new Map(
          (companies as unknown as Array<{ id: string } & Record<string, unknown>>).map((c) => [c.id, c])
        );

        rows = ccRows.map(
          (cc: { id: string; company_id: string; assigned_at: string | null; status: string }) => {
            const co = companyMap.get(cc.company_id) ?? {};
            return {
              id: cc.id,
              company_id: cc.company_id,
              assigned_at: cc.assigned_at,
              status: cc.status,
              company_name: (co as Record<string, unknown>).company_name as string ?? "-",
              industry: (co as Record<string, unknown>).industry as string | null ?? null,
              std_iso9001: Boolean((co as Record<string, unknown>).std_iso9001),
              std_iso14001: Boolean((co as Record<string, unknown>).std_iso14001),
              std_iso45001: Boolean((co as Record<string, unknown>).std_iso45001),
              std_iso50001: Boolean((co as Record<string, unknown>).std_iso50001),
              std_iso37001: Boolean((co as Record<string, unknown>).std_iso37001),
              std_iso37301: Boolean((co as Record<string, unknown>).std_iso37301),
              std_iso27001: Boolean((co as Record<string, unknown>).std_iso27001),
              openCapaCount: 0,
            };
          }
        );

        for (const row of rows) {
          try {
            const { count } = await supabase
              .from("capas")
              .select("*", { count: "exact", head: true })
              .eq("company_id", row.company_id)
              .neq("status", "completed");
            row.openCapaCount = count ?? 0;
          } catch {
            row.openCapaCount = 0;
          }
        }
      }
    }
  } catch {
    // table may not exist yet
  }

  return (
    <ConsultantLayout active="/consultant/clients">
      <div style={{ padding: 32 }}>
        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
            고객사 목록
          </h1>
        </div>

        {rows.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              color: "#bbb",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>🏢</div>
            <p style={{ margin: 0, fontSize: 14 }}>담당 고객사가 없습니다</p>
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              border: "1px solid #E5E5E5",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
                  {["회사명", "적용표준", "미완료CAPA", "배정일", "상태", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#555",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    style={{ borderBottom: "1px solid #F0F0F0" }}
                  >
                    {/* 회사명 */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#1a1a1a" }}>
                        {row.company_name}
                      </div>
                      {row.industry && (
                        <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                          {row.industry}
                        </div>
                      )}
                    </td>

                    {/* 적용표준 */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        {STD_BADGES.filter(
                          (b) => (row as Record<string, unknown>)[b.key as BadgeKey]
                        ).map((b) => (
                          <span
                            key={b.key}
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              padding: "1px 5px",
                              borderRadius: 3,
                              background: b.bg,
                              color: b.color,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {b.label}
                          </span>
                        ))}
                        {STD_BADGES.every(
                          (b) => !(row as Record<string, unknown>)[b.key as BadgeKey]
                        ) && (
                          <span style={{ fontSize: 11, color: "#ccc" }}>-</span>
                        )}
                      </div>
                    </td>

                    {/* 미완료CAPA */}
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: row.openCapaCount > 0 ? "#E03131" : "#2F9E44",
                        }}
                      >
                        {row.openCapaCount}
                      </span>
                    </td>

                    {/* 배정일 */}
                    <td style={{ padding: "14px 16px", color: "#555", whiteSpace: "nowrap" }}>
                      {formatDate(row.assigned_at)}
                    </td>

                    {/* 상태 */}
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: row.status === "active" ? "#F3F0FF" : "#F0F0F0",
                          color: row.status === "active" ? "#7C3AED" : "#888",
                        }}
                      >
                        {row.status === "active" ? "활성" : "비활성"}
                      </span>
                    </td>

                    {/* 상세보기 */}
                    <td style={{ padding: "14px 16px" }}>
                      <Link
                        href={`/consultant/clients/${row.company_id}`}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#7C3AED",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        상세보기 →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ConsultantLayout>
  );
}
