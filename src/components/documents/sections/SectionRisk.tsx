"use client";
import { Plus, X } from "lucide-react";
import type { RiskData } from "@/types/sections";

interface Props { data: RiskData; onChange: (d: RiskData) => void; readonly?: boolean }

const TH: React.CSSProperties = { padding: "8px 10px", background: "#F9FAFB", fontSize: 11, fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E5E7EB", textAlign: "left" };
const TD: React.CSSProperties = { padding: "6px 8px", borderBottom: "1px solid #F3F4F6", verticalAlign: "middle" };
const IN: React.CSSProperties = { width: "100%", padding: "3px 6px", fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 4, outline: "none", boxSizing: "border-box" };

function scoreColor(score: number): { color: string; bg: string } {
  if (score >= 10) return { color: "#DC2626", bg: "#FEE2E2" };
  if (score >= 5)  return { color: "#D97706", bg: "#FEF3C7" };
  return { color: "#16A34A", bg: "#DCFCE7" };
}

export default function SectionRisk({ data, onChange, readonly = false }: Props) {
  const addRow = () => onChange({ rows: [...data.rows, { id: crypto.randomUUID(), type: "위험", content: "", likelihood: 1, impact: 1, response: "", owner: "" }] });
  const removeRow = (id: string) => onChange({ rows: data.rows.filter(r => r.id !== id) });
  const editRow = (id: string, key: string, val: string | number) => onChange({ rows: data.rows.map(r => r.id === id ? { ...r, [key]: val } : r) });

  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: 36 }}>#</th>
            <th style={{ ...TH, width: 70 }}>구분</th>
            <th style={TH}>내용</th>
            <th style={{ ...TH, width: 60 }}>가능성</th>
            <th style={{ ...TH, width: 60 }}>영향</th>
            <th style={{ ...TH, width: 60 }}>점수</th>
            <th style={TH}>대응방안</th>
            <th style={{ ...TH, width: 90 }}>담당자</th>
            {!readonly && <th style={{ ...TH, width: 32 }} />}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => {
            const score = row.likelihood * row.impact;
            const sc = scoreColor(score);
            return (
              <tr key={row.id}>
                <td style={{ ...TD, textAlign: "center", fontSize: 12, color: "#9CA3AF" }}>{i + 1}</td>
                <td style={TD}>
                  {readonly ? (
                    <span style={{ fontSize: 12, padding: "2px 6px", borderRadius: 4, background: row.type === "위험" ? "#FEE2E2" : "#DCFCE7", color: row.type === "위험" ? "#DC2626" : "#16A34A", fontWeight: 600 }}>{row.type}</span>
                  ) : (
                    <select value={row.type} onChange={e => editRow(row.id, "type", e.target.value)} style={{ ...IN, cursor: "pointer" }}>
                      <option value="위험">위험</option>
                      <option value="기회">기회</option>
                    </select>
                  )}
                </td>
                <td style={TD}>{readonly ? <span style={{ fontSize: 13 }}>{row.content}</span> : <input value={row.content} onChange={e => editRow(row.id, "content", e.target.value)} placeholder="내용" style={IN} />}</td>
                <td style={{ ...TD, textAlign: "center" }}>
                  {readonly ? <span style={{ fontSize: 13, fontWeight: 600 }}>{row.likelihood}</span> : (
                    <select value={row.likelihood} onChange={e => editRow(row.id, "likelihood", Number(e.target.value))} style={{ ...IN, cursor: "pointer" }}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  )}
                </td>
                <td style={{ ...TD, textAlign: "center" }}>
                  {readonly ? <span style={{ fontSize: 13, fontWeight: 600 }}>{row.impact}</span> : (
                    <select value={row.impact} onChange={e => editRow(row.id, "impact", Number(e.target.value))} style={{ ...IN, cursor: "pointer" }}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  )}
                </td>
                <td style={{ ...TD, textAlign: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, padding: "2px 8px", borderRadius: 4, color: sc.color, background: sc.bg }}>{score}</span>
                </td>
                <td style={TD}>{readonly ? <span style={{ fontSize: 13 }}>{row.response}</span> : <input value={row.response} onChange={e => editRow(row.id, "response", e.target.value)} placeholder="대응방안" style={IN} />}</td>
                <td style={TD}>{readonly ? <span style={{ fontSize: 13 }}>{row.owner}</span> : <input value={row.owner} onChange={e => editRow(row.id, "owner", e.target.value)} placeholder="담당자" style={IN} />}</td>
                {!readonly && <td style={{ ...TD, textAlign: "center" }}>{data.rows.length > 1 && <button onClick={() => removeRow(row.id)} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={12} color="#bbb" /></button>}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
      {!readonly && (
        <button onClick={addRow} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", border: "1px dashed #D1D5DB", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 13, color: "#6B7280" }}>
          <Plus size={12} /> 행 추가
        </button>
      )}
      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        {[{ label: "저위험 (1–4)", ...scoreColor(3) }, { label: "중위험 (5–9)", ...scoreColor(6) }, { label: "고위험 (10+)", ...scoreColor(12) }].map(s => (
          <span key={s.label} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, color: s.color, background: s.bg, fontWeight: 600 }}>{s.label}</span>
        ))}
      </div>
    </div>
  );
}
