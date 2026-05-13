import { Suspense } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayoutServer";
import { supabase } from "@/lib/supabase";
import type { Capa } from "@/types/capa";
import { AlertCircle } from "lucide-react";

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const GRADE_STYLE: Record<string, { color: string; bg: string }> = {
  A: { color: "#E03131", bg: "#FFF0F0" },
  B: { color: "#E67700", bg: "#FFF9DB" },
  C: { color: "#F59F00", bg: "#FFFBE6" },
};

async function NonconformityContent() {
  const { data, error } = await supabase
    .from("capas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <p style={{ color: "#E03131", fontSize: 13 }}>데이터 로드 실패: {error.message}</p>
    </div>
  );

  const items = (data ?? []) as Capa[];
  const total    = items.length;
  const open     = items.filter(c => c.status !== "completed").length;
  const closed   = items.filter(c => c.status === "completed").length;
  const gradeA   = items.filter(c => c.grade === "A").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>
      {/* KPI */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E5E5", padding: "20px 28px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "전체",    value: total,  color: "#1a1a1a" },
            { label: "진행중",  value: open,   color: "#E03131" },
            { label: "완료",    value: closed, color: "#2F9E44" },
            { label: "A급(긴급)", value: gradeA, color: "#E03131" },
          ].map(kpi => (
            <div key={kpi.label} style={{
              flex: 1, padding: "14px 16px", borderRadius: 8,
              background: "#FAFAFA", border: "1px solid #F0F0F0",
            }}>
              <p style={{ margin: 0, fontSize: 11, color: "#999", fontWeight: 500 }}>{kpi.label}</p>
              <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 700, color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 테이블 */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
            <tr>
              {["번호", "제목", "등급", "발생원", "담당자", "마감일", "상태"].map((col, i) => (
                <th key={i} style={{
                  padding: "8px 14px", textAlign: "left",
                  fontSize: 11, fontWeight: 600, color: "#999", whiteSpace: "nowrap",
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                  등록된 부적합이 없습니다
                </td>
              </tr>
            ) : items.map((c, i) => {
              const gs = GRADE_STYLE[c.grade] ?? { color: "#999", bg: "#F5F5F5" };
              const completed = c.status === "completed";
              return (
                <tr key={c.id} style={{ borderBottom: i < items.length - 1 ? "1px solid #F5F5F5" : "none" }}
                  className="hover:bg-[#FAFAFA] transition-colors"
                >
                  <td style={{ padding: "10px 14px" }}>
                    <Link href={`/capa/${c.id}`} style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#3B5BDB", textDecoration: "none" }}
                      className="hover:underline">
                      {c.capa_number}
                    </Link>
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: "#1a1a1a", maxWidth: 320 }}>
                    <Link href={`/capa/${c.id}`} style={{ color: "#1a1a1a", textDecoration: "none" }} className="hover:text-[#3B5BDB] transition-colors">
                      {c.title}
                    </Link>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 4, color: gs.color, background: gs.bg }}>
                      {c.grade}급
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#555" }}>{c.source}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#555" }}>{c.owner_name ?? "—"}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#555" }}>{c.due_date ?? "—"}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4,
                      color: completed ? "#2F9E44" : "#3B5BDB",
                      background: completed ? "#F0FBF4" : "#EEF2FF",
                    }}>
                      {completed ? "완료" : "진행중"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 푸터 */}
      <div style={{
        background: "#fff", borderTop: "1px solid #E5E5E5",
        padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, color: "#999" }}>
          총 <span style={{ fontWeight: 600, color: "#555" }}>{total}</span>건
        </span>
        <Link href="/capa/new" style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 12px", borderRadius: 6, textDecoration: "none",
          fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB",
        }} className="hover:opacity-90 transition-opacity">
          <AlertCircle size={13} />
          부적합 등록
        </Link>
      </div>
    </div>
  );
}

export default async function NonconformityPage() {
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <NonconformityContent />
      </Suspense>
    </AppLayout>
  );
}
