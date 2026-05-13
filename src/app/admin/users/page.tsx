import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  is_active: boolean;
  is_consultant: boolean;
  created_at: string;
  companies: { company_name: string } | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    admin:      { bg: "#FFF5F5", color: "#e03131", label: "관리자" },
    consultant: { bg: "#F3F0FF", color: "#7950F2", label: "컨설턴트" },
    user:       { bg: "#EEF2FF", color: "#3B5BDB", label: "사용자" },
  };
  const s = styles[role] ?? styles.user;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      padding: "2px 8px", borderRadius: 4,
      background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  );
}

export default async function AdminUsersPage() {
  let users: UserRow[] = [];
  let totalUsers = 0;
  let activeUsers = 0;
  let consultantCount = 0;
  let newThisMonth = 0;

  // KPI: 전체 사용자
  try {
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });
    totalUsers = count ?? 0;
  } catch {}

  // KPI: 활성 사용자
  try {
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);
    activeUsers = count ?? 0;
  } catch {}

  // KPI: 컨설턴트 수
  try {
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("is_consultant", true);
    consultantCount = count ?? 0;
  } catch {}

  // KPI: 이번달 신규
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString());
    newThisMonth = count ?? 0;
  } catch {}

  // 사용자 목록 (join companies)
  try {
    const { data } = await supabase
      .from("users")
      .select("*, companies(company_name)")
      .order("created_at", { ascending: false });
    if (data) users = data as unknown as UserRow[];
  } catch {}

  const kpiCards = [
    { label: "전체 사용자",   value: totalUsers,      color: "#1a1a1a", accent: undefined },
    { label: "활성 사용자",   value: activeUsers,     color: "#2F9E44", accent: "#EBFBEE" },
    { label: "컨설턴트 수",   value: consultantCount, color: "#7950F2", accent: "#F3F0FF" },
    { label: "이번달 신규",   value: newThisMonth,    color: "#3B5BDB", accent: "#EEF2FF" },
  ];

  return (
    <AdminLayout active="/admin/users">
      <div style={{ padding: 32 }}>
        {/* 타이틀 */}
        <h1 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
          사용자 관리
        </h1>

        {/* KPI 카드 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          {kpiCards.map((card) => (
            <div
              key={card.label}
              style={{
                flex: 1,
                background: card.accent ?? "#fff",
                border: "1px solid #E5E5E5",
                borderRadius: 8,
                padding: "20px 24px",
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 700, color: card.color, lineHeight: 1.2 }}>
                {card.value.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
                {card.label}
              </div>
            </div>
          ))}
        </div>

        {/* 사용자 테이블 */}
        <div style={{
          background: "#fff",
          border: "1px solid #E5E5E5",
          borderRadius: 8,
          overflow: "hidden",
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E5E5" }}>
            <span style={{
              fontSize: 10, fontWeight: 600, color: "#bbb",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              사용자 목록 ({users.length})
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
                  {["이름", "이메일", "역할", "회사", "가입일", "상태"].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "10px 16px", textAlign: "left",
                        fontWeight: 600, color: "#888", fontSize: 12,
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ padding: "32px 16px", textAlign: "center", color: "#bbb" }}
                    >
                      등록된 사용자가 없습니다
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      style={{ borderBottom: "1px solid #F0F0F0" }}
                      className="hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 500, color: "#1a1a1a" }}>
                        {user.name ?? "-"}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#555" }}>
                        {user.email}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <RoleBadge role={user.role} />
                      </td>
                      <td style={{ padding: "12px 16px", color: "#555" }}>
                        {user.companies?.company_name ?? "-"}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#888" }}>
                        {formatDate(user.created_at)}
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
