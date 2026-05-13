import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayoutServer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Training, TrainingType, TrainingStatus } from "@/types/training";

const TYPE_STYLE: Record<TrainingType, { label: string }> = {
  internal: { label: "내부교육" },
  external: { label: "외부교육" },
  ojt:      { label: "OJT" },
};

const STATUS_STYLE: Record<TrainingStatus, { label: string; color: string; bg: string }> = {
  planned:     { label: "예정",   color: "#999",    bg: "#F5F5F5" },
  in_progress: { label: "진행중", color: "#3B5BDB", bg: "#EEF2FF" },
  completed:   { label: "완료",   color: "#2F9E44", bg: "#F0FBF4" },
};

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function TrainingDetailContent({ id }: { id: string }) {
  const { data, error } = await supabase
    .from("trainings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const training = data as Training;
  const ts = TYPE_STYLE[training.type];
  const ss = STATUS_STYLE[training.status];

  const rate    = training.total_count > 0
    ? Math.round((training.completed_count / training.total_count) * 100)
    : 0;
  const missing = training.total_count - training.completed_count;
  const rateColor = rate === 100 ? "#2F9E44" : rate >= 80 ? "#3B5BDB" : "#E67700";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* ── 헤더 ── */}
      <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid #E5E5E5", background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <Breadcrumb items={[{ label: "교육훈련", href: "/trainings" }, { label: training.title }]} />
          <Link href="/trainings" style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "5px 10px", borderRadius: 6, textDecoration: "none",
            fontSize: 12, fontWeight: 500, color: "#555",
            border: "1px solid #E5E5E5", background: "#fff",
          }} className="hover:bg-[#F5F5F5] transition-colors">
            <ChevronLeft size={12} color="#999" />목록
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 6px", borderRadius: 4, color: "#555", background: "#F5F5F5" }}>
            {ts.label}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: ss.color, background: ss.bg }}>
            {ss.label}
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>{training.title}</h1>
        <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#999" }}>
          <span>예정일 <span style={{ color: "#555", fontWeight: 500 }}>{training.planned_date}</span></span>
          {training.actual_date && (
            <span>실시일 <span style={{ color: "#555", fontWeight: 500 }}>{training.actual_date}</span></span>
          )}
          <span>계획인원 <span style={{ color: "#555", fontWeight: 500 }}>{training.total_count}명</span></span>
          <span>이수인원 <span style={{ color: "#555", fontWeight: 500 }}>{training.completed_count}명</span></span>
        </div>
      </div>

      {/* ── 본문 ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* 좌측 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

          {/* 교육 개요 */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              교육 개요
            </p>
            <div style={{ padding: "14px 16px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F0F0F0" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                {training.purpose ?? "교육 목적이 등록되지 않았습니다."}
              </p>
            </div>
          </div>

          {/* 이수자 목록 */}
          <div>
            <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              이수자 목록
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
                <tr>
                  {["이름", "부서", "이수일", "평가점수"].map((col, i) => (
                    <th key={i} style={{ padding: "8px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#999" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} style={{ padding: "32px 14px", textAlign: "center", fontSize: 13, color: "#bbb" }}>
                    이수자 데이터가 없습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 우측 패널 ── */}
        <aside style={{
          width: 240, flexShrink: 0,
          background: "#fff", borderLeft: "1px solid #E5E5E5",
          overflowY: "auto",
        }}>
          {/* 이수율 */}
          <div style={{ padding: "20px 16px", borderBottom: "1px solid #F0F0F0", textAlign: "center" }}>
            <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              이수율
            </p>
            <p style={{ margin: "0 0 12px", fontSize: 40, fontWeight: 700, color: rateColor, lineHeight: 1 }}>
              {rate}%
            </p>
            <div style={{ height: 6, background: "#F0F0F0", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${rate}%`, background: rateColor, borderRadius: 3, transition: "width 0.3s" }} />
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#999" }}>
              {training.completed_count}/{training.total_count}명 이수
            </p>
          </div>

          {/* 미이수 */}
          <div style={{ padding: "16px", borderBottom: "1px solid #F0F0F0" }}>
            <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              미이수 인원
            </p>
            {missing > 0 ? (
              <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#E67700" }}>
                {missing}명
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: "#2F9E44", fontWeight: 600 }}>전원 이수 완료</p>
            )}
          </div>

          {/* 이수 처리 버튼 */}
          <div style={{ padding: "16px" }}>
            <button style={{
              width: "100%", padding: "8px 0", borderRadius: 6, cursor: "pointer",
              fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB",
              border: "none",
            }}
              className="hover:opacity-90 transition-opacity"
            >
              이수 처리
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default async function TrainingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <TrainingDetailContent id={id} />
      </Suspense>
    </AppLayout>
  );
}
