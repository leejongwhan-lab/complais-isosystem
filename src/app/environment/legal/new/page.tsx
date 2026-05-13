"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";

const INPUT_STYLE = {
  width: "100%", padding: "8px 12px", fontSize: 13,
  border: "1px solid #E5E5E5", borderRadius: 6,
  outline: "none", color: "#1a1a1a", background: "#fff",
  boxSizing: "border-box" as const,
};

const CATEGORIES = ["환경", "안전보건", "화학물질"];
const COMPLIANCE_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: "compliant",     label: "준수",    color: "#2F9E44" },
  { value: "non_compliant", label: "미준수",  color: "#E03131" },
  { value: "na",            label: "해당없음", color: "#999"   },
];

export default function LegalNewPage() {
  const router = useRouter();
  const year   = new Date().getFullYear();

  const [count, setCount] = useState(0);
  const [form, setForm] = useState({
    category:          "환경",
    law_name:          "",
    article:           "",
    requirement:       "",
    applicable_dept:   "",
    compliance_status: "compliant",
    next_review_date:  "",
    notes:             "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("legal_requirements")
      .select("*", { count: "exact", head: true })
      .then(({ count: c }) => setCount(c ?? 0));
  }, []);

  const lawNumber = `LAW-${year}-${String(count + 1).padStart(3, "0")}`;

  function set<K extends keyof typeof form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.law_name.trim() || !form.requirement.trim()) { setError("법규명과 요구사항을 입력해주세요."); return; }
    setSaving(true); setError(null);

    const { error: err } = await supabase
      .from("legal_requirements")
      .insert({
        law_number:        lawNumber,
        category:          form.category,
        law_name:          form.law_name.trim(),
        article:           form.article.trim()          || null,
        requirement:       form.requirement.trim(),
        applicable_dept:   form.applicable_dept.trim()  || null,
        compliance_status: form.compliance_status,
        next_review_date:  form.next_review_date        || null,
        notes:             form.notes.trim()             || null,
      });

    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push("/environment");
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "36px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 540 }}>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>법규 등록</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>환경·안전보건 관련 법규를 등록합니다.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* 번호 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>법규 번호</label>
              <div style={{ ...INPUT_STYLE, background: "#FAFAFA", fontFamily: "monospace", fontWeight: 700, color: "#3B5BDB" }}>{lawNumber}</div>
            </div>

            {/* 구분 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>구분</label>
              <div style={{ display: "flex", gap: 8 }}>
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => setForm(p => ({ ...p, category: c }))}
                    style={{ flex: 1, padding: "8px 0", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: form.category === c ? 600 : 400, border: form.category === c ? "1px solid #3B5BDB" : "1px solid #E5E5E5", background: form.category === c ? "#EEF2FF" : "#fff", color: form.category === c ? "#3B5BDB" : "#555" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* 법규명 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>법규명 *</label>
              <input type="text" value={form.law_name} onChange={set("law_name")} placeholder="예: 대기환경보전법" style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 해당 조항 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>해당 조항</label>
              <input type="text" value={form.article} onChange={set("article")} placeholder="예: 제16조" style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 요구사항 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>요구사항 내용 *</label>
              <textarea value={form.requirement} onChange={set("requirement")} placeholder="법규에서 요구하는 구체적인 내용" rows={3}
                style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 적용 부서 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>적용 부서</label>
              <input type="text" value={form.applicable_dept} onChange={set("applicable_dept")} placeholder="예: 생산부, 안전팀" style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 준수 여부 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>준수 여부</label>
              <div style={{ display: "flex", gap: 8 }}>
                {COMPLIANCE_OPTIONS.map(opt => (
                  <button key={opt.value} type="button" onClick={() => setForm(p => ({ ...p, compliance_status: opt.value }))}
                    style={{
                      flex: 1, padding: "8px 0", borderRadius: 6, cursor: "pointer", fontSize: 12,
                      fontWeight: form.compliance_status === opt.value ? 600 : 400,
                      border: form.compliance_status === opt.value ? `1px solid ${opt.color}` : "1px solid #E5E5E5",
                      background: form.compliance_status === opt.value ? `${opt.color}15` : "#fff",
                      color: form.compliance_status === opt.value ? opt.color : "#555",
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 다음 검토일 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>다음 검토일</label>
              <input type="date" value={form.next_review_date} onChange={set("next_review_date")} style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors" />
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
