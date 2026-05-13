"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import RiskHeatmap, { type HeatmapRisk } from "@/components/common/RiskHeatmap";
import type {
  EnvAspect, HazardAssessment, ProcessHazardAssessment,
  MaterialBalance, LegalRequirement, RiskLevel,
} from "@/types/environment";

// ── 상수 ──────────────────────────────────────────────────────

const CONDITION_LABEL: Record<string, { label: string; color: string }> = {
  normal:    { label: "정상",   color: "#2F9E44" },
  abnormal:  { label: "비정상", color: "#E67700" },
  emergency: { label: "비상",   color: "#E03131" },
};

const LEVEL_STYLE: Record<RiskLevel, { label: string; color: string; bg: string }> = {
  critical: { label: "매우높음", color: "#E03131", bg: "#FECACA" },
  high:     { label: "높음",    color: "#E67700", bg: "#FED7AA" },
  medium:   { label: "중간",    color: "#854D0E", bg: "#FEF9C3" },
  low:      { label: "낮음",    color: "#166534", bg: "#DCFCE7" },
};

const COMPLIANCE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  compliant:     { label: "준수",     color: "#2F9E44", bg: "#F0FBF4" },
  non_compliant: { label: "미준수",   color: "#E03131", bg: "#FFF0F0" },
  na:            { label: "해당없음", color: "#999",    bg: "#F5F5F5" },
};

const MATERIAL_TYPE_COLOR: Record<string, { color: string; bg: string }> = {
  원료:   { color: "#3B5BDB", bg: "#EEF2FF" },
  제품:   { color: "#2F9E44", bg: "#F0FBF4" },
  폐기물: { color: "#E03131", bg: "#FFF0F0" },
  폐수:   { color: "#7048E8", bg: "#F3F0FF" },
  대기:   { color: "#E67700", bg: "#FFF9DB" },
};

const M4_STYLE: Record<string, { color: string; bg: string }> = {
  Man:        { color: "#3B5BDB", bg: "#EEF2FF" },
  Machine:    { color: "#E67700", bg: "#FFF9DB" },
  Media:      { color: "#2F9E44", bg: "#F0FBF4" },
  Management: { color: "#7048E8", bg: "#F3F0FF" },
};

const PHA_METHOD_STYLE: Record<string, { color: string; bg: string }> = {
  HAZOP:     { color: "#7048E8", bg: "#F3F0FF" },
  "What-If": { color: "#3B5BDB", bg: "#EEF2FF" },
  Checklist: { color: "#2F9E44", bg: "#F0FBF4" },
};

const PHA_STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  open:        { label: "열림",   color: "#E03131", bg: "#FFF0F0" },
  in_progress: { label: "처리중", color: "#3B5BDB", bg: "#EEF2FF" },
  closed:      { label: "완료",   color: "#2F9E44", bg: "#F0FBF4" },
};

// ── 타입 ──────────────────────────────────────────────────────

type Tab         = "환경영향평가" | "위험성평가" | "물질수지표" | "법규등록부";
type HazardSub   = "kras" | "pha";
type CellSel     = { likelihood: number; impact: number } | null;

const TABS: Tab[] = ["환경영향평가", "위험성평가", "물질수지표", "법규등록부"];

function scoreLevel(score: number): RiskLevel {
  if (score >= 16) return "critical";
  if (score >= 11) return "high";
  if (score >= 6)  return "medium";
  return "low";
}

// ── KPI 스트립 ────────────────────────────────────────────────

