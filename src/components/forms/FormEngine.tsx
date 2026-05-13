"use client";

import { useState } from "react";
import { FormTemplate, FormData, FormField } from "@/types/form";
import FormTable from "./FormTable";

interface FormEngineProps {
  template: FormTemplate;
  initialData?: FormData;
  onSave?: (data: FormData, status: "draft" | "completed") => void | Promise<void>;
  readOnly?: boolean;
}

function FieldRow({ field, value, onChange, readOnly }: {
  field: FormField;
  value: FormData[string];
  onChange: (v: FormData[string]) => void;
  readOnly: boolean;
}) {
  const base: React.CSSProperties = {
    width: "100%", fontSize: 13, color: "#1a1a1a",
    background: readOnly ? "#FAFAFA" : "#fff",
    border: "1px solid #E5E5E5", borderRadius: 5,
    padding: "7px 10px", outline: "none",
    boxSizing: "border-box",
  };

  if (field.type === "table") {
    const rows = (Array.isArray(value) ? value : []) as Record<string, string>[];
    return (
      <FormTable
        columns={field.columns ?? []}
        value={rows}
        onChange={onChange as (rows: Record<string, string>[]) => void}
        readOnly={readOnly}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        value={(value as string) ?? ""}
        onChange={e => onChange(e.target.value)}
        readOnly={readOnly}
        rows={4}
        placeholder={field.placeholder}
        style={{ ...base, resize: "vertical", lineHeight: 1.6 }}
      />
    );
  }

  if (field.type === "select") {
    if (readOnly) {
      return <div style={{ ...base, cursor: "default" }}>{(value as string) ?? ""}</div>;
    }
    return (
      <select
        value={(value as string) ?? ""}
        onChange={e => onChange(e.target.value)}
        style={{ ...base, cursor: "pointer" }}
      >
        <option value="">선택</option>
        {field.options?.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: readOnly ? "default" : "pointer" }}>
        <input
          type="checkbox"
          checked={!!value}
          onChange={e => onChange(e.target.checked)}
          disabled={readOnly}
          style={{ width: 15, height: 15 }}
        />
        <span style={{ fontSize: 13, color: "#555" }}>{field.label}</span>
      </label>
    );
  }

  return (
    <input
      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
      value={(value as string) ?? ""}
      onChange={e => onChange(field.type === "number" ? e.target.valueAsNumber : e.target.value)}
      readOnly={readOnly}
      placeholder={field.placeholder}
      style={base}
    />
  );
}

export default function FormEngine({ template, initialData = {}, onSave, readOnly = false }: FormEngineProps) {
  const [data, setData] = useState<FormData>(initialData);
  const [saving, setSaving] = useState(false);

  function set(key: string, val: FormData[string]) {
    setData(prev => ({ ...prev, [key]: val }));
  }

  async function handleSave(status: "draft" | "completed") {
    setSaving(true);
    await onSave?.(data, status);
    setSaving(false);
  }

  const required = template.fields.filter(f => f.required);

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      {/* 폼 필드 영역 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8,
          padding: 24,
        }}>
          {/* 서식 헤더 */}
          <div style={{
            borderBottom: "2px solid #3B5BDB", paddingBottom: 16, marginBottom: 24,
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "#999", marginBottom: 2 }}>
                {template.form_code} · {template.category}
                {template.iso_clause && ` · ISO ${template.iso_clause}`}
              </p>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1a1a" }}>
                {template.form_name}
              </h2>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>서식번호</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#555" }}>
                {template.form_code}
              </p>
            </div>
          </div>

          {/* 필드 그리드 */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px 20px",
          }}>
            {template.fields.map(field => {
              const isFullWidth = field.width === "full" || field.type === "textarea" || field.type === "table";
              return (
                <div
                  key={field.key}
                  style={{
                    gridColumn: isFullWidth ? "1 / -1" : undefined,
                  }}
                >
                  {field.type !== "checkbox" && (
                    <label style={{
                      display: "block", fontSize: 12, fontWeight: 600,
                      color: "#555", marginBottom: 5,
                    }}>
                      {field.label}
                      {field.required && <span style={{ color: "#E03131", marginLeft: 2 }}>*</span>}
                    </label>
                  )}
                  <FieldRow
                    field={field}
                    value={data[field.key]}
                    onChange={v => set(field.key, v)}
                    readOnly={readOnly}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 저장 버튼 */}
        {!readOnly && (
          <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              style={{
                padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 500,
                border: "1px solid #E5E5E5", background: "#fff",
                color: "#555", cursor: saving ? "default" : "pointer",
              }}
              className="hover:bg-[#F5F5F5] transition-colors"
            >
              임시저장
            </button>
            <button
              onClick={() => handleSave("completed")}
              disabled={saving}
              style={{
                padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                border: "none", background: saving ? "#748FFC" : "#3B5BDB",
                color: "#fff", cursor: saving ? "default" : "pointer",
              }}
              className="hover:bg-[#3451C7] transition-colors"
            >
              {saving ? "저장 중..." : "서식 완료"}
            </button>
          </div>
        )}
      </div>

      {/* 우측 패널: 필수 항목 체크리스트 */}
      <div style={{ width: 220, flexShrink: 0 }}>
        <div style={{
          background: "#F8F9FA", border: "1px solid #E5E5E5",
          borderRadius: 8, padding: 16,
        }}>
          <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 700, color: "#555" }}>
            필수 항목
          </p>
          {required.length === 0 && (
            <p style={{ margin: 0, fontSize: 12, color: "#bbb" }}>없음</p>
          )}
          {required.map(f => {
            const filled = !!data[f.key] && (
              Array.isArray(data[f.key])
                ? (data[f.key] as unknown[]).length > 0
                : String(data[f.key]).trim() !== ""
            );
            return (
              <div key={f.key} style={{
                display: "flex", alignItems: "center", gap: 6,
                marginBottom: 8,
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                  background: filled ? "#2F9E44" : "#E5E5E5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {filled && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 12, color: filled ? "#2F9E44" : "#888" }}>
                  {f.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* 서식 정보 */}
        <div style={{
          background: "#fff", border: "1px solid #E5E5E5",
          borderRadius: 8, padding: 16, marginTop: 12,
        }}>
          <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: "#555" }}>서식 정보</p>
          {[
            { label: "유형", value: template.category },
            { label: "패턴", value: `Pattern ${template.pattern}` },
            { label: "ISO 조항", value: template.iso_clause ?? "-" },
          ].map(({ label, value }) => (
            <div key={label} style={{ marginBottom: 6 }}>
              <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>{label}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#555" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
