"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export type MBItem = {
  id: string;
  company_id: string;
  item_code: string | null;
  category: "input" | "output";
  item_type: string;
  item_name: string;
  unit: string | null;
  is_energy: boolean;
  emission_factor_id: string | null;
  sort_order: number;
};

export type MBActual = {
  id: string;
  item_id: string;
  measured_year: number;
  measured_value: number | null;
  ghg_calc: number | null;
};

export type EmissionFactor = {
  id: string;
  fuel_code: string;
  fuel_name: string;
  fuel_type: string;
  factor_co2: number;
  unit_input: string | null;
  scope_type: number;
};

const INPUT_TYPES = ["raw_material", "energy", "water", "chemical"];
const OUTPUT_TYPES = ["product", "byproduct", "emission", "wastewater", "waste"];

const TYPE_LABEL: Record<string, string> = {
  raw_material: "원재료", energy: "에너지", water: "용수", chemical: "화학물질",
  product: "제품", byproduct: "부산물", emission: "대기배출", wastewater: "폐수", waste: "폐기물",
};

type NewItemDraft = {
  item_name: string; category: "input" | "output"; item_type: string;
  unit: string; is_energy: boolean; emission_factor_id: string;
};

export default function ComplianceMBClient({
  companyId,
  initialItems,
  initialActuals,
  emissionFactors,
  currentYear,
}: {
  companyId: string;
  initialItems: MBItem[];
  initialActuals: MBActual[];
  emissionFactors: EmissionFactor[];
  currentYear: number;
}) {
  const [year, setYear] = useState(currentYear);
  const [items, setItems] = useState(initialItems);
  const [actuals, setActuals] = useState(initialActuals);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [inputVals, setInputVals] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<NewItemDraft>({
    item_name: "", category: "input", item_type: "energy",
    unit: "", is_energy: false, emission_factor_id: "",
  });
  const [addingSaving, setAddingSaving] = useState(false);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  function getActual(itemId: string, y: number) {
    return actuals.find(a => a.item_id === itemId && a.measured_year === y);
  }

  async function handleSave(item: MBItem) {
    const val = parseFloat(inputVals[item.id] ?? "");
    if (isNaN(val)) return;
    setSaving(prev => ({ ...prev, [item.id]: true }));

    let ghg_calc = 0;
    if (item.is_energy && item.emission_factor_id) {
      const ef = emissionFactors.find(f => f.id === item.emission_factor_id);
      if (ef) ghg_calc = val * ef.factor_co2;
    }

    const existing = getActual(item.id, year);
    if (existing) {
      await supabase.from("material_balance_actuals")
        .update({ measured_value: val, ghg_calc, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      setActuals(prev => prev.map(a =>
        a.id === existing.id ? { ...a, measured_value: val, ghg_calc } : a
      ));
    } else {
      const { data } = await supabase.from("material_balance_actuals")
        .insert({ company_id: companyId, item_id: item.id, measured_year: year, measured_value: val, ghg_calc })
        .select().single();
      if (data) setActuals(prev => [...prev, data as MBActual]);
    }

    setSaving(prev => ({ ...prev, [item.id]: false }));
    setEditing(prev => ({ ...prev, [item.id]: false }));
    setInputVals(prev => { const n = { ...prev }; delete n[item.id]; return n; });
  }

  async function handleAddItem() {
    if (!newItem.item_name.trim()) return;
    setAddingSaving(true);
    const { data } = await supabase.from("material_balance_items")
      .insert({
        company_id: companyId,
        item_name: newItem.item_name.trim(),
        category: newItem.category,
        item_type: newItem.item_type,
        unit: newItem.unit.trim() || null,
        is_energy: newItem.is_energy,
        emission_factor_id: newItem.emission_factor_id || null,
        sort_order: items.length,
      })
      .select().single();
    if (data) setItems(prev => [...prev, data as MBItem]);
    setAddingSaving(false);
    setShowModal(false);
    setNewItem({ item_name: "", category: "input", item_type: "energy", unit: "", is_energy: false, emission_factor_id: "" });
  }

  function renderSection(cat: "input" | "output") {
    const types = cat === "input" ? INPUT_TYPES : OUTPUT_TYPES;
    const color = cat === "input" ? "#3B5BDB" : "#E03131";
    const bg = cat === "input" ? "#EEF2FF" : "#FFF0F0";
    const border = cat === "input" ? "#BAC8FF" : "#FFD8D8";
    const catItems = items.filter(i => i.category === cat);

    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ padding: "10px 16px", background: bg, border: `1px solid ${border}`, borderRadius: "8px 8px 0 0" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{cat === "input" ? "▼ 투입 (Input)" : "▲ 산출 (Output)"}</span>
          <span style={{ marginLeft: 8, fontSize: 12, color: "#777" }}>{catItems.length}개 항목</span>
        </div>
        <div style={{ border: `1px solid ${border}`, borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
          {types.map(type => {
            const typeItems = catItems.filter(i => i.item_type === type);
            if (typeItems.length === 0) return null;
            return (
              <div key={type}>
                <div style={{ padding: "7px 16px", background: "#FAFAFA", borderBottom: "1px solid #F0F0F0" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase" }}>
                    {TYPE_LABEL[type] ?? type}
                  </span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "#FAFAFA" }}>
                    <tr>
                      {["항목명", "단위", "전년도", "당해연도", "GHG(tCO₂eq)", "추세", ""].map((h, i) => (
                        <th key={i} style={{ padding: "7px 14px", textAlign: i >= 2 ? "right" : "left", fontSize: 11, fontWeight: 600, color: "#999", borderBottom: "1px solid #F0F0F0" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {typeItems.map(item => {
                      const curr = getActual(item.id, year);
                      const prev = getActual(item.id, year - 1);
                      const isEd = editing[item.id];
                      const trend = curr?.measured_value != null && prev?.measured_value != null
                        ? curr.measured_value > prev.measured_value ? "↑" : curr.measured_value < prev.measured_value ? "↓" : "→"
                        : null;

                      return (
                        <>
                          <tr key={item.id} style={{ borderBottom: "1px solid #F5F5F5" }}>
                            <td style={{ padding: "9px 14px", fontSize: 13 }}>
                              {item.item_name}
                              {item.item_code && <span style={{ marginLeft: 6, fontSize: 10, color: "#bbb", fontFamily: "monospace" }}>{item.item_code}</span>}
                            </td>
                            <td style={{ padding: "9px 14px", fontSize: 12, color: "#777" }}>{item.unit ?? "—"}</td>
                            <td style={{ padding: "9px 14px", fontSize: 12, textAlign: "right" }}>
                              {prev?.measured_value != null ? prev.measured_value.toLocaleString() : "—"}
                            </td>
                            <td style={{ padding: "9px 14px", fontSize: 12, textAlign: "right", fontWeight: curr?.measured_value != null ? 600 : 400 }}>
                              {curr?.measured_value != null ? curr.measured_value.toLocaleString() : "—"}
                            </td>
                            <td style={{ padding: "9px 14px", fontSize: 12, textAlign: "right" }}>
                              {item.is_energy && curr?.ghg_calc != null
                                ? <span style={{ color: "#E67700", fontWeight: 600 }}>{curr.ghg_calc.toFixed(4)}</span>
                                : "—"}
                            </td>
                            <td style={{ padding: "9px 14px", textAlign: "right" }}>
                              {trend && (
                                <span style={{ color: trend === "↑" ? "#E03131" : trend === "↓" ? "#2F9E44" : "#bbb" }}>
                                  {trend}
                                </span>
                              )}
                            </td>
                            <td style={{ padding: "9px 14px" }}>
                              <button
                                onClick={() => {
                                  setEditing(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                                  if (!editing[item.id]) setInputVals(prev => ({ ...prev, [item.id]: String(curr?.measured_value ?? "") }));
                                }}
                                style={{ padding: "3px 8px", borderRadius: 4, fontSize: 12, border: "1px solid #E5E5E5", background: "#fff", color: "#555", cursor: "pointer" }}
                              >✏️</button>
                            </td>
                          </tr>
                          {isEd && (
                            <tr key={`${item.id}-edit`} style={{ background: "#F8F9FF" }}>
                              <td colSpan={7} style={{ padding: "10px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <label style={{ fontSize: 12, color: "#555" }}>{year}년 실적</label>
                                  <input
                                    type="number"
                                    value={inputVals[item.id] ?? ""}
                                    onChange={e => setInputVals(prev => ({ ...prev, [item.id]: e.target.value }))}
                                    placeholder={item.unit ?? "값 입력"}
                                    style={{ fontSize: 13, border: "1px solid #3B5BDB", borderRadius: 5, padding: "5px 10px", outline: "none", width: 160 }}
                                  />
                                  {item.is_energy && (
                                    <span style={{ fontSize: 11, color: "#E67700" }}>
                                      GHG 자동계산 예정
                                    </span>
                                  )}
                                  <button
                                    onClick={() => handleSave(item)}
                                    disabled={saving[item.id]}
                                    style={{ padding: "5px 14px", borderRadius: 5, fontSize: 12, fontWeight: 600, background: "#3B5BDB", color: "#fff", border: "none", cursor: "pointer" }}
                                  >{saving[item.id] ? "저장 중..." : "저장"}</button>
                                  <button
                                    onClick={() => setEditing(prev => ({ ...prev, [item.id]: false }))}
                                    style={{ padding: "5px 10px", borderRadius: 5, fontSize: 12, background: "#fff", color: "#777", border: "1px solid #E5E5E5", cursor: "pointer" }}
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
            );
          })}
          {catItems.length === 0 && (
            <div style={{ padding: "24px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
              등록된 항목이 없습니다. &ldquo;+ 항목 추가&rdquo;를 클릭하세요.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 24px" }}>
      {/* 툴바 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <select
          value={year}
          onChange={e => setYear(parseInt(e.target.value))}
          style={{ fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 6, padding: "6px 10px", outline: "none" }}
        >
          {years.map(y => <option key={y} value={y}>{y}년</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600,
            background: "#3B5BDB", color: "#fff", border: "none", cursor: "pointer",
          }}
        >
          <Plus size={14} /> 항목 추가
        </button>
      </div>

      {renderSection("input")}
      {renderSection("output")}

      <div style={{ padding: "10px 14px", background: "#FAFAFA", borderRadius: 6, border: "1px solid #E5E5E5", fontSize: 12, color: "#888" }}>
        항목별 단위가 달라 투입/산출 합계 비교는 같은 단위 그룹 내에서만 의미가 있습니다.
      </div>

      {/* 항목 추가 모달 */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "24px", width: 480, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>항목 추가</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} color="#999" />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["항목명 *", "item_name", "text"],
              ].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 12, color: "#555", marginBottom: 4 }}>{label}</label>
                  <input
                    type={type}
                    value={newItem[key as keyof NewItemDraft] as string}
                    onChange={e => setNewItem(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{ width: "100%", fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 5, padding: "6px 10px", outline: "none" }}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: "block", fontSize: 12, color: "#555", marginBottom: 4 }}>분류</label>
                <select value={newItem.category}
                  onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value as "input" | "output" }))}
                  style={{ fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 5, padding: "6px 10px", width: "100%", outline: "none" }}>
                  <option value="input">투입 (Input)</option>
                  <option value="output">산출 (Output)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "#555", marginBottom: 4 }}>항목유형</label>
                <select value={newItem.item_type}
                  onChange={e => setNewItem(prev => ({ ...prev, item_type: e.target.value }))}
                  style={{ fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 5, padding: "6px 10px", width: "100%", outline: "none" }}>
                  {(newItem.category === "input" ? INPUT_TYPES : OUTPUT_TYPES).map(t => (
                    <option key={t} value={t}>{TYPE_LABEL[t]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "#555", marginBottom: 4 }}>단위</label>
                <input value={newItem.unit}
                  onChange={e => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="예) ton, L, MWh, Nm³"
                  style={{ width: "100%", fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 5, padding: "6px 10px", outline: "none" }} />
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#555", cursor: "pointer" }}>
                  <input type="checkbox" checked={newItem.is_energy}
                    onChange={e => setNewItem(prev => ({ ...prev, is_energy: e.target.checked, emission_factor_id: e.target.checked ? prev.emission_factor_id : "" }))} />
                  에너지 항목 (GHG 계산 대상)
                </label>
              </div>

              {newItem.is_energy && (
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#555", marginBottom: 4 }}>배출계수 선택</label>
                  <select value={newItem.emission_factor_id}
                    onChange={e => setNewItem(prev => ({ ...prev, emission_factor_id: e.target.value }))}
                    style={{ fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 5, padding: "6px 10px", width: "100%", outline: "none" }}>
                    <option value="">— 선택 —</option>
                    {emissionFactors.map(ef => (
                      <option key={ef.id} value={ef.id}>
                        {ef.fuel_name} ({ef.factor_co2} tCO₂/{ef.unit_input})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button onClick={handleAddItem} disabled={addingSaving || !newItem.item_name.trim()} style={{
                padding: "8px 0", borderRadius: 6, fontSize: 13, fontWeight: 700,
                background: "#3B5BDB", color: "#fff", border: "none", cursor: "pointer",
                opacity: addingSaving || !newItem.item_name.trim() ? 0.6 : 1,
              }}>
                {addingSaving ? "추가 중..." : "항목 추가"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
