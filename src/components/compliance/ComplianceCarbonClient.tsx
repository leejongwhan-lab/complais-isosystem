"use client";

import { useState, useMemo } from "react";
import type { MBItem, MBActual, EmissionFactor } from "./ComplianceMBClient";

export default function ComplianceCarbonClient({
  initialItems,
  initialActuals,
  emissionFactors,
  currentYear,
}: {
  initialItems: MBItem[];
  initialActuals: MBActual[];
  emissionFactors: EmissionFactor[];
  currentYear: number;
}) {
  const [year, setYear] = useState(currentYear);
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const energyItems = initialItems.filter(i => i.is_energy);

  const rows = useMemo(() => {
    return energyItems.map(item => {
      const actual = initialActuals.find(a => a.item_id === item.id && a.measured_year === year);
      const prevActual = initialActuals.find(a => a.item_id === item.id && a.measured_year === year - 1);
      const ef = emissionFactors.find(f => f.id === item.emission_factor_id);

      const value = actual?.measured_value ?? null;
      const prevValue = prevActual?.measured_value ?? null;
      const ghg = ef && value != null ? value * ef.factor_co2 : (actual?.ghg_calc ?? null);
      const prevGhg = ef && prevValue != null ? prevValue * ef.factor_co2 : (prevActual?.ghg_calc ?? null);

      return { item, ef, value, prevValue, ghg, prevGhg };
    });
  }, [energyItems, initialActuals, emissionFactors, year]);

  const scope1Total = rows
    .filter(r => r.ef?.scope_type === 1)
    .reduce((s, r) => s + (r.ghg ?? 0), 0);
  const scope2Total = rows
    .filter(r => r.ef?.scope_type === 2)
    .reduce((s, r) => s + (r.ghg ?? 0), 0);
  const total = scope1Total + scope2Total;

  const prevScope1 = rows
    .filter(r => r.ef?.scope_type === 1)
    .reduce((s, r) => s + (r.prevGhg ?? 0), 0);
  const prevScope2 = rows
    .filter(r => r.ef?.scope_type === 2)
    .reduce((s, r) => s + (r.prevGhg ?? 0), 0);
  const prevTotal = prevScope1 + prevScope2;

  function pct(curr: number, prev: number) {
    if (prev === 0) return null;
    const v = ((curr - prev) / prev) * 100;
    return v;
  }

  function pctBadge(curr: number, prev: number) {
    const v = pct(curr, prev);
    if (v == null) return null;
    const up = v > 0;
    return (
      <span style={{ fontSize: 11, fontWeight: 600, marginLeft: 4, color: up ? "#E03131" : "#2F9E44" }}>
        {up ? "▲" : "▼"}{Math.abs(v).toFixed(1)}%
      </span>
    );
  }

  const summaryCards = [
    { label: "Scope 1 직접배출", value: scope1Total, prev: prevScope1, color: "#E03131", bg: "#FFF0F0", border: "#FFD8D8", desc: "화석연료 직접 연소" },
    { label: "Scope 2 간접배출", value: scope2Total, prev: prevScope2, color: "#E67700", bg: "#FFF9DB", border: "#FFE8A1", desc: "전력 사용 간접배출" },
    { label: "합계", value: total, prev: prevTotal, color: "#2F9E44", bg: "#F0FBF4", border: "#B2F2BB", desc: "Scope 1 + Scope 2" },
  ];

  return (
    <div style={{ padding: "20px 24px" }}>
      {/* 연도 선택 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <select value={year}
          onChange={e => setYear(parseInt(e.target.value))}
          style={{ fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 6, padding: "6px 10px", outline: "none" }}>
          {years.map(y => <option key={y} value={y}>{y}년</option>)}
        </select>
        <span style={{ fontSize: 12, color: "#999" }}>에너지 항목 {energyItems.length}개 기준</span>
      </div>

      {/* 요약 카드 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {summaryCards.map(c => (
          <div key={c.label} style={{
            padding: "18px 20px", borderRadius: 10,
            background: c.bg, border: `1px solid ${c.border}`,
          }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 600, color: c.color, textTransform: "uppercase" }}>{c.label}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: c.color, lineHeight: 1 }}>
                {c.value.toFixed(2)}
              </span>
              <span style={{ fontSize: 12, color: c.color }}>tCO₂eq</span>
              {pctBadge(c.value, c.prev)}
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 11, color: "#888" }}>{c.desc}</p>
            <p style={{ margin: "3px 0 0", fontSize: 11, color: "#bbb" }}>전년 {c.prev.toFixed(2)} tCO₂eq</p>
          </div>
        ))}
      </div>

      {/* 상세 테이블 */}
      {rows.length > 0 ? (
        <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
              <tr>
                {["에너지원", "Scope", "사용량", "단위", "배출계수 (tCO₂/단위)", "GHG (tCO₂eq)", "비중 %"].map((h, i) => (
                  <th key={i} style={{ padding: "9px 14px", textAlign: i >= 2 ? "right" : "left", fontSize: 11, fontWeight: 600, color: "#999" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ item, ef, value, ghg }) => {
                const share = total > 0 && ghg != null ? (ghg / total) * 100 : null;
                return (
                  <tr key={item.id} style={{ borderBottom: "1px solid #F5F5F5" }}
                    className="hover:bg-[#FAFAFA] transition-colors">
                    <td style={{ padding: "10px 14px", fontSize: 13, color: "#1a1a1a" }}>{item.item_name}</td>
                    <td style={{ padding: "10px 14px" }}>
                      {ef ? (
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
                          background: ef.scope_type === 1 ? "#FFF0F0" : "#FFF9DB",
                          color: ef.scope_type === 1 ? "#E03131" : "#E67700",
                        }}>
                          Scope {ef.scope_type}
                        </span>
                      ) : "—"}
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontSize: 12, fontWeight: value != null ? 600 : 400, color: value != null ? "#1a1a1a" : "#ccc" }}>
                      {value != null ? value.toLocaleString() : "—"}
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontSize: 12, color: "#777" }}>
                      {ef?.unit_input ?? item.unit ?? "—"}
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontSize: 12, color: "#555", fontFamily: "monospace" }}>
                      {ef ? ef.factor_co2.toFixed(8) : "—"}
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontSize: 13, fontWeight: 600, color: ghg != null ? "#E67700" : "#ccc" }}>
                      {ghg != null ? ghg.toFixed(4) : "—"}
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontSize: 12, color: "#555" }}>
                      {share != null ? `${share.toFixed(1)}%` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot style={{ background: "#FAFAFA", borderTop: "1px solid #E5E5E5" }}>
              <tr>
                <td colSpan={5} style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#555" }}>합계</td>
                <td style={{ padding: "10px 14px", textAlign: "right", fontSize: 13, fontWeight: 700, color: "#2F9E44" }}>
                  {total.toFixed(4)}
                </td>
                <td style={{ padding: "10px 14px", textAlign: "right", fontSize: 12, color: "#555" }}>100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#bbb", fontSize: 13 }}>
          에너지 항목이 없습니다. 물질수지표에서 에너지 항목을 추가하세요.
        </div>
      )}

      {/* 배출계수 출처 */}
      <div style={{ padding: "12px 16px", background: "#FAFAFA", borderRadius: 6, border: "1px solid #E5E5E5" }}>
        <p style={{ margin: 0, fontSize: 11, color: "#888", lineHeight: 1.8 }}>
          <strong>배출계수 출처:</strong> 환경부 고시 2022-208호<br />
          전력: 0.4587 tCO₂eq/MWh · LNG: 0.002176 tCO₂eq/Nm³ · 경유: 0.002578 tCO₂eq/L ·
          LPG: 0.002996 tCO₂eq/L · 휘발유: 0.002218 tCO₂eq/L · 등유: 0.002449 tCO₂eq/L
        </p>
      </div>
    </div>
  );
}
