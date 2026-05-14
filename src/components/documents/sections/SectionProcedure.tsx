"use client";
import { Plus, ChevronUp, ChevronDown, X } from "lucide-react";
import type { ProcedureData } from "@/types/sections";

interface Props { data: ProcedureData; onChange: (d: ProcedureData) => void; readonly?: boolean }

const inputStyle = (width?: string): React.CSSProperties => ({
  width: width ?? "100%", padding: "5px 8px", fontSize: 13,
  border: "1px solid #E5E7EB", borderRadius: 6, outline: "none", boxSizing: "border-box",
});

export default function SectionProcedure({ data, onChange, readonly = false }: Props) {
  const addStep = () => onChange({
    steps: [...data.steps, { id: crypto.randomUUID(), title: `Step ${data.steps.length + 1}`, owner: "", input: "", output: "", content: "", note: "" }]
  });
  const removeStep = (id: string) => onChange({ steps: data.steps.filter(s => s.id !== id) });
  const editStep = (id: string, key: string, val: string) =>
    onChange({ steps: data.steps.map(s => s.id === id ? { ...s, [key]: val } : s) });
  const moveStep = (i: number, dir: -1 | 1) => {
    const arr = [...data.steps];
    const [item] = arr.splice(i, 1);
    arr.splice(i + dir, 0, item);
    onChange({ steps: arr });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.steps.map((step, i) => (
        <div key={step.id} style={{ border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", background: "#DBEAFE", borderRadius: 4, padding: "1px 8px", flexShrink: 0 }}>
              Step {i + 1}
            </span>
            {readonly ? (
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827", flex: 1 }}>{step.title}</span>
            ) : (
              <input value={step.title} onChange={e => editStep(step.id, "title", e.target.value)} placeholder="스텝 제목" style={{ flex: 1, ...inputStyle(), border: "none", background: "transparent", fontSize: 14, fontWeight: 600 }} />
            )}
            {!readonly && (
              <div style={{ display: "flex", gap: 2 }}>
                {i > 0 && <button onClick={() => moveStep(i, -1)} style={{ border: "none", background: "none", cursor: "pointer" }}><ChevronUp size={14} color="#9CA3AF" /></button>}
                {i < data.steps.length - 1 && <button onClick={() => moveStep(i, 1)} style={{ border: "none", background: "none", cursor: "pointer" }}><ChevronDown size={14} color="#9CA3AF" /></button>}
                {data.steps.length > 1 && <button onClick={() => removeStep(step.id)} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={14} color="#9CA3AF" /></button>}
              </div>
            )}
          </div>
          <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 3 }}>담당</label>
                {readonly ? <span style={{ fontSize: 13 }}>{step.owner || "—"}</span> : <input value={step.owner} onChange={e => editStep(step.id, "owner", e.target.value)} placeholder="담당자" style={inputStyle("100%")} />}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 3 }}>입력 (Input)</label>
                {readonly ? <span style={{ fontSize: 13 }}>{step.input || "—"}</span> : <input value={step.input} onChange={e => editStep(step.id, "input", e.target.value)} placeholder="필요 자료/정보" style={inputStyle("100%")} />}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 3 }}>출력 (Output)</label>
                {readonly ? <span style={{ fontSize: 13 }}>{step.output || "—"}</span> : <input value={step.output} onChange={e => editStep(step.id, "output", e.target.value)} placeholder="산출물/결과" style={inputStyle("100%")} />}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 3 }}>상세 내용</label>
              {readonly ? (
                <p style={{ margin: 0, fontSize: 14, color: "#374151", whiteSpace: "pre-wrap" }}>{step.content || "—"}</p>
              ) : (
                <textarea value={step.content} onChange={e => editStep(step.id, "content", e.target.value)} placeholder="상세 절차 내용..." style={{ ...inputStyle(), minHeight: 72, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} />
              )}
            </div>
            {(step.note || !readonly) && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 3 }}>비고</label>
                {readonly ? <span style={{ fontSize: 13, color: "#6B7280" }}>{step.note || "—"}</span> : <input value={step.note} onChange={e => editStep(step.id, "note", e.target.value)} placeholder="주의사항, 예외처리 등" style={inputStyle("100%")} />}
              </div>
            )}
          </div>
        </div>
      ))}
      {!readonly && (
        <button onClick={addStep} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px dashed #D1D5DB", borderRadius: 8, background: "none", cursor: "pointer", fontSize: 13, color: "#6B7280", alignSelf: "flex-start" }}>
          <Plus size={13} /> 스텝 추가
        </button>
      )}
    </div>
  );
}
