import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayoutServer";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Capa } from "@/types/capa";
import { Pencil, FileText } from "lucide-react";
import CAPAFiveWhyPanel from "@/components/capa/CAPAFiveWhyPanel";
import CapaD9Panel from "@/components/capa/CapaD9Panel";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PrintButton from "@/components/print/PrintButton";
import PrintLayout from "@/components/print/PrintLayout";

const D_STEPS = [
  { d: 1, title: "팀 구성",             desc: "문제 해결을 위한 크로스펑셔널 팀을 구성합니다." },
  { d: 2, title: "문제 기술",            desc: "5W2H 방법으로 문제를 명확하게 기술합니다." },
  { d: 3, title: "임시조치",             desc: "근본원인 분석 전까지 적용할 임시 방지 대책입니다." },
  { d: 4, title: "근본원인 분석",        desc: "특성요인도 / 5-Why 기법으로 근본원인을 규명합니다." },
  { d: 5, title: "영구대책 수립",        desc: "근본원인을 제거하기 위한 영구적 시정조치를 수립합니다." },
  { d: 6, title: "대책 실행 및 검증",   desc: "영구대책을 실행하고 효과를 검증합니다." },
  { d: 7, title: "재발 방지",            desc: "유사 공정·제품에 대한 수평 전개 및 시스템화합니다." },
  { d: 8, title: "팀 인정 및 종결",     desc: "팀의 노력을 공인하고 CAPA를 공식 종결합니다." },
];

const GRADE_COLOR: Record<string, string> = { A: "#E03131", B: "#E67700", C: "#F59F00" };

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function calcDday(due_date: string | null) {
  if (!due_date) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due   = new Date(due_date); due.setHours(0, 0, 0, 0);
  const diff  = Math.ceil((due.getTime() - today.getTime()) / 86400000);
  const text  = diff < 0 ? `D+${Math.abs(diff)} 초과` : diff === 0 ? "D-Day" : `D-${diff}`;
  const color = diff <= 3 ? "#E03131" : diff <= 7 ? "#E67700" : "#999";
  return { text, color, diff };
}

