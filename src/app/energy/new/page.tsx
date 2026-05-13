"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";

const INPUT_STYLE = {
  width: "100%", padding: "8px 12px", fontSize: 13,
  border: "1px solid #E5E5E5", borderRadius: 6,
  outline: "none", color: "#1a1a1a", background: "#fff",
  boxSizing: "border-box" as const,
};

const ENERGY_TYPES = ["전력", "도시가스", "LPG", "경유", "기타"] as const;
const UNITS = ["kWh", "Nm³", "L", "ton", "기타"] as const;

type EnergyType = typeof ENERGY_TYPES[number];
type Unit = typeof UNITS[number];

const DEFAULT_UNIT: Record<EnergyType, Unit> = {
  "전력":     "kWh",
  "도시가스": "Nm³",
  "LPG":      "L",
  "경유":     "L",
  "기타":     "kWh",
};

export default function EnergyNewPage() {
  const router = useRouter();
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [form, setForm] = useState({
    record_month: defaultMonth,
    energy_type:  "전력" as EnergyType,
    amount:       "",
    unit:         DEFAULT_UNIT["전력"],
    cost:         "",
    memo:         "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  const isValid = useMemo(() => form.record_month && form.amount && Number(form.amount) > 0, [form]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) { setError("기록 월과 사용량을 입력해주세요."); return; }
    setSaving(true);
    setError(null);
    const { error: err } = await supabase
      .from("energy_records")
      .insert({
        record_month: form.record_month,
        energy_type:  form.energy_type,
        amount:       Number(form.amount),
        unit:         form.unit,
        cost:         form.cost ? Number(form.cost) : null,
        memo:         form.memo.trim() || null,
      });
    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push("/energy");
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "36px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>에너지 사용량 기록</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>월별 에너지 사용량을 등록합니다.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* 기록 월 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>기록 월 *</label>
              <input type="month" value={form.record_month}
                onChange={e => setForm(p => ({ ...p, record_month: e.target.value }))}
                style={INPUT_STYLE} className="focus:border-[#3B5BDB] transition-colors" />
            </div>

            {/* 에너지 구분 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>에너지 구분 *</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {ENERGY_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setForm(p => ({ ...p, energy_type: t, unit: DEFAULT_UNIT[t] }))}
                    style={{
                      padding: "6px 14px", borderRadius: 6, cursor: "pointer",
                      fontSize: 12, fontWeight: form.energy_type === t ? 600 : 400,
                      border: form.energy_type === t ? "1px solid #3B5BDB" : "1px solid #E5E5E5",
                      background: form.energy_type === t ? "#EEF2FF" : "#fff",
                      color: form.energy_type === t ? "#3B5BDB" : "#555",
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 사용량 + 단위 */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>사용량 *</label>
                <input type="number" min="0" step="any" value={form.amount}
                  onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="0" style={INPUT_STYLE}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>단위</label>
                <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value as Unit }))}
                  style={{ ...INPUT_STYLE, cursor: "pointer" }}>
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* 비용 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>비용 (원)</label>
              <input type="number" min="0" value={form.cost}
                onChange={e => setForm(p => ({ ...p, cost: e.target.value }))}
                placeholder="선택 입력" style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 메모 */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>메모</label>
              <textarea value={form.memo} onChange={e => setForm(p => ({ ...p, memo: e.target.value }))}
                placeholder="특이사항 등 자유롭게 입력" rows={3}
                style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {error && <p style={{ marginBottom: 16, fontSize: 12, color: "#E03131" }}>{error}</p>}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => router.back()}
                style={{ padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#555", border: "1px solid #E5E5E5", background: "#fff" }}
                className="hover:bg-[#F5F5F5] transition-colors">취소</button>
              <button type="submit" disabled={saving || !isValid}
                style={{ padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#fff", border: "none",
                  background: saving || !isValid ? "#C5D0FF" : "#3B5BDB",
                  cursor: saving || !isValid ? "not-allowed" : "pointer" }}
                className={saving || !isValid ? "" : "hover:opacity-90 transition-opacity"}>
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
