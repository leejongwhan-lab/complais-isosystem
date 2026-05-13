"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";

const INPUT_STYLE = {
  width: "100%", padding: "8px 12px", fontSize: 13,
  border: "1px solid #E5E5E5", borderRadius: 6,
  outline: "none", color: "#1a1a1a", background: "#fff",
  boxSizing: "border-box" as const,
};

const MATERIAL_TYPES = ["원료", "제품", "폐기물", "폐수", "대기"];
const UNITS = ["kg", "L", "ton", "m³", "개"];

export default function MaterialNewPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    record_month:   "",
    material_name:  "",
    material_type:  "원료",
    input_amount:   "",
    output_amount:  "",
    unit:           "kg",
    loss_amount:    "",
    notes:          "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.record_month || !form.material_name.trim()) { setError("기록 월과 물질명을 입력해주세요."); return; }
    setSaving(true); setError(null);

    const { error: err } = await supabase
      .from("material_balances")
      .insert({
        record_month:  form.record_month,
        material_name: form.material_name.trim(),
        material_type: form.material_type,
        input_amount:  form.input_amount  === "" ? null : parseFloat(form.input_amount),
        output_amount: form.output_amount === "" ? null : parseFloat(form.output_amount),
        unit:          form.unit,
        loss_amount:   form.loss_amount   === "" ? null : parseFloat(form.loss_amount),
        notes:         form.notes.trim()         || null,
      });

    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push("/environment");
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "36px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 480 }}>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>물질 등록</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>물질수지표 항목을 등록합니다.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* 기록 월 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>기록 월 *</label>
              <input type="month" value={form.record_month} onChange={set("record_month")} style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors" />
            </div>

            {/* 물질명 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>물질명 *</label>
              <input type="text" value={form.material_name} onChange={set("material_name")} placeholder="예: 이소프로필알코올" style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 유형 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>유형</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {MATERIAL_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setForm(p => ({ ...p, material_type: t }))}
                    style={{ padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: form.material_type === t ? 600 : 400, border: form.material_type === t ? "1px solid #3B5BDB" : "1px solid #E5E5E5", background: form.material_type === t ? "#EEF2FF" : "#fff", color: form.material_type === t ? "#3B5BDB" : "#555" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 단위 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>단위</label>
              <div style={{ display: "flex", gap: 6 }}>
                {UNITS.map(u => (
                  <button key={u} type="button" onClick={() => setForm(p => ({ ...p, unit: u }))}
                    style={{ padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: form.unit === u ? 600 : 400, border: form.unit === u ? "1px solid #3B5BDB" : "1px solid #E5E5E5", background: form.unit === u ? "#EEF2FF" : "#fff", color: form.unit === u ? "#3B5BDB" : "#555" }}>
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* 투입량 / 산출량 / 손실량 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { key: "input_amount",  label: "투입량",  placeholder: "0" },
                { key: "output_amount", label: "산출량",  placeholder: "0" },
                { key: "loss_amount",   label: "손실량",  placeholder: "0" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>{label} ({form.unit})</label>
                  <input type="number" min="0" step="0.01"
                    value={form[key as keyof typeof form] as string}
                    onChange={set(key as keyof typeof form)}
                    placeholder={placeholder}
                    style={INPUT_STYLE}
                    className="focus:border-[#3B5BDB] transition-colors" />
                </div>
              ))}
            </div>

            {/* 비고 */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>비고</label>
              <textarea value={form.notes} onChange={set("notes")} placeholder="추가 메모" rows={2}
                style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {error && <p style={{ marginBottom: 16, fontSize: 12, color: "#E03131" }}>{error}</p>}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => router.back()}
                style={{ padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#555", border: "1px solid #E5E5E5", background: "#fff" }}
                className="hover:bg-[#F5F5F5] transition-colors">취소</button>
              <button type="submit" disabled={saving}
                style={{ padding: "8px 18px", borderRadius: 6, cursor: saving ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, color: "#fff", border: "none", background: saving ? "#C5D0FF" : "#3B5BDB" }}
                className={saving ? "" : "hover:opacity-90 transition-opacity"}>
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
