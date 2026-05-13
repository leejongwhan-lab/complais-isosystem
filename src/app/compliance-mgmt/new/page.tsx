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

const CATEGORIES = ["환경", "안전보건", "노동", "공정거래", "개인정보", "세무", "기타"] as const;
const STATUSES = [
  { value: "compliant",     label: "준수" },
  { value: "non_compliant", label: "미준수" },
  { value: "na",            label: "해당없음" },
] as const;
const SCALE_LABELS = ["", "거의없음", "낮음", "보통", "높음", "매우높음"];

type Category = typeof CATEGORIES[number];
type StatusVal = typeof STATUSES[number]["value"];

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
      border: selected ? "2px solid #1098AD" : "1px solid #E5E5E5",
      background: selected ? "#E3FAFC" : "#fff",
      color: selected ? "#1098AD" : "#555",
    }}>{value}</button>
  );
}

export default function ComplianceNewPage() {
  const router = useRouter();
  const year = new Date().getFullYear();
  const [count, setCount] = useState(0);
  const [form, setForm] = useState({
    category:         "환경" as Category,
    law_name:         "",
    article:          "",
    requirement:      "",
    applicable_dept:  "",
    compliance_status: "compliant" as StatusVal,
    next_review_date:  "",
    owner_name:        "",
    likelihood:        3,
    impact:            3,
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    supabase.from("compliance_obligations").select("*", { count: "exact", head: true })
      .then(({ count: c }) => setCount(c ?? 0));
  }, []);

  const obligationNumber = `CO-${year}-${String(count + 1).padStart(3, "0")}`;
  const score = form.likelihood * form.impact;
  const level = useMemo(() => levelInfo(score), [score]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.law_name.trim() || !form.requirement.trim()) {
      setError("법규명과 요구사항을 입력해주세요."); return;
    }
    setSaving(true); setError(null);
    const { error: err } = await supabase.from("compliance_obligations").insert({
      obligation_number: obligationNumber,
      category:          form.category,
      law_name:          form.law_name.trim(),
      article:           form.article.trim() || null,
      requirement:       form.requirement.trim(),
      applicable_dept:   form.applicable_dept.trim() || null,
      compliance_status: form.compliance_status,
      next_review_date:  form.next_review_date || null,
      owner_name:        form.owner_name.trim() || null,
      likelihood:        form.likelihood,
      impact:            form.impact,
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push("/compliance-mgmt");
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "36px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 580 }}>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>준법의무 등록</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>조직이 준수해야 할 법적 의무사항을 등록합니다.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* 번호 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>의무 번호</label>
              <div style={{ ...INPUT_STYLE, background: "#FAFAFA", fontFamily: "monospace", fontWeight: 700, color: "#1098AD" }}>
                {obligationNumber}
              </div>
            </div>

            {/* 구분 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>구분 *</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => setForm(p => ({ ...p, category: c }))}
                    style={{
                      padding: "6px 12px", borderRadius: 6, cursor: "pointer",
                      fontSize: 12, fontWeight: form.category === c ? 600 : 400,
                      border: form.category === c ? "1px solid #1098AD" : "1px solid #E5E5E5",
                      background: form.category === c ? "#E3FAFC" : "#fff",
                      color: form.category === c ? "#1098AD" : "#555",
                    }}>{c}</button>
                ))}
              </div>
            </div>

            {/* 법규명 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>법규명 *</label>
              <input type="text" value={form.law_name} onChange={e => setForm(p => ({ ...p, law_name: e.target.value }))}
                placeholder="예: 산업안전보건법" style={INPUT_STYLE}
                className="focus:border-[#1098AD] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 해당 조항 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>해당 조항</label>
              <input type="text" value={form.article} onChange={e => setForm(p => ({ ...p, article: e.target.value }))}
                placeholder="예: 제38조 제1항" style={INPUT_STYLE}
                className="focus:border-[#1098AD] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 요구사항 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>요구사항 내용 *</label>
              <textarea value={form.requirement} onChange={e => setForm(p => ({ ...p, requirement: e.target.value }))}
                placeholder="법적 요구사항의 내용을 입력하세요" rows={3}
                style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                className="focus:border-[#1098AD] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 적용 부서 + 담당자 */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>적용 부서</label>
                <input type="text" value={form.applicable_dept} onChange={e => setForm(p => ({ ...p, applicable_dept: e.target.value }))}
                  placeholder="전사 / 생산팀 등" style={INPUT_STYLE}
                  className="focus:border-[#1098AD] transition-colors placeholder:text-[#bbb]" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>담당자</label>
                <input type="text" value={form.owner_name} onChange={e => setForm(p => ({ ...p, owner_name: e.target.value }))}
                  placeholder="담당자 이름" style={INPUT_STYLE}
                  className="focus:border-[#1098AD] transition-colors placeholder:text-[#bbb]" />
              </div>
            </div>

            {/* 준수 여부 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>준수 여부 *</label>
              <div style={{ display: "flex", gap: 8 }}>
                {STATUSES.map(s => (
                  <button key={s.value} type="button" onClick={() => setForm(p => ({ ...p, compliance_status: s.value }))}
                    style={{
                      flex: 1, padding: "8px 0", borderRadius: 6, cursor: "pointer",
                      fontSize: 12, fontWeight: form.compliance_status === s.value ? 600 : 400,
                      border: form.compliance_status === s.value ? "1px solid #1098AD" : "1px solid #E5E5E5",
                      background: form.compliance_status === s.value ? "#E3FAFC" : "#fff",
                      color: form.compliance_status === s.value ? "#1098AD" : "#555",
                    }}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* 다음 검토일 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>다음 검토일</label>
              <input type="date" value={form.next_review_date} onChange={e => setForm(p => ({ ...p, next_review_date: e.target.value }))}
                style={INPUT_STYLE} className="focus:border-[#1098AD] transition-colors" />
            </div>

            {/* 리스크 평가 */}
            <div style={{ marginBottom: 28, padding: "16px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F0F0F0" }}>
              <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 600, color: "#555" }}>리스크 평가 (선택)</p>
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
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, color: level.color, background: "rgba(255,255,255,0.7)" }}>{level.label}</span>
              </div>
            </div>

            {error && <p style={{ marginBottom: 16, fontSize: 12, color: "#E03131" }}>{error}</p>}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => router.back()}
                style={{ padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#555", border: "1px solid #E5E5E5", background: "#fff" }}
                className="hover:bg-[#F5F5F5] transition-colors">취소</button>
              <button type="submit" disabled={saving}
                style={{ padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#fff", border: "none",
                  background: saving ? "#99E9F2" : "#1098AD", cursor: saving ? "not-allowed" : "pointer" }}
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
