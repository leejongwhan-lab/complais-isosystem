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

const CATEGORIES = ["조달", "영업", "인허가", "채용", "접대", "기타"] as const;
const SCALE_LABELS = ["", "거의없음", "낮음", "보통", "높음", "매우높음"];

function levelInfo(score: number) {
  if (score >= 16) return { label: "매우높음", color: "#E03131", bg: "#FECACA", key: "critical" };
  if (score >= 11) return { label: "높음",    color: "#E67700", bg: "#FED7AA", key: "high" };
  if (score >= 6)  return { label: "중간",    color: "#854D0E", bg: "#FEF9C3", key: "medium" };
  return                   { label: "낮음",    color: "#166534", bg: "#DCFCE7", key: "low" };
}

function ScaleBtn({ value, selected, onClick }: { value: number; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 6, cursor: "pointer",
      fontSize: 13, fontWeight: selected ? 700 : 400,
      border: selected ? "2px solid #2F9E44" : "1px solid #E5E5E5",
      background: selected ? "#EBFBEE" : "#fff",
      color: selected ? "#2F9E44" : "#555",
    }}>{value}</button>
  );
}

export default function BriberyRiskNewPage() {
  const router = useRouter();
  const year = new Date().getFullYear();
  const [riskCount, setRiskCount] = useState(0);
  const [form, setForm] = useState({
    category:        "조달" as typeof CATEGORIES[number],
    title:           "",
    description:     "",
    likelihood:      3,
    impact:          3,
    control_measure: "",
    owner_name:      "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    supabase.from("bribery_risks").select("*", { count: "exact", head: true })
      .then(({ count }) => setRiskCount(count ?? 0));
  }, []);

  const riskNumber = `BR-${year}-${String(riskCount + 1).padStart(3, "0")}`;
  const score = form.likelihood * form.impact;
  const level = useMemo(() => levelInfo(score), [score]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("제목을 입력해주세요."); return; }
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.from("bribery_risks").insert({
      risk_number:     riskNumber,
      category:        form.category,
      title:           form.title.trim(),
      description:     form.description.trim() || null,
      likelihood:      form.likelihood,
      impact:          form.impact,
      control_measure: form.control_measure.trim() || null,
      owner_name:      form.owner_name.trim() || null,
      status:          "open",
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push("/antibribery");
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "36px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 580 }}>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>부패리스크 등록</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>조직 내 부패 리스크를 식별하고 평가합니다.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* 리스크 번호 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>리스크 번호</label>
              <div style={{ ...INPUT_STYLE, background: "#FAFAFA", fontFamily: "monospace", fontWeight: 700, color: "#2F9E44" }}>
                {riskNumber}
              </div>
            </div>

            {/* 카테고리 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>카테고리 *</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => setForm(p => ({ ...p, category: c }))}
                    style={{
                      padding: "6px 12px", borderRadius: 6, cursor: "pointer",
                      fontSize: 12, fontWeight: form.category === c ? 600 : 400,
                      border: form.category === c ? "1px solid #2F9E44" : "1px solid #E5E5E5",
                      background: form.category === c ? "#EBFBEE" : "#fff",
                      color: form.category === c ? "#2F9E44" : "#555",
                    }}>{c}</button>
                ))}
              </div>
            </div>

            {/* 제목 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>제목 *</label>
              <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="부패리스크 제목을 입력하세요" style={INPUT_STYLE}
                className="focus:border-[#2F9E44] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 설명 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>설명</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="리스크 상세 설명" rows={3}
                style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                className="focus:border-[#2F9E44] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 발생가능성 × 영향도 */}
            <div style={{ marginBottom: 16, padding: "16px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F0F0F0" }}>
              <div style={{ display: "flex", gap: 24, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8 }}>발생가능성</label>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1,2,3,4,5].map(v => (
                      <ScaleBtn key={v} value={v} selected={form.likelihood === v} onClick={() => setForm(p => ({ ...p, likelihood: v }))} />
                    ))}
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb" }}>{SCALE_LABELS[form.likelihood]}</p>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8 }}>영향도</label>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1,2,3,4,5].map(v => (
                      <ScaleBtn key={v} value={v} selected={form.impact === v} onClick={() => setForm(p => ({ ...p, impact: v }))} />
                    ))}
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb" }}>{SCALE_LABELS[form.impact]}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: level.bg, borderRadius: 6, border: `1px solid ${level.color}30` }}>
                <span style={{ fontSize: 11, color: "#555" }}>위험도 점수</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: level.color }}>{score}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: level.color }}>/ 25</span>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, color: level.color, background: "rgba(255,255,255,0.7)" }}>
                  {level.label}
                </span>
              </div>
            </div>

            {/* 관리방안 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>관리방안</label>
              <textarea value={form.control_measure} onChange={e => setForm(p => ({ ...p, control_measure: e.target.value }))}
                placeholder="부패 리스크를 관리하기 위한 통제 방안" rows={3}
                style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                className="focus:border-[#2F9E44] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 담당자 */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>담당자</label>
              <input type="text" value={form.owner_name} onChange={e => setForm(p => ({ ...p, owner_name: e.target.value }))}
                placeholder="담당자 이름" style={INPUT_STYLE}
                className="focus:border-[#2F9E44] transition-colors placeholder:text-[#bbb]" />
            </div>

            {error && <p style={{ marginBottom: 16, fontSize: 12, color: "#E03131" }}>{error}</p>}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => router.back()}
                style={{ padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#555", border: "1px solid #E5E5E5", background: "#fff" }}
                className="hover:bg-[#F5F5F5] transition-colors">취소</button>
              <button type="submit" disabled={saving}
                style={{ padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#fff", border: "none",
                  background: saving ? "#B2F2BB" : "#2F9E44", cursor: saving ? "not-allowed" : "pointer" }}
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
