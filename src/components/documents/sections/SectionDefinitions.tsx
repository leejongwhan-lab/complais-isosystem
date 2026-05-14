"use client";
import { Plus, X } from "lucide-react";
import type { DefinitionsData } from "@/types/sections";

interface Props { data: DefinitionsData; onChange: (d: DefinitionsData) => void; readonly?: boolean }

const TH: React.CSSProperties = {
  padding: "8px 12px", background: "#F9FAFB", fontSize: 12,
  fontWeight: 600, color: "#6B7280", borderBottom: "1px solid #E5E7EB",
  textAlign: "left", whiteSpace: "nowrap",
};
const TD: React.CSSProperties = {
  padding: "6px 8px", borderBottom: "1px solid #F3F4F6", verticalAlign: "middle",
};

export default function SectionDefinitions({ data, onChange, readonly = false }: Props) {
  const addRow = () => onChange({ rows: [...data.rows, { id: crypto.randomUUID(), term: "", definition: "", source: "" }] });
  const removeRow = (id: string) => onChange({ rows: data.rows.filter(r => r.id !== id) });
  const editRow = (id: string, key: string, val: string) =>
    onChange({ rows: data.rows.map(r => r.id === id ? { ...r, [key]: val } : r) });

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "4px 6px", fontSize: 13,
    border: "1px solid #E5E7EB", borderRadius: 4, outline: "none", boxSizing: "border-box",
  };

  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: 40 }}>번호</th>
            <th style={{ ...TH, width: 140 }}>용어</th>
            <th style={TH}>정의</th>
            <th style={{ ...TH, width: 120 }}>출처</th>
            {!readonly && <th style={{ ...TH, width: 32 }} />}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={row.id}>
              <td style={{ ...TD, textAlign: "center", fontSize: 12, color: "#9CA3AF" }}>{i + 1}</td>
              <td style={TD}>
                {readonly ? <span style={{ fontSize: 14 }}>{row.term}</span> : <input value={row.term} onChange={e => editRow(row.id, "term", e.target.value)} placeholder="용어" style={inputStyle} />}
              </td>
              <td style={TD}>
                {readonly ? <span style={{ fontSize: 14, color: "#374151" }}>{row.definition}</span> : <input value={row.definition} onChange={e => editRow(row.id, "definition", e.target.value)} placeholder="정의" style={inputStyle} />}
              </td>
              <td style={TD}>
                {readonly ? <span style={{ fontSize: 13, color: "#6B7280" }}>{row.source}</span> : <input value={row.source} onChange={e => editRow(row.id, "source", e.target.value)} placeholder="ISO 9001:7.1" style={inputStyle} />}
              </td>
              {!readonly && (
                <td style={{ ...TD, textAlign: "center" }}>
                  {data.rows.length > 1 && <button onClick={() => removeRow(row.id)} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={13} color="#bbb" /></button>}
                </td>
              )}
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
