"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";

const INPUT_STYLE = {
  width: "100%",
  padding: "10px 12px",
  fontSize: 14,
  border: "1px solid #E5E5E5",
  borderRadius: 6,
  outline: "none",
  color: "#1a1a1a",
  background: "#fff",
  boxSizing: "border-box" as const,
};

const WEATHER_OPTIONS = [
  { value: "맑음", emoji: "☀️" },
  { value: "흐림", emoji: "🌤️" },
  { value: "비", emoji: "🌧️" },
  { value: "눈", emoji: "❄️" },
];

export default function TBMNewPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    tbm_date: new Date().toISOString().slice(0, 10),
    work_location: "",
    work_content: "",
    hazards: "",
    safety_instructions: "",
    weather: "맑음",
    temperature: "",
    leader_name: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.work_location.trim() || !form.work_content.trim() || !form.leader_name.trim()) {
      setError("필수 항목을 입력해주세요.");
      return;
    }
    setSaving(true);
    setError(null);

    const { data, error: err } = await supabase
      .from("tbm_records")
      .insert({
        ...form,
        work_location: form.work_location.trim(),
        work_content: form.work_content.trim(),
        leader_name: form.leader_name.trim(),
        attendee_count: 0,
      })
      .select()
      .single();

    setSaving(false);
    if (err || !data) {
      setError(err?.message ?? "저장 실패");
      return;
    }
    router.push(`/tbm/${data.id}`);
  }

  return (
    <AppLayout>
      <div style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px 24px",
        background: "#fff",
        minHeight: "calc(100vh - 56px)",
      }}>
        <div style={{ width: "100%", maxWidth: 560 }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
              오늘의 TBM 등록
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>
              작업 전 안전교육을 기록합니다
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{
              background: "#fff",
              border: "1px solid #E5E5E5",
              borderRadius: 10,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}>

              {/* 날짜 */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>
                  날짜
                </label>
                <input
                  type="date"
                  value={form.tbm_date}
                  onChange={e => setForm(prev => ({ ...prev, tbm_date: e.target.value }))}
                  style={INPUT_STYLE}
                  className="focus:border-[#3B5BDB] transition-colors"
                />
              </div>

              {/* 작업 장소 */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>
                  작업 장소 <span style={{ color: "#E03131" }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.work_location}
                  onChange={e => setForm(prev => ({ ...prev, work_location: e.target.value }))}
                  placeholder="예: 3공장 2층 조립라인"
                  style={INPUT_STYLE}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                />
              </div>

              {/* 오늘 작업 내용 */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>
                  오늘 작업 내용 <span style={{ color: "#E03131" }}>*</span>
                </label>
                <textarea
                  value={form.work_content}
                  onChange={e => setForm(prev => ({ ...prev, work_content: e.target.value }))}
                  placeholder="오늘 진행할 작업 내용을 입력하세요"
                  rows={3}
                  style={{ ...INPUT_STYLE, resize: "vertical" }}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                />
              </div>

              {/* 위험 요인 */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>
                  위험 요인
                </label>
                <textarea
                  value={form.hazards}
                  onChange={e => setForm(prev => ({ ...prev, hazards: e.target.value }))}
                  placeholder="오늘 작업의 주요 위험요인을 입력하세요"
                  rows={2}
                  style={{ ...INPUT_STYLE, resize: "vertical" }}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                />
              </div>

              {/* 안전 지시사항 */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>
                  안전 지시사항
                </label>
                <textarea
                  value={form.safety_instructions}
                  onChange={e => setForm(prev => ({ ...prev, safety_instructions: e.target.value }))}
                  placeholder="안전 지시사항을 입력하세요"
                  rows={2}
                  style={{ ...INPUT_STYLE, resize: "vertical" }}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                />
              </div>

              {/* 날씨 */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8 }}>
                  날씨
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {WEATHER_OPTIONS.map(opt => {
                    const selected = form.weather === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, weather: opt.value }))}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 6,
                          fontSize: 14,
                          cursor: "pointer",
                          border: selected ? "1px solid #3B5BDB" : "1px solid #E5E5E5",
                          background: selected ? "#EEF2FF" : "#fff",
                          color: selected ? "#3B5BDB" : "#555",
                          fontWeight: selected ? 600 : 400,
                        }}
                      >
                        {opt.emoji} {opt.value}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 기온 */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>
                  기온
                </label>
                <input
                  type="text"
                  value={form.temperature}
                  onChange={e => setForm(prev => ({ ...prev, temperature: e.target.value }))}
                  placeholder="예: 23°C"
                  style={INPUT_STYLE}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                />
              </div>

              {/* 책임자 이름 */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>
                  책임자 이름 <span style={{ color: "#E03131" }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.leader_name}
                  onChange={e => setForm(prev => ({ ...prev, leader_name: e.target.value }))}
                  placeholder="책임자 이름"
                  style={INPUT_STYLE}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                />
              </div>
            </div>

            {error && (
              <p style={{ marginTop: 12, fontSize: 13, color: "#E03131" }}>{error}</p>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  padding: "10px 20px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#555",
                  border: "1px solid #E5E5E5",
                  background: "#fff",
                }}
                className="hover:bg-[#F5F5F5] transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "10px 24px",
                  borderRadius: 6,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  border: "none",
                  background: saving ? "#93C5FD" : "#3B5BDB",
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
