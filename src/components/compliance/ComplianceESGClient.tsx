"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export type KpiMaster = {
  id: string;
  kpi_key: string;
  kpi_code: string;
  category_esg: "E" | "S" | "G";
  category_mid: string;
  name_kr: string;
  unit: string | null;
  direction: "lower_better" | "higher_better" | "target";
  gri_code: string | null;
  k_esg_code: string | null;
  iso_clause: string | null;
  is_mandatory: boolean;
  sort_order: number;
};

export type KpiActual = {
  id: string;
  kpi_id: string;
  kpi_code: string;
  measured_year: number;
  measured_value: number | null;
};

const ESG_COLORS = {
  E: { color: "#2F9E44", bg: "#F0FBF4", border: "#B2F2BB" },
  S: { color: "#3B5BDB", bg: "#EEF2FF", border: "#BAC8FF" },
  G: { color: "#7048E8", bg: "#F3F0FF", border: "#D0BFFF" },
};

function trendIcon(direction: KpiMaster["direction"], prev: number | null, curr: number | null) {
  if (prev == null || curr == null) return null;
  if (curr === prev) return <span style={{ color: "#bbb" }}>→</span>;
  const up = curr > prev;
  if (direction === "higher_better") {
    return up
      ? <span style={{ color: "#2F9E44" }}>↑</span>
      : <span style={{ color: "#E03131" }}>↓</span>;
  }
  return up
    ? <span style={{ color: "#E03131" }}>↑</span>
    : <span style={{ color: "#2F9E44" }}>↓</span>;
}

