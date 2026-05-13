import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ConsultantAssignment from "@/components/admin/ConsultantAssignment";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const STD_BADGES = [
  { key: "std_iso9001",  label: "ISO 9001",  color: "#3B5BDB", bg: "#EEF2FF" },
  { key: "std_iso14001", label: "ISO 14001", color: "#2F9E44", bg: "#EBFBEE" },
  { key: "std_iso45001", label: "ISO 45001", color: "#E67700", bg: "#FFF9DB" },
  { key: "std_iso50001", label: "ISO 50001", color: "#E67700", bg: "#FFF9DB" },
  { key: "std_iso37301", label: "ISO 37301", color: "#1098AD", bg: "#E3FAFC" },
  { key: "std_iso27001", label: "ISO 27001", color: "#7048E8", bg: "#F3F0FF" },
  { key: "std_iso37001", label: "ISO 37001", color: "#2F9E44", bg: "#EBFBEE" },
] as const;

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  user:       { bg: "#F5F5F5", color: "#666" },
  consultant: { bg: "#EEF2FF", color: "#3B5BDB" },
  admin:      { bg: "#FFF0F0", color: "#E03131" },
};

function roleLabel(role: string) {
  if (role === "admin") return "관리자";
  if (role === "consultant") return "컨설턴트";
  return "사용자";
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  });
}

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, color: "#1a1a1a" }}>
        {value ?? "-"}
      </div>
    </div>
  );
}

export default async function AdminCompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 회사 정보 조회
  let company: Record<string, unknown> | null = null;
  try {
    const { data } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();
    company = data;
  } catch {}

  if (!company) notFound();

  // 구독 정보
  let subscription: { plan: string; started_at: string | null; expires_at: string | null; status: string } | null = null;
  try {
    const { data } = await supabase
      .from("subscriptions")
      .select("plan, started_at, expires_at, status")
      .eq("company_id", id)
      .eq("status", "active")
      .single();
    subscription = data;
  } catch {}

  // 사용자 목록
  let users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
  }> = [];
  try {
    const { data } = await supabase
      .from("users")
      .select("id, name, email, role, is_active, created_at")
      .eq("company_id", id)
      .order("created_at", { ascending: false });
    if (data) users = data;
  } catch {}

  const companyName = (company.company_name as string) ?? "회사";

  return (
    <AdminLayout active="/admin/companies">
      <div style={{ padding: 32 }}>
        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              <Link href="/admin/companies" style={{ color: "#888", textDecoration: "none" }} className="hover:underline">
                회사 관리
              </Link>
              {" / "}
              {companyName}
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
              {companyName}
            </h1>
          </div>
          <Link
            href={`/?company_id=${id}`}
            style={{
              padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600,
              background: "#3B5BDB", color: "#fff", textDecoration: "none",
            }}
            className="hover:opacity-90 transition-opacity"
          >
            이 회사로 접속
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* 기본 정보 */}
          <div style={{
            background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden",
          }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #E5E5E5", background: "#FAFAFA" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                기본정보
              </span>
            </div>
            <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <InfoRow label="회사명" value={company.company_name as string} />
              <InfoRow label="업종" value={company.industry as string} />
              <InfoRow label="직원 수" value={company.employee_count as number} />
              <InfoRow label="대표자" value={company.management_rep as string} />
            </div>
          </div>

          {/* 적용 표준 */}
          <div style={{
            background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden",
          }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #E5E5E5", background: "#FAFAFA" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                적용 표준
              </span>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {STD_BADGES.filter((b) => company && company[b.key]).map((b) => (
                  <span
                    key={b.key}
                    style={{
                      fontSize: 12, fontWeight: 700,
                      padding: "4px 12px", borderRadius: 6,
                      background: b.bg, color: b.color,
                    }}
                  >
                    {b.label}
                  </span>
                ))}
                {STD_BADGES.every((b) => !company || !company[b.key]) && (
                  <span style={{ fontSize: 13, color: "#bbb" }}>적용된 표준이 없습니다</span>
                )}
              </div>
            </div>
          </div>

          {/* 플랜 현황 */}
          <div style={{
            background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden",
          }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #E5E5E5", background: "#FAFAFA" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                플랜 현황
              </span>
            </div>
            <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
              <InfoRow
                label="플랜"
                value={subscription ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : "Free"}
              />
              <InfoRow label="시작일" value={subscription ? formatDate(subscription.started_at) : "-"} />
              <InfoRow label="만료일" value={subscription ? formatDate(subscription.expires_at) : "-"} />
            </div>
          </div>

          {/* 사용자 목록 */}
          <div style={{
            background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden",
          }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #E5E5E5", background: "#FAFAFA" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                사용자 목록 ({users.length}명)
              </span>
            </div>
            {users.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                등록된 사용자가 없습니다
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #E5E5E5" }}>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>이름</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>이메일</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>역할</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#888", fontSize: 12 }}>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const roleStyle = ROLE_COLORS[user.role] ?? ROLE_COLORS.user;
                    return (
                      <tr key={user.id} style={{ borderBottom: "1px solid #F0F0F0" }} className="hover:bg-[#FAFAFA] transition-colors">
                        <td style={{ padding: "12px 16px", fontWeight: 500, color: "#1a1a1a" }}>
                          {user.name}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#555" }}>
                          {user.email}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600,
                            padding: "2px 8px", borderRadius: 4,
                            background: roleStyle.bg, color: roleStyle.color,
                          }}>
                            {roleLabel(user.role)}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600,
                            padding: "2px 8px", borderRadius: 4,
                            background: user.is_active ? "#EBFBEE" : "#F5F5F5",
                            color: user.is_active ? "#2F9E44" : "#888",
                          }}>
                            {user.is_active ? "활성" : "비활성"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* 컨설턴트 배정 */}
          <ConsultantAssignment companyId={id} />
        </div>
      </div>
    </AdminLayout>
  );
}