function KpiStrip({ items }: { items: { label: string; value: string | number; sub: string; color?: string }[] }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
      {items.map((kpi, i, arr) => (
        <div key={kpi.label} style={{ flex: 1, padding: "13px 18px", borderRight: i < arr.length - 1 ? "1px solid #F0F0F0" : "none" }}>
          <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {kpi.label}
          </p>
          <p style={{ margin: "0 0 2px", fontSize: 22, fontWeight: 600, lineHeight: 1, color: kpi.color ?? "#1a1a1a" }}>
            {kpi.value}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>{kpi.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────

type Props = {
  aspects:   EnvAspect[];
  hazards:   HazardAssessment[];
  materials: MaterialBalance[];
  laws:      LegalRequirement[];
  phas:      ProcessHazardAssessment[];
};

export default function EnvironmentClientView({ aspects, hazards, materials, laws, phas }: Props) {
  const [activeTab,    setActiveTab]    = useState<Tab>("환경영향평가");
  const [hazardSub,    setHazardSub]    = useState<HazardSub>("kras");
  const [aspectCell,   setAspectCell]   = useState<CellSel>(null);
  const [hazardCell,   setHazardCell]   = useState<CellSel>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // ── 환경영향평가 ─────────────────────────────────────────

  const aspectStats = useMemo(() => ({
    total:       aspects.length,
    significant: aspects.filter(a => a.is_significant).length,
    highPlus:    aspects.filter(a => a.significance_score >= 11).length,
    hasLegal:    aspects.filter(a => a.legal_requirement).length,
  }), [aspects]);

  const aspectHeatmap: HeatmapRisk[] = useMemo(() =>
    aspects.map(a => ({
      id:          a.id,
      risk_number: a.aspect_number,
      likelihood:  a.likelihood,
      impact:      a.severity,
      risk_level:  scoreLevel(a.significance_score),
    })), [aspects]);

  const filteredAspects = useMemo(() =>
    aspectCell
      ? aspects.filter(a => a.likelihood === aspectCell.likelihood && a.severity === aspectCell.impact)
      : aspects,
    [aspects, aspectCell]);

  // ── KRAS ─────────────────────────────────────────────────

  const krasHazards = useMemo(() =>
    hazards.filter(h => !h.assessment_type || h.assessment_type === "kras"),
    [hazards]);

  const krasStats = useMemo(() => ({
    total:    krasHazards.length,
    critical: krasHazards.filter(h => h.risk_level === "critical").length,
    high:     krasHazards.filter(h => h.risk_level === "high").length,
    action:   krasHazards.filter(h => h.risk_level === "critical" || h.risk_level === "high").length,
  }), [krasHazards]);

  const krasHeatmap: HeatmapRisk[] = useMemo(() =>
    krasHazards.map(h => ({
      id:          h.id,
      risk_number: h.hazard_number,
      likelihood:  h.before_likelihood ?? h.likelihood,
      impact:      h.before_severity   ?? h.severity,
      risk_level:  h.risk_level,
    })), [krasHazards]);

  const filteredKras = useMemo(() =>
    hazardCell
      ? krasHazards.filter(h =>
          (h.before_likelihood ?? h.likelihood) === hazardCell.likelihood &&
          (h.before_severity   ?? h.severity)   === hazardCell.impact)
      : krasHazards,
    [krasHazards, hazardCell]);

  // ── 공정위험성평가 (PHA) ──────────────────────────────────

  const phaStats = useMemo(() => ({
    total:           phas.length,
    critical:        phas.filter(p => p.risk_level === "critical").length,
    high:            phas.filter(p => p.risk_level === "high").length,
    hasRecommendation: phas.filter(p => p.recommendation).length,
  }), [phas]);

  // ── 물질수지표 ────────────────────────────────────────────

  const months = useMemo(() =>
    [...new Set(materials.map(m => m.record_month))].sort().reverse(),
    [materials]);

  const filteredMaterials = useMemo(() =>
    selectedMonth ? materials.filter(m => m.record_month === selectedMonth) : materials,
    [materials, selectedMonth]);

  const materialTotals = useMemo(() => ({
    input:  filteredMaterials.reduce((s, m) => s + (m.input_amount  ?? 0), 0),
    output: filteredMaterials.reduce((s, m) => s + (m.output_amount ?? 0), 0),
    loss:   filteredMaterials.reduce((s, m) => s + (m.loss_amount   ?? 0), 0),
  }), [filteredMaterials]);

  // ── 법규등록부 ────────────────────────────────────────────

  const lawStats = useMemo(() => ({
    total:         laws.length,
    compliant:     laws.filter(l => l.compliance_status === "compliant").length,
    nonCompliant:  laws.filter(l => l.compliance_status === "non_compliant").length,
  }), [laws]);

  // ── 핸들러 ───────────────────────────────────────────────

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setAspectCell(null);
    setHazardCell(null);
  }

  // ── 공통 스타일 ──────────────────────────────────────────

  const TH = { padding: "7px 10px", textAlign: "left" as const, fontSize: 10, fontWeight: 600 as const, color: "#999", whiteSpace: "nowrap" as const };
  const TD = { padding: "7px 10px" };

  // ── 렌더 ─────────────────────────────────────────────────

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* ── 메인 탭 스트립 ── */}
      <div style={{ display: "flex", borderBottom: "1px solid #E5E5E5", background: "#fff", padding: "0 16px", flexShrink: 0 }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => switchTab(tab)} style={{
            padding: "10px 16px", border: "none", background: "transparent",
            cursor: "pointer", fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
            color: activeTab === tab ? "#3B5BDB" : "#555",
            borderBottom: activeTab === tab ? "2px solid #3B5BDB" : "2px solid transparent",
            marginBottom: -1,
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* ══ 탭 ①: 환경영향평가 ══ */}
      {activeTab === "환경영향평가" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <KpiStrip items={[
            { label: "전체 환경측면", value: aspectStats.total,       sub: "등록 건수" },
            { label: "중요환경측면",  value: aspectStats.significant,  sub: "중점 관리",    color: aspectStats.significant > 0 ? "#3B5BDB" : undefined },
            { label: "높음 이상",     value: aspectStats.highPlus,     sub: "점수 11+",     color: aspectStats.highPlus > 0 ? "#E67700" : undefined },
            { label: "법규 관련",     value: aspectStats.hasLegal,     sub: "법적 요구사항" },
          ]} />
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* 좌: 히트맵 */}
            <div style={{ flex: 55, overflowY: "auto", padding: "20px 24px", borderRight: "1px solid #E5E5E5" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>환경영향 히트맵</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {aspectCell && (
                    <button onClick={() => setAspectCell(null)}
                      style={{ fontSize: 11, color: "#3B5BDB", background: "#EEF2FF", border: "1px solid #C5D0FF", borderRadius: 4, padding: "3px 8px", cursor: "pointer" }}>
                      필터 해제 ✕
                    </button>
                  )}
                  <Link href="/environment/aspects/new"
                    style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, textDecoration: "none", fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB" }}
                    className="hover:opacity-90 transition-opacity">
                    <Plus size={12} /> 환경측면 등록
                  </Link>
                </div>
              </div>
              <RiskHeatmap
                risks={aspectHeatmap}
                selectedCell={aspectCell}
                onCellClick={(l, i) => setAspectCell(prev => prev?.likelihood === l && prev?.impact === i ? null : { likelihood: l, impact: i })}
              />
            </div>
            {/* 우: 테이블 */}
            <div style={{ flex: 45, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "8px 12px", borderBottom: "1px solid #E5E5E5", flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: "#999" }}>
                  {aspectCell ? `가능성 ${aspectCell.likelihood} × 심각도 ${aspectCell.impact} — ${filteredAspects.length}건` : `전체 ${aspects.length}건`}
                </span>
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
                    <tr>{["번호","카테고리","환경측면","환경영향","조건","점수","중요","관리방안"].map((c,i) => <th key={i} style={TH}>{c}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filteredAspects.length === 0
                      ? <tr><td colSpan={8} style={{ textAlign: "center", padding: "36px 0", fontSize: 13, color: "#bbb" }}>해당하는 환경측면이 없습니다.</td></tr>
                      : filteredAspects.map((a, i) => {
                          const ls  = LEVEL_STYLE[scoreLevel(a.significance_score)];
                          const cnd = CONDITION_LABEL[a.condition] ?? { label: a.condition, color: "#999" };
                          return (
                            <tr key={a.id} style={{ borderBottom: i < filteredAspects.length - 1 ? "1px solid #F0F0F0" : "none" }}>
                              <td style={TD}><span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#3B5BDB" }}>{a.aspect_number.slice(-3)}</span></td>
                              <td style={TD}><span style={{ fontSize: 11, color: "#555" }}>{a.category}</span></td>
                              <td style={{ ...TD, maxWidth: 90 }}><span style={{ fontSize: 12, color: "#1a1a1a", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.aspect}</span></td>
                              <td style={{ ...TD, maxWidth: 90 }}><span style={{ fontSize: 11, color: "#555", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.impact}</span></td>
                              <td style={TD}><span style={{ fontSize: 10, fontWeight: 600, color: cnd.color }}>{cnd.label}</span></td>
                              <td style={TD}><span style={{ fontSize: 12, fontWeight: 700, color: ls.color }}>{a.significance_score}</span></td>
                              <td style={TD}>
                                {(() => {
                                  const s = a.significance_score;
                                  if (s >= 15) return <span style={{ fontSize: 11, fontWeight: 700, color: "#E03131" }}>● 유의</span>;
                                  if (s >= 8)  return <span style={{ fontSize: 11, fontWeight: 700, color: "#E67700" }}>● 검토</span>;
                                  return <span style={{ fontSize: 11, fontWeight: 600, color: "#2F9E44" }}>● 일반</span>;
                                })()}
                              </td>
                              <td style={{ ...TD, maxWidth: 110 }}><span style={{ fontSize: 11, color: "#555", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.control_measure ?? "—"}</span></td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ 탭 ②: 위험성평가 (KRAS / PHA 서브탭) ══ */}
      {activeTab === "위험성평가" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* 서브탭 스트립 */}
          <div style={{ display: "flex", borderBottom: "1px solid #E5E5E5", background: "#FAFAFA", padding: "0 14px", flexShrink: 0 }}>
            {(["kras", "pha"] as HazardSub[]).map(sub => {
              const label = sub === "kras" ? "KRAS (작업위험성평가)" : "공정위험성평가 (PHA)";
              return (
                <button key={sub} onClick={() => { setHazardSub(sub); setHazardCell(null); }} style={{
                  padding: "8px 14px", border: "none", background: "transparent",
                  cursor: "pointer", fontSize: 12, fontWeight: hazardSub === sub ? 600 : 400,
                  color: hazardSub === sub ? "#3B5BDB" : "#777",
                  borderBottom: hazardSub === sub ? "2px solid #3B5BDB" : "2px solid transparent",
                  marginBottom: -1,
                }}>
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── 서브탭 A: KRAS ── */}
          {hazardSub === "kras" && (
            <>
              <KpiStrip items={[
                { label: "전체 위험요인", value: krasStats.total,    sub: "등록 건수" },
                { label: "매우높음",      value: krasStats.critical,  sub: "즉시 대응", color: krasStats.critical > 0 ? "#E03131" : undefined },
                { label: "높음",          value: krasStats.high,      sub: "관리 필요", color: krasStats.high > 0 ? "#E67700" : undefined },
                { label: "개선 필요",     value: krasStats.action,    sub: "매우높음+높음" },
              ]} />
              <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* 좌: 히트맵 (개선 전 기준) */}
                <div style={{ flex: 55, overflowY: "auto", padding: "18px 22px", borderRight: "1px solid #E5E5E5" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>위험성 히트맵</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#bbb" }}>개선 전 기준</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {hazardCell && (
                        <button onClick={() => setHazardCell(null)}
                          style={{ fontSize: 11, color: "#3B5BDB", background: "#EEF2FF", border: "1px solid #C5D0FF", borderRadius: 4, padding: "3px 8px", cursor: "pointer" }}>
                          필터 해제 ✕
                        </button>
                      )}
                      <Link href="/environment/hazards/new"
                        style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, textDecoration: "none", fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB" }}
                        className="hover:opacity-90 transition-opacity">
                        <Plus size={12} /> KRAS 등록
                      </Link>
                    </div>
                  </div>
                  <RiskHeatmap
                    risks={krasHeatmap}
                    selectedCell={hazardCell}
                    onCellClick={(l, i) => setHazardCell(prev => prev?.likelihood === l && prev?.impact === i ? null : { likelihood: l, impact: i })}
                  />
                </div>
                {/* 우: KRAS 테이블 */}
                <div style={{ flex: 45, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ padding: "8px 10px", borderBottom: "1px solid #E5E5E5", flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: "#999" }}>
                      {hazardCell ? `가능성 ${hazardCell.likelihood} × 심각도 ${hazardCell.impact} — ${filteredKras.length}건` : `전체 ${krasHazards.length}건`}
                    </span>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
                        <tr>{["번호","장소","단계","4M","위험요인","개선전","현재관리","개선후","등급","담당자"].map((c,i) => <th key={i} style={{ ...TH, padding: "7px 8px" }}>{c}</th>)}</tr>
                      </thead>
                      <tbody>
                        {filteredKras.length === 0
                          ? <tr><td colSpan={10} style={{ textAlign: "center", padding: "36px 0", fontSize: 13, color: "#bbb" }}>해당하는 위험요인이 없습니다.</td></tr>
                          : filteredKras.map((h, i) => {
                              const ls   = LEVEL_STYLE[h.risk_level] ?? { label: h.risk_level, color: "#999", bg: "#F5F5F5" };
                              const m4   = h.hazard_type ? (M4_STYLE[h.hazard_type] ?? { color: "#999", bg: "#F5F5F5" }) : null;
                              const bL   = h.before_likelihood ?? h.likelihood;
                              const bS   = h.before_severity   ?? h.severity;
                              const bScore = bL * bS;
                              const aScore = (h.after_likelihood && h.after_severity) ? h.after_likelihood * h.after_severity : null;
                              const aLevel = aScore !== null ? LEVEL_STYLE[scoreLevel(aScore)] : null;
                              return (
                                <tr key={h.id} style={{ borderBottom: i < filteredKras.length - 1 ? "1px solid #F0F0F0" : "none" }}>
                                  <td style={{ padding: "7px 8px" }}><span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#3B5BDB" }}>{h.hazard_number.slice(-3)}</span></td>
                                  <td style={{ padding: "7px 8px" }}><span style={{ fontSize: 10, color: "#555", whiteSpace: "nowrap" }}>{h.work_area}</span></td>
                                  <td style={{ padding: "7px 8px", maxWidth: 70 }}><span style={{ fontSize: 10, color: "#555", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.work_step ?? "—"}</span></td>
                                  <td style={{ padding: "7px 8px" }}>
                                    {m4 && h.hazard_type
                                      ? <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 4px", borderRadius: 3, color: m4.color, background: m4.bg, whiteSpace: "nowrap" }}>{h.hazard_type}</span>
                                      : <span style={{ fontSize: 10, color: "#bbb" }}>—</span>}
                                  </td>
                                  <td style={{ padding: "7px 8px", maxWidth: 90 }}><span style={{ fontSize: 11, color: "#1a1a1a", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.hazard}</span></td>
                                  <td style={{ padding: "7px 8px", whiteSpace: "nowrap" }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: LEVEL_STYLE[scoreLevel(bScore)].color }}>{bL}×{bS}={bScore}</span>
                                  </td>
                                  <td style={{ padding: "7px 8px", maxWidth: 80 }}><span style={{ fontSize: 10, color: "#555", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.current_control ?? "—"}</span></td>
                                  <td style={{ padding: "7px 8px" }}>
                                    {aScore !== null && aLevel
                                      ? <span style={{ fontSize: 11, fontWeight: 700, color: aLevel.color }}>{aScore}</span>
                                      : <span style={{ fontSize: 11, color: "#bbb" }}>—</span>}
                                  </td>
                                  <td style={{ padding: "7px 8px" }}><span style={{ fontSize: 9, fontWeight: 700, padding: "2px 4px", borderRadius: 3, color: ls.color, background: ls.bg }}>{ls.label}</span></td>
                                  <td style={{ padding: "7px 8px" }}><span style={{ fontSize: 10, color: "#555", whiteSpace: "nowrap" }}>{h.owner_name ?? "—"}</span></td>
                                </tr>
                              );
                            })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── 서브탭 B: 공정위험성평가 (PHA) ── */}
          {hazardSub === "pha" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <KpiStrip items={[
                { label: "전체 공정위험",  value: phaStats.total,              sub: "등록 건수" },
                { label: "매우높음",       value: phaStats.critical,           sub: "즉시 대응", color: phaStats.critical > 0 ? "#E03131" : undefined },
                { label: "높음",           value: phaStats.high,               sub: "관리 필요", color: phaStats.high > 0 ? "#E67700" : undefined },
                { label: "권고사항",       value: phaStats.hasRecommendation,  sub: "조치 필요" },
              ]} />
              <div style={{ padding: "10px 14px", borderBottom: "1px solid #E5E5E5", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
                <Link
                  href="/environment/hazards/new?type=pha"
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, textDecoration: "none", fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB" }}
                  className="hover:opacity-90 transition-opacity">
                  <Plus size={12} /> 공정위험성평가 등록
                </Link>
              </div>
              <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
                  <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
                    <tr>{["번호","공정명","평가방법","노드","이탈","원인","결과","점수","등급","권고사항","상태"].map((c,i) => <th key={i} style={TH}>{c}</th>)}</tr>
                  </thead>
                  <tbody>
                    {phas.length === 0
                      ? <tr><td colSpan={11} style={{ textAlign: "center", padding: "48px 0", fontSize: 13, color: "#bbb" }}>등록된 공정위험성평가가 없습니다.</td></tr>
                      : phas.map((p, i) => {
                          const ls  = LEVEL_STYLE[p.risk_level] ?? { label: p.risk_level, color: "#999", bg: "#F5F5F5" };
                          const ms  = PHA_METHOD_STYLE[p.assessment_method] ?? { color: "#999", bg: "#F5F5F5" };
                          const sts = PHA_STATUS_STYLE[p.status] ?? { label: p.status, color: "#999", bg: "#F5F5F5" };
                          return (
                            <tr key={p.id} style={{ borderBottom: i < phas.length - 1 ? "1px solid #F0F0F0" : "none" }}>
                              <td style={TD}><span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#3B5BDB" }}>{p.pha_number}</span></td>
                              <td style={TD}><span style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a", whiteSpace: "nowrap" }}>{p.process_name}</span></td>
                              <td style={TD}><span style={{ fontSize: 10, fontWeight: 700, padding: "2px 5px", borderRadius: 3, color: ms.color, background: ms.bg }}>{p.assessment_method}</span></td>
                              <td style={{ ...TD, maxWidth: 90 }}><span style={{ fontSize: 11, color: "#555", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.node ?? "—"}</span></td>
                              <td style={{ ...TD, maxWidth: 100 }}><span style={{ fontSize: 11, color: "#555", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.deviation ?? "—"}</span></td>
                              <td style={{ ...TD, maxWidth: 100 }}><span style={{ fontSize: 11, color: "#555", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.cause ?? "—"}</span></td>
                              <td style={{ ...TD, maxWidth: 120 }}><span style={{ fontSize: 11, color: "#555", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.consequence ?? "—"}</span></td>
                              <td style={TD}><span style={{ fontSize: 12, fontWeight: 700, color: ls.color }}>{p.risk_score}</span></td>
                              <td style={TD}><span style={{ fontSize: 10, fontWeight: 700, padding: "2px 4px", borderRadius: 3, color: ls.color, background: ls.bg }}>{ls.label}</span></td>
                              <td style={{ ...TD, maxWidth: 130 }}><span style={{ fontSize: 11, color: "#555", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.recommendation ?? "—"}</span></td>
                              <td style={TD}><span style={{ fontSize: 10, fontWeight: 600, padding: "2px 5px", borderRadius: 3, color: sts.color, background: sts.bg }}>{sts.label}</span></td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ 탭 ③: 물질수지표 ══ */}
      {activeTab === "물질수지표" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #E5E5E5", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
              style={{ padding: "5px 10px", border: "1px solid #E5E5E5", borderRadius: 6, fontSize: 12, color: "#555", background: "#fff", cursor: "pointer", outline: "none" }}>
              <option value="">전체 월</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <span style={{ fontSize: 12, color: "#999", flex: 1 }}>{filteredMaterials.length}건</span>
            <Link href="/environment/materials/new"
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, textDecoration: "none", fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB" }}
              className="hover:opacity-90 transition-opacity">
              <Plus size={12} /> 물질 등록
            </Link>
          </div>
          <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
                <tr>{["기록 월","물질명","유형","투입량","산출량","손실량","단위","비고"].map((c,i) => <th key={i} style={{ padding: "8px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#999", whiteSpace: "nowrap" }}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {filteredMaterials.length === 0
                  ? <tr><td colSpan={8} style={{ textAlign: "center", padding: "48px 0", fontSize: 13, color: "#bbb" }}>등록된 물질이 없습니다.</td></tr>
                  : (
                    <>
                      {filteredMaterials.map((m) => {
                        const mt = MATERIAL_TYPE_COLOR[m.material_type] ?? { color: "#999", bg: "#F5F5F5" };
                        return (
                          <tr key={m.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                            <td style={{ padding: "9px 14px", fontSize: 12, color: "#555", whiteSpace: "nowrap" }}>{m.record_month}</td>
                            <td style={{ padding: "9px 14px", fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>{m.material_name}</td>
                            <td style={{ padding: "9px 14px" }}><span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: mt.color, background: mt.bg }}>{m.material_type}</span></td>
                            <td style={{ padding: "9px 14px", fontSize: 13, color: "#555", textAlign: "right" as const }}>{m.input_amount?.toLocaleString() ?? "—"}</td>
                            <td style={{ padding: "9px 14px", fontSize: 13, color: "#555", textAlign: "right" as const }}>{m.output_amount?.toLocaleString() ?? "—"}</td>
                            <td style={{ padding: "9px 14px", fontSize: 13, color: m.loss_amount ? "#E03131" : "#555", textAlign: "right" as const }}>{m.loss_amount?.toLocaleString() ?? "—"}</td>
                            <td style={{ padding: "9px 14px", fontSize: 12, color: "#999" }}>{m.unit}</td>
                            <td style={{ padding: "9px 14px", fontSize: 12, color: "#bbb" }}>{m.notes ?? "—"}</td>
                          </tr>
                        );
                      })}
                      <tr style={{ background: "#FAFAFA", borderTop: "2px solid #E5E5E5" }}>
                        <td colSpan={3} style={{ padding: "9px 14px", fontSize: 12, fontWeight: 700, color: "#555" }}>합계</td>
                        <td style={{ padding: "9px 14px", fontSize: 13, fontWeight: 700, color: "#1a1a1a", textAlign: "right" as const }}>{materialTotals.input.toLocaleString()}</td>
                        <td style={{ padding: "9px 14px", fontSize: 13, fontWeight: 700, color: "#1a1a1a", textAlign: "right" as const }}>{materialTotals.output.toLocaleString()}</td>
                        <td style={{ padding: "9px 14px", fontSize: 13, fontWeight: 700, color: "#E03131", textAlign: "right" as const }}>{materialTotals.loss.toLocaleString()}</td>
                        <td colSpan={2} />
                      </tr>
                    </>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ 탭 ④: 법규등록부 ══ */}
      {activeTab === "법규등록부" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <KpiStrip items={[
            { label: "전체 법규", value: lawStats.total,        sub: "등록 건수" },
            { label: "준수",      value: lawStats.compliant,    sub: "적합",     color: "#2F9E44" },
            { label: "미준수",    value: lawStats.nonCompliant, sub: "조치 필요", color: lawStats.nonCompliant > 0 ? "#E03131" : undefined },
            { label: "준수율",    value: lawStats.total > 0 ? `${Math.round(lawStats.compliant / lawStats.total * 100)}%` : "—", sub: "compliance rate", color: "#3B5BDB" },
          ]} />
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #E5E5E5", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
            <Link href="/environment/legal/new"
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, textDecoration: "none", fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB" }}
              className="hover:opacity-90 transition-opacity">
              <Plus size={12} /> 법규 등록
            </Link>
          </div>
          <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
                <tr>{["번호","구분","법규명","조항","요구사항","적용부서","준수여부","검토일"].map((c,i) => <th key={i} style={{ padding: "8px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#999", whiteSpace: "nowrap" }}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {laws.length === 0
                  ? <tr><td colSpan={8} style={{ textAlign: "center", padding: "48px 0", fontSize: 13, color: "#bbb" }}>등록된 법규가 없습니다.</td></tr>
                  : laws.map((l, i) => {
                      const cs = COMPLIANCE_STYLE[l.compliance_status] ?? { label: l.compliance_status, color: "#999", bg: "#F5F5F5" };
                      return (
                        <tr key={l.id} style={{ borderBottom: i < laws.length - 1 ? "1px solid #F0F0F0" : "none" }}>
                          <td style={{ padding: "10px 14px" }}><span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#3B5BDB" }}>{l.law_number}</span></td>
                          <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 11, color: "#555" }}>{l.category}</span></td>
                          <td style={{ padding: "10px 14px", fontSize: 13, color: "#1a1a1a", fontWeight: 500, whiteSpace: "nowrap" }}>{l.law_name}</td>
                          <td style={{ padding: "10px 14px", fontSize: 12, color: "#555", whiteSpace: "nowrap" }}>{l.article ?? "—"}</td>
                          <td style={{ padding: "10px 14px", maxWidth: 280 }}><span style={{ fontSize: 12, color: "#555", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.requirement}</span></td>
                          <td style={{ padding: "10px 14px", fontSize: 12, color: "#555", whiteSpace: "nowrap" }}>{l.applicable_dept ?? "—"}</td>
                          <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: cs.color, background: cs.bg }}>{cs.label}</span></td>
                          <td style={{ padding: "10px 14px", fontSize: 12, color: "#555", whiteSpace: "nowrap" }}>{l.next_review_date ?? "—"}</td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
          <div style={{ background: "#fff", borderTop: "1px solid #E5E5E5", padding: "8px 16px", flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: "#999" }}>총 <span style={{ fontWeight: 600, color: "#555" }}>{laws.length}</span>건</span>
          </div>
        </div>
      )}
    </div>
  );
}
