import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

type SubscriptionRow = {
  id: string;
  company_id: string;
  plan: string;
  started_at: string;
  expires_at: string;
  status: string;
  monthly_price: number;
  companies: { company_name: string } | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function dday(expiresAt: string): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expiresAt);
  exp.setHours(0, 0, 0, 0);
  const diff = Math.round((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "만료됨";
  return `D-${diff}`;
}

const PLAN_META: Record<string, { label: string; price: string; color: string; bg: string; textColor: string }> = {
  free:       { label: "Free",       price: "₩0",       color: "#888",    bg: "#F5F5F5", textColor: "#888" },
  starter:    { label: "Starter",    price: "₩39,000",  color: "#3B5BDB", bg: "#EEF2FF", textColor: "#3B5BDB" },
  pro:        { label: "Pro",        price: "₩79,000",  color: "#4C6EF5", bg: "#EDF2FF", textColor: "#4C6EF5" },
  enterprise: { label: "Enterprise", price: "₩149,000", color: "#7950F2", bg: "#F3F0FF", textColor: "#7950F2" },
};

const PLAN_OVERVIEW_COLORS: Record<string, { border: string; accent: string }> = {
  free:       { border: "#E5E5E5", accent: "#888" },
  starter:    { border: "#4C6EF5", accent: "#3B5BDB" },
  pro:        { border: "#4C6EF5", accent: "#4C6EF5" },
  enterprise: { border: "#7950F2", accent: "#7950F2" },
};

export default async function AdminPlansPage() {
  let subscriptions: SubscriptionRow[] = [];
  let totalSubs = 0;
  let paidSubs = 0;
  let newThisMonth = 0;
  let expiringSoon = 0;

  const planCounts: Record<string, number> = { free: 0, starter: 0, pro: 0, enterprise: 0 };

  // KPI: 전체 구독
  try {
    const { count } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true });
    totalSubs = count ?? 0;
  } catch {}

  // KPI: 유료 구독
  try {
    const { count } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .neq("plan", "free");
    paidSubs = count ?? 0;
  } catch {}

  // KPI: 이번달 신규
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .gte("started_at", startOfMonth.toISOString());
    newThisMonth = count ?? 0;
  } catch {}

  // KPI: 만료 예정 (expires_at between now and +30 days, status=active)
  try {
    const now = new Date();
    const plus30 = new Date(now);
    plus30.setDate(plus30.getDate() + 30);
    const { count } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .gte("expires_at", now.toISOString())
      .lte("expires_at", plus30.toISOString());
    expiringSoon = count ?? 0;
  } catch {}

  // 구독 목록 (join companies)
  try {
    const { data } = await supabase
      .from("subscriptions")
      .select("*, companies(company_name)")
      .order("started_at", { ascending: false });
    if (data) {
      subscriptions = data as unknown as SubscriptionRow[];
      for (const sub of subscriptions) {
        const key = sub.plan?.toLowerCase() ?? "free";
        if (key in planCounts) planCounts[key]++;
        else planCounts.free++;
      }
    }
  } catch {}

  const kpiCards = [
    { label: "전체 구독",   value: totalSubs,    color: "#1a1a1a", bg: "#fff" },
    { label: "유료 구독",   value: paidSubs,     color: "#2F9E44", bg: "#EBFBEE" },
    { label: "이번달 신규", value: newThisMonth, color: "#3B5BDB", bg: "#EEF2FF" },
    { label: "만료 예정",   value: expiringSoon, color: "#E67700", bg: "#FFF9DB" },
  ];

  return (
    <AdminLayout active="/admin/plans">
      <div style={{ padding: 32 }}>
        {/* 타이틀 */}
        <h1 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
          플랜/결제 관리
        </h1>

        {/* KPI 카드 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          {kpiCards.map((card) => (
            <div
              key={card.label}
              style={{
                flex: 1,
                background: card.bg,
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

        {/* 플랜 개요 카드 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          {(["free", "starter", "pro", "enterprise"] as const).map((plan) => {
            const meta = PLAN_META[plan];
            const col = PLAN_OVERVIEW_COLORS[plan];
            return (
              <div
                key={plan}
                style={{
                  flex: 1,
                  background: "#fff",
                  border: `1px solid ${col.border}`,
                  borderRadius: 8,
                  padding: "20px 24px",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: col.accent, marginBottom: 4 }}>
                  {meta.label}
                </div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>
                  {meta.price} / 월
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: col.accent }}>
                  {planCounts[plan]}
                </div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
                  개 회사
                </div>
              </div>
            );
          })}
        </div>

        {/* 구독 테이블 */}
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
              구독 목록 ({subscriptions.length})
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
                  {["회사명", "플랜", "시작일", "만료일", "상태", "D-day"].map((col) => (
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
                {subscriptions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ padding: "32px 16px", textAlign: "center", color: "#bbb" }}
                    >
                      구독 정보가 없습니다
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => {
                    const planMeta = PLAN_META[sub.plan?.toLowerCase()] ?? PLAN_META.free;
                    const ddayStr = sub.expires_at ? dday(sub.expires_at) : "-";
                    const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
                      active:    { bg: "#EBFBEE", color: "#2F9E44", label: "활성" },
                      cancelled: { bg: "#FFF5F5", color: "#e03131", label: "해지" },
                      expired:   { bg: "#F5F5F5", color: "#888",    label: "만료" },
                    };
                    const st = statusStyles[sub.status] ?? statusStyles.expired;
                    const ddayColor = ddayStr === "만료됨" ? "#888" : ddayStr.startsWith("D-0") ? "#e03131" : "#3B5BDB";
                    return (
                      <tr
                        key={sub.id}
                        style={{ borderBottom: "1px solid #F0F0F0" }}
                        className="hover:bg-[#FAFAFA] transition-colors"
                      >
                        <td style={{ padding: "12px 16px", fontWeight: 500, color: "#1a1a1a" }}>
                          {sub.companies?.company_name ?? "-"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600,
                            padding: "2px 8px", borderRadius: 4,
                            background: planMeta.bg, color: planMeta.textColor,
                          }}>
                            {planMeta.label}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#888" }}>
                          {sub.started_at ? formatDate(sub.started_at) : "-"}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#888" }}>
                          {sub.expires_at ? formatDate(sub.expires_at) : "-"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600,
                            padding: "2px 8px", borderRadius: 4,
                            background: st.bg, color: st.color,
                          }}>
                            {st.label}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: ddayColor }}>
                          {ddayStr}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
