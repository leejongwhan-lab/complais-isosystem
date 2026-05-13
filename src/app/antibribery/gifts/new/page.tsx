"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";

const INPUT_STYLE = {
  width: "100%", padding: "8px 12px", fontSize: 13,
  border: "1px solid #E5E5E5", borderRadius: 6,
  outline: "none", color: "#1a1a1a", background: "#fff",
  boxSizing: "border-box" as const,
};

const GIFT_TYPES = ["선물수령", "접대", "기부", "기타"] as const;
const ACTIONS = [
  { value: "reported", label: "신고완료" },
  { value: "returned", label: "반환" },
  { value: "approved", label: "승인필요" },
] as const;

type GiftType = typeof GIFT_TYPES[number];
type ActionType = typeof ACTIONS[number]["value"];

export default function GiftReportNewPage() {
  const router = useRouter();
  const year = new Date().getFullYear();
  const today = new Date().toISOString().slice(0, 10);
  const [giftCount, setGiftCount] = useState(0);
  const [form, setForm] = useState({
    report_date:   today,
    reporter_name: "",
    gift_type:     "선물수령" as GiftType,
    provider:      "",
    amount:        "",
    description:   "",
    action:        "reported" as ActionType,
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    supabase.from("gift_reports").select("*", { count: "exact", head: true })
      .then(({ count }) => setGiftCount(count ?? 0));
  }, []);

  const reportNumber = `GR-${year}-${String(giftCount + 1).padStart(3, "0")}`;
  const isValid = useMemo(() => form.reporter_name.trim() && form.provider.trim(), [form]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) { setError("신고자와 제공자를 입력해주세요."); return; }
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.from("gift_reports").insert({
      report_number: reportNumber,
      report_date:   form.report_date,
      reporter_name: form.reporter_name.trim(),
      gift_type:     form.gift_type,
      provider:      form.provider.trim(),
      amount:        form.amount ? Number(form.amount) : null,
      description:   form.description.trim() || null,
      action:        form.action,
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push("/antibribery");
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "36px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>선물·접대 신고서</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>수령한 선물·접대 내역을 신고합니다.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* 신고번호 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>신고번호</label>
              <div style={{ ...INPUT_STYLE, background: "#FAFAFA", fontFamily: "monospace", fontWeight: 700, color: "#3B5BDB" }}>
                {reportNumber}
              </div>
            </div>

            {/* 신고일 + 신고자 */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>신고일 *</label>
                <input type="date" value={form.report_date}
                  onChange={e => setForm(p => ({ ...p, report_date: e.target.value }))}
                  style={INPUT_STYLE} className="focus:border-[#3B5BDB] transition-colors" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>신고자 *</label>
                <input type="text" value={form.reporter_name}
                  onChange={e => setForm(p => ({ ...p, reporter_name: e.target.value }))}
                  placeholder="신고자 이름" style={INPUT_STYLE}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
              </div>
            </div>

            {/* 구분 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>구분 *</label>
              <div style={{ display: "flex", gap: 6 }}>
                {GIFT_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setForm(p => ({ ...p, gift_type: t }))}
                    style={{
                      flex: 1, padding: "7px 0", borderRadius: 6, cursor: "pointer",
                      fontSize: 12, fontWeight: form.gift_type === t ? 600 : 400,
                      border: form.gift_type === t ? "1px solid #3B5BDB" : "1px solid #E5E5E5",
                      background: form.gift_type === t ? "#EEF2FF" : "#fff",
                      color: form.gift_type === t ? "#3B5BDB" : "#555",
                    }}>{t}</button>
                ))}
              </div>
            </div>

            {/* 제공자 + 금액 */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>제공자 *</label>
                <input type="text" value={form.provider}
                  onChange={e => setForm(p => ({ ...p, provider: e.target.value }))}
                  placeholder="회사명 또는 개인명" style={INPUT_STYLE}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>금액 (원)</label>
                <input type="number" min="0" value={form.amount}
                  onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="선택" style={INPUT_STYLE}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
              </div>
            </div>

            {/* 내용 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>내용 설명</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="선물·접대 내용을 구체적으로 기재하세요" rows={3}
                style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 처리방법 */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>처리방법 *</label>
              <div style={{ display: "flex", gap: 8 }}>
                {ACTIONS.map(a => (
                  <button key={a.value} type="button" onClick={() => setForm(p => ({ ...p, action: a.value }))}
                    style={{
                      flex: 1, padding: "8px 0", borderRadius: 6, cursor: "pointer",
                      fontSize: 12, fontWeight: form.action === a.value ? 600 : 400,
                      border: form.action === a.value ? "1px solid #3B5BDB" : "1px solid #E5E5E5",
                      background: form.action === a.value ? "#EEF2FF" : "#fff",
                      color: form.action === a.value ? "#3B5BDB" : "#555",
                    }}>{a.label}</button>
                ))}
              </div>
            </div>

            {error && <p style={{ marginBottom: 16, fontSize: 12, color: "#E03131" }}>{error}</p>}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => router.back()}
                style={{ padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#555", border: "1px solid #E5E5E5", background: "#fff" }}
                className="hover:bg-[#F5F5F5] transition-colors">취소</button>
              <button type="submit" disabled={saving}
                style={{ padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#fff", border: "none",
                  background: saving ? "#C5D0FF" : "#3B5BDB", cursor: saving ? "not-allowed" : "pointer" }}
                className={saving ? "" : "hover:opacity-90 transition-opacity"}>
                {saving ? "저장 중..." : "신고 제출"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
