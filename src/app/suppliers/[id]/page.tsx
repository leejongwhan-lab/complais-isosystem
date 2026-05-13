import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayoutServer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Supplier, SupplierGrade, SupplierStatus } from "@/types/supplier";

const GRADE_STYLE: Record<SupplierGrade, { color: string; bg: string }> = {
  A: { color: "#2F9E44", bg: "#F0FBF4" },
  B: { color: "#3B5BDB", bg: "#EEF2FF" },
  C: { color: "#E67700", bg: "#FFF9DB" },
  D: { color: "#E03131", bg: "#FFF0F0" },
};

const STATUS_STYLE: Record<SupplierStatus, { label: string; color: string; bg: string }> = {
  approved:    { label: "승인",    color: "#2F9E44", bg: "#F0FBF4" },
  conditional: { label: "조건부",  color: "#E67700", bg: "#FFF9DB" },
  pending:     { label: "평가대기", color: "#999",   bg: "#F5F5F5" },
  suspended:   { label: "거래정지", color: "#E03131", bg: "#FFF0F0" },
};

function scoreColor(s: number) {
  if (s >= 80) return "#2F9E44";
  if (s >= 60) return "#E67700";
  return "#E03131";
}

function ScoreRow({ label: rowLabel, weight, score }: { label: string; weight: string; score: number }) {
  const color = scoreColor(score);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: "#555" }}>
          {rowLabel} <span style={{ fontSize: 11, color: "#bbb" }}>{weight}</span>
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}점</span>
      </div>
      <div style={{ height: 4, background: "#F0F0F0", borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

function InfoRow({ label: rowLabel, value }: { label: string; value: string | null }) {
  return (
    <div style={{ display: "flex", gap: 16, padding: "8px 0", borderBottom: "1px solid #F5F5F5" }}>
      <span style={{ fontSize: 12, color: "#999", minWidth: 60, flexShrink: 0 }}>{rowLabel}</span>
      <span style={{ fontSize: 12, color: "#1a1a1a" }}>{value ?? "—"}</span>
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

async function SupplierDetailContent({ id, tab }: { id: string; tab: string }) {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const supplier = data as Supplier;
  const gs = GRADE_STYLE[supplier.grade];
  const ss = STATUS_STYLE[supplier.status];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dday = supplier.next_evaluation_date
    ? Math.ceil((new Date(supplier.next_evaluation_date).setHours(0,0,0,0) - today.getTime()) / 86400000)
    : null;

  const totalColor = scoreColor(supplier.total_score);

  const TAB_STYLE_BASE: React.CSSProperties = {
    padding: "8px 16px", fontSize: 13, fontWeight: 500,
    borderRadius: "6px 6px 0 0", border: "1px solid transparent",
    borderBottom: "none", cursor: "pointer", textDecoration: "none",
    display: "inline-block",
  };
  const activeTabStyle: React.CSSProperties = {
    ...TAB_STYLE_BASE,
    background: "#fff", color: "#1a1a1a",
    border: "1px solid #E5E5E5", borderBottom: "1px solid #fff",
    fontWeight: 600,
  };
  const inactiveTabStyle: React.CSSProperties = {
    ...TAB_STYLE_BASE,
    background: "transparent", color: "#999",
    border: "1px solid transparent",
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>

      {/* ── 좌측 본문 ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #F0F0F0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Breadcrumb items={[{ label: "공급자 관리", href: "/suppliers" }, { label: supplier.company_name }]} />
            <Link href="/suppliers" style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "5px 10px", borderRadius: 6, textDecoration: "none",
              fontSize: 12, fontWeight: 500, color: "#555",
              border: "1px solid #E5E5E5", background: "#fff",
            }} className="hover:bg-[#F5F5F5] transition-colors">
              <ChevronLeft size={12} color="#999" />목록
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 4, color: gs.color, background: gs.bg }}>
              {supplier.grade}등급
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: ss.color, background: ss.bg }}>
              {ss.label}
            </span>
            {supplier.iso_certified && (
              <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 6px", borderRadius: 4, color: "#3B5BDB", background: "#EEF2FF" }}>
                ISO 인증
              </span>
            )}
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>{supplier.company_name}</h1>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#999" }}>
            <span>품목 <span style={{ color: "#555", fontWeight: 500 }}>{supplier.category}</span></span>
            <span>등록일 <span style={{ color: "#555" }}>{supplier.created_at.slice(0, 10)}</span></span>
          </div>
        </div>

        {/* 탭 바 */}
        <div style={{ display: "flex", gap: 2, borderBottom: "1px solid #E5E5E5", marginBottom: 24 }}>
          <Link href={`/suppliers/${id}?tab=info`} style={tab === "info" || tab === "" ? activeTabStyle : inactiveTabStyle}>
            기본정보
          </Link>
          <Link href={`/suppliers/${id}?tab=eval`} style={tab === "eval" ? activeTabStyle : inactiveTabStyle}>
            평가이력
          </Link>
          <Link href={`/suppliers/${id}?tab=improve`} style={tab === "improve" ? activeTabStyle : inactiveTabStyle}>
            개선요구
          </Link>
        </div>

        {/* 탭 컨텐츠 */}
        {(tab === "info" || tab === "") && (
          <>
            {/* 평가 점수 */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "0 0 16px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                최근 평가 점수
              </p>

              {/* 종합 점수 */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: "16px 20px", background: "#FAFAFA", borderRadius: 10, border: "1px solid #F0F0F0" }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 36, fontWeight: 700, color: totalColor, lineHeight: 1 }}>
                    {supplier.total_score}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#999" }}>종합 점수</p>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 8, background: "#F0F0F0", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${supplier.total_score}%`, background: totalColor, borderRadius: 4 }} />
                  </div>
                  <p style={{ margin: "5px 0 0", fontSize: 11, color: "#bbb" }}>
                    {supplier.total_score >= 80 ? "우수" : supplier.total_score >= 60 ? "보통" : "미흡"}
                  </p>
                </div>
              </div>

              {/* 항목별 */}
              <ScoreRow label="품질"  weight="(40%)" score={supplier.quality_score} />
              <ScoreRow label="납기"  weight="(30%)" score={supplier.delivery_score} />
              <ScoreRow label="가격"  weight="(20%)" score={supplier.price_score} />
              <ScoreRow label="협력도" weight="(10%)" score={supplier.cooperation_score} />
            </div>

            {/* 기본 정보 */}
            <div>
              <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                기본 정보
              </p>
              <InfoRow label="업체명" value={supplier.company_name} />
              <InfoRow label="대표자" value={supplier.ceo_name} />
              <InfoRow label="소재지" value={supplier.address} />
              <InfoRow label="연락처" value={supplier.contact} />
              <InfoRow label="주요품목" value={supplier.category} />
              <InfoRow label="최근평가" value={supplier.last_evaluation_date} />
            </div>
          </>
        )}

        {tab === "eval" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Link
              href={`/forms/F-SUP-02/new?supplier_name=${encodeURIComponent(supplier.company_name)}`}
              style={{
                display: "inline-block", padding: "8px 18px", borderRadius: 7,
                background: "#3B5BDB", color: "#fff", textDecoration: "none",
                fontSize: 13, fontWeight: 600,
              }}
              className="hover:opacity-90 transition-opacity"
            >
              평가 시작
            </Link>
            <p style={{ fontSize: 13, color: "#555" }}>
              평가 기록을 조회하려면 서식 F-SUP-01, F-SUP-02 서식 기록을 확인하세요.
            </p>
          </div>
        )}

        {tab === "improve" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Link
              href={`/forms/F-SUP-04/new?supplier_name=${encodeURIComponent(supplier.company_name)}`}
              style={{
                display: "inline-block", padding: "8px 18px", borderRadius: 7,
                background: "#E03131", color: "#fff", textDecoration: "none",
                fontSize: 13, fontWeight: 600,
              }}
              className="hover:opacity-90 transition-opacity"
            >
              개선 요구서 발행
            </Link>
            <p style={{ fontSize: 13, color: "#555" }}>
              개선 요구 기록을 조회하려면 서식 F-SUP-04 기록을 확인하세요.
            </p>
          </div>
        )}
      </div>

      {/* ── 우측 패널 ── */}
      <aside style={{
        width: 260, flexShrink: 0,
        background: "#fff", borderLeft: "1px solid #E5E5E5",
        overflowY: "auto",
      }}>
        {/* 포털 연결 */}
        <div style={{ padding: "16px", borderBottom: "1px solid #F0F0F0" }}>
          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            포털 연결 상태
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E5E5E5" }} />
            <span style={{ fontSize: 12, color: "#bbb" }}>미연결</span>
          </div>
        </div>

        {/* D-day */}
        {dday !== null && (
          <div style={{ padding: "16px", borderBottom: "1px solid #F0F0F0" }}>
            <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              다음 평가일
            </p>
            <p style={{ margin: "0 0 3px", fontSize: 12, color: "#555" }}>{supplier.next_evaluation_date}</p>
            <p style={{
              margin: 0, fontSize: 20, fontWeight: 700,
              color: dday <= 0 ? "#E03131" : dday <= 30 ? "#E67700" : "#3B5BDB",
            }}>
              {dday <= 0 ? "D-Day" : dday <= 30 ? `D-${dday}` : `D-${dday}`}
            </p>
          </div>
        )}

        {/* 액션 */}
        <div style={{ padding: "16px", borderBottom: "1px solid #F0F0F0", display: "flex", flexDirection: "column", gap: 8 }}>
          <button style={{
            width: "100%", padding: "8px 0", borderRadius: 6, cursor: "pointer",
            fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB",
            border: "none",
          }}
            className="hover:opacity-90 transition-opacity"
          >
            평가 실시
          </button>
          <Link
            href="/capa/new"
            style={{
              display: "block", width: "100%", padding: "7px 0", borderRadius: 6,
              fontSize: 12, fontWeight: 600, color: "#E03131",
              border: "1px solid #FFC9C9", background: "#FFF5F5",
              textDecoration: "none", textAlign: "center",
            }}
            className="hover:opacity-90 transition-opacity"
          >
            CAPA 발행
          </Link>
        </div>

        {/* 관련 CAPA */}
        <div style={{ padding: "16px" }}>
          <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            관련 CAPA
          </p>
          <p style={{ fontSize: 12, color: "#bbb" }}>연결된 CAPA 없음</p>
        </div>
      </aside>
    </div>
  );
}

export default async function SupplierDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { tab = "info" } = await searchParams;
  const resolvedTab = Array.isArray(tab) ? tab[0] : tab;
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <SupplierDetailContent id={id} tab={resolvedTab} />
      </Suspense>
    </AppLayout>
  );
}
