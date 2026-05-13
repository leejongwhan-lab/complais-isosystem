"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const SUB_TYPES: Record<string, { value: string; label: string }[]> = {
  safety: [
    { value: "near_miss", label: "아차사고" },
    { value: "hazard", label: "위험상황" },
    { value: "violation", label: "안전규정 위반" },
    { value: "accident", label: "사고 발생" },
  ],
  antibribery: [
    { value: "bribery", label: "부패/뇌물" },
    { value: "legal", label: "법규 위반" },
    { value: "accounting", label: "회계 부정" },
    { value: "conflict", label: "이해충돌" },
  ],
  quality: [
    { value: "concealment", label: "불량 은폐" },
    { value: "falsification", label: "기록 위조" },
    { value: "inspection", label: "검사 부정" },
  ],
  workplace: [
    { value: "harassment", label: "직장 내 괴롭힘" },
    { value: "discrimination", label: "차별/혐오" },
    { value: "unfair", label: "부당처우" },
  ],
  other: [{ value: "other", label: "기타" }],
};

const REPORT_TYPES = [
  {
    value: "safety",
    emoji: "🦺",
    label: "안전보건",
    desc: "아차사고/위험상황/안전위반",
  },
  {
    value: "antibribery",
    emoji: "🚫",
    label: "반부패/준법",
    desc: "부패/법규위반/회계부정",
  },
  {
    value: "quality",
    emoji: "⚠️",
    label: "품질",
    desc: "불량은폐/기록위조",
  },
  {
    value: "workplace",
    emoji: "💬",
    label: "직장문화",
    desc: "괴롭힘/차별",
  },
];

