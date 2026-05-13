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

const SECTION_LABEL_STYLE = {
  margin: "0 0 4px", fontSize: 12, fontWeight: 600 as const, color: "#555",
  display: "block",
};

const SECTION_HEADER_STYLE = {
  margin: "0 0 14px", fontSize: 11, fontWeight: 700 as const, color: "#3B5BDB",
  textTransform: "uppercase" as const, letterSpacing: "0.06em",
  padding: "6px 10px", background: "#EEF2FF", borderRadius: 6,
};

export default function ManagementReviewNewPage() {
  const router = useRouter();
  const year   = new Date().getFullYear();

  const [reviewCount, setReviewCount] = useState(0);
  const [form, setForm] = useState({
    review_date:                "",
    chairperson:                "",
    attendees:                  "",
    input_audit_results:        "",
    input_customer_feedback:    "",
    input_process_performance:  "",
    input_nonconformities:      "",
    input_risk_opportunities:   "",
    output_improvement:         "",
    output_resource_needs:      "",
    output_policy_changes:      "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("management_reviews")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setReviewCount(count ?? 0));
  }, []);

  const reviewNumber = `MR-${year}-${String(reviewCount + 1).padStart(3, "0")}`;

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.review_date) { setError("검토일을 입력해주세요."); return; }
    setSaving(true);
    setError(null);

    const { data, error: err } = await supabase
      .from("management_reviews")
      .insert({
        review_number:              reviewNumber,
        review_date:                form.review_date,
        chairperson:                form.chairperson.trim()               || null,
        attendees:                  form.attendees.trim()                 || null,
        status:                     "planned",
        input_audit_results:        form.input_audit_results.trim()       || null,
        input_customer_feedback:    form.input_customer_feedback.trim()   || null,
        input_process_performance:  form.input_process_performance.trim() || null,
        input_nonconformities:      form.input_nonconformities.trim()     || null,
        input_risk_opportunities:   form.input_risk_opportunities.trim()  || null,
        output_improvement:         form.output_improvement.trim()        || null,
        output_resource_needs:      form.output_resource_needs.trim()     || null,
        output_policy_changes:      form.output_policy_changes.trim()     || null,
      })
      .select()
      .single();

    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push(`/management-review/${data.id}`);
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "36px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 620 }}>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>경영검토 등록</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>ISO 9001:2015 9.3 경영검토를 등록합니다.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── Section A: 기본 정보 ── */}
            <p style={SECTION_HEADER_STYLE}>A. 기본 정보</p>

            {/* 검토 번호 */}
            <div style={{ marginBottom: 16 }}>
              <label style={SECTION_LABEL_STYLE}>검토 번호</label>
              <div style={{ ...INPUT_STYLE, background: "#FAFAFA", fontFamily: "monospace", fontWeight: 700, color: "#3B5BDB" }}>
                {reviewNumber}
              </div>
            </div>

            {/* 검토일 */}
            <div style={{ marginBottom: 16 }}>
              <label style={SECTION_LABEL_STYLE}>검토일 *</label>
              <input type="date" value={form.review_date} onChange={set("review_date")}
                style={INPUT_STYLE} className="focus:border-[#3B5BDB] transition-colors" />
            </div>

            {/* 의장 + 참석자 */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1 }}>
                <label style={SECTION_LABEL_STYLE}>의장</label>
                <input type="text" value={form.chairperson} onChange={set("chairperson")}
                  placeholder="의장 이름" style={INPUT_STYLE}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
              </div>
              <div style={{ flex: 2 }}>
                <label style={SECTION_LABEL_STYLE}>참석자</label>
                <input type="text" value={form.attendees} onChange={set("attendees")}
                  placeholder="참석자 이름 (쉼표로 구분)" style={INPUT_STYLE}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
              </div>
            </div>

            {/* ── Section B: 입력 사항 (ISO 9.3.2) ── */}
            <p style={SECTION_HEADER_STYLE}>B. 입력 사항 (ISO 9001 9.3.2)</p>

            {[
              { key: "input_audit_results",       label: "이전 경영검토 조치사항 및 내부심사 결과" },
              { key: "input_customer_feedback",    label: "고객 만족도 및 피드백" },
              { key: "input_process_performance",  label: "프로세스 성과 및 제품·서비스 적합성" },
              { key: "input_nonconformities",      label: "부적합 및 시정조치 현황" },
              { key: "input_risk_opportunities",   label: "리스크 및 기회 대응 현황" },
            ].map(({ key, label }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={SECTION_LABEL_STYLE}>{label}</label>
                <textarea
                  value={form[key as keyof typeof form]}
                  onChange={set(key as keyof typeof form)}
                  placeholder="내용을 입력하세요"
                  rows={3}
                  style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                />
              </div>
            ))}

            {/* ── Section C: 출력 사항 (ISO 9.3.3) ── */}
            <p style={{ ...SECTION_HEADER_STYLE, marginTop: 8 }}>C. 출력 사항 (ISO 9001 9.3.3)</p>

            {[
              { key: "output_improvement",    label: "개선 기회 및 조치 사항" },
              { key: "output_resource_needs", label: "자원 소요 사항" },
              { key: "output_policy_changes", label: "품질방침 및 목표 변경 사항" },
            ].map(({ key, label }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={SECTION_LABEL_STYLE}>{label}</label>
                <textarea
                  value={form[key as keyof typeof form]}
                  onChange={set(key as keyof typeof form)}
                  placeholder="내용을 입력하세요"
                  rows={3}
                  style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                />
              </div>
            ))}

            {error && <p style={{ marginBottom: 16, fontSize: 12, color: "#E03131" }}>{error}</p>}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8, marginBottom: 40 }}>
              <button type="button" onClick={() => router.back()}
                style={{ padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#555", border: "1px solid #E5E5E5", background: "#fff" }}
                className="hover:bg-[#F5F5F5] transition-colors">
                취소
              </button>
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
