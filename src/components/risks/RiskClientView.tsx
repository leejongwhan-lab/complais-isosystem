"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import RiskHeatmap from "@/components/common/RiskHeatmap";
import type { Risk, RiskLevel, RiskStatus } from "@/types/risk";

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

export default function RiskClientView({ risks, canWrite = false }: { risks: Risk[]; canWrite?: boolean }) {
  const router = useRouter();
  const [selectedCell, setSelectedCell] = useState<{ likelihood: number; impact: number } | null>(null);

  const stats = useMemo(() => ({
    total:    risks.length,
    critical: risks.filter(r => r.risk_level === "critical").length,
    high:     risks.filter(r => r.risk_level === "high").length,
    open:     risks.filter(r => r.status === "open").length,
  }), [risks]);

  const tableRisks = useMemo(() => {
    if (!selectedCell) return risks;
    return risks.filter(r => r.likelihood === selectedCell.likelihood && r.impact === selectedCell.impact);
  }, [risks, selectedCell]);

  function handleCellClick(l: number, i: number) {
    setSelectedCell(prev =>
      prev?.likelihood === l && prev?.impact === i ? null : { likelihood: l, impact: i }
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* ── KPI 스트립 ── */}
      <div style={{ display: "flex", borderBottom: "1px solid #EBEBEB", flexShrink: 0 }}>
        {[
          { label: "전체 리스크", value: stats.total,    sub: "등록 건수" },
          { label: "매우높음",    value: stats.critical, sub: "즉시 대응", danger: stats.critical > 0 },
          { label: "높음",        value: stats.high,     sub: "관리 필요", warn: stats.high > 0 },
          { label: "열린 리스크", value: stats.open,     sub: "처리 중" },
        ].map((kpi, i, arr) => (
          <div key={kpi.label} style={{
            flex: 1, padding: "20px 24px",
            borderRight: i < arr.length - 1 ? "1px solid #EBEBEB" : "none",
          }}>
            <p style={{ margin: "0 0 5px", fontSize: 12, fontWeight: 500, color: "#666666", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              {kpi.label}
            </p>
            <p style={{
              margin: "0 0 4px", fontSize: 32, fontWeight: 700, lineHeight: 1,
              color: kpi.danger && kpi.value > 0 ? "#E03131" : kpi.warn && kpi.value > 0 ? "#E67700" : "#1a1a1a",
            }}>
              {kpi.value}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#999999" }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 본문 2컬럼 ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* 좌측: 히트맵 */}
        <div style={{ flex: 55, overflowY: "auto", padding: "20px 24px", borderRight: "1px solid #E8E8E8" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>리스크 히트맵</p>
            {selectedCell && (
              <button
                onClick={() => setSelectedCell(null)}
                style={{
                  fontSize: 11, fontWeight: 500, color: "#3B5BDB",
                  background: "#EEF2FF", border: "1px solid #C5D0FF",
                  borderRadius: 4, padding: "3px 8px", cursor: "pointer",
                }}
              >
                필터 해제 ✕
              </button>
            )}
          </div>
          <RiskHeatmap
            risks={risks}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
            onRiskClick={id => router.push(`/risks/${id}`)}
          />
        </div>

        {/* 우측: 테이블 */}
        <div style={{ flex: 45, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* 우측 툴바 */}
          <div style={{
            padding: "10px 14px", borderBottom: "1px solid #E8E8E8",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
          }}>
            <span style={{ fontSize: 12, color: "#999" }}>
              {selectedCell
                ? `가능성 ${selectedCell.likelihood} × 영향도 ${selectedCell.impact} — ${tableRisks.length}건`
                : `전체 ${risks.length}건`
              }
            </span>
            {canWrite && (
              <Link
                href="/risks/new"
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "5px 10px", borderRadius: 6, textDecoration: "none",
                  fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB",
                }}
                className="hover:opacity-90 transition-opacity"
              >
                <Plus size={12} />
                리스크 등록
              </Link>
            )}
          </div>

          {/* 테이블 */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#F8F8F8", borderBottom: "1px solid #E8E8E8" }}>
                <tr>
                  {["번호", "제목", "카테고리", "가능성", "영향도", "점수", "등급", "담당자", "상태"].map((col, i) => (
                    <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#555555", whiteSpace: "nowrap" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRisks.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "48px 0", fontSize: 14, color: "#999999" }}>
                      해당하는 리스크가 없습니다.
                    </td>
                  </tr>
                ) : tableRisks.map((r, i) => {
                  const ls = LEVEL_STYLE[r.risk_level]  ?? { label: r.risk_level, color: "#999", bg: "#F5F5F5" };
                  const ss = STATUS_STYLE[r.status]      ?? { label: r.status,     color: "#999", bg: "#F5F5F5" };
                  return (
                    <tr
                      key={r.id}
                      onClick={() => router.push(`/risks/${r.id}`)}
                      style={{ borderBottom: i < tableRisks.length - 1 ? "1px solid #F0F0F0" : "none", cursor: "pointer" }}
                      className="hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#3B5BDB" }}>
                          {r.risk_number.slice(-3)}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", maxWidth: 140 }}>
                        <span style={{ fontSize: 14, color: "#1a1a1a", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.title}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "#444444", whiteSpace: "nowrap" }}>
                        {r.category}
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#444444" }}>
                        {r.likelihood}
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#444444" }}>
                        {r.impact}
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "center", fontSize: 12, fontWeight: 700, color: ls.color }}>
                        {r.risk_score}
                      </td>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 5px", borderRadius: 3, color: ls.color, background: ls.bg }}>
                          {ls.label}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "#444444", whiteSpace: "nowrap" }}>
                        {r.owner_name ?? "—"}
                      </td>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 5px", borderRadius: 3, color: ss.color, background: ss.bg }}>
                          {ss.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
