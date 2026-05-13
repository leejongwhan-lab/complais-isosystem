import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { formatPlanLabel, getActiveSubscriptionPlans } from "@/lib/subscriptions";
import Link from "next/link";

// 표준 뱃지 정의
const STD_BADGES = [
  { key: "std_iso9001",  label: "9001",  color: "#3B5BDB", bg: "#EEF2FF" },
  { key: "std_iso14001", label: "14001", color: "#2F9E44", bg: "#EBFBEE" },
  { key: "std_iso45001", label: "45001", color: "#E67700", bg: "#FFF9DB" },
  { key: "std_iso50001", label: "50001", color: "#E67700", bg: "#FFF9DB" },
  { key: "std_iso37301", label: "37301", color: "#1098AD", bg: "#E3FAFC" },
  { key: "std_iso27001", label: "27001", color: "#7048E8", bg: "#F3F0FF" },
  { key: "std_iso37001", label: "37001", color: "#2F9E44", bg: "#EBFBEE" },
] as const;

const PLAN_TABS = [
  { label: "전체", value: "" },
  { label: "Free", value: "free" },
  { label: "Starter", value: "starter" },
  { label: "Pro", value: "pro" },
  { label: "Enterprise", value: "enterprise" },
];

type Company = {
  id: string;
  company_name: string;
  industry: string | null;
  created_at: string;
  std_iso9001: boolean;
  std_iso14001: boolean;
  std_iso45001: boolean;
  std_iso50001: boolean;
  std_iso37001: boolean;
  std_iso37301: boolean;
  std_iso27001: boolean;
  plan?: string;
};

export default async function AdminCompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planFilter } = await searchParams;

  let companies: Company[] = [];
  const subMap = await getActiveSubscriptionPlans();

  try {
    const { data } = await supabase
      .from("companies")
      .select(
        "id, company_name, industry, created_at, " +
        "std_iso9001, std_iso14001, std_iso45001, std_iso50001, std_iso37001, std_iso37301, std_iso27001"
      )
      .order("created_at", { ascending: false });
    if (data) companies = data as unknown as Company[];
  } catch {}

  // 플랜 병합 및 필터
  const enriched = companies.map((c) => ({
    ...c,
    plan: subMap[c.id] ?? "free",
  }));

  const filtered = planFilter
    ? enriched.filter((c) => c.plan.toLowerCase() === planFilter.toLowerCase())
    : enriched;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit",
    });
  }

  return (
    <AdminLayout active="/admin/companies">
      <div style={{ padding: 32 }}>
        {/* 타이틀 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
            회사 관리
          </h1>
          <span style={{ fontSize: 13, color: "#888" }}>
            총 {filtered.length}개 회사
          </span>
        </div>

        {/* 필터 탭 */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 20,
          borderBottom: "1px solid #E5E5E5", paddingBottom: 0,
        }}>
          {PLAN_TABS.map((tab) => {
            const isActive = (planFilter ?? "") === tab.value;
            return (
              <Link
                key={tab.value}
                href={tab.value ? `/admin/companies?plan=${tab.value}` : "/admin/companies"}
                style={{
                  padding: "8px 16px",
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#3B5BDB" : "#555",
                  textDecoration: "none",
                  borderBottom: isActive ? "2px solid #3B5BDB" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* 테이블 */}
        <div style={{
          background: "#fff",
          border: "1px solid #E5E5E5",
          borderRadius: 8,
          overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>회사명</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>업종</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>적용 표준</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>플랜</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>가입일</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "32px 16px", textAlign: "center", color: "#bbb" }}>
                      해당 회사가 없습니다
                    </td>
                  </tr>
                ) : (
                  filtered.map((company) => (
                    <tr
                      key={company.id}
                      style={{ borderBottom: "1px solid #F0F0F0" }}
                      className="hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 500, color: "#1a1a1a" }}>
                        {company.company_name}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#555" }}>
                        {company.industry ?? "-"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {STD_BADGES.filter((b) => (company as Record<string, unknown>)[b.key]).map((b) => (
                            <span
                              key={b.key}
                              style={{
                                fontSize: 10, fontWeight: 700,
                                padding: "2px 6px", borderRadius: 4,
                                background: b.bg, color: b.color,
                              }}
                            >
                              {b.label}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600,
                          padding: "2px 8px", borderRadius: 4,
                          background: company.plan === "free" ? "#F5F5F5" : "#EEF2FF",
                          color: company.plan === "free" ? "#888" : "#3B5BDB",
                        }}>
                          {formatPlanLabel(company.plan ?? "free")}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#888" }}>
                        {formatDate(company.created_at)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Link
                          href={`/admin/companies/${company.id}`}
                          style={{
                            fontSize: 12, fontWeight: 600,
                            padding: "4px 10px", borderRadius: 4,
                            border: "1px solid #E5E5E5",
                            background: "#fff", color: "#555",
                            textDecoration: "none",
                          }}
                          className="hover:bg-[#F5F5F5] transition-colors"
                        >
                          상세보기
                        </Link>
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
