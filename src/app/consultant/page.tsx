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

type ClientCompany = {
  id: string;
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

function formatKoreanDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default async function ConsultantDashboardPage() {
  let clients: ClientCompany[] = [];

  try {
    const { data: ccRows } = await supabase
      .from("consultant_clients")
      .select("company_id")
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
        clients = (companies as unknown as Omit<ClientCompany, "openCapaCount">[]).map(
          (c) => ({ ...c, openCapaCount: 0 })
        );

        for (const client of clients) {
          try {
            const { count } = await supabase
              .from("capas")
              .select("*", { count: "exact", head: true })
              .eq("company_id", client.id)
              .neq("status", "completed");
            client.openCapaCount = count ?? 0;
          } catch {
            client.openCapaCount = 0;
          }
        }
      }
    }
  } catch {
    // table may not exist yet
  }

  const totalOpenCapas = clients.reduce((sum, c) => sum + c.openCapaCount, 0);
  const today = formatKoreanDate(new Date());

  return (
    <ConsultantLayout active="/consultant">
      <div style={{ padding: 32 }}>
        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
            컨설턴트 대시보드
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>{today}</p>
        </div>

        {/* KPI row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {/* Card 1 */}
          <div style={kpiCard}>
            <div style={kpiLabel}>담당 고객사</div>
            <div style={kpiValue}>{clients.length}</div>
          </div>
          {/* Card 2 */}
          <div style={kpiCard}>
            <div style={kpiLabel}>미완료 CAPA 합계</div>
            <div
              style={{
                ...kpiValue,
                color: totalOpenCapas > 0 ? "#E03131" : "#1a1a1a",
              }}
            >
              {totalOpenCapas}
            </div>
          </div>
          {/* Card 3 */}
          <div style={kpiCard}>
            <div style={kpiLabel}>인증 만료 임박</div>
            <div style={kpiValue}>0</div>
          </div>
          {/* Card 4 */}
          <div style={kpiCard}>
            <div style={kpiLabel}>이번달 심사</div>
            <div style={kpiValue}>0</div>
          </div>
        </div>

        {/* Client cards */}
        {clients.length === 0 ? (
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
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}
          >
            {clients.map((client) => (
              <div
                key={client.id}
                style={{
                  border: "1px solid #E5E5E5",
                  borderRadius: 10,
                  padding: 20,
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {/* Company name */}
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>
                    {client.company_name}
                  </div>
                  {client.industry && (
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                      {client.industry}
                    </div>
                  )}
                </div>

                {/* ISO badges */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {STD_BADGES.filter(
                    (b) => (client as Record<string, unknown>)[b.key as BadgeKey]
                  ).map((b) => (
                    <span
                      key={b.key}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: b.bg,
                        color: b.color,
                      }}
                    >
                      ISO {b.label}
                    </span>
                  ))}
                  {STD_BADGES.every(
                    (b) => !(client as Record<string, unknown>)[b.key as BadgeKey]
                  ) && (
                    <span style={{ fontSize: 11, color: "#bbb" }}>표준 미설정</span>
                  )}
                </div>

                {/* Open CAPA count */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: "#FAFAFA",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#888" }}>미완료 CAPA</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: client.openCapaCount > 0 ? "#E03131" : "#2F9E44",
                      marginLeft: "auto",
                    }}
                  >
                    {client.openCapaCount}건
                  </span>
                </div>

                {/* Detail button */}
                <Link
                  href={`/consultant/clients/${client.id}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "9px 16px",
                    borderRadius: 7,
                    fontSize: 13,
                    fontWeight: 600,
                    background: "#7C3AED",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  상세 보기
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConsultantLayout>
  );
}

const kpiCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E5E5E5",
  borderRadius: 10,
  padding: "20px 24px",
};

const kpiLabel: React.CSSProperties = {
  fontSize: 12,
  color: "#888",
  marginBottom: 8,
};

const kpiValue: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: "#1a1a1a",
};
