import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayoutServer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Risk, RiskLevel, RiskStatus, RiskResponse } from "@/types/risk";

const LEVEL_STYLE: Record<RiskLevel, { label: string; color: string; bg: string }> = {
  critical: { label: "매우높음", color: "#E03131", bg: "#FECACA" },
  high:     { label: "높음",    color: "#E67700", bg: "#FED7AA" },
  medium:   { label: "중간",    color: "#854D0E", bg: "#FEF9C3" },
  low:      { label: "낮음",    color: "#166534", bg: "#DCFCE7" },
};

const STATUS_STYLE: Record<RiskStatus, { label: string; color: string; bg: string }> = {
  open:        { label: "열림",   color: "#E03131", bg: "#FFF0F0" },
  in_progress: { label: "처리중", color: "#3B5BDB", bg: "#EEF2FF" },
  closed:      { label: "종결",   color: "#2F9E44", bg: "#F0FBF4" },
};

const RESPONSE_LABEL: Record<RiskResponse, string> = {
  accept:   "수용",
  mitigate: "감소",
  transfer: "이전",
  avoid:    "회피",
};
const RESPONSE_COLOR: Record<RiskResponse, { color: string; bg: string }> = {
  accept:   { color: "#3B5BDB", bg: "#EEF2FF" },
  mitigate: { color: "#E67700", bg: "#FFF9DB" },
  transfer: { color: "#7048E8", bg: "#F3F0FF" },
  avoid:    { color: "#E03131", bg: "#FFF0F0" },
};

function DotScale({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: max }, (_, i) => (
        <div key={i} style={{
          width: 14, height: 14, borderRadius: "50%",
          background: i < value ? color : "#F0F0F0",
          border: i < value ? "none" : "1px solid #E5E5E5",
        }} />
      ))}
    </div>
  );
}

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function RiskDetailContent({ id }: { id: string }) {
  const { data, error } = await supabase
    .from("risks")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const risk = data as Risk;
  const ls   = LEVEL_STYLE[risk.risk_level]  ?? { label: risk.risk_level,  color: "#999", bg: "#F5F5F5" };
  const ss   = STATUS_STYLE[risk.status]     ?? { label: risk.status,      color: "#999", bg: "#F5F5F5" };
  const rc   = RESPONSE_COLOR[risk.response] ?? { color: "#999",           bg: "#F5F5F5" };
  const rl   = RESPONSE_LABEL[risk.response] ?? risk.response;

  const needsCapa = risk.risk_level === "critical" || risk.risk_level === "high";

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>

      {/* ── 좌측 본문 ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #F0F0F0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Breadcrumb items={[{ label: "리스크 관리", href: "/risks" }, { label: risk.risk_number }]} />
            <Link href="/risks" style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "5px 10px", borderRadius: 6, textDecoration: "none",
              fontSize: 12, fontWeight: 500, color: "#555",
              border: "1px solid #E5E5E5", background: "#fff",
            }} className="hover:bg-[#F5F5F5] transition-colors">
              <ChevronLeft size={12} color="#999" />목록
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#3B5BDB" }}>
              {risk.risk_number}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: "#555", background: "#F5F5F5" }}>
              {risk.type === "risk" ? "리스크" : "기회"}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: ls.color, background: ls.bg }}>
              {ls.label}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: ss.color, background: ss.bg }}>
              {ss.label}
            </span>
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>{risk.title}</h1>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#999" }}>
            <span>카테고리 <span style={{ color: "#555", fontWeight: 500 }}>{risk.category}</span></span>
            {risk.owner_name && <span>담당자 <span style={{ color: "#555", fontWeight: 500 }}>{risk.owner_name}</span></span>}
            {risk.due_date   && <span>마감일 <span style={{ color: "#555", fontWeight: 500 }}>{risk.due_date}</span></span>}
          </div>
        </div>

        {/* 리스크 설명 */}
        {risk.description && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              리스크 설명
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.75, padding: "14px 16px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F0F0F0" }}>
              {risk.description}
            </p>
          </div>
        )}

        {/* 발생가능성 × 영향도 */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            위험도 분석
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1, padding: "14px 16px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F0F0F0" }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "#999" }}>발생가능성</p>
              <DotScale value={risk.likelihood} color="#3B5BDB" />
              <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 700, color: "#3B5BDB" }}>{risk.likelihood} / 5</p>
            </div>
            <div style={{ flex: 1, padding: "14px 16px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F0F0F0" }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "#999" }}>영향도</p>
              <DotScale value={risk.impact} color="#E67700" />
              <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 700, color: "#E67700" }}>{risk.impact} / 5</p>
            </div>
          </div>
        </div>

        {/* 대응 방안 */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            대응 방안
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: rc.bg, border: `1px solid ${rc.color}20` }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: rc.color }}>{rl}</span>
          </div>
        </div>

        {/* 실행 계획 */}
        {risk.action_plan && (
          <div>
            <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              실행 계획
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.75, padding: "14px 16px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F0F0F0" }}>
              {risk.action_plan}
            </p>
          </div>
        )}
      </div>

      {/* ── 우측 패널 ── */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: "#fff", borderLeft: "1px solid #E5E5E5",
        overflowY: "auto",
      }}>
        {/* 위험도 점수 */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #F0F0F0", textAlign: "center" }}>
          <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            위험도 점수
          </p>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: ls.bg, border: `3px solid ${ls.color}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            margin: "0 auto 10px",
          }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: ls.color, lineHeight: 1 }}>{risk.risk_score}</span>
            <span style={{ fontSize: 10, color: ls.color, marginTop: 2 }}>점</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: ls.color }}>{ls.label}</span>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb" }}>
            {risk.likelihood} × {risk.impact} = {risk.risk_score}
          </p>
        </div>

        {/* 관련 CAPA */}
        <div style={{ padding: "16px", borderBottom: "1px solid #F0F0F0" }}>
          <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            관련 CAPA
          </p>
          {risk.related_capa_id ? (
            <Link href={`/capa/${risk.related_capa_id}`} style={{ fontSize: 12, color: "#3B5BDB", textDecoration: "underline" }}>
              CAPA 보기
            </Link>
          ) : (
            <p style={{ margin: 0, fontSize: 12, color: "#bbb" }}>연결된 CAPA 없음</p>
          )}

          {needsCapa && (
            <Link
              href="/capa/new"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: 10, padding: "7px 0", borderRadius: 6, textDecoration: "none",
                fontSize: 12, fontWeight: 600, color: "#fff", background: "#E03131",
              }}
              className="hover:opacity-90 transition-opacity"
            >
              CAPA 발행
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}

export default async function RiskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <RiskDetailContent id={id} />
      </Suspense>
    </AppLayout>
  );
}
