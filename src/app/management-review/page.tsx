import { Suspense } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayoutServer";
import { supabase } from "@/lib/supabase";
import { getUserProfile } from "@/lib/supabase-server";
import { canWrite } from "@/lib/permissions";
import { Plus } from "lucide-react";
import type { ManagementReview, ReviewStatus } from "@/types/risk";

const STATUS_STYLE: Record<ReviewStatus, { label: string; color: string; bg: string }> = {
  planned:   { label: "예정",   color: "#999",    bg: "#F5F5F5" },
  completed: { label: "완료",   color: "#2F9E44", bg: "#F0FBF4" },
};

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function ReviewsContent() {
  const [{ data, error }, profile] = await Promise.all([
    supabase.from("management_reviews").select("*").order("review_date", { ascending: false }),
    getUserProfile(),
  ]);
  const writeOk = canWrite(profile?.role ?? "viewer");

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, height: "calc(100vh - 56px)" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#E03131" }}>데이터 로드 실패</p>
        <p style={{ fontSize: 12, color: "#999" }}>{error.message}</p>
      </div>
    );
  }

  const reviews = (data ?? []) as ManagementReview[];
  const completed = reviews.filter(r => r.status === "completed").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* KPI 스트립 */}
      <div style={{ display: "flex", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
        {[
          { label: "전체 경영검토", value: reviews.length,                      sub: "등록 건수" },
          { label: "완료",          value: completed,                            sub: "종결",     ok: true },
          { label: "예정",          value: reviews.length - completed,           sub: "진행 대기" },
          { label: "최근 검토",     value: reviews[0]?.review_date ?? "—",       sub: "검토일",   text: true },
        ].map((kpi, i, arr) => (
          <div key={kpi.label} style={{
            flex: 1, padding: "18px 22px",
            borderRight: i < arr.length - 1 ? "1px solid #F0F0F0" : "none",
          }}>
            <p style={{ margin: "0 0 5px", fontSize: 11, fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {kpi.label}
            </p>
            <p style={{
              margin: "0 0 4px", lineHeight: 1,
              fontSize: kpi.text ? 16 : 26, fontWeight: 600,
              color: kpi.ok ? "#2F9E44" : "#1a1a1a",
            }}>
              {kpi.value}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* 툴바 */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E5E5",
        padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "flex-end", flexShrink: 0,
      }}>
        {writeOk && <Link
          href="/management-review/new"
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 6, textDecoration: "none",
            fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB",
          }}
          className="hover:opacity-90 transition-opacity"
        >
          <Plus size={13} />
          경영검토 등록
        </Link>}
      </div>

      {/* 테이블 */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
            <tr>
              {["검토번호", "검토일", "의장", "참석자", "상태"].map((col, i) => (
                <th key={i} style={{ padding: "8px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#999", whiteSpace: "nowrap" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "48px 0", fontSize: 13, color: "#bbb" }}>
                  등록된 경영검토가 없습니다.
                </td>
              </tr>
            ) : reviews.map((r, i) => {
              const ss = STATUS_STYLE[r.status] ?? { label: r.status, color: "#999", bg: "#F5F5F5" };
              return (
                <tr
                  key={r.id}
                  style={{ borderBottom: i < reviews.length - 1 ? "1px solid #F0F0F0" : "none" }}
                >
                  <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#3B5BDB" }}>
                      {r.review_number}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "#555", whiteSpace: "nowrap" }}>
                    {r.review_date}
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "#555", whiteSpace: "nowrap" }}>
                    {r.chairperson ?? "—"}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{ fontSize: 12, color: "#555", display: "block", maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.attendees ?? "—"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: ss.color, background: ss.bg }}>
                      {ss.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 하단 카운트 */}
      <div style={{ background: "#fff", borderTop: "1px solid #E5E5E5", padding: "10px 16px", flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: "#999" }}>
          총 <span style={{ fontWeight: 600, color: "#555" }}>{reviews.length}</span>건
        </span>
      </div>
    </div>
  );
}

export default function ManagementReviewPage() {
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <ReviewsContent />
      </Suspense>
    </AppLayout>
  );
}
