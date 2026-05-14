"use client";
import { Plus, X } from "lucide-react";
import type { ScopeData } from "@/types/sections";

interface Props { data: ScopeData; onChange: (d: ScopeData) => void; readonly?: boolean }

function ItemList({
  items, label, color, onAdd, onRemove, onEdit, readonly,
}: {
  items: string[]; label: string; color: string;
  onAdd: () => void; onRemove: (i: number) => void; onEdit: (i: number, v: string) => void;
  readonly: boolean;
}) {
  return (
    <div style={{ flex: 1, border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", background: color, borderBottom: "1px solid #E5E7EB" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</span>
      </div>
      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {readonly ? (
              <span style={{ fontSize: 14, color: "#374151", flex: 1 }}>• {item}</span>
            ) : (
              <>
                <input
                  value={item}
                  onChange={e => onEdit(i, e.target.value)}
                  placeholder="항목 입력..."
                  style={{ flex: 1, padding: "5px 8px", fontSize: 13, border: "1px solid #E5E7EB", borderRadius: 6, outline: "none" }}
                />
                {items.length > 1 && (
                  <button onClick={() => onRemove(i)} style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }}>
                    <X size={13} color="#999" />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
        {!readonly && (
          <button
            onClick={onAdd}
            style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2, padding: "4px 6px", border: "1px dashed #D1D5DB", borderRadius: 6, background: "none", cursor: "pointer", fontSize: 12, color: "#6B7280" }}
          >
            <Plus size={11} /> 항목 추가
          </button>
        )}
      </div>
    </div>
  );
}

export default function SectionScope({ data, onChange, readonly = false }: Props) {
  const update = (key: keyof ScopeData, items: string[]) => onChange({ ...data, [key]: items });
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <ItemList
        items={data.in_scope}
        label="✅ 적용 대상 (In Scope)"
        color="#F0FDF4"
        readonly={readonly}
        onAdd={() => update("in_scope", [...data.in_scope, ""])}
        onRemove={i => update("in_scope", data.in_scope.filter((_, idx) => idx !== i))}
        onEdit={(i, v) => update("in_scope", data.in_scope.map((x, idx) => idx === i ? v : x))}
      />
      <ItemList
        items={data.out_scope}
        label="❌ 제외 대상 (Out of Scope)"
        color="#FFF7ED"
        readonly={readonly}
        onAdd={() => update("out_scope", [...data.out_scope, ""])}
        onRemove={i => update("out_scope", data.out_scope.filter((_, idx) => idx !== i))}
        onEdit={(i, v) => update("out_scope", data.out_scope.map((x, idx) => idx === i ? v : x))}
      />
    </div>
  );
}
