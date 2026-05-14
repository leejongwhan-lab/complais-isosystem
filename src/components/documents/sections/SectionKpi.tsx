"use client";
import { Plus, X } from "lucide-react";
import type { KpiData } from "@/types/sections";

interface Props { data: KpiData; onChange: (d: KpiData) => void; readonly?: boolean }

const TH: React.CSSProperties = { padding: "8px 10px", background: "#F9FAFB", fontSize: 11, fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E5E7EB", textAlign: "left" };
const TD: React.CSSProperties = { padding: "6px 8px", borderBottom: "1px solid #F3F4F6", verticalAlign: "middle" };
const IN: React.CSSProperties = { width: "100%", padding: "3px 6px", fontSize: 13, border: "1px solid #E5E7EB", borderRadius: 4, outline: "none", boxSizing: "border-box" };
const CYCLES = ["매일", "주 1회", "월 1회", "분기 1회", "반기 1회", "연 1회"];

export default function SectionKpi({ data, onChange, readonly = false }: Props) {
  const addRow = () => onChange({ rows: [...data.rows, { id: crypto.randomUUID(), name: "", unit: "", target: "", cycle: "월 1회", owner: "" }] });
  const removeRow = (id: string) => onChange({ rows: data.rows.filter(r => r.id !== id) });
  const editRow = (id: string, key: string, val: string) => onChange({ rows: data.rows.map(r => r.id === id ? { ...r, [key]: val } : r) });

  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: 36 }}>번호</th>
            <th style={TH}>지표명</th>
            <th style={{ ...TH, width: 70 }}>단위</th>
            <th style={{ ...TH, width: 90 }}>목표값</th>
            <th style={{ ...TH, width: 100 }}>측정주기</th>
            <th style={{ ...TH, width: 100 }}>담당자</th>
            {!readonly && <th style={{ ...TH, width: 32 }} />}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={row.id}>
              <td style={{ ...TD, textAlign: "center", fontSize: 12, color: "#9CA3AF" }}>{i + 1}</td>
              <td style={TD}>{readonly ? <span style={{ fontSize: 13 }}>{row.name}</span> : <input value={row.name} onChange={e => editRow(row.id, "name", e.target.value)} placeholder="지표명" style={IN} />}</td>
              <td style={TD}>{readonly ? <span style={{ fontSize: 13 }}>{row.unit}</span> : <input value={row.unit} onChange={e => editRow(row.id, "unit", e.target.value)} placeholder="%" style={IN} />}</td>
              <td style={TD}>{readonly ? <span style={{ fontSize: 13, fontWeight: 600 }}>{row.target}</span> : <input value={row.target} onChange={e => editRow(row.id, "target", e.target.value)} placeholder="≥ 95" style={IN} />}</td>
              <td style={TD}>
                {readonly ? <span style={{ fontSize: 13 }}>{row.cycle}</span> : (
                  <select value={row.cycle} onChange={e => editRow(row.id, "cycle", e.target.value)} style={{ ...IN, cursor: "pointer" }}>
                    {CYCLES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              </td>
              <td style={TD}>{readonly ? <span style={{ fontSize: 13 }}>{row.owner}</span> : <input value={row.owner} onChange={e => editRow(row.id, "owner", e.target.value)} placeholder="담당자" style={IN} />}</td>
              {!readonly && <td style={{ ...TD, textAlign: "center" }}>{data.rows.length > 1 && <button onClick={() => removeRow(row.id)} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={12} color="#bbb" /></button>}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {!readonly && (
        <button onClick={addRow} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", border: "1px dashed #D1D5DB", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 13, color: "#6B7280" }}>
          <Plus size={12} /> 행 추가
        </button>
      )}
    </div>
  );
}
