"use client";
import { Plus, X } from "lucide-react";
import type { SipocData } from "@/types/sections";

interface Props { data: SipocData; onChange: (d: SipocData) => void; readonly?: boolean }

const COLS: Array<{ key: keyof SipocData; label: string; sub: string; color: string }> = [
  { key: "suppliers", label: "공급자 (S)", sub: "Supplier", color: "#EFF6FF" },
  { key: "inputs",    label: "입력 (I)",   sub: "Input",    color: "#F0FDF4" },
  { key: "processes", label: "프로세스 (P)", sub: "Process", color: "#F5F3FF" },
  { key: "outputs",   label: "출력 (O)",   sub: "Output",   color: "#FFF7ED" },
  { key: "customers", label: "고객 (C)",   sub: "Customer", color: "#FFF1F2" },
];

export default function SectionSipoc({ data, onChange, readonly = false }: Props) {
  const update = (key: keyof SipocData, items: string[]) => onChange({ ...data, [key]: items });

  return (
    <div style={{ display: "flex", gap: 0, border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
      {COLS.map(({ key, label, sub, color }) => {
        const items = data[key] as string[];
        return (
          <div key={key} style={{ flex: 1, borderRight: key !== "customers" ? "1px solid #E5E7EB" : "none" }}>
            <div style={{ padding: "10px 12px", background: color, borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{label}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{sub}</div>
            </div>
            <div style={{ padding: "10px 8px", display: "flex", flexDirection: "column", gap: 6, minHeight: 80 }}>
              {items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {readonly ? (
                    <span style={{ fontSize: 13, color: "#374151" }}>• {item}</span>
                  ) : (
                    <>
                      <input
                        value={item}
                        onChange={e => update(key, items.map((x, idx) => idx === i ? e.target.value : x))}
                        placeholder="항목..."
                        style={{ flex: 1, padding: "3px 6px", fontSize: 12, border: "1px solid #E5E7EB", borderRadius: 4, outline: "none" }}
                      />
                      {items.length > 1 && <button onClick={() => update(key, items.filter((_, idx) => idx !== i))} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={10} color="#bbb" /></button>}
                    </>
                  )}
                </div>
              ))}
              {!readonly && (
                <button onClick={() => update(key, [...items, ""])} style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 4px", border: "1px dashed #D1D5DB", borderRadius: 4, background: "none", cursor: "pointer", fontSize: 11, color: "#9CA3AF" }}>
                  <Plus size={9} /> 추가
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
