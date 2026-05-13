"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";
import type { AuditType } from "@/types/audit";
import UserPicker from "@/components/common/UserPicker";

const INPUT_STYLE = {
  width: "100%", padding: "8px 12px", fontSize: 13,
  border: "1px solid #E5E5E5", borderRadius: 6,
  outline: "none", color: "#1a1a1a", background: "#fff",
  boxSizing: "border-box" as const,
};

const AUDIT_TYPES: { value: AuditType; label: string }[] = [
  { value: "system",  label: "시스템심사" },
  { value: "process", label: "공정심사" },
  { value: "product", label: "제품심사" },
];

export default function AuditNewPage() {
  const router = useRouter();
  const year = new Date().getFullYear();

  const [companyId, setCompanyId] = useState("");
  const [auditCount, setAuditCount] = useState(0);
  const [form, setForm] = useState({
    audit_type:     "system" as AuditType,
    target_process: "",
    auditor_name:   "",
    planned_date:   "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("audits")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setAuditCount(count ?? 0));

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("company_id, full_name").eq("id", user.id).single();
      if (profile?.company_id) setCompanyId(profile.company_id as string);
      if (profile?.full_name) setForm(p => ({ ...p, auditor_name: (profile.full_name as string) || p.auditor_name }));
    });
  }, []);

  const auditNumber = `AUD-${year}-${String(auditCount + 1).padStart(2, "0")}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.target_process.trim() || !form.auditor_name.trim() || !form.planned_date) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    setSaving(true);
    setError(null);

    const { data, error: err } = await supabase
      .from("audits")
      .insert({
        audit_number:        auditNumber,
        audit_type:          form.audit_type,
        status:              "planned",
        auditor_name:        form.auditor_name.trim(),
        target_process:      form.target_process.trim(),
        planned_date:        form.planned_date,
        conformity_count:    0,
        nonconformity_count: 0,
        observation_count:   0,
      })
      .select()
      .single();

    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push(`/audit/${data.id}`);
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "40px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          {/* 헤더 */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>심사 계획 등록</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>새로운 내부심사 계획을 등록합니다.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* 심사번호 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>심사번호</label>
              <div style={{
                ...INPUT_STYLE, background: "#FAFAFA",
                fontFamily: "monospace", fontWeight: 700, color: "#3B5BDB",
              }}>
                {auditNumber}
              </div>
              <p style={{ margin: "3px 0 0", fontSize: 11, color: "#bbb" }}>자동 생성됩니다.</p>
            </div>

            {/* 심사유형 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>심사유형</label>
              <div style={{ display: "flex", gap: 8 }}>
                {AUDIT_TYPES.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, audit_type: t.value }))}
                    style={{
                      flex: 1, padding: "8px 0", borderRadius: 6, cursor: "pointer",
                      fontSize: 12, fontWeight: form.audit_type === t.value ? 600 : 400,
                      border: form.audit_type === t.value ? "1px solid #3B5BDB" : "1px solid #E5E5E5",
                      background: form.audit_type === t.value ? "#EEF2FF" : "#fff",
                      color: form.audit_type === t.value ? "#3B5BDB" : "#555",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 대상 프로세스 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>대상 프로세스</label>
              <input
                type="text"
                value={form.target_process}
                onChange={e => setForm(prev => ({ ...prev, target_process: e.target.value }))}
                placeholder="예: 전체 프로세스, 제조공정 전반"
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
            </div>

            {/* 심사원 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>심사원</label>
              <UserPicker
                value={form.auditor_name}
                onChange={name => setForm(prev => ({ ...prev, auditor_name: name }))}
                placeholder="심사원 이름"
                companyId={companyId}
              />
            </div>

            {/* 예정일 */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>예정일</label>
              <input
                type="date"
                value={form.planned_date}
                onChange={e => setForm(prev => ({ ...prev, planned_date: e.target.value }))}
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors"
              />
            </div>

            {error && (
              <p style={{ marginBottom: 16, fontSize: 12, color: "#E03131" }}>{error}</p>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  padding: "8px 18px", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 500, color: "#555",
                  border: "1px solid #E5E5E5", background: "#fff",
                }}
                className="hover:bg-[#F5F5F5] transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "8px 18px", borderRadius: 6,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: 13, fontWeight: 600, color: "#fff",
                  border: "none", background: saving ? "#C5D0FF" : "#3B5BDB",
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