function ProgressBar({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 32 }}>
      {[1, 2, 3].map((s) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              background: s <= step ? "#3B5BDB" : "#E5E5E5",
              color: s <= step ? "#fff" : "#999",
              transition: "background 0.2s",
            }}
          >
            {s}
          </div>
          {s < 3 && (
            <div
              style={{
                width: 40,
                height: 2,
                background: s < step ? "#3B5BDB" : "#E5E5E5",
                transition: "background 0.2s",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ReportNewContent() {
  const searchParams = useSearchParams();
  const companyCode = searchParams.get("company") ?? "";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    report_type: "",
    sub_type: "",
    occurrence_date: "",
    occurrence_location: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit() {
    if (!form.content.trim()) {
      setError("제보 내용을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const code =
      "RPT-" +
      Math.random().toString(36).substring(2, 6).toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 6).toUpperCase();

    try {
      const { error: err } = await supabase.from("anonymous_reports").insert({
        company_id: companyCode || null,
        tracking_code: code,
        report_type: form.report_type,
        sub_type: form.sub_type || null,
        content: form.content.trim(),
        status: "received",
      });

      setSubmitting(false);
      if (err) {
        setError(err.message);
        return;
      }
      setTrackingCode(code);
    } catch {
      setSubmitting(false);
      setError("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }

  function handleCopy() {
    if (trackingCode) {
      navigator.clipboard.writeText(trackingCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    border: "1px solid #E5E5E5",
    borderRadius: 8,
    outline: "none",
    color: "#1a1a1a",
    boxSizing: "border-box" as const,
    marginBottom: 12,
  };

  const labelStyle = {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
    display: "block",
    fontWeight: 500,
  };

  if (trackingCode) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F9FAFB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            background: "#fff",
            borderRadius: 12,
            padding: 40,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#EBFBEE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              margin: "0 auto 20px",
            }}
          >
            ✓
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
            제보가 접수되었습니다
          </h1>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 28 }}>
            담당자가 검토 후 처리 결과를 알려드립니다.
          </p>

          <div
            style={{
              background: "#F5F5F5",
              padding: 20,
              borderRadius: 10,
              marginBottom: 16,
            }}
          >
            <p style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>추적 코드</p>
            <div
              style={{
                fontSize: 22,
                fontFamily: "monospace",
                fontWeight: 700,
                color: "#1a1a1a",
                letterSpacing: 4,
              }}
            >
              {trackingCode}
            </div>
          </div>

          <p
            style={{
              fontSize: 13,
              color: "#e03131",
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            ⚠️ 이 코드를 반드시 보관하세요! 처리현황 확인에 필요합니다.
          </p>

          <button
            onClick={handleCopy}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: copied ? "#2F9E44" : "#3B5BDB",
              background: copied ? "#EBFBEE" : "#EEF2FF",
              border: "none",
              cursor: "pointer",
              marginBottom: 12,
            }}
          >
            {copied ? "✓ 복사되었습니다" : "📋 코드 복사하기"}
          </button>

          <div style={{ display: "flex", gap: 8 }}>
            <Link
              href="/"
              style={{
                flex: 1,
                display: "block",
                padding: "12px 0",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "#555",
                textAlign: "center",
                background: "#fff",
                border: "1px solid #E5E5E5",
                textDecoration: "none",
              }}
            >
              대시보드로 돌아가기
            </Link>
            <Link
              href="/report/track"
              style={{
                flex: 1,
                display: "block",
                padding: "12px 0",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                textAlign: "center",
                background: "#3B5BDB",
                textDecoration: "none",
              }}
            >
              처리현황 확인
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#fff",
          borderRadius: 12,
          padding: 40,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#3B5BDB" }}>complAIs</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a" }}> ISOSystem</span>
        </div>

        <ProgressBar step={step} />

        {/* Step 1: Report Type */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 20, textAlign: "center" }}>
              어떤 종류의 제보인가요?
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 12,
              }}
            >
              {REPORT_TYPES.map((type) => (
                <div
                  key={type.value}
                  onClick={() => {
                    setForm((p) => ({ ...p, report_type: type.value, sub_type: "" }));
                    setStep(2);
                  }}
                  style={{
                    border: form.report_type === type.value ? "2px solid #3B5BDB" : "1px solid #E5E5E5",
                    background: form.report_type === type.value ? "#EEF2FF" : "#fff",
                    borderRadius: 10,
                    padding: 20,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (form.report_type !== type.value) {
                      e.currentTarget.style.borderColor = "#3B5BDB";
                      e.currentTarget.style.background = "#F8F9FF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (form.report_type !== type.value) {
                      e.currentTarget.style.borderColor = "#E5E5E5";
                      e.currentTarget.style.background = "#fff";
                    }
                  }}
                >
                  <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>{type.emoji}</span>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>{type.label}</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{type.desc}</div>
                </div>
              ))}
            </div>
            <div
              onClick={() => {
                setForm((p) => ({ ...p, report_type: "other", sub_type: "other" }));
                setStep(2);
              }}
              style={{
                border: form.report_type === "other" ? "2px solid #3B5BDB" : "1px solid #E5E5E5",
                background: form.report_type === "other" ? "#EEF2FF" : "#fff",
                borderRadius: 10,
                padding: 16,
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (form.report_type !== "other") {
                  e.currentTarget.style.borderColor = "#3B5BDB";
                  e.currentTarget.style.background = "#F8F9FF";
                }
              }}
              onMouseLeave={(e) => {
                if (form.report_type !== "other") {
                  e.currentTarget.style.borderColor = "#E5E5E5";
                  e.currentTarget.style.background = "#fff";
                }
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>기타</span>
              <span style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>위 항목에 해당하지 않는 경우</span>
            </div>
            <Link
              href="/report"
              style={{ display: "block", textAlign: "center", fontSize: 13, color: "#bbb", textDecoration: "none", marginTop: 16 }}
            >
              ← 돌아가기
            </Link>
          </div>
        )}

        {/* Step 2: Sub-type */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 20, textAlign: "center" }}>
              세부 유형을 선택하세요
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
              {(SUB_TYPES[form.report_type] ?? []).map((sub) => (
                <button
                  key={sub.value}
                  onClick={() => setForm((p) => ({ ...p, sub_type: sub.value }))}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    fontSize: 13,
                    cursor: "pointer",
                    border: form.sub_type === sub.value ? "1.5px solid #3B5BDB" : "1px solid #E5E5E5",
                    background: form.sub_type === sub.value ? "#EEF2FF" : "#fff",
                    color: form.sub_type === sub.value ? "#3B5BDB" : "#555",
                    fontWeight: form.sub_type === sub.value ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (form.sub_type) setStep(3);
              }}
              disabled={!form.sub_type}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                background: form.sub_type ? "#3B5BDB" : "#ccc",
                border: "none",
                cursor: form.sub_type ? "pointer" : "not-allowed",
                marginBottom: 12,
              }}
            >
              다음
            </button>
            <button
              onClick={() => setStep(1)}
              style={{
                width: "100%",
                padding: "10px 0",
                borderRadius: 8,
                fontSize: 14,
                color: "#999",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              ← 이전
            </button>
          </div>
        )}

        {/* Step 3: Content */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 20, textAlign: "center" }}>
              제보 내용을 작성하세요
            </h2>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>발생 일시 (선택)</label>
              <input
                type="date"
                value={form.occurrence_date}
                onChange={(e) => setForm((p) => ({ ...p, occurrence_date: e.target.value }))}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>발생 장소 (선택)</label>
              <input
                type="text"
                value={form.occurrence_location}
                onChange={(e) => setForm((p) => ({ ...p, occurrence_location: e.target.value }))}
                placeholder="예: 3공장 2층 조립라인"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                제보 내용 <span style={{ color: "#e03131" }}>*</span>
              </label>
              <textarea
                rows={6}
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                placeholder="구체적으로 작성할수록 빠른 처리가 가능합니다."
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "#FFF5F5",
                  border: "1px solid #FFC9C9",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#e03131",
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: "100%",
                padding: "13px 0",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                background: submitting ? "#aaa" : "#3B5BDB",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                marginBottom: 12,
              }}
            >
              {submitting ? "제출 중..." : "🔒 익명으로 제출"}
            </button>
            <button
              onClick={() => setStep(2)}
              style={{
                width: "100%",
                padding: "10px 0",
                borderRadius: 8,
                fontSize: 14,
                color: "#999",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              ← 이전
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportNewPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F9FAFB",
          }}
        >
          <div style={{ fontSize: 14, color: "#999" }}>로딩 중...</div>
        </div>
      }
    >
      <ReportNewContent />
    </Suspense>
  );
}
