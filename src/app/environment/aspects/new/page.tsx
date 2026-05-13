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

const CATEGORIES = ["대기", "수질", "폐기물", "에너지", "토양", "소음"];
const CONDITIONS: { value: string; label: string }[] = [
  { value: "normal",    label: "정상"   },
  { value: "abnormal",  label: "비정상" },
  { value: "emergency", label: "비상"   },
];
const SCALE_LABELS = ["", "거의없음", "낮음", "보통", "높음", "매우높음"];

function levelInfo(score: number) {
  if (score >= 16) return { label: "매우높음", color: "#E03131", bg: "#FECACA" };
  if (score >= 11) return { label: "높음",    color: "#E67700", bg: "#FED7AA" };
  if (score >= 6)  return { label: "중간",    color: "#854D0E", bg: "#FEF9C3" };
  return                   { label: "낮음",    color: "#166534", bg: "#DCFCE7" };
}

function ScaleBtn({ value, selected, onClick }: { value: number; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 6, cursor: "pointer",
      fontSize: 13, fontWeight: selected ? 700 : 400,
      border: selected ? "2px solid #3B5BDB" : "1px solid #E5E5E5",
      background: selected ? "#EEF2FF" : "#fff",
      color: selected ? "#3B5BDB" : "#555",
    }}>{value}</button>
  );
}

export default function AspectNewPage() {
  const router = useRouter();
  const year   = new Date().getFullYear();

  const [count, setCount] = useState(0);
  const [form, setForm] = useState({
    category:         "대기",
    activity:         "",
    aspect:           "",
    impact:           "",
    condition:        "normal",
    likelihood:       3,
    severity:         3,
    is_significant:   false,
    legal_requirement: "",
    control_measure:  "",
    owner_name:       "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("env_aspects")
      .select("*", { count: "exact", head: true })
      .then(({ count: c }) => setCount(c ?? 0));
  }, []);

  const aspectNumber = `EA-${year}-${String(count + 1).padStart(3, "0")}`;
  const score        = form.likelihood * form.severity;
  const level        = useMemo(() => levelInfo(score), [score]);

  function set<K extends keyof typeof form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.aspect.trim() || !form.impact.trim()) { setError("환경측면과 환경영향을 입력해주세요."); return; }
    setSaving(true); setError(null);

    const { error: err } = await supabase
      .from("env_aspects")
      .insert({
        aspect_number:     aspectNumber,
        category:          form.category,
        activity:          form.activity.trim(),
        aspect:            form.aspect.trim(),
        impact:            form.impact.trim(),
        condition:         form.condition,
        likelihood:        form.likelihood,
        severity:          form.severity,
        is_significant:    form.is_significant,
        legal_requirement: form.legal_requirement.trim() || null,
        control_measure:   form.control_measure.trim()  || null,
        owner_name:        form.owner_name.trim()        || null,
      })
      .select()
      .single();

    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push(`/environment`);
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "36px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 560 }}>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>환경측면 등록</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>ISO 14001 환경영향평가 항목을 등록합니다.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* 번호 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>환경측면 번호</label>
              <div style={{ ...INPUT_STYLE, background: "#FAFAFA", fontFamily: "monospace", fontWeight: 700, color: "#3B5BDB" }}>{aspectNumber}</div>
            </div>

            {/* 카테고리 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>카테고리</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => setForm(p => ({ ...p, category: c }))}
                    style={{ padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: form.category === c ? 600 : 400, border: form.category === c ? "1px solid #3B5BDB" : "1px solid #E5E5E5", background: form.category === c ? "#EEF2FF" : "#fff", color: form.category === c ? "#3B5BDB" : "#555" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* 활동/공정 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>관련 활동/공정</label>
              <input type="text" value={form.activity} onChange={set("activity")} placeholder="예: 도장 공정" style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 환경측면 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>환경측면 *</label>
              <input type="text" value={form.aspect} onChange={set("aspect")} placeholder="예: 유기용제 사용" style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 환경영향 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>환경영향 *</label>
              <input type="text" value={form.impact} onChange={set("impact")} placeholder="예: VOC 대기 배출" style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 조건 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>운전 조건</label>
              <div style={{ display: "flex", gap: 8 }}>
                {CONDITIONS.map(c => (
                  <button key={c.value} type="button" onClick={() => setForm(p => ({ ...p, condition: c.value }))}
                    style={{ flex: 1, padding: "7px 0", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: form.condition === c.value ? 600 : 400, border: form.condition === c.value ? "1px solid #3B5BDB" : "1px solid #E5E5E5", background: form.condition === c.value ? "#EEF2FF" : "#fff", color: form.condition === c.value ? "#3B5BDB" : "#555" }}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 발생가능성 × 심각도 */}
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
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8 }}>심각도</label>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1,2,3,4,5].map(v => (
                      <ScaleBtn key={v} value={v} selected={form.severity === v} onClick={() => setForm(p => ({ ...p, severity: v }))} />
                    ))}
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb" }}>{SCALE_LABELS[form.severity]}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: level.bg, borderRadius: 6, border: `1px solid ${level.color}30` }}>
                <span style={{ fontSize: 11, color: "#555" }}>유의성 점수</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: level.color }}>{score}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: level.color }}>/ 25</span>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, color: level.color, background: "rgba(255,255,255,0.7)" }}>
                  {level.label}
                </span>
              </div>
            </div>

            {/* 중요환경측면 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={form.is_significant} onChange={e => setForm(p => ({ ...p, is_significant: e.target.checked }))}
                  style={{ width: 14, height: 14, cursor: "pointer" }} />
                <span style={{ fontSize: 13, color: "#1a1a1a" }}>중요환경측면으로 지정</span>
                <span style={{ fontSize: 11, color: "#3B5BDB" }}>★</span>
              </label>
            </div>

            {/* 관련 법규 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>관련 법규</label>
              <input type="text" value={form.legal_requirement} onChange={set("legal_requirement")}
                placeholder="예: 대기환경보전법 제16조" style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 관리 방안 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>관리 방안</label>
              <textarea value={form.control_measure} onChange={set("control_measure")}
                placeholder="구체적인 환경 관리 방안을 입력하세요" rows={3}
                style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 담당자 */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>담당자</label>
              <input type="text" value={form.owner_name} onChange={set("owner_name")}
                placeholder="담당자 이름" style={INPUT_STYLE}
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