export default function ComplianceESGClient({
  companyId,
  kpiMaster,
  allKpis,
  kpiActuals: initialActuals,
  autoValues,
  currentYear,
  selectedCodes,
}: {
  companyId: string;
  kpiMaster: KpiMaster[];
  allKpis?: KpiMaster[];
  kpiActuals: KpiActual[];
  autoValues: Record<string, number>;
  currentYear: number;
  selectedCodes?: string[];
}) {
  const [tab, setTab] = useState<"E" | "S" | "G">("E");
  const [myOnly, setMyOnly] = useState(false);
  const [showSelected, setShowSelected] = useState(false);
  const [actuals, setActuals] = useState<KpiActual[]>(initialActuals);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const hasSelections = (selectedCodes?.length ?? 0) > 0;
  const baseKpis = (showSelected && hasSelections)
    ? kpiMaster
    : (allKpis ?? kpiMaster);

  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

  function getActual(kpiId: string, year: number): number | null {
    const a = actuals.find(a => a.kpi_id === kpiId && a.measured_year === year);
    return a?.measured_value ?? null;
  }

  function getKpiCode(kpi: KpiMaster) { return kpi.kpi_code; }

  const filtered = baseKpis
    .filter(k => k.category_esg === tab)
    .filter(k => !myOnly || k.is_mandatory)
    .sort((a, b) => a.sort_order - b.sort_order);

  async function handleSave(kpi: KpiMaster) {
    const val = inputValues[kpi.id];
    if (val === undefined || val === "") return;
    setSaving(prev => ({ ...prev, [kpi.id]: true }));

    const numeric = parseFloat(val);
    const existing = actuals.find(a => a.kpi_id === kpi.id && a.measured_year === currentYear);

    if (existing) {
      await supabase
        .from("kpi_actuals")
        .update({ measured_value: numeric, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      setActuals(prev => prev.map(a =>
        a.id === existing.id ? { ...a, measured_value: numeric } : a
      ));
    } else {
      const { data } = await supabase
        .from("kpi_actuals")
        .insert({
          company_id: companyId, kpi_id: kpi.id, kpi_code: kpi.kpi_code,
          measured_year: currentYear, measured_value: numeric,
          data_source: "기업 직접입력",
        })
        .select()
        .single();
      if (data) setActuals(prev => [...prev, data as KpiActual]);
    }

    setSaving(prev => ({ ...prev, [kpi.id]: false }));
    setEditing(prev => ({ ...prev, [kpi.id]: false }));
    setInputValues(prev => { const n = { ...prev }; delete n[kpi.id]; return n; });
  }

  const esgColor = ESG_COLORS[tab];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* ── complais 유입 배너 (상단) ── */}
      <div style={{
        background: "#3B5BDB", color: "#fff",
        padding: "10px 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 12, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🔗</span>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>
            complais 플랫폼과 연동하면 인증기관 심사 데이터가 ESG 지표에 자동 반영됩니다.
          </p>
        </div>
        <a
          href="https://complais.kr"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "5px 14px", borderRadius: 5, fontSize: 12, fontWeight: 700,
            background: "#fff", color: "#3B5BDB", textDecoration: "none",
            whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          인증 시작하기 →
        </a>
      </div>

      {/* ── KPI 선택 안내 (선택 없을 때) ── */}
      {!hasSelections && (
        <div style={{
          padding: "8px 20px", background: "#FFFBEB", borderBottom: "1px solid #FDE68A",
          display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
        }}>
          <span style={{ fontSize: 14 }}>💡</span>
          <p style={{ margin: 0, fontSize: 12, color: "#92400E" }}>
            현재 전체 KPI가 표시됩니다. <strong>ESG 마스터</strong> 탭에서 추적할 KPI를 선택하면 집중 보기가 가능합니다.
          </p>
        </div>
      )}

      {/* 툴바 */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 20px", borderBottom: "1px solid #E5E5E5",
        background: "#fff", flexShrink: 0,
      }}>
        {/* 전체 / 내 선택만 토글 */}
        {hasSelections && (
          <div style={{ display: "flex", gap: 0, border: "1px solid #E5E5E5", borderRadius: 6, overflow: "hidden" }}>
            <button
              onClick={() => setShowSelected(false)}
              style={{
                padding: "4px 12px", fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer",
                background: !showSelected ? "#3B5BDB" : "#fff",
                color: !showSelected ? "#fff" : "#777",
              }}
            >
              전체 지표
            </button>
            <button
              onClick={() => setShowSelected(true)}
              style={{
                padding: "4px 12px", fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer",
                background: showSelected ? "#3B5BDB" : "#fff",
                color: showSelected ? "#fff" : "#777",
                borderLeft: "1px solid #E5E5E5",
              }}
            >
              내 선택만 ({selectedCodes?.length})
            </button>
          </div>
        )}
        <button
          onClick={() => setMyOnly(v => !v)}
          style={{
            padding: "4px 12px", borderRadius: 5, fontSize: 12, fontWeight: 500,
            border: myOnly ? "1.5px solid #3B5BDB" : "1px solid #E5E5E5",
            background: myOnly ? "#EEF2FF" : "#fff", color: myOnly ? "#3B5BDB" : "#777",
            cursor: "pointer",
          }}
        >
          {myOnly ? "✓ 필수 지표만" : "전체 지표"}
        </button>
        <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
          {(["E", "S", "G"] as const).map(t => {
            const c = ESG_COLORS[t];
            return (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "5px 16px", borderRadius: 5, fontSize: 12, fontWeight: 600,
                border: tab === t ? `1.5px solid ${c.color}` : "1px solid #E5E5E5",
                background: tab === t ? c.bg : "#fff",
                color: tab === t ? c.color : "#777",
                cursor: "pointer",
              }}>
                {t === "E" ? "🌿 환경" : t === "S" ? "👥 사회" : "🏛 거버넌스"}
              </button>
            );
          })}
        </div>
      </div>

      {/* 테이블 */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
            <tr>
              <th style={th}>KPI코드</th>
              <th style={th}>지표명</th>
              <th style={th}>단위</th>
              {years.map(y => (
                <th key={y} style={{ ...th, textAlign: "right" }}>{y}년</th>
              ))}
              <th style={th}>추세</th>
              <th style={th}>입력</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(kpi => {
              const isAuto = getKpiCode(kpi) in autoValues;
              const autoVal = autoValues[getKpiCode(kpi)];
              const currVal = isAuto ? autoVal : getActual(kpi.id, currentYear);
              const prevVal = getActual(kpi.id, currentYear - 1);
              const isEditing = editing[kpi.id];

              return (
                <>
                  <tr key={kpi.id}
                    style={{ borderBottom: "1px solid #F0F0F0" }}
                    className="hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td style={td}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, fontFamily: "monospace",
                        color: esgColor.color, background: esgColor.bg,
                        padding: "2px 6px", borderRadius: 4,
                      }}>{kpi.kpi_code}</span>
                    </td>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, color: "#1a1a1a" }}>{kpi.name_kr}</span>
                        {kpi.is_mandatory && (
                          <span style={{ fontSize: 10, color: "#3B5BDB", background: "#EEF2FF", padding: "1px 4px", borderRadius: 3, fontWeight: 600 }}>필수</span>
                        )}
                        {kpi.iso_clause && (
                          <span style={{ fontSize: 10, color: "#999", fontFamily: "monospace" }}>{kpi.iso_clause}</span>
                        )}
                      </div>
                    </td>
                    <td style={td}>
                      <span style={{ fontSize: 12, color: "#777" }}>{kpi.unit ?? "—"}</span>
                    </td>
                    {years.map(y => {
                      const v = isAuto && y === currentYear ? autoVal : getActual(kpi.id, y);
                      return (
                        <td key={y} style={{ ...td, textAlign: "right" }}>
                          {isAuto && y === currentYear ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#16A34A" }}>
                                {autoVal.toLocaleString()}
                              </span>
                              <span style={{
                                fontSize: 10, padding: "1px 5px", borderRadius: 99,
                                background: "#DCFCE7", color: "#16A34A", fontWeight: 700,
                                letterSpacing: "0.2px",
                              }}>🔗 자동</span>
                            </span>
                          ) : (
                            <span style={{ fontSize: 13, color: v != null ? "#1a1a1a" : "#D1D5DB" }}>
                              {v != null ? v.toLocaleString() : "—"}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td style={td}>
                      {trendIcon(kpi.direction, prevVal, currVal ?? null)}
                    </td>
                    <td style={td}>
                      {isAuto ? (
                        <span style={{ fontSize: 11, color: "#bbb" }}>자동연동</span>
                      ) : (
                        <button
                          onClick={() => {
                            setEditing(prev => ({ ...prev, [kpi.id]: !prev[kpi.id] }));
                            if (!editing[kpi.id]) {
                              setInputValues(prev => ({ ...prev, [kpi.id]: String(currVal ?? "") }));
                            }
                          }}
                          style={{
                            padding: "3px 8px", borderRadius: 4, fontSize: 12,
                            border: "1px solid #E5E5E5", background: "#fff",
                            color: "#555", cursor: "pointer",
                          }}
                        >
                          ✏️
                        </button>
                      )}
                    </td>
                  </tr>
                  {isEditing && (
                    <tr key={`${kpi.id}-edit`} style={{ background: "#F8F9FF", borderBottom: "1px solid #E5E5E5" }}>
                      <td colSpan={years.length + 4} style={{ padding: "10px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <label style={{ fontSize: 12, color: "#555" }}>{currentYear}년 실적 입력</label>
                          <input
                            type="number"
                            value={inputValues[kpi.id] ?? ""}
                            onChange={e => setInputValues(prev => ({ ...prev, [kpi.id]: e.target.value }))}
                            placeholder={`단위: ${kpi.unit ?? ""}`}
                            style={{
                              fontSize: 13, border: "1px solid #3B5BDB", borderRadius: 5,
                              padding: "5px 10px", outline: "none", width: 160,
                            }}
                          />
                          <button
                            onClick={() => handleSave(kpi)}
                            disabled={saving[kpi.id]}
                            style={{
                              padding: "5px 14px", borderRadius: 5, fontSize: 12, fontWeight: 600,
                              background: "#3B5BDB", color: "#fff", border: "none", cursor: "pointer",
                            }}
                          >
                            {saving[kpi.id] ? "저장 중..." : "저장"}
                          </button>
                          <button
                            onClick={() => setEditing(prev => ({ ...prev, [kpi.id]: false }))}
                            style={{
                              padding: "5px 10px", borderRadius: 5, fontSize: 12,
                              background: "#fff", color: "#777", border: "1px solid #E5E5E5", cursor: "pointer",
                            }}
                          >취소</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

const th: React.CSSProperties = {
  padding: "9px 14px", textAlign: "left", fontSize: 11,
  fontWeight: 600, color: "#999", whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "10px 14px", verticalAlign: "middle",
};
