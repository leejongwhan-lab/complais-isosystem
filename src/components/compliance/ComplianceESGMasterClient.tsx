"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { KpiMaster } from "./ComplianceESGClient";

const ESG_COLORS = {
  E: { color: "#2F9E44", bg: "#F0FBF4", border: "#B2F2BB" },
  S: { color: "#3B5BDB", bg: "#EEF2FF", border: "#BAC8FF" },
  G: { color: "#7048E8", bg: "#F3F0FF", border: "#D0BFFF" },
};

type FilterKey = "all" | "E" | "S" | "G" | "mandatory" | "selected";

export default function ComplianceESGMasterClient({
  initialSelections,
}: {
  initialSelections: string[];
}) {
  const [allKpis, setAllKpis] = useState<KpiMaster[]>([]);
  const [masterLoading, setMasterLoading] = useState(true);
  const [selections, setSelections] = useState<Set<string>>(new Set(initialSelections));
  const [filter, setFilter] = useState<FilterKey>("all");
  const [toggling, setToggling] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase
      .from("kpi_master")
      .select("*")
      .order("category_esg")
      .order("sort_order")
      .then(({ data, error }) => {
        if (error) console.error("[ESGMasterClient] kpi_master error:", error.message);
        else setAllKpis((data ?? []) as KpiMaster[]);
        setMasterLoading(false);
      });
  }, []);

  const filtered = allKpis.filter(k => {
    if (filter === "E") return k.category_esg === "E";
    if (filter === "S") return k.category_esg === "S";
    if (filter === "G") return k.category_esg === "G";
    if (filter === "mandatory") return k.is_mandatory;
    if (filter === "selected") return selections.has(k.kpi_code);
    return true;
  });

  // category_esg + category_mid 기준 그룹핑
  type Group = { esg: "E" | "S" | "G"; mid: string; items: KpiMaster[] };
  const groupMap = new Map<string, Group>();
  for (const kpi of filtered) {
    const key = `${kpi.category_esg}::${kpi.category_mid}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, { esg: kpi.category_esg, mid: kpi.category_mid, items: [] });
    }
    groupMap.get(key)!.items.push(kpi);
  }
  const groups = Array.from(groupMap.values());

  const total        = allKpis.length;
  const eCount       = allKpis.filter(k => k.category_esg === "E").length;
  const sCount       = allKpis.filter(k => k.category_esg === "S").length;
  const gCount       = allKpis.filter(k => k.category_esg === "G").length;
  const mandatoryCount = allKpis.filter(k => k.is_mandatory).length;

  async function toggleSelection(kpiCode: string) {
    if (toggling.has(kpiCode)) return;
    setToggling(prev => new Set([...prev, kpiCode]));

    const isSelected = selections.has(kpiCode);
    const res = await fetch("/api/kpi/selection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kpi_code: kpiCode, action: isSelected ? "remove" : "add" }),
    });

    if (res.ok) {
      setSelections(prev => {
        const next = new Set(prev);
        if (isSelected) next.delete(kpiCode);
        else next.add(kpiCode);
        return next;
      });
    }

    setToggling(prev => { const n = new Set(prev); n.delete(kpiCode); return n; });
  }

  const filterButtons: { key: FilterKey; label: string }[] = [
    { key: "all",       label: `전체 ${total}` },
    { key: "E",         label: "E 환경" },
    { key: "S",         label: "S 사회" },
    { key: "G",         label: "G 거버넌스" },
    { key: "mandatory", label: "필수 지표" },
    { key: "selected",  label: "내 선택만" },
  ];

  const statChips = [
    { label: `전체 ${total}개`,         color: "#555",    bg: "#F5F5F5" },
    { label: `E ${eCount}`,             color: "#2F9E44", bg: "#F0FBF4" },
    { label: `S ${sCount}`,             color: "#3B5BDB", bg: "#EEF2FF" },
    { label: `G ${gCount}`,             color: "#7048E8", bg: "#F3F0FF" },
    { label: `필수 ${mandatoryCount}개`, color: "#E67700", bg: "#FFF9DB" },
    { label: `✓ ${selections.size}개 선택`, color: "#2F9E44", bg: "#EBFBEE" },
  ];

  if (masterLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 10 }}>
        <div className="w-5 h-5 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
        <span style={{ fontSize: 13, color: "#999" }}>KPI 마스터 로딩 중...</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 필터 + 통계 */}
      <div style={{
        padding: "12px 20px 10px", borderBottom: "1px solid #E5E5E5",
        background: "#fff", flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "nowrap" }}>
          {filterButtons.map(btn => (
            <button key={btn.key} onClick={() => setFilter(btn.key)} style={{
              padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 500,
              border: filter === btn.key ? "1.5px solid #3B5BDB" : "1px solid #E5E5E5",
              background: filter === btn.key ? "#EEF2FF" : "#fff",
              color: filter === btn.key ? "#3B5BDB" : "#666",
              cursor: "pointer", whiteSpace: "nowrap",
            }}>
              {btn.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {statChips.map(chip => (
            <span key={chip.label} style={{
              padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600,
              color: chip.color, background: chip.bg, whiteSpace: "nowrap",
            }}>
              {chip.label}
            </span>
          ))}
        </div>
      </div>

      {/* KPI 목록 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {groups.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#bbb", fontSize: 13 }}>
            표시할 KPI가 없습니다.
          </div>
        )}
        {groups.map(({ esg, mid, items }) => {
          const c = ESG_COLORS[esg];
          return (
            <div key={`${esg}::${mid}`} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{
                  padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                  color: c.color, background: c.bg, border: `1px solid ${c.border}`,
                }}>
                  {esg}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{mid}</span>
              </div>

              <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {items.map((kpi, idx) => {
                      const kc = ESG_COLORS[kpi.category_esg];
                      const selected   = selections.has(kpi.kpi_code);
                      const isToggling = toggling.has(kpi.kpi_code);
                      return (
                        <tr
                          key={kpi.id}
                          style={{
                            borderBottom: idx < items.length - 1 ? "1px solid #F0F0F0" : "none",
                            background: selected ? "#FAFFFD" : "#fff",
                          }}
                        >
                          {/* KPI 코드 */}
                          <td style={{ padding: "10px 14px", width: 80, whiteSpace: "nowrap" }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700, fontFamily: "monospace",
                              color: kc.color, background: kc.bg,
                              padding: "2px 6px", borderRadius: 4,
                            }}>
                              {kpi.kpi_code}
                            </span>
                          </td>

                          {/* 지표명 + 필수 뱃지 */}
                          <td style={{ padding: "10px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 13, color: "#1a1a1a" }}>{kpi.name_kr}</span>
                              {kpi.is_mandatory && (
                                <span style={{
                                  fontSize: 10, color: "#E67700", background: "#FFF9DB",
                                  padding: "1px 5px", borderRadius: 3, fontWeight: 600,
                                }}>필수</span>
                              )}
                            </div>
                          </td>

                          {/* 단위 */}
                          <td style={{ padding: "10px 14px", width: 70, color: "#777", fontSize: 12, whiteSpace: "nowrap" }}>
                            {kpi.unit ?? "—"}
                          </td>

                          {/* 방향성 */}
                          <td style={{ padding: "10px 14px", width: 36, fontSize: 14, color: "#555", textAlign: "center" }}>
                            {kpi.direction === "higher_better" ? "↑" : kpi.direction === "lower_better" ? "↓" : "◎"}
                          </td>

                          {/* GRI 코드 */}
                          <td style={{ padding: "10px 14px", width: 100 }}>
                            {kpi.gri_code && (
                              <span style={{
                                fontSize: 10, color: "#555", background: "#F5F5F5",
                                padding: "1px 5px", borderRadius: 3, fontFamily: "monospace",
                              }}>
                                GRI {kpi.gri_code}
                              </span>
                            )}
                          </td>

                          {/* K-ESG 코드 */}
                          <td style={{ padding: "10px 14px", width: 110 }}>
                            {kpi.k_esg_code && (
                              <span style={{
                                fontSize: 10, color: "#555", background: "#F5F5F5",
                                padding: "1px 5px", borderRadius: 3, fontFamily: "monospace",
                              }}>
                                K-ESG {kpi.k_esg_code}
                              </span>
                            )}
                          </td>

                          {/* ISO 조항 */}
                          <td style={{ padding: "10px 14px", width: 110, color: "#999", fontSize: 11, fontFamily: "monospace" }}>
                            {kpi.iso_clause ?? ""}
                          </td>

                          {/* ESG 지정 토글 */}
                          <td style={{ padding: "10px 14px", width: 110, textAlign: "right" }}>
                            <button
                              onClick={() => toggleSelection(kpi.kpi_code)}
                              disabled={isToggling}
                              style={{
                                padding: "4px 12px", borderRadius: 5, fontSize: 12, fontWeight: 600,
                                border: selected ? "1.5px solid #2F9E44" : "1px solid #D0D7DD",
                                background: selected ? "#F0FBF4" : "#fff",
                                color: selected ? "#2F9E44" : "#888",
                                cursor: isToggling ? "not-allowed" : "pointer",
                                opacity: isToggling ? 0.5 : 1,
                                transition: "all 0.15s",
                              }}
                            >
                              {selected ? "✓ ESG 지정" : "ESG 지정"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

