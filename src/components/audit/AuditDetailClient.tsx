"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, AlertCircle, ChevronLeft } from "lucide-react";
import type { Audit, AuditType } from "@/types/audit";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PrintButton from "@/components/print/PrintButton";
import PrintLayout from "@/components/print/PrintLayout";

const TYPE_LABEL: Record<AuditType, string> = {
  system:  "시스템심사",
  process: "공정심사",
  product: "제품심사",
};

const STATUS_STYLE = {
  planned:     { label: "예정",   color: "#999",    bg: "#F5F5F5" },
  in_progress: { label: "진행중", color: "#3B5BDB", bg: "#EEF2FF" },
  completed:   { label: "완료",   color: "#2F9E44", bg: "#F0FBF4" },
} as const;

const AUDIT_STEPS = ["계획수립", "세부계획", "오프닝", "현장심사", "클로징", "보고서"];
const STATUS_TO_STEP: Record<string, number> = {
  planned:     1,
  in_progress: 4,
  completed:   6,
};

type Verdict = "C" | "NC" | "OBS";

type ChecklistItem = { id: string; clause: string; question: string };
type ChecklistGroup = { process: string; items: ChecklistItem[] };

const CHECKLIST: ChecklistGroup[] = [
  {
    process: "5 생산운영",
    items: [
      { id: "5-1", clause: "ISO 8.5.1", question: "생산 및 서비스 제공이 관리된 조건 하에서 수행되는가?" },
      { id: "5-2", clause: "ISO 8.5.2", question: "식별 및 추적성 관리가 적절히 유지되는가?" },
      { id: "5-3", clause: "ISO 8.5.4", question: "외부 공급자 제공물의 보존 관리가 이루어지는가?" },
      { id: "5-4", clause: "ISO 8.6",   question: "제품 및 서비스의 불출 전 검증활동이 수행되는가?" },
    ],
  },
  {
    process: "6 품질관리",
    items: [
      { id: "6-1", clause: "ISO 8.7",   question: "부적합 출력물의 관리가 적절히 이루어지는가?" },
      { id: "6-2", clause: "ISO 9.1.1", question: "모니터링, 측정, 분석 및 평가가 계획되어 있는가?" },
      { id: "6-3", clause: "ISO 9.2",   question: "내부심사가 계획된 주기로 실시되고 있는가?" },
      { id: "6-4", clause: "ISO 10.2",  question: "부적합 및 시정조치 프로세스가 효과적으로 운영되는가?" },
    ],
  },
];

const ALL_ITEMS = CHECKLIST.flatMap(g => g.items);

