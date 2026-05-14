"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { EffectivenessStatus } from "@/types/capa";

interface Props {
  capaId: string;
  d8DoneDate: string | null;
  initialStatus: EffectivenessStatus;
  initialResult: string | null;
  initialDueDate: string | null;
}

const STATUS_LABELS: Record<EffectivenessStatus, string> = {
  pending:  "검증 대기",
  verified: "유효",
  failed:   "무효",
};
const STATUS_COLORS: Record<EffectivenessStatus, { color: string; bg: string }> = {
  pending:  { color: "#999",    bg: "#F5F5F5" },
  verified: { color: "#15803D", bg: "#DCFCE7" },
  failed:   { color: "#DC2626", bg: "#FEE2E2" },
};

export default function CapaD9Panel({ capaId, d8DoneDate, initialStatus, initialResult, initialDueDate }: Props) {
  const [status,   setStatus]  = useState<EffectivenessStatus>(initialStatus);
  const [result,   setResult]  = useState(initialResult ?? "");
  const [dueDate,  setDueDate] = useState(() => {
    if (initialDueDate) return initialDueDate;
    if (d8DoneDate) {
      const d = new Date(d8DoneDate);
      d.setDate(d.getDate() + 30);
      return d.toISOString().slice(0, 10);
    }
    return "";
  });
  const [recurrence, setRecurrence] = useState<"none" | "recurred">("none");
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);

  const sc = STATUS_COLORS[status];

  async function handleSave() {
    setSaving(true);
    await supabase
      .from("capas")
      .update({
        effectiveness_due_date:  dueDate || null,
        effectiveness_result:    result.trim() || null,
        effectiveness_status:    status,
        updated_at:              new Date().toISOString(),
      })
      .eq("id", capaId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ border: `1px solid ${status === "verified" ? "#86EFAC" : status === "failed" ? "#FCA5A5" : "#E5E5E5"}`, borderRadius: 8, overflow: "hidden" }}>
      {/* 헤더 */}
      <div style={{ padding: "12px 16px", background: status === "verified" ? "#F0FDF4" : status === "failed" ? "#FFF1F2" : "#FAFAFA", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700,
            background: status === "verified" ? "#15803D" : status === "failed" ? "#DC2626" : "#F0F0F0",
            color: status !== "pending" ? "#fff" : "#bbb",
          }}>D9</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>효과성 검증</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, color: sc.color, background: sc.bg }}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* 본문 */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>검증 예정일</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            style={{ fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 5, padding: "5px 8px", width: "100%", outline: "none", boxSizing: "border-box" }}
          />
          {d8DoneDate && !initialDueDate && (
            <p style={{ margin: "3px 0 0", fontSize: 11, color: "#bbb" }}>D8 완료 후 30일 기준 자동 산정</p>
          )}
        </div>

        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>재발 여부</label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["none", "recurred"] as const).map(v => (
              <button
                key={v}
                onClick={() => setRecurrence(v)}
                style={{
                  padding: "5px 14px", borderRadius: 5, fontSize: 12, cursor: "pointer",
                  fontWeight: recurrence === v ? 600 : 400,
                  border: recurrence === v ? "1.5px solid #3B5BDB" : "1px solid #E5E5E5",
                  background: recurrence === v ? "#EEF2FF" : "#fff",
                  color: recurrence === v ? "#3B5BDB" : "#555",
                }}
              >
                {v === "none" ? "○ 없음" : "○ 재발"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>검증 결과</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as EffectivenessStatus)}
            style={{ fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 5, padding: "5px 8px", width: "100%", outline: "none", background: "#fff" }}
          >
            <option value="pending">선택하세요</option>
            <option value="verified">유효 — 재발 없음, 목표 달성</option>
            <option value="failed">무효 — 재발 또는 목표 미달</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>검증 내용</label>
          <textarea
            value={result}
            onChange={e => setResult(e.target.value)}
            placeholder="효과성 검증 결과를 기술하세요."
            rows={3}
            style={{ fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 5, padding: "6px 8px", width: "100%", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
          />
        </div>

        {saved && (
          <p style={{ margin: 0, fontSize: 12, color: "#15803D", fontWeight: 500 }}>✓ 저장되었습니다.</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "7px 0", borderRadius: 6, fontSize: 13, fontWeight: 600,
            background: "#3B5BDB", color: "#fff", border: "none",
            cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "저장 중..." : "효과성 검증 완료"}
        </button>
      </div>
    </div>
  );
}