// ── 8D 진행바 ─────────────────────────────────────────────────
function EightDBar({ currentStep, status }: { currentStep: number; status: string }) {
  const completed = status === "completed";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {D_STEPS.map((s, i) => {
        const done    = completed || s.d < currentStep;
        const active  = !completed && s.d === currentStep;

        return (
          <div key={s.d} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              {/* 원형 */}
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: done ? "#2F9E44" : active ? "#3B5BDB" : "#F0F0F0",
                color: done || active ? "#fff" : "#bbb",
                boxShadow: active ? "0 0 0 3px #C5D0FF" : "none",
              }}>
                {done ? "✓" : `D${s.d}`}
              </div>
              {/* 라벨 */}
              <span style={{
                fontSize: 10, whiteSpace: "nowrap",
                color: done ? "#2F9E44" : active ? "#3B5BDB" : "#bbb",
                fontWeight: active ? 600 : 400,
              }}>
                {s.title.split(" ")[0]}
              </span>
            </div>
            {/* 연결선 */}
            {i < D_STEPS.length - 1 && (
              <div style={{
                width: 24, height: 2, margin: "0 3px", marginBottom: 16,
                background: done ? "#2F9E44" : "#F0F0F0", borderRadius: 1,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

async function CAPADetailContent({ id }: { id: string }) {
  const supabase = await createSupabaseServerClient();
  const [capaRes, docRes] = await Promise.all([
    supabase.from("capas").select("*").eq("id", id).single(),
    supabase.from("capas").select("related_doc_id").eq("id", id).single(),
  ]);
  if (capaRes.error || !capaRes.data) notFound();

  const capa      = capaRes.data as Capa;
  const dday      = calcDday(capa.due_date);
  const completed = capa.status === "completed";
  const step      = capa.current_step ?? 1;

  // fetch related doc info
  let relatedDoc: { doc_number: string; title: string; id: string } | null = null;
  if (capa.related_doc_id) {
    const { data: rd } = await supabase
      .from("documents")
      .select("id, doc_number, title")
      .eq("id", capa.related_doc_id)
      .single();
    relatedDoc = rd as { id: string; doc_number: string; title: string } | null;
  }

  return (
    <PrintLayout docNumber={capa.capa_number} title={capa.title}>
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* ── 헤더 ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E5E5", padding: "20px 32px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <Breadcrumb items={[{ label: "CAPA 관리", href: "/capa" }, { label: capa.capa_number }]} />
            {/* 뱃지 행 */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#3B5BDB" }}>
                {capa.capa_number}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: GRADE_COLOR[capa.grade] }}>
                {capa.grade}급
              </span>
              {completed ? (
                <span style={{ fontSize: 11, fontWeight: 600, color: "#2F9E44", background: "#F0FBF4", borderRadius: 4, padding: "2px 6px" }}>완료</span>
              ) : (
                <span style={{ fontSize: 11, fontWeight: 600, color: "#3B5BDB", background: "#EEF2FF", borderRadius: 4, padding: "2px 6px" }}>
                  {capa.status} 진행중
                </span>
              )}
              {dday && !completed && (
                <span style={{ fontSize: 11, fontWeight: 700, color: dday.color }}>{dday.text}</span>
              )}
            </div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>{capa.title}</h1>
            {/* 메타 */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8, fontSize: 12, color: "#999" }}>
              <span>발생원 <span style={{ color: "#555", fontWeight: 500 }}>{capa.source}</span></span>
              {capa.owner_name && <span>담당자 <span style={{ color: "#555", fontWeight: 500 }}>{capa.owner_name}</span></span>}
              {capa.due_date   && <span>마감일 <span style={{ color: "#555", fontWeight: 500 }}>{capa.due_date}</span></span>}
            </div>
            {/* 관련 문서 칩 */}
            {relatedDoc && (
              <Link
                href={`/documents/${relatedDoc.id}`}
                style={{
                  marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 10px", borderRadius: 5, textDecoration: "none",
                  border: "1px solid #C5D0FF", background: "#EEF2FF",
                  fontSize: 12, color: "#3B5BDB", fontWeight: 500,
                }}
              >
                <FileText size={12} />
                <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{relatedDoc.doc_number}</span>
                <span>{relatedDoc.title}</span>
              </Link>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="no-print" style={{ display: "flex", gap: 6, flexShrink: 0, marginTop: 2 }}>
            {!completed && (
              <Link href={`/capa/${capa.id}/edit`} style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 10px", borderRadius: 6, textDecoration: "none",
                fontSize: 12, fontWeight: 500, color: "#555",
                border: "1px solid #E5E5E5", background: "#fff",
              }}
                className="hover:bg-[#F5F5F5] transition-colors"
              >
                <Pencil size={12} color="#999" />
                수정
              </Link>
            )}
            <PrintButton />
            <Link href="/capa" style={{
              display: "flex", alignItems: "center",
              padding: "5px 10px", borderRadius: 6, textDecoration: "none",
              fontSize: 12, fontWeight: 500, color: "#555",
              border: "1px solid #E5E5E5", background: "#fff",
            }}
              className="hover:bg-[#F5F5F5] transition-colors"
            >
              목록
            </Link>
          </div>
        </div>
      </div>

      {/* ── 8D 진행바 ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E5E5", padding: "16px 32px", flexShrink: 0 }}>
        <EightDBar currentStep={step} status={capa.status} />
      </div>

      {/* ── 2컬럼 본문 ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* 좌측: 8D 카드 목록 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", background: "#fff" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 680 }}>
            {D_STEPS.map(s => {
              const done    = completed || s.d < step;
              const active  = !completed && s.d === step;
              const pending = !done && !active;

              return (
                <div key={s.d} style={{
                  background: "#fff",
                  border: `1px solid ${active ? "#3B5BDB" : "#E5E5E5"}`,
                  borderRadius: 8, overflow: "hidden",
                  opacity: pending ? 0.45 : 1,
                }}>
                  <div style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: active || done ? 6 : 0 }}>
                      {/* 스텝 인디케이터 */}
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700,
                        background: done ? "#2F9E44" : active ? "#3B5BDB" : "#F0F0F0",
                        color: done || active ? "#fff" : "#bbb",
                      }}>
                        {done ? "✓" : `D${s.d}`}
                      </div>
                      <p style={{
                        margin: 0, fontSize: 13, fontWeight: 600,
                        color: done ? "#2F9E44" : active ? "#1a1a1a" : "#999",
                        flex: 1,
                      }}>
                        D{s.d}. {s.title}
                      </p>
                      {active && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#3B5BDB", background: "#EEF2FF", borderRadius: 4, padding: "2px 6px" }}>
                          현재 단계
                        </span>
                      )}
                      {done && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#2F9E44", background: "#F0FBF4", borderRadius: 4, padding: "2px 6px" }}>
                          완료
                        </span>
                      )}
                    </div>

                    {(done || active) && (
                      <p style={{ margin: "0 0 0 32px", fontSize: 12, color: "#999" }}>{s.desc}</p>
                    )}

                    {active && capa.description && (
                      <div style={{ margin: "10px 0 0 32px", padding: 12, background: "#FAFAFA", borderRadius: 6, border: "1px solid #F0F0F0" }}>
                        <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 600, color: "#999" }}>내용</p>
                        <p style={{ margin: 0, fontSize: 13, color: "#1a1a1a", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                          {capa.description}
                        </p>
                      </div>
                    )}

                    {s.d === 4 && (active || done) && (
                      <div style={{ margin: "10px 0 0 32px" }}>
                        <CAPAFiveWhyPanel
                          description={capa.description ?? capa.title}
                          source={capa.source}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 우측: 정보 패널 */}
        <aside style={{ width: 248, flexShrink: 0, background: "#fff", borderLeft: "1px solid #E5E5E5", overflowY: "auto" }}>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 20 }}>

            {/* 기본 정보 */}
            <div>
              <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                기본 정보
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { key: "CAPA 번호", val: capa.capa_number, mono: true },
                  { key: "등급",      val: `${capa.grade}급` },
                  { key: "발생원",    val: capa.source },
                  { key: "담당자",    val: capa.owner_name ?? "—" },
                  { key: "마감일",    val: capa.due_date   ?? "—" },
                  { key: "등록일",    val: capa.created_at.slice(0, 10) },
                ].map(({ key, val, mono }) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12 }}>
                    <span style={{ color: "#999", flexShrink: 0 }}>{key}</span>
                    <span style={{
                      color: "#1a1a1a", fontWeight: 500, textAlign: "right",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140,
                      fontFamily: mono ? "monospace" : undefined, fontSize: mono ? 11 : 12,
                    }}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 8D 진행률 */}
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                8D 진행률
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ flex: 1, height: 3, background: "#F0F0F0", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: 3, borderRadius: 2,
                    width: `${completed ? 100 : (step / 8) * 100}%`,
                    background: completed ? "#2F9E44" : "#3B5BDB",
                  }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#555", flexShrink: 0 }}>
                  {completed ? "8/8" : `${step}/8`}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>
                {completed ? "모든 단계 완료" : `D${step} · ${D_STEPS[step - 1]?.title}`}
              </p>
            </div>

            {/* D-Day */}
            {dday && !completed && (
              <div>
                <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  마감 현황
                </p>
                <div style={{
                  background: "#FAFAFA", border: "1px solid #E5E5E5",
                  borderRadius: 8, padding: "14px 12px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                }}>
                  <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color: dday.color }}>
                    {dday.text}
                  </span>
                  <span style={{ fontSize: 11, color: "#bbb" }}>{capa.due_date}</span>
                </div>
              </div>
            )}

            {/* D9 효과성 검증 */}
            {(completed || step >= 8) && (
              <div>
                <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  D9 효과성 검증
                </p>
                <CapaD9Panel
                  capaId={capa.id}
                  d8DoneDate={capa.closed_at ?? capa.updated_at}
                  initialStatus={capa.effectiveness_status}
                  initialResult={capa.effectiveness_result}
                  initialDueDate={capa.effectiveness_due_date}
                />
              </div>
            )}

            {/* 등급 기준 */}
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                등급 기준
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { g: "A", desc: "즉각 대응 — 72h 이내 D3 완료" },
                  { g: "B", desc: "우선 처리 — 1주 이내 D3 완료" },
                  { g: "C", desc: "정기 처리 — 1개월 이내 완결" },
                ].map(({ g, desc }) => (
                  <div key={g} style={{ display: "flex", alignItems: "start", gap: 6 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, flexShrink: 0,
                      color: GRADE_COLOR[g],
                    }}>
                      {g}
                    </span>
                    <span style={{
                      fontSize: 11, color: capa.grade === g ? "#555" : "#bbb",
                      lineHeight: 1.4, fontWeight: capa.grade === g ? 600 : 400,
                    }}>
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>
      </div>
    </div>
    </PrintLayout>
  );
}

export default async function CAPADetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <CAPADetailContent id={id} />
      </Suspense>
    </AppLayout>
  );
}
