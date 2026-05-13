import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { getActiveSubscriptionPlans } from "@/lib/subscriptions";
import Link from "next/link";

export default async function AdminPage() {
  // KPI 데이터 수집
  let totalCompanies = 0;
  let newCompaniesThisMonth = 0;
  let activeSubscriptions = 0;
  let totalUsers = 0;
  let recentCompanies: Array<{
    id: string;
    company_name: string;
    industry: string | null;
    created_at: string;
    plan?: string;
  }> = [];

  try {
    const { count } = await supabase
      .from("companies")
      .select("*", { count: "exact", head: true });
    totalCompanies = count ?? 0;
  } catch {}

  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("companies")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString());
    newCompaniesThisMonth = count ?? 0;
  } catch {}

  try {
    const { count } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");
    activeSubscriptions = count ?? 0;
  } catch {}

  try {
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });
    totalUsers = count ?? 0;
  } catch {}

  // 최근 가입 회사 (limit 10)
  try {
    const { data: companies } = await supabase
      .from("companies")
      .select("id, company_name, industry, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (companies) {
      const subMap = await getActiveSubscriptionPlans();

      recentCompanies = companies.map((c) => ({
        ...c,
        plan: subMap[c.id] ?? "Free",
      }));
    }
  } catch {}

  const kpiCards = [
    { label: "전체 가입 회사", value: totalCompanies },
    { label: "이번달 신규 가입", value: newCompaniesThisMonth },
    { label: "활성 구독", value: activeSubscriptions },
    { label: "전체 사용자", value: totalUsers },
  ];

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit",
    });
  }

  return (
    <AdminLayout active="/admin">
      <div style={{ padding: 32 }}>
        {/* 페이지 타이틀 */}
        <h1 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
          전체 현황
        </h1>

        {/* KPI 스트립 */}
        <div style={{
          display: "flex", gap: 16,
          padding: "20px 24px",
          background: "#FAFAFA",
          borderBottom: "1px solid #E5E5E5",
          border: "1px solid #E5E5E5",
          borderRadius: 8,
          marginBottom: 32,
        }}>
          {kpiCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: "#fff",
                border: "1px solid #E5E5E5",
                borderRadius: 8,
                padding: "16px 20px",
                flex: 1,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>
                {card.value.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                {card.label}
              </div>
            </div>
          ))}
        </div>

        {/* 최근 가입 회사 */}
        <div style={{
          background: "#fff",
          border: "1px solid #E5E5E5",
          borderRadius: 8,
          overflow: "hidden",
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E5E5" }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              최근 가입 회사
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>회사명</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>업종</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>플랜</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>가입일</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>상태</th>
                </tr>
              </thead>
              <tbody>
                {recentCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "#bbb" }}>
                      가입된 회사가 없습니다
                    </td>
                  </tr>
                ) : (
                  recentCompanies.map((company) => (
                    <tr
                      key={company.id}
                      style={{ borderBottom: "1px solid #F0F0F0" }}
                      className="hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <Link
                          href={`/admin/companies/${company.id}`}
                          style={{ color: "#3B5BDB", textDecoration: "none", fontWeight: 500 }}
                          className="hover:underline"
                        >
                          {company.company_name}
                        </Link>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#555" }}>
                        {company.industry ?? "-"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600,
                          padding: "2px 8px", borderRadius: 4,
                          background: company.plan === "Free" ? "#F5F5F5" : "#EEF2FF",
                          color: company.plan === "Free" ? "#888" : "#3B5BDB",
                        }}>
                          {company.plan}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#888" }}>
                        {formatDate(company.created_at)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600,
                          padding: "2px 8px", borderRadius: 4,
                          background: "#EBFBEE", color: "#2F9E44",
                        }}>
                          활성
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
