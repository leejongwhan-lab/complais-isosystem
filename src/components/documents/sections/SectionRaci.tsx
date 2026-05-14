"use client";
import { Plus, X } from "lucide-react";
import type { RaciData } from "@/types/sections";

interface Props { data: RaciData; onChange: (d: RaciData) => void; readonly?: boolean }

const RACI_OPTIONS = ["R", "A", "C", "I", "-"];
const RACI_COLORS: Record<string, { color: string; bg: string }> = {
  R: { color: "#2563EB", bg: "#DBEAFE" },
  A: { color: "#DC2626", bg: "#FEE2E2" },
  C: { color: "#D97706", bg: "#FEF3C7" },
  I: { color: "#16A34A", bg: "#DCFCE7" },
  "-": { color: "#9CA3AF", bg: "#F3F4F6" },
};

export default function SectionRaci({ data, onChange, readonly = false }: Props) {
  const getCell = (activity: string, role: string) => data.matrix[activity]?.[role] ?? "-";
  const setCell = (activity: string, role: string, val: string) => {
    const next = { ...data.matrix, [activity]: { ...data.matrix[activity], [role]: val } };
    onChange({ ...data, matrix: next });
  };

  const addRole = () => onChange({ ...data, roles: [...data.roles, ""] });
  const addActivity = () => onChange({ ...data, activities: [...data.activities, ""] });
  const removeRole = (i: number) => onChange({ ...data, roles: data.roles.filter((_, idx) => idx !== i) });
  const removeActivity = (i: number) => onChange({ ...data, activities: data.activities.filter((_, idx) => idx !== i) });
  const editRole = (i: number, v: string) => onChange({ ...data, roles: data.roles.map((r, idx) => idx === i ? v : r) });
  const editActivity = (i: number, v: string) => onChange({ ...data, activities: data.activities.map((a, idx) => idx === i ? v : a) });

  const TH: React.CSSProperties = { padding: "8px 10px", background: "#F9FAFB", fontSize: 12, fontWeight: 600, color: "#6B7280", border: "1px solid #E5E7EB", textAlign: "center" };
  const TD: React.CSSProperties = { padding: "6px 8px", border: "1px solid #F3F4F6", textAlign: "center" };

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", minWidth: 500 }}>
          <thead>
            <tr>
              <th style={{ ...TH, textAlign: "left", minWidth: 160 }}>업무/활동</th>
              {data.roles.map((role, i) => (
                <th key={i} style={{ ...TH, minWidth: 90 }}>
                  {readonly ? role : (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <input value={role} onChange={e => editRole(i, e.target.value)} placeholder="역할" style={{ width: "100%", border: "none", background: "transparent", fontSize: 12, fontWeight: 600, textAlign: "center", outline: "none" }} />
                      {data.roles.length > 1 && <button onClick={() => removeRole(i)} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}><X size={10} color="#bbb" /></button>}
                    </div>
                  )}
                </th>
              ))}
              {!readonly && <th style={TH}><button onClick={addRole} style={{ border: "none", background: "none", cursor: "pointer", color: "#6B7280" }}><Plus size={12} /></button></th>}
            </tr>
          </thead>
          <tbody>
            {data.activities.map((activity, ai) => (
              <tr key={ai}>
                <td style={{ ...TD, textAlign: "left", padding: "6px 10px" }}>
                  {readonly ? <span style={{ fontSize: 13 }}>{activity}</span> : (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <input value={activity} onChange={e => editActivity(ai, e.target.value)} placeholder="업무 입력..." style={{ flex: 1, border: "none", fontSize: 13, outline: "none" }} />
                      {data.activities.length > 1 && <button onClick={() => removeActivity(ai)} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={11} color="#bbb" /></button>}
                    </div>
                  )}
                </td>
                {data.roles.map((role, ri) => {
                  const val = getCell(activity, role);
                  const style = RACI_COLORS[val] ?? RACI_COLORS["-"];
                  return (
                    <td key={ri} style={TD}>
                      {readonly ? (
                        <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 700, color: style.color, background: style.bg }}>{val}</span>
                      ) : (
                        <select
                          value={val}
                          onChange={e => setCell(activity, role, e.target.value)}
                          style={{ border: "none", background: style.bg, color: style.color, fontSize: 12, fontWeight: 700, borderRadius: 4, padding: "2px 4px", cursor: "pointer" }}
                        >
                          {RACI_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      )}
                    </td>
                  );
                })}
                {!readonly && <td style={TD} />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!readonly && (
        <button onClick={addActivity} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", border: "1px dashed #D1D5DB", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 13, color: "#6B7280" }}>
          <Plus size={12} /> 업무 추가
        </button>
      )}
      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[["R", "실행책임"], ["A", "최종책임"], ["C", "협의"], ["I", "통보"]].map(([k, label]) => {
          const s = RACI_COLORS[k!];
          return (
            <span key={k} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, color: s.color, background: s.bg, fontWeight: 600 }}>
              {k} = {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