// ── 6단계 진행 바 ──────────────────────────────────────────────
function SixStepBar({ status }: { status: string }) {
  const doneCount = status === "completed"
    ? AUDIT_STEPS.length
    : (STATUS_TO_STEP[status] ?? 1) - 1;

  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}>
      {AUDIT_STEPS.map((step, i) => {
        const n      = i + 1;
        const done   = n <= doneCount;
        const active = !done && n === doneCount + 1;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
              background: done ? "#3B5BDB" : active ? "#fff" : "#F0F0F0",
              border: active ? "2px solid #3B5BDB" : done ? "none" : "1px solid #E5E5E5",
              color: done ? "#fff" : active ? "#3B5BDB" : "#bbb",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700,
            }}>
              {done ? <Check size={11} strokeWidth={3} /> : n}
            </div>
            <span style={{
              marginLeft: 5, fontSize: 11, whiteSpace: "nowrap",
              color: (done || active) ? "#1a1a1a" : "#bbb",
              fontWeight: (done || active) ? 500 : 400,
            }}>
              {step}
            </span>
            {i < AUDIT_STEPS.length - 1 && (
              <div style={{
                width: 20, height: 2, margin: "0 6px", flexShrink: 0,
                background: done ? "#3B5BDB" : "#F0F0F0",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────
export default function AuditDetailClient({ audit }: { audit: Audit }) {
  const router = useRouter();
  const [verdicts, setVerdicts] = useState<Record<string, Verdict | null>>({});
  const [memos,    setMemos]    = useState<Record<string, string>>({});

  const ss        = STATUS_STYLE[audit.status];
  const typeLabel = TYPE_LABEL[audit.audit_type];

  const summary = useMemo(() => {
    const c       = ALL_ITEMS.filter(it => verdicts[it.id] === "C").length;
    const nc      = ALL_ITEMS.filter(it => verdicts[it.id] === "NC").length;
    const obs     = ALL_ITEMS.filter(it => verdicts[it.id] === "OBS").length;
    const pending = ALL_ITEMS.length - c - nc - obs;
    return { c, nc, obs, pending, total: ALL_ITEMS.length };
  }, [verdicts]);

  const progressPct = Math.round(((summary.total - summary.pending) / summary.total) * 100);

  function toggleVerdict(id: string, v: Verdict) {
    setVerdicts(prev => ({ ...prev, [id]: prev[id] === v ? null : v }));
  }

  return (
    <PrintLayout docNumber={audit.audit_number} title={`${typeLabel} 심사 결과`}>
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* ── 헤더 ── */}
      <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid #E5E5E5", background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <Breadcrumb items={[{ label: "내부심사", href: "/audit" }, { label: audit.audit_number }]} />
          <div className="no-print" style={{ display: "flex", gap: 6 }}>
            <PrintButton />
            <Link href="/audit" style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "5px 10px", borderRadius: 6, textDecoration: "none",
              fontSize: 12, fontWeight: 500, color: "#555",
              border: "1px solid #E5E5E5", background: "#fff",
            }} className="hover:bg-[#F5F5F5] transition-colors">
              <ChevronLeft size={12} color="#999" />목록
            </Link>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#3B5BDB" }}>
            {audit.audit_number}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: "#555", background: "#F5F5F5" }}>
            {typeLabel}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: ss.color, background: ss.bg }}>
            {ss.label}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 12, color: "#999", marginBottom: 18 }}>
          <span>심사원 <span style={{ color: "#555", fontWeight: 500 }}>{audit.auditor_name}</span></span>
          <span>대상 <span style={{ color: "#555", fontWeight: 500 }}>{audit.target_process}</span></span>
          <span>예정일 <span style={{ color: "#555", fontWeight: 500 }}>{audit.planned_date}</span></span>
          {audit.completed_date && (
            <span>완료일 <span style={{ color: "#555", fontWeight: 500 }}>{audit.completed_date}</span></span>
          )}
        </div>

        <SixStepBar status={audit.status} />
      </div>

      {/* ── 본문 ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* 체크리스트 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
          {CHECKLIST.map(group => (
            <div key={group.process} style={{ marginBottom: 28 }}>
              {/* 그룹 헤더 */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #F0F0F0",
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{group.process}</span>
                <span style={{ fontSize: 11, color: "#bbb" }}>
                  {group.items.filter(it => verdicts[it.id]).length}/{group.items.length}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {group.items.map(item => {
                  const verdict = verdicts[item.id] ?? null;
                  const isNC    = verdict === "NC";
                  const isOBS   = verdict === "OBS";
                  return (
                    <div key={item.id} style={{
                      border: isNC ? "1px solid #FFC9C9" : isOBS ? "1px solid #FFD8A8" : "1px solid #F0F0F0",
                      borderRadius: 8, padding: "12px 14px",
                      background: isNC ? "#FFF5F5" : isOBS ? "#FFFBF0" : "#fff",
                    }}>
                      {/* 조항 + 질문 */}
                      <div style={{ display: "flex", alignItems: "start", gap: 10, marginBottom: 10 }}>
                        <span style={{
                          fontFamily: "monospace", fontSize: 11, fontWeight: 700,
                          color: "#3B5BDB", background: "#EEF2FF",
                          borderRadius: 3, padding: "2px 5px", flexShrink: 0, marginTop: 1,
                        }}>
                          {item.clause}
                        </span>
                        <span style={{ fontSize: 13, color: "#1a1a1a", lineHeight: 1.5 }}>
                          {item.question}
                        </span>
                      </div>

                      {/* 판정 버튼 + 메모 */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {(["C", "NC", "OBS"] as const).map(v => {
                          const sel = verdict === v;
                          const cfg =
                            v === "C"   ? { selBg: "#2F9E44", selBorder: "#2F9E44", label: "적합" }
                          : v === "NC"  ? { selBg: "#E03131", selBorder: "#E03131", label: "부적합" }
                          :               { selBg: "#E67700", selBorder: "#E67700", label: "관찰" };
                          return (
                            <button
                              key={v}
                              onClick={() => toggleVerdict(item.id, v)}
                              style={{
                                padding: "4px 10px", borderRadius: 5, cursor: "pointer",
                                fontSize: 11, fontWeight: 600,
                                background: sel ? cfg.selBg : "#fff",
                                color:      sel ? "#fff"    : "#555",
                                border:     sel ? `1px solid ${cfg.selBorder}` : "1px solid #E5E5E5",
                              }}
                            >
                              {v} <span style={{ fontWeight: 400 }}>{cfg.label}</span>
                            </button>
                          );
                        })}
                        <input
                          type="text"
                          value={memos[item.id] ?? ""}
                          onChange={e => setMemos(prev => ({ ...prev, [item.id]: e.target.value }))}
                          placeholder="메모 입력..."
                          style={{
                            flex: 1, padding: "4px 10px", fontSize: 12,
                            border: "1px solid #E5E5E5", borderRadius: 5,
                            outline: "none", color: "#555", background: "#fff",
                          }}
                          className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                        />
                      </div>

                      {/* NC 안내 + CAPA 생성 버튼 */}
                      {isNC && (
                        <div style={{
                          marginTop: 10, display: "flex", alignItems: "center", gap: 8,
                        }}>
                          <div style={{
                            flex: 1, padding: "7px 10px", borderRadius: 5,
                            background: "#FFF0F0", border: "1px solid #FFC9C9",
                            display: "flex", alignItems: "center", gap: 6,
                          }}>
                            <AlertCircle size={12} color="#E03131" />
                            <span style={{ fontSize: 11, color: "#E03131" }}>
                              부적합 — CAPA 연계가 필요합니다
                            </span>
                          </div>
                          <button
                            onClick={() => router.push(
                              `/capa/new?source=audit&audit_id=${audit.id}&audit_no=${encodeURIComponent(audit.audit_number)}&title=${encodeURIComponent(item.question)}&grade=B`
                            )}
                            style={{
                              padding: "6px 12px", borderRadius: 5, cursor: "pointer",
                              fontSize: 11, fontWeight: 600, color: "#fff",
                              background: "#E03131", border: "none", whiteSpace: "nowrap",
                            }}
                            className="hover:opacity-90 transition-opacity"
                          >
                            CAPA 생성
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── 우측 패널 ── */}
        <aside style={{
          width: 240, flexShrink: 0,
          background: "#fff", borderLeft: "1px solid #E5E5E5",
          overflowY: "auto",
        }}>
          {/* 심사 요약 */}
          <div style={{ padding: "16px", borderBottom: "1px solid #F0F0F0" }}>
            <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              심사 요약
            </p>
            {[
              { label: "적합",   value: summary.c,       color: "#2F9E44", bg: "#F0FBF4" },
              { label: "부적합", value: summary.nc,      color: "#E03131", bg: "#FFF0F0" },
              { label: "관찰",   value: summary.obs,     color: "#E67700", bg: "#FFF9DB" },
              { label: "미완료", value: summary.pending, color: "#999",    bg: "#F5F5F5" },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontSize: 12, color: "#555" }}>{row.label}</span>
                <span style={{
                  fontSize: 12, fontWeight: 700, borderRadius: 4, padding: "1px 7px",
                  color: row.color, background: row.bg,
                }}>
                  {row.value}
                </span>
              </div>
            ))}

            {/* 진행률 */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: "#999" }}>진행률</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#3B5BDB" }}>{progressPct}%</span>
              </div>
              <div style={{ height: 4, background: "#F0F0F0", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${progressPct}%`,
                  background: "#3B5BDB", borderRadius: 2, transition: "width 0.2s",
                }} />
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb" }}>
                {summary.total - summary.pending}/{summary.total} 항목 완료
              </p>
            </div>
          </div>

          {/* CAPA 발행 (NC 발생 시) */}
          {summary.nc > 0 && (
            <div style={{ padding: "16px", borderBottom: "1px solid #F0F0F0" }}>
              <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                CAPA
              </p>
              <p style={{ margin: "0 0 10px", fontSize: 12, color: "#555" }}>
                <span style={{ fontWeight: 700, color: "#E03131" }}>{summary.nc}건</span>의 부적합이 발견되었습니다.
              </p>
              <button
                onClick={() => router.push(
                  `/capa/new?source=audit&audit_id=${audit.id}&audit_no=${encodeURIComponent(audit.audit_number)}&grade=B`
                )}
                style={{
                  width: "100%", padding: "7px 0", borderRadius: 6, cursor: "pointer",
                  fontSize: 12, fontWeight: 600, color: "#fff", background: "#E03131",
                  border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                }}
                className="hover:opacity-90 transition-opacity"
              >
                <AlertCircle size={12} />
                CAPA 발행
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* ── 하단 액션 ── */}
      <div style={{
        background: "#fff", borderTop: "1px solid #E5E5E5",
        padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, flexShrink: 0,
      }}>
        <button style={{
          padding: "6px 14px", borderRadius: 6, cursor: "pointer",
          fontSize: 12, fontWeight: 500, color: "#555",
          border: "1px solid #E5E5E5", background: "#fff",
        }}
          className="hover:bg-[#F5F5F5] transition-colors"
        >
          보고서 생성
        </button>
        <button style={{
          padding: "6px 14px", borderRadius: 6, cursor: "pointer",
          fontSize: 12, fontWeight: 600, color: "#fff",
          border: "none", background: "#3B5BDB",
        }}
          className="hover:opacity-90 transition-opacity"
        >
          심사 완료 처리
        </button>
      </div>
    </div>
    </PrintLayout>
  );
}
