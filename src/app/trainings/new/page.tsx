"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";
import type { TrainingType } from "@/types/training";

const INPUT_STYLE = {
  width: "100%", padding: "8px 12px", fontSize: 13,
  border: "1px solid #E5E5E5", borderRadius: 6,
  outline: "none", color: "#1a1a1a", background: "#fff",
  boxSizing: "border-box" as const,
};

const TRAINING_TYPES: { value: TrainingType; label: string }[] = [
  { value: "internal", label: "내부교육" },
  { value: "external", label: "외부교육" },
  { value: "ojt",      label: "OJT" },
];

export default function TrainingNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title:        "",
    type:         "internal" as TrainingType,
    planned_date: "",
    total_count:  "",
    purpose:      "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.planned_date) {
      setError("교육명과 예정일을 입력해주세요.");
      return;
    }
    const count = parseInt(form.total_count, 10);
    if (form.total_count && (isNaN(count) || count <= 0)) {
      setError("계획 인원은 0보다 큰 숫자를 입력해주세요.");
      return;
    }
    setSaving(true);
    setError(null);

    const { data, error: err } = await supabase
      .from("trainings")
      .insert({
        title:           form.title.trim(),
        type:            form.type,
        status:          "planned",
        planned_date:    form.planned_date,
        total_count:     count || 0,
        completed_count: 0,
        purpose:         form.purpose.trim() || null,
      })
      .select()
      .single();

    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push(`/trainings/${data.id}`);
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "40px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>교육 등록</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>교육훈련 계획을 등록합니다.</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>교육명 *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="ISO 9001 품질교육"
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>교육 유형</label>
              <div style={{ display: "flex", gap: 8 }}>
                {TRAINING_TYPES.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, type: t.value }))}
                    style={{
                      flex: 1, padding: "8px 0", borderRadius: 6, cursor: "pointer",
                      fontSize: 12, fontWeight: form.type === t.value ? 600 : 400,
                      border: form.type === t.value ? "1px solid #3B5BDB" : "1px solid #E5E5E5",
                      background: form.type === t.value ? "#EEF2FF" : "#fff",
                      color: form.type === t.value ? "#3B5BDB" : "#555",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>예정일 *</label>
              <input
                type="date"
                value={form.planned_date}
                onChange={e => setForm(p => ({ ...p, planned_date: e.target.value }))}
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>계획 인원수</label>
              <input
                type="number"
                min="1"
                value={form.total_count}
                onChange={e => setForm(p => ({ ...p, total_count: e.target.value }))}
                placeholder="20"
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>교육 목적</label>
              <textarea
                value={form.purpose}
                onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))}
                placeholder="교육의 목적과 기대 효과를 입력하세요."
                rows={3}
                style={{
                  ...INPUT_STYLE,
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
            </div>

            {error && (
              <p style={{ marginBottom: 16, fontSize: 12, color: "#E03131" }}>{error}</p>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  padding: "8px 18px", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 500, color: "#555",
                  border: "1px solid #E5E5E5", background: "#fff",
                }}
                className="hover:bg-[#F5F5F5] transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "8px 18px", borderRadius: 6,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: 13, fontWeight: 600, color: "#fff",
                  border: "none", background: saving ? "#C5D0FF" : "#3B5BDB",
                }}
                className={saving ? "" : "hover:opacity-90 transition-opacity"}
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
